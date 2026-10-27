"use client"

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"

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
      <DialogContent className="w-[calc(100%-1.5rem)] max-w-3xl border-0 bg-transparent p-0 shadow-none sm:max-w-3xl [&>[data-slot=dialog-close]]:top-4 [&>[data-slot=dialog-close]]:right-4 [&>[data-slot=dialog-close]]:z-10 [&>[data-slot=dialog-close]]:rounded-full [&>[data-slot=dialog-close]]:bg-ink/70 [&>[data-slot=dialog-close]]:p-2 [&>[data-slot=dialog-close]]:text-cream [&>[data-slot=dialog-close]]:opacity-100">
        {/* Foto im cremefarbenen Rahmen, beschriftet wie ein Gewinnlos */}
        <figure className="rounded-lg bg-cream p-2.5 pb-4 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.8)] md:p-3.5 md:pb-5">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={`Geschenk von ${winner} an Tag ${day}`}
            className="max-h-[72dvh] w-full rounded-[5px] bg-night object-contain"
          />
          <figcaption className="mt-3 flex items-baseline justify-between gap-3 px-1.5 text-ink">
            <DialogTitle className="ticket-num text-3xl leading-none font-extrabold uppercase">Türchen {day}</DialogTitle>
            <DialogDescription className="text-base font-semibold text-ink/75">Gewinner: {winner}</DialogDescription>
          </figcaption>
        </figure>
      </DialogContent>
    </Dialog>
  )
}
