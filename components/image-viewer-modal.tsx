"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageViewerModalProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  day: number
  winner: string
}

export function ImageViewerModal({ isOpen, onClose, imageUrl, day, winner }: ImageViewerModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-0 overflow-hidden bg-background/95 backdrop-blur">
        <DialogTitle className="sr-only">Bild von Tag {day}</DialogTitle>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 bg-background/80 hover:bg-background"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="p-4">
            <img
              src={imageUrl || "/placeholder.svg"}
              alt={`Geschenk von ${winner} an Tag ${day}`}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
            <div className="mt-4 text-center">
              <p className="text-lg font-semibold">Tag {day}</p>
              <p className="text-muted-foreground">Gewinner: {winner}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
