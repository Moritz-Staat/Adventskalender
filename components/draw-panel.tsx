"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, Check, Loader2 } from "lucide-react"
import WheelModal from "@/components/wheel-modal"
import { BulbRow, StarIcon, Ticket } from "@/components/booth"
import type { DrawingState, Participant, Settings } from "@/lib/types"
import { cn } from "@/lib/utils"

interface DrawPanelProps {
  currentDay: number
  currentUser: Participant
  drawingState: DrawingState
  settings: Settings
  onPerformDraw: () => Promise<string>
  onDrawRevealed: () => Promise<void>
  onRequestImageUpload: () => void
}

const ease = [0.16, 1, 0.3, 1] as const

export default function DrawPanel({
  currentDay,
  currentUser,
  drawingState,
  settings,
  onPerformDraw,
  onDrawRevealed,
  onRequestImageUpload,
}: DrawPanelProps) {
  const [showWheel, setShowWheel] = useState(false)
  const [wheelWinnerId, setWheelWinnerId] = useState<string | null>(null)
  const [wheelParticipants, setWheelParticipants] = useState<Participant[]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawError, setDrawError] = useState("")

  const hasDrawnToday = drawingState.winnersByDay[currentDay] !== undefined
  const eligibleParticipants = drawingState.participants.filter((p) => !drawingState.currentCycleWinners.includes(p.id))

  const todayWinner = drawingState.winnersByDay[currentDay]
  const isWinner = todayWinner === currentUser.id
  const hasUploadedImage = drawingState.imagesByDay[currentDay] !== undefined
  const needsImageUpload = isWinner && !hasUploadedImage
  const isValidDay = currentDay >= 1 && currentDay <= 25

  const todayWinnerData = hasDrawnToday
    ? drawingState.participants.find((p) => p.id === drawingState.winnersByDay[currentDay])
    : null

  const handleDraw = async () => {
    if (hasDrawnToday || !isValidDay || isDrawing) return
    setIsDrawing(true)
    setDrawError("")
    try {
      // Rad zeigt die Teilnehmenden, die vor der Ziehung noch im Topf waren
      setWheelParticipants(eligibleParticipants)
      const winnerId = await onPerformDraw()
      setWheelWinnerId(winnerId)
      setShowWheel(true)
    } catch (error) {
      console.error("[v0] Error performing draw:", error)
      setDrawError("Die Ziehung hat nicht geklappt. Prüf die Verbindung und versuch es noch einmal.")
    } finally {
      setIsDrawing(false)
    }
  }

  const handleDrawComplete = async () => {
    await onDrawRevealed()
  }

  const closeWheel = () => {
    setShowWheel(false)
    setWheelWinnerId(null)
  }

  return (
    <>
      <div className="plank relative overflow-hidden rounded-2xl">
        {/* Bühnenlicht von oben */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(70%_100%_at_50%_0%,rgb(255_210_122/0.18),transparent)]"
        />

        <div className="relative px-5 pt-5 pb-6 md:px-7 md:pt-7">
          <div className="flex items-end gap-4">
            <div className="ticket-num text-[5.5rem] leading-[0.78] font-extrabold tracking-[-0.02em] text-cream md:text-[6.5rem]">
              <span className="sr-only">Türchen </span>
              {isValidDay ? currentDay : "–"}
            </div>
            <div className="min-w-0 pb-1">
              <h2 className="text-xl leading-snug font-bold text-cream md:text-2xl">
                {!isValidDay
                  ? "Heute ist kein Adventstag"
                  : hasDrawnToday
                    ? "Heute wurde bereits ausgelost"
                    : "Wer darf heute öffnen?"}
              </h2>
            </div>
          </div>

          {/* Lostopf: wer in diesem Durchgang noch drin ist */}
          <div className="mt-6">
            <div className="mb-2.5 flex items-baseline justify-between gap-3">
              <h3 className="text-sm font-semibold text-cream">Im Lostopf</h3>
              <p className="text-xs text-cream-dim">
                {eligibleParticipants.length} von {drawingState.participants.length} noch drin
              </p>
            </div>
            <ul className="flex flex-wrap gap-2">
              {drawingState.participants.map((participant) => {
                const isEligible = !drawingState.currentCycleWinners.includes(participant.id)
                const isWinnerToday = todayWinnerData?.id === participant.id
                return (
                  <li key={participant.id}>
                    <Ticket
                      color={participant.color ?? "#f4ead6"}
                      className={cn(
                        "flex h-10 items-center gap-1.5 pr-6 pl-5 text-[15px] font-semibold",
                        !isEligible && !isWinnerToday && "pr-10 saturate-[0.2] brightness-90",
                        isWinnerToday && "shadow-[0_0_0_2px_var(--bulb)]",
                      )}
                    >
                      {isWinnerToday && <StarIcon className="h-3.5 w-3.5 text-awning-deep" />}
                      {/* Gestanzt: in diesem Durchgang schon gezogen */}
                      {!isEligible && !isWinnerToday && (
                        <span
                          aria-hidden
                          className="absolute top-1/2 right-[18px] h-3 w-3 -translate-y-1/2 rounded-full bg-plank shadow-[inset_0_1.5px_2px_rgb(0_0_0/0.75)]"
                        />
                      )}
                      <span>{participant.name}</span>
                      <span className="sr-only">
                        {isWinnerToday ? "– gewinnt heute" : isEligible ? "– noch im Topf" : "– in diesem Durchgang schon dran"}
                      </span>
                    </Ticket>
                  </li>
                )
              })}
            </ul>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {hasDrawnToday ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease }}
                className="mt-6 space-y-3"
              >
                {todayWinnerData && (
                  <Ticket color={todayWinnerData.color ?? "#f4ead6"} className="flex items-stretch [--notch:10px]">
                    <div className="flex w-20 shrink-0 flex-col items-center justify-center py-4">
                      <span className="ticket-num text-[11px] font-bold tracking-[0.2em] uppercase opacity-70">Los</span>
                      <span className="ticket-num text-4xl leading-none font-extrabold">{currentDay}</span>
                    </div>
                    <div className="perforation my-3" />
                    <div className="min-w-0 flex-1 py-4 pr-6 pl-4">
                      <p className="ticket-num truncate text-[2.4rem] leading-[1.05] font-extrabold uppercase">
                        {todayWinnerData.name}
                      </p>
                      <p className="text-sm font-medium">
                        {isWinner
                          ? "Heute gewinnst du. Du darfst das Adventstürchen öffnen!"
                          : `zieht Los ${currentDay} und darf das Türchen öffnen.`}
                      </p>
                    </div>
                  </Ticket>
                )}

                {needsImageUpload && (
                  <div>
                    <button
                      type="button"
                      onClick={onRequestImageUpload}
                      className="booth-button flex h-14 w-full items-center justify-center gap-2.5 text-lg"
                    >
                      <Camera className="h-5 w-5" />
                      Bild hochladen
                    </button>
                    <p className="mt-2 text-center text-sm text-cream-dim">
                      Lade ein Bild von dir mit deinem Geschenk hoch.
                    </p>
                  </div>
                )}

                {hasUploadedImage && isWinner && (
                  <p className="flex items-center justify-center gap-2 rounded-xl bg-night/60 py-3 text-sm font-semibold text-cream [&_svg]:text-bulb">
                    <Check className="h-4 w-4" />
                    Bild erfolgreich hochgeladen
                  </p>
                )}
              </motion.div>
            ) : isValidDay ? (
              <motion.div
                key="button"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease }}
                className="mt-7"
              >
                <button
                  type="button"
                  onClick={handleDraw}
                  disabled={isDrawing}
                  className="booth-button group relative flex h-[4.5rem] w-full items-center justify-center gap-3 text-xl"
                >
                  <BulbRow count={9} className="pointer-events-none absolute inset-x-6 top-1.5 opacity-90" />
                  {isDrawing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Lose werden gemischt …
                    </>
                  ) : (
                    "Jetzt auslosen"
                  )}
                </button>
                {drawError && (
                  <p role="alert" className="mt-3 text-center text-sm font-medium text-destructive">
                    {drawError}
                  </p>
                )}
              </motion.div>
            ) : (
              <motion.p
                key="invalid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 rounded-xl bg-night/60 p-5 text-center text-cream-dim"
              >
                Die Bude hat vom 1. bis 25. Dezember geöffnet.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      <WheelModal
        open={showWheel}
        participants={wheelParticipants}
        onComplete={handleDrawComplete}
        onDismiss={closeWheel}
        day={currentDay}
        soundEnabled={settings.soundEnabled}
        confettiEnabled={settings.confettiEnabled}
        preselectedWinnerId={wheelWinnerId ?? undefined}
      />
    </>
  )
}
