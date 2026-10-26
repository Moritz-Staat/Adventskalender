"use client"

import type React from "react"
import { cn } from "@/lib/utils"

/** Rot-creme gestreifte Markise über die ganze Breite */
export function Awning({ className }: { className?: string }) {
  return <div aria-hidden className={cn("awning w-full", className)} />
}

/** Reihe Glühbirnen; `chase` lässt sie abwechselnd laufen */
export function BulbRow({ count, chase = true, className }: { count: number; chase?: boolean; className?: string }) {
  return (
    <div aria-hidden className={cn("flex justify-between", chase && "chase", className)}>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className="bulb" />
      ))}
    </div>
  )
}

/** Lackiertes Holzschild mit Birnenrand oben und unten */
export function MarqueeSign({
  children,
  className,
  bulbs = 14,
}: {
  children: React.ReactNode
  className?: string
  bulbs?: number
}) {
  return (
    <div className={cn("plank relative rounded-2xl px-4 py-5", className)}>
      {/* Die Birnen werfen warmes Licht aufs Holz */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-10 rounded-t-2xl bg-[linear-gradient(180deg,rgb(255_210_122/0.16),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-10 rounded-b-2xl bg-[linear-gradient(0deg,rgb(255_210_122/0.12),transparent)]"
      />
      <BulbRow count={bulbs} className="absolute inset-x-4 top-2" />
      <div className="relative">{children}</div>
      <BulbRow count={bulbs} className="absolute inset-x-4 bottom-2" />
    </div>
  )
}

/** Rotes Schild, das mit zwei Messingschrauben oben auf das Brett montiert ist */
export function MountedSign({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("-mt-11 mb-4 flex justify-center md:-mt-12", className)}>
      <div className="relative rounded-lg bg-awning px-7 pt-2 pb-2.5 shadow-[inset_0_0_0_2px_rgb(232_176_58/0.9),0_8px_16px_-6px_rgb(0_0_0/0.7)]">
        <span aria-hidden className="absolute top-1/2 left-2 h-2 w-2 -translate-y-1/2 rounded-full bg-brass shadow-[inset_0_-1px_1px_rgb(0_0_0/0.4)]" />
        <span aria-hidden className="absolute top-1/2 right-2 h-2 w-2 -translate-y-1/2 rounded-full bg-brass shadow-[inset_0_-1px_1px_rgb(0_0_0/0.4)]" />
        {children}
      </div>
    </div>
  )
}

/** Ein Los in der Papierfarbe einer Person */
export function Ticket({
  color,
  className,
  children,
  style,
}: {
  color: string
  className?: string
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <div className={cn("ticket ticket-paper", className)} style={{ backgroundColor: color, ...style }}>
      {children}
    </div>
  )
}

/** Kleine Marke mit Initiale, statt runder Avatare */
export function NameStamp({
  name,
  color,
  size = "md",
  dimmed = false,
  className,
}: {
  name: string
  color?: string
  size?: "sm" | "md" | "lg"
  dimmed?: boolean
  className?: string
}) {
  const sizes = {
    sm: "w-7 h-7 text-sm rounded-[7px]",
    md: "w-10 h-10 text-lg rounded-[9px]",
    lg: "w-16 h-16 text-3xl rounded-[14px]",
  }
  return (
    <span
      aria-hidden
      className={cn(
        "ticket-num ticket-paper inline-flex shrink-0 items-center justify-center font-extrabold uppercase text-ink",
        "shadow-[0_2px_5px_rgb(0_0_0/0.35),inset_0_0_0_1.5px_rgb(42_23_18/0.18)]",
        sizes[size],
        dimmed && "opacity-45 saturate-50",
        className,
      )}
      style={{ backgroundColor: color }}
    >
      {name.charAt(0)}
    </span>
  )
}

/** Fünfzackiger Stern, gezeichnet statt Emoji */
export function StarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        d="M12 2.6l2.7 6.1 6.6.6-5 4.4 1.5 6.5L12 16.8l-5.8 3.4 1.5-6.5-5-4.4 6.6-.6L12 2.6z"
        fill="currentColor"
      />
    </svg>
  )
}

/** Tannenbaum-Signet der Bude */
export function TreeMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={className}>
      <path d="M16 2.5l2 3.6 4 .4-3 2.7.8 4L16 11.3l-3.8 1.9.8-4-3-2.7 4-.4z" fill="var(--bulb)" />
      <path d="M16 11l-6 7h3l-5 6h5l-4 5h14l-4-5h5l-5-6h3z" fill="currentColor" />
      <rect x="14.5" y="28.6" width="3" height="2.6" rx=".6" fill="currentColor" />
    </svg>
  )
}
