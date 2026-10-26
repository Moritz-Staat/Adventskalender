"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, animate, useMotionValue, useMotionValueEvent, useTransform } from "framer-motion"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import type { Participant } from "@/lib/types"
import Confetti from "react-confetti"
import IntenseSnowfall from "./intense-snowfall"
import { Awning, StarIcon, Ticket } from "./booth"

interface WheelModalProps {
  open: boolean
  participants: Participant[]
  onComplete: (winnerId: string) => void
  onDismiss?: () => void
  day?: number
  soundEnabled: boolean
  confettiEnabled: boolean
  preselectedWinnerId?: string
}

const SPIN_SECONDS = 5.2
const RIM_BULBS = 20

/** Kleine Buden-Geräusche, nur wenn Sound an ist */
function useBoothSound(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null)

  const getCtx = () => {
    if (!enabled || typeof window === "undefined") return null
    if (!ctxRef.current) {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!Ctor) return null
      ctxRef.current = new Ctor()
    }
    if (ctxRef.current.state === "suspended") ctxRef.current.resume().catch(() => {})
    return ctxRef.current
  }

  const tick = () => {
    const ctx = getCtx()
    if (!ctx) return
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = "triangle"
    osc.frequency.setValueAtTime(1900, t)
    osc.frequency.exponentialRampToValueAtTime(700, t + 0.03)
    gain.gain.setValueAtTime(0.12, t)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.045)
    osc.connect(gain).connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 0.05)
  }

  const fanfare = () => {
    const ctx = getCtx()
    if (!ctx) return
    ;[1046.5, 1318.5, 1568, 2093].forEach((freq, i) => {
      const t = ctx.currentTime + i * 0.11
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = "sine"
      osc.frequency.setValueAtTime(freq, t)
      gain.gain.setValueAtTime(0.0001, t)
      gain.gain.exponentialRampToValueAtTime(0.16, t + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.9)
      osc.connect(gain).connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 1)
    })
  }

  useEffect(() => () => void ctxRef.current?.close().catch(() => {}), [])

  return { tick, fanfare }
}

/** Punkt auf dem Rad: Winkel im Uhrzeigersinn ab 12 Uhr */
function polar(r: number, deg: number) {
  const rad = (deg * Math.PI) / 180
  return { x: r * Math.sin(rad), y: -r * Math.cos(rad) }
}

function segmentPath(r: number, from: number, to: number) {
  if (to - from >= 359.99) {
    return `M 0 ${-r} A ${r} ${r} 0 1 1 0 ${r} A ${r} ${r} 0 1 1 0 ${-r} Z`
  }
  const a = polar(r, from)
  const b = polar(r, to)
  const large = to - from > 180 ? 1 : 0
  return `M 0 0 L ${a.x} ${a.y} A ${r} ${r} 0 ${large} 1 ${b.x} ${b.y} Z`
}

export default function WheelModal({
  open,
  participants,
  onComplete,
  onDismiss,
  day,
  soundEnabled,
  confettiEnabled,
  preselectedWinnerId,
}: WheelModalProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [winner, setWinner] = useState<Participant | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [viewport, setViewport] = useState({ w: 0, h: 0 })
  const spinStartedRef = useRef(false)
  const lastPegRef = useRef(0)

  const rotation = useMotionValue(0)
  const pointerKick = useMotionValue(0)
  const wheelTransform = useTransform(rotation, (r) => `rotate(${r}deg)`)
  const pointerTransform = useTransform(pointerKick, (r) => `rotate(${r}deg)`)
  const { tick, fanfare } = useBoothSound(soundEnabled)

  const segment = 360 / Math.max(participants.length, 1)

  // Zunge tickt an jedem Stift vorbei
  useMotionValueEvent(rotation, "change", (r) => {
    const peg = Math.floor(r / segment)
    if (peg !== lastPegRef.current) {
      lastPegRef.current = peg
      pointerKick.set(-22)
      animate(pointerKick, 0, { type: "spring", stiffness: 900, damping: 18 })
      tick()
    }
  })

  useEffect(() => {
    if (open && !spinStartedRef.current && participants.length > 0) {
      spinStartedRef.current = true
      startSpin()
    } else if (!open) {
      spinStartedRef.current = false
      setIsSpinning(false)
      setWinner(null)
      rotation.set(0)
      lastPegRef.current = 0
      setShowConfetti(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, participants, preselectedWinnerId])

  useEffect(() => {
    const update = () => setViewport({ w: window.innerWidth, h: window.innerHeight })
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  const startSpin = () => {
    setIsSpinning(true)

    let selectedWinner: Participant
    const preselected = preselectedWinnerId ? participants.find((p) => p.id === preselectedWinnerId) : undefined
    if (preselected) {
      selectedWinner = preselected
    } else {
      selectedWinner = participants[Math.floor(Math.random() * participants.length)]
    }

    const winnerIndex = participants.findIndex((p) => p.id === selectedWinner.id)
    const winnerSegmentCenter = winnerIndex * segment + segment / 2
    // Etwas Streuung im Segment, damit es nicht jedes Mal exakt mittig stoppt
    const jitter = (Math.random() - 0.5) * segment * 0.5
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const spins = reduceMotion ? 1 : 6
    const finalRotation = spins * 360 + (360 - winnerSegmentCenter) + jitter

    animate(rotation, finalRotation, {
      duration: reduceMotion ? 1.2 : SPIN_SECONDS,
      ease: [0.12, 0.8, 0.18, 1],
      onComplete: () => {
        setIsSpinning(false)
        setWinner(selectedWinner)
        fanfare()
        if (confettiEnabled) setShowConfetti(true)
        onComplete(selectedWinner.id)
      },
    })
  }

  const rimBulbs = Array.from({ length: RIM_BULBS }, (_, i) => polar(101, (360 / RIM_BULBS) * i))

  return (
    <Dialog open={open}>
      <DialogContent
        showCloseButton={false}
        className="top-0 left-0 flex h-dvh max-h-dvh w-full max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-none border-0 bg-night p-0 sm:max-w-none md:top-1/2 md:left-1/2 md:h-auto md:max-h-[calc(100dvh-2rem)] md:max-w-lg md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl md:border md:border-plank-edge"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_55%_at_50%_30%,rgb(255_190_110/0.2),transparent_70%)]"
        />
        {isSpinning && <IntenseSnowfall />}
        {showConfetti && viewport.w > 0 && (
          <Confetti
            width={viewport.w}
            height={viewport.h}
            recycle={false}
            numberOfPieces={420}
            gravity={0.28}
            colors={["#9fd9c3", "#f4a7b5", "#f5d26a", "#a9c7f1", "#cab4ee", "#ffd27a", "#c41e32", "#f4ead6"]}
            style={{ position: "fixed", inset: 0, zIndex: 60, pointerEvents: "none" }}
          />
        )}

        <Awning className="relative shrink-0" />

        <div className="relative flex flex-1 flex-col items-center justify-center overflow-y-auto px-5 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:pb-8">
          <DialogTitle className="sign-text text-center text-[2rem] leading-none md:text-[2.3rem]">Die Ziehung</DialogTitle>
          <DialogDescription className="ticket-num mt-2.5 text-sm font-semibold tracking-[0.2em] text-bulb uppercase">
            {day ? `Türchen ${day}` : "Heute"} · {participants.length} Lose im Topf
          </DialogDescription>

          {/* Glücksrad */}
          <div
            className={`relative mt-9 aspect-square shrink-0 transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              winner ? "w-[min(62vw,30dvh,320px)]" : "w-[min(88vw,50dvh,420px)] md:w-[min(80vw,52dvh,400px)]"
            }`}
          >
            <motion.svg
              viewBox="-110 -110 220 220"
              className="absolute inset-0 h-full w-full drop-shadow-[0_18px_30px_rgb(0_0_0/0.6)]"
              role="img"
              aria-label={`Glücksrad mit ${participants.map((p) => p.name).join(", ")}`}
            >
              {/* Holzrand */}
              <circle r="108" fill="#4a2a22" />
              <circle r="108" fill="none" stroke="#e8b03a" strokeWidth="2" />
              <circle r="94.5" fill="none" stroke="#e8b03a" strokeWidth="1.5" />

              {/* Lauflicht am Rand */}
              <g className={isSpinning ? "rim-chase rim-fast" : winner ? "rim-chase" : "rim-chase rim-slow"}>
                {rimBulbs.map((b, i) => (
                  <g key={i} transform={`translate(${b.x} ${b.y})`}>
                    <circle r="4.6" fill="url(#bulbGlow)" />
                    <circle r="2.6" fill="#fff4d6" />
                  </g>
                ))}
              </g>

              <motion.g style={{ transform: wheelTransform, transformOrigin: "0px 0px" }}>
                {participants.map((p, i) => {
                  const from = i * segment
                  const to = (i + 1) * segment
                  const mid = from + segment / 2
                  const isWin = winner?.id === p.id
                  return (
                    <g key={p.id}>
                      <path d={segmentPath(93, from, to)} fill={p.color ?? "#f4ead6"} />
                      {/* Papierstruktur und Schatten zur Mitte */}
                      <path d={segmentPath(93, from, to)} fill="url(#segShade)" />
                      {winner && !isWin && <path d={segmentPath(93, from, to)} fill="rgb(26 15 13 / 0.45)" />}
                      <text
                        transform={`rotate(${mid - 90}) translate(60 0)${mid > 180 ? " rotate(180)" : ""}`}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="ticket-num"
                        style={{ fontSize: participants.length > 5 ? 13 : 15, fontWeight: 800, letterSpacing: "0.04em" }}
                        fill="#2a1712"
                      >
                        {p.name.toUpperCase()}
                      </text>
                    </g>
                  )
                })}
                {/* Trennlinien und Stifte */}
                {participants.length > 1 &&
                  participants.map((_, i) => {
                    const a = polar(93, i * segment)
                    const peg = polar(88, i * segment)
                    return (
                      <g key={`peg-${i}`}>
                        <line x1="0" y1="0" x2={a.x} y2={a.y} stroke="#2a1712" strokeOpacity="0.35" strokeWidth="1" />
                        <circle cx={peg.x} cy={peg.y} r="2.8" fill="#e8b03a" stroke="#7a4f12" strokeWidth=".8" />
                      </g>
                    )
                  })}
              </motion.g>

              {/* Nabe */}
              <circle r="21" fill="#c41e32" stroke="#e8b03a" strokeWidth="3" />
              <circle r="21" fill="url(#hubShine)" />

              <defs>
                <radialGradient id="bulbGlow">
                  <stop offset="0%" stopColor="#ffd27a" stopOpacity="1" />
                  <stop offset="100%" stopColor="#ffd27a" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="segShade" cx="0" cy="0" r="93" gradientUnits="userSpaceOnUse">
                  <stop offset="0.25" stopColor="#2a1712" stopOpacity="0.22" />
                  <stop offset="0.6" stopColor="#2a1712" stopOpacity="0" />
                  <stop offset="1" stopColor="#ffffff" stopOpacity="0.12" />
                </radialGradient>
                <radialGradient id="hubShine" cx="-6" cy="-8" r="22" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#ffffff" stopOpacity="0.35" />
                  <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
                </radialGradient>
              </defs>
            </motion.svg>

            <StarIcon className="pointer-events-none absolute top-1/2 left-1/2 h-[9%] w-[9%] -translate-x-1/2 -translate-y-1/2 text-bulb" />

            {/* Zunge oben, schlägt an den Stiften aus */}
            <svg
              viewBox="0 0 40 20"
              aria-hidden
              className="absolute -top-[5.5%] left-1/2 w-[16%] -translate-x-1/2 drop-shadow-[0_3px_3px_rgb(0_0_0/0.5)]"
            >
              <rect x="2" y="2" width="36" height="12" rx="3" fill="#e8b03a" stroke="#7a4f12" strokeWidth="1" />
              <circle cx="9" cy="8" r="1.6" fill="#7a4f12" />
              <circle cx="31" cy="8" r="1.6" fill="#7a4f12" />
            </svg>
            <motion.svg
              viewBox="0 0 20 60"
              aria-hidden
              className="absolute -top-[2%] left-1/2 h-[16%] w-[6%] -translate-x-1/2 drop-shadow-[0_3px_3px_rgb(0_0_0/0.55)]"
              style={{ transform: pointerTransform, transformOrigin: "50% 8%" }}
            >
              <path d="M6 5 L14 5 L11.5 55 Q10 58.5 8.5 55 Z" fill="#7a2d1f" stroke="#e8b03a" strokeWidth="1.4" />
              <circle cx="10" cy="6" r="4" fill="#e8b03a" stroke="#7a4f12" strokeWidth="1" />
            </motion.svg>
          </div>

          {/* Gewinnlos fährt heraus */}
          <div className="min-h-[11rem] w-full max-w-sm">
            {/* Ständer und Losausgabe: Messingplatte mit Schlitz */}
            <div aria-hidden className="mx-auto h-5 w-5 bg-plank-edge shadow-[inset_2px_0_0_rgb(255_255_255/0.06)]" />
            <div
              aria-hidden
              className="relative z-10 mx-auto rounded-xl bg-brass px-4 pt-2 pb-2.5 shadow-[inset_0_1px_0_rgb(255_255_255/0.35),inset_0_-2px_0_rgb(0_0_0/0.2),0_10px_18px_-8px_rgb(0_0_0/0.8)]"
            >
              <div className="mb-1.5 flex justify-between px-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7a4f12]" />
                <span className="ticket-num text-[10px] leading-none font-bold tracking-[0.3em] text-[#5a3a0c] uppercase">Losausgabe</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#7a4f12]" />
              </div>
              <div className="h-3 rounded-full bg-[#0d0706] shadow-[inset_0_3px_4px_rgb(0_0_0/0.95),0_1px_0_rgb(255_255_255/0.3)]" />
            </div>
            <AnimatePresence>
              {winner ? (
                <motion.div key="win" className="-mt-4 space-y-4">
                  <div className="overflow-hidden px-[7%] pt-1 pb-3">
                    <motion.div
                      initial={{ y: "-105%" }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    >
                  <Ticket color={winner.color ?? "#f4ead6"} className="flex items-stretch [--notch:11px]">
                    <div className="flex w-20 shrink-0 flex-col items-center justify-center py-4">
                      <span className="ticket-num text-[11px] font-bold tracking-[0.2em] uppercase opacity-70">Los</span>
                      <span className="ticket-num text-4xl leading-none font-extrabold">{day ?? "–"}</span>
                    </div>
                    <div className="perforation my-3" />
                    <div className="min-w-0 flex-1 py-4 pr-6 pl-4">
                      <p className="ticket-num truncate text-[2.75rem] leading-[1.02] font-extrabold uppercase">
                        {winner.name}
                      </p>
                      <p className="text-sm font-medium">zieht Los {day ?? ""} und darf das Türchen öffnen.</p>
                    </div>
                  </Ticket>
                    </motion.div>
                  </div>
                  {onDismiss && (
                    <motion.button
                      type="button"
                      onClick={onDismiss}
                      className="booth-button-quiet h-13 w-full py-3.5 text-base"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9 }}
                      autoFocus
                    >
                      Weiter zur Tafel
                    </motion.button>
                  )}
                </motion.div>
              ) : (
                <motion.p
                  key="spin"
                  exit={{ opacity: 0 }}
                  className="pt-5 text-center text-base font-semibold text-cream-dim"
                  aria-live="polite"
                >
                  Das Rad dreht sich …
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
