"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Camera, ImagePlus, RotateCcw, Upload } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ImageUploadModalProps {
  open: boolean
  onClose: () => void
  onUpload: (file: File) => void
  winnerName: string
  day: number
}

export default function ImageUploadModal({ open, onClose, onUpload, winnerName, day }: ImageUploadModalProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const [fileError, setFileError] = useState("")

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setFileError("Das ist keine Bilddatei. Bitte wähle ein Foto aus.")
      return
    }

    setFileError("")
    setSelectedFile(file)

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setPreview(result)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleUploadClick = () => {
    if (preview && selectedFile) {
      onUpload(selectedFile)
      setPreview(null)
      setSelectedFile(null)
      onClose()
    }
  }

  const resetSelection = () => {
    setPreview(null)
    setSelectedFile(null)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] max-w-lg overflow-y-auto border-plank-edge bg-night-2 p-5 sm:max-w-lg md:p-6">
        <DialogHeader className="pr-6 text-left">
          <DialogTitle className="sign-text text-[1.75rem] leading-tight">Glückwunsch, {winnerName}</DialogTitle>
          <DialogDescription className="text-[15px] text-cream-dim">
            Du hast Türchen {day} gewonnen. Lade jetzt ein Bild von dir mit deinem Geschenk hoch.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!preview ? (
            <>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`hidden rounded-2xl border-2 border-dashed p-8 text-center transition-colors md:block ${
                  isDragging ? "border-bulb bg-bulb/10" : "border-cream/20"
                }`}
              >
                <ImagePlus className="mx-auto h-10 w-10 text-cream-dim" />
                <p className="mt-3 font-semibold text-cream">Ziehe ein Bild hierher</p>
                <p className="text-sm text-cream-dim">oder wähle eine der Optionen unten</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="booth-button flex h-14 items-center justify-center gap-2.5 text-base"
                >
                  <Camera className="h-5 w-5" />
                  Foto aufnehmen
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="booth-button-quiet flex h-14 items-center justify-center gap-2.5 text-base"
                >
                  <Upload className="h-5 w-5" />
                  Datei auswählen
                </button>
              </div>

              {fileError && (
                <p role="alert" className="text-sm font-medium text-destructive">
                  {fileError}
                </p>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileSelect(file)
                }}
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileSelect(file)
                }}
              />
            </>
          ) : (
            <div className="space-y-4">
              {/* Foto im Rahmen wie an der Gewinnertafel */}
              <div className="rotate-[-1.2deg] rounded-md bg-cream p-2.5 pb-9 shadow-[0_16px_30px_-12px_rgb(0_0_0/0.7)]">
                <img src={preview} alt="Vorschau deines Fotos" className="max-h-[52dvh] w-full rounded-sm bg-night object-contain" />
                <p className="ticket-num mt-2 text-center text-sm font-bold tracking-[0.18em] text-ink/70 uppercase">
                  Türchen {day} · {winnerName}
                </p>
              </div>

              <div className="grid grid-cols-[auto_1fr] gap-3">
                <button
                  type="button"
                  onClick={resetSelection}
                  className="booth-button-quiet flex h-14 items-center justify-center gap-2 px-4 text-base"
                >
                  <RotateCcw className="h-4 w-4" />
                  Anderes Bild
                </button>
                <button type="button" onClick={handleUploadClick} className="booth-button h-14 text-base">
                  Bild hochladen
                </button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
