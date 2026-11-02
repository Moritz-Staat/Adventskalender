"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Awning, MarqueeSign, TreeMark } from "@/components/booth"
import Snowfall from "@/components/snowfall"

interface LoginPageProps {
  onLogin: (name: string, password: string) => Promise<void>
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isShaking, setIsShaking] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await onLogin(username, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Anmeldung fehlgeschlagen")
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
    }
  }

  const fieldClass =
    "h-12 w-full rounded-xl border-2 border-ink/15 bg-white/55 px-4 text-base font-medium text-ink placeholder:text-ink/45 outline-none transition-[border-color,background-color] focus:border-ink/60 focus:bg-white/80"

  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-hidden">
      <Snowfall />
      <Awning className="relative z-10" />

      <main className="relative z-10 flex flex-1 flex-col items-center px-4 pt-6 pb-12 md:justify-center md:pt-0 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          <MarqueeSign className="pt-8 pb-9 text-center" bulbs={12}>
            <TreeMark className="mx-auto h-12 w-12 text-[#2f6b4f]" />
            <h1 className="sign-text mt-3 leading-[0.95]">
              <span className="block text-lg">Familien-</span>
              <span className="block text-[clamp(1.9rem,9vw,2.6rem)]">Adventskalender</span>
            </h1>
          </MarqueeSign>

          {/* Eintrittskarte */}
          <motion.div
            animate={isShaking ? { x: [-10, 10, -8, 8, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="mt-4 px-2"
          >
            <div className="ticket ticket-paper relative bg-cream px-6 pt-6 pb-7 shadow-[0_20px_40px_-16px_rgb(0_0_0/0.7)] [--notch:12px]">
              <h2 className="text-center text-lg font-bold text-ink">Melde dich mit deinem Namen an</h2>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="username" className="text-sm font-semibold text-ink">
                    Benutzername
                  </label>
                  <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    autoCapitalize="words"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value)
                      setError("")
                    }}
                    placeholder="Dein Name"
                    className={fieldClass}
                    aria-invalid={!!error}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="password" className="text-sm font-semibold text-ink">
                    Passwort
                  </label>
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setError("")
                    }}
                    placeholder="Dein Passwort"
                    className={fieldClass}
                    aria-invalid={!!error}
                    required
                  />
                </div>

                {error && (
                  <motion.p
                    role="alert"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm font-semibold text-awning-deep"
                  >
                    {error}
                  </motion.p>
                )}

                <div className="border-t-2 border-dashed border-ink/20 pt-5">
                  <button type="submit" className="booth-button h-14 w-full text-lg">
                    Anmelden
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
