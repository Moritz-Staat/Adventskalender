"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Camera, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ImageUploadModalProps {
  open: boolean
  onClose: () => void
  onUpload: (imageData: string) => void
  winnerName: string
  day: number
}

export default function ImageUploadModal({ open, onClose, onUpload, winnerName, day }: ImageUploadModalProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Bitte wähle eine Bilddatei aus")
      return
    }

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
    if (preview) {
      onUpload(preview)
      setPreview(null)
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#0f3d2e]">Glückwunsch, {winnerName}! 🎄</DialogTitle>
          <DialogDescription className="text-base">
            Du hast Türchen {day} gewonnen! Lade jetzt ein Bild von dir mit deinem Geschenk hoch.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!preview ? (
            <>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center transition-all
                  ${isDragging ? "border-[#b52b3b] bg-[#b52b3b]/5" : "border-[#0f3d2e]/30"}
                `}
              >
                <div className="flex flex-col items-center gap-4">
                  <Upload className="w-12 h-12 text-[#0f3d2e]/50" />
                  <div>
                    <p className="text-lg font-medium text-[#0f3d2e]">Ziehe ein Bild hierher oder</p>
                    <p className="text-sm text-[#0f3d2e]/70">wähle eine der Optionen unten</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-[#0f3d2e] hover:bg-[#2d5f4f] text-white h-14"
                  size="lg"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Datei auswählen
                </Button>
                <Button
                  onClick={() => cameraInputRef.current?.click()}
                  className="bg-[#b52b3b] hover:bg-[#8b3a3a] text-white h-14"
                  size="lg"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Foto aufnehmen
                </Button>
              </div>

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
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src={preview || "/placeholder.svg"}
                  alt="Vorschau"
                  className="w-full h-auto max-h-96 object-contain bg-gray-50"
                />
                <Button
                  onClick={() => setPreview(null)}
                  className="absolute top-2 right-2 bg-white/90 hover:bg-white text-[#b52b3b]"
                  size="icon"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => setPreview(null)}
                  variant="outline"
                  className="border-[#0f3d2e] text-[#0f3d2e] hover:bg-[#0f3d2e]/5"
                  size="lg"
                >
                  Neues Bild wählen
                </Button>
                <Button onClick={handleUploadClick} className="bg-[#b52b3b] hover:bg-[#8b3a3a] text-white" size="lg">
                  Bild hochladen
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
