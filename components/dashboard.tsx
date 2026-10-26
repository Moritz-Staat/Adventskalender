"use client"

import { useState } from "react"
import { LogOut, Settings as SettingsIcon, Download, ImageIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import CalendarGrid from "@/components/calendar-grid"
import DrawPanel from "@/components/draw-panel"
import HistoryPanel from "@/components/history-panel"
import StatsPanel from "@/components/stats-panel"
import SettingsDialog from "@/components/settings-dialog"
import Snowfall from "@/components/snowfall"
import ImageUploadModal from "@/components/image-upload-modal"
import { ImageViewerModal } from "@/components/image-viewer-modal"
import { Awning, MarqueeSign, NameStamp, TreeMark } from "@/components/booth"
import type { Participant, DrawingState, Settings } from "@/lib/types"
import { getCurrentDay } from "@/lib/utils"
import { getAllImages } from "@/lib/supabase-helpers"
import JSZip from "jszip"
import { toast } from "sonner"

interface DashboardProps {
  currentUser: Participant
  drawingState: DrawingState
  onLogout: () => void
  onUpdateState: () => void
  onPerformDraw: () => Promise<string>
  onDrawRevealed: () => Promise<void>
  onImageUpload: (day: number, file: File) => Promise<void>
}

export default function Dashboard({
  currentUser,
  drawingState,
  onLogout,
  onUpdateState,
  onPerformDraw,
  onDrawRevealed,
  onImageUpload,
}: DashboardProps) {
  const [settings, setSettings] = useState<Settings>(
    drawingState.settings || { soundEnabled: true, confettiEnabled: true },
  )
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [uploadDay, setUploadDay] = useState<number | null>(null)
  const [viewerState, setViewerState] = useState<{ isOpen: boolean; day: number; imageUrl: string; winner: string }>({
    isOpen: false,
    day: 0,
    imageUrl: "",
    winner: "",
  })
  const currentDay = getCurrentDay()
  const todayLabel = new Date().toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" })

  const todayWinner = drawingState.winnersByDay[currentDay]
  const needsImageUpload = todayWinner === currentUser.id && !drawingState.imagesByDay[currentDay]

  const handleImageUploadPrompt = () => {
    if (needsImageUpload) {
      setUploadDay(currentDay)
      setShowImageUpload(true)
    }
  }

  const handleAdminUploadClick = (day: number) => {
    if (currentUser.isAdmin) {
      setUploadDay(day)
      setShowImageUpload(true)
    }
  }

  const handleImageUpload = async (file: File) => {
    if (uploadDay) {
      await onImageUpload(uploadDay, file)
      setShowImageUpload(false)
      setUploadDay(null)
    }
  }

  const handleImageView = (day: number) => {
    const imageUrl = drawingState.imagesByDay[day]
    const winnerId = drawingState.winnersByDay[day]
    const winner = drawingState.participants.find((p) => p.id === winnerId)

    if (imageUrl && winner) {
      setViewerState({
        isOpen: true,
        day,
        imageUrl,
        winner: winner.name,
      })
    }
  }

  const handleDownloadAllImages = async () => {
    try {
      const images = await getAllImages()

      if (images.length === 0) {
        toast("Noch keine Fotos zum Herunterladen.")
        return
      }

      const zip = new JSZip()

      for (const img of images) {
        try {
          const response = await fetch(img.imageUrl)
          const blob = await response.blob()
          const extension = img.imageUrl.includes("data:image/") ? "jpg" : img.imageUrl.split(".").pop() || "jpg"
          zip.file(`Tag_${img.day}_${img.winner}.${extension}`, blob)
        } catch (error) {
          console.error(`[v0] Error downloading image for day ${img.day}:`, error)
        }
      }

      const content = await zip.generateAsync({ type: "blob" })
      const url = URL.createObjectURL(content)
      const a = document.createElement("a")
      a.href = url
      a.download = `Adventskalender_Bilder_${new Date().getFullYear()}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("[v0] Error downloading images:", error)
      toast.error("Download fehlgeschlagen. Bitte versuch es noch einmal.")
    }
  }

  const handleDownloadCollage = async () => {
    try {
      const images = await getAllImages()

      if (images.length === 0) {
        toast("Noch keine Fotos zum Herunterladen.")
        return
      }

      const cols = 5
      const rows = Math.ceil(images.length / cols)
      const cellSize = 400
      const padding = 6 // Viel dünnere Ränder
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        toast.error("Dein Browser kann keine Collage erstellen.")
        return
      }

      canvas.width = cols * cellSize + (cols + 1) * padding
      canvas.height = rows * cellSize + (rows + 1) * padding

      // Warmer weihnachtlicher Hintergrund mit Farbverlauf
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, "#3a1610") // Budenholz
      gradient.addColorStop(0.5, "#1a0f0d") // Budennacht
      gradient.addColorStop(1, "#8f1424") // Markisenrot
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Subtiles Schnee-Muster hinzufügen
      ctx.fillStyle = "rgba(255, 255, 255, 0.03)"
      for (let i = 0; i < 500; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const size = Math.random() * 3
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      }

      const loadImage = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
          const img = new Image()
          img.crossOrigin = "anonymous"
          img.onload = () => resolve(img)
          img.onerror = reject
          img.src = src
        })
      }

      for (let i = 0; i < images.length; i++) {
        const img = images[i]
        const col = i % cols
        const row = Math.floor(i / cols)
        const x = col * cellSize + (col + 1) * padding
        const y = row * cellSize + (row + 1) * padding

        try {
          const loadedImg = await loadImage(img.imageUrl)

          ctx.save()

          // Weißer Rahmen um das Bild (Polaroid-Stil)
          ctx.fillStyle = "#ffffff"
          ctx.shadowColor = "rgba(0, 0, 0, 0.3)"
          ctx.shadowBlur = 15
          ctx.shadowOffsetX = 5
          ctx.shadowOffsetY = 5
          ctx.fillRect(x - 8, y - 8, cellSize + 16, cellSize + 16)

          ctx.shadowColor = "transparent"

          // Bild mit Cover-Fit
          const aspectRatio = loadedImg.width / loadedImg.height
          let drawWidth = cellSize
          let drawHeight = cellSize
          let offsetX = 0
          let offsetY = 0

          if (aspectRatio > 1) {
            drawHeight = cellSize / aspectRatio
            offsetY = (cellSize - drawHeight) / 2
          } else {
            drawWidth = cellSize * aspectRatio
            offsetX = (cellSize - drawWidth) / 2
          }

          ctx.drawImage(loadedImg, x + offsetX, y + offsetY, drawWidth, drawHeight)

          // Elegante goldene Zahl in der Ecke (wie auf einem Adventskalender-Türchen)
          const numSize = 70
          const numPadding = 12

          // Goldener Kreis-Hintergrund
          ctx.fillStyle = "#e8b03a" // Messing
          ctx.beginPath()
          ctx.arc(x + numPadding + numSize / 2, y + numPadding + numSize / 2, numSize / 2, 0, Math.PI * 2)
          ctx.fill()

          // Dunkelroter Innenkreis
          ctx.fillStyle = "#c41e32"
          ctx.beginPath()
          ctx.arc(x + numPadding + numSize / 2, y + numPadding + numSize / 2, numSize / 2 - 4, 0, Math.PI * 2)
          ctx.fill()

          // Elegante Serif-Schrift für die Zahl
          ctx.fillStyle = "#f4ead6" // Creme
          ctx.font = "bold 36px Georgia, serif"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText(img.day.toString(), x + numPadding + numSize / 2, y + numPadding + numSize / 2 + 2)

          ctx.restore()
        } catch (error) {
          console.error(`[v0] Error loading image for day ${img.day}:`, error)
        }
      }

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = `Adventskalender_Collage_${new Date().getFullYear()}.png`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        }
      })
    } catch (error) {
      console.error("[v0] Error creating collage:", error)
      toast.error("Collage konnte nicht erstellt werden. Bitte versuch es noch einmal.")
    }
  }

  const getWinnerName = () => {
    if (uploadDay) {
      const winnerId = drawingState.winnersByDay[uploadDay]
      const winner = drawingState.participants.find((p) => p.id === winnerId)
      return winner?.name || currentUser.name
    }
    return currentUser.name
  }

  return (
    <div className="relative min-h-dvh overflow-x-hidden">
      <Snowfall />

      <header className="relative z-10">
        <Awning />
        <div className="mx-auto -mt-1 max-w-6xl px-4 md:px-8">
          <MarqueeSign className="pt-7 pb-8 md:px-10" bulbs={16}>
            <div className="flex items-center gap-4 md:gap-6">
              <TreeMark className="hidden h-16 w-16 shrink-0 text-[#2f6b4f] md:block" />
              <div className="min-w-0 flex-1">
                <h1 className="sign-text leading-[0.95]">
                  <span className="flex items-center gap-1.5 text-[15px] tracking-wide md:text-xl">
                    <TreeMark className="h-6 w-6 text-[#2f6b4f] md:hidden" />
                    Familien-
                  </span>
                  <span className="block text-[clamp(1.6rem,7.7vw,3rem)] whitespace-nowrap">Adventskalender</span>
                </h1>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="text-sm text-cream-dim md:text-base">Heute ist {todayLabel}</p>

                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className="-my-1 flex shrink-0 items-center gap-2 rounded-xl p-1 transition-transform active:translate-y-px"
                      aria-label={`Menü für ${currentUser.name}`}
                    >
                      <span className="hidden font-semibold text-cream md:inline">{currentUser.name}</span>
                      <NameStamp name={currentUser.name} color={currentUser.color} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 border-plank-edge bg-night-2 p-1.5">
                      {currentUser.isAdmin && (
                        <>
                          <DropdownMenuItem onClick={handleDownloadAllImages} className="py-2.5">
                            <Download className="mr-1 h-4 w-4" />
                            Als ZIP herunterladen
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={handleDownloadCollage} className="py-2.5">
                            <ImageIcon className="mr-1 h-4 w-4" />
                            Als Collage herunterladen
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuItem onClick={() => setShowSettings(true)} className="py-2.5">
                        <SettingsIcon className="mr-1 h-4 w-4" />
                        Einstellungen
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={onLogout} variant="destructive" className="py-2.5">
                        <LogOut className="mr-1 h-4 w-4" />
                        Abmelden
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </MarqueeSign>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-4 pt-6 pb-16 md:px-8 md:pt-10">
        <div className="grid gap-x-6 gap-y-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-x-8 lg:gap-y-14">
          <section aria-label="Heutige Auslosung" className="lg:col-start-1 lg:row-start-1 lg:self-start">
            <DrawPanel
              currentDay={currentDay}
              currentUser={currentUser}
              drawingState={drawingState}
              settings={settings}
              onPerformDraw={onPerformDraw}
              onDrawRevealed={onDrawRevealed}
              onRequestImageUpload={handleImageUploadPrompt}
            />
          </section>

          <section aria-label="Gewinnertafel" className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start">
            <CalendarGrid
              currentDay={currentDay}
              winnersByDay={drawingState.winnersByDay}
              dayImages={drawingState.imagesByDay}
              participants={drawingState.participants}
              onDayClick={setSelectedDay}
              onImageClick={handleImageView}
              isAdmin={currentUser.isAdmin}
              onAdminUploadClick={handleAdminUploadClick}
            />
          </section>

          <section aria-label="Statistik" className="lg:col-start-1 lg:row-span-2 lg:row-start-2 lg:self-start">
            <StatsPanel
              participants={drawingState.participants}
              winnersByDay={drawingState.winnersByDay}
              currentCycleWinners={drawingState.currentCycleWinners}
            />
          </section>

          <section aria-label="Verlauf" className="lg:col-start-2 lg:row-start-3 lg:self-start">
            <HistoryPanel
              winnersByDay={drawingState.winnersByDay}
              participants={drawingState.participants}
              selectedDay={selectedDay}
            />
          </section>
        </div>
      </main>

      <SettingsDialog
        open={showSettings}
        onOpenChange={setShowSettings}
        settings={settings}
        onUpdateSettings={(next) => {
          setSettings(next)
          localStorage.setItem("userSettings", JSON.stringify(next))
        }}
      />

      <ImageUploadModal
        open={showImageUpload}
        onClose={() => setShowImageUpload(false)}
        onUpload={handleImageUpload}
        winnerName={getWinnerName()}
        day={uploadDay || currentDay}
      />

      <ImageViewerModal
        isOpen={viewerState.isOpen}
        onClose={() => setViewerState({ ...viewerState, isOpen: false })}
        imageUrl={viewerState.imageUrl}
        day={viewerState.day}
        winner={viewerState.winner}
      />
    </div>
  )
}
