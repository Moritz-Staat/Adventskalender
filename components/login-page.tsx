"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Participant, DrawingState } from "@/lib/types"
import Snowfall from "@/components/snowfall"

interface LoginPageProps {
  onLogin: (user: Participant) => void
  drawingState: DrawingState | null
}

export default function LoginPage({ onLogin, drawingState }: LoginPageProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isShaking, setIsShaking] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!drawingState) return

    const user = drawingState.participants.find((p) => p.name.toLowerCase() === username.toLowerCase())

    if (user && password.toLowerCase() === user.name.toLowerCase()) {
      onLogin(user)
    } else {
      setError("Benutzername oder Passwort falsch")
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#f5e6c8] via-white to-[#f5e6c8] flex items-center justify-center p-4">
      <Snowfall />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Card className="w-full max-w-md shadow-2xl border-2 border-[#0f3d2e]/10">
          <motion.div animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}} transition={{ duration: 0.4 }}>
            <CardHeader className="text-center space-y-4">
              <motion.div
                className="mx-auto w-16 h-16 bg-gradient-to-br from-[#0f3d2e] to-[#2d5f4f] rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Gift className="w-8 h-8 text-[#f5e6c8]" />
              </motion.div>
              <CardTitle className="text-3xl font-bold text-[#0f3d2e]">Familien-Adventskalender</CardTitle>
              <CardDescription className="text-base text-[#0f3d2e]/70">
                Melde dich mit deinem Vornamen an
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium text-[#0f3d2e]">
                    Benutzername
                  </label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value)
                      setError("")
                    }}
                    placeholder="Dein Vorname"
                    className="border-[#0f3d2e]/20 focus:border-[#0f3d2e] focus:ring-[#0f3d2e]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-[#0f3d2e]">
                    Passwort
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setError("")
                    }}
                    placeholder="Dein Vorname"
                    className="border-[#0f3d2e]/20 focus:border-[#0f3d2e] focus:ring-[#0f3d2e]"
                    required
                  />
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-[#b52b3b] font-medium"
                  >
                    {error}
                  </motion.p>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#0f3d2e] to-[#2d5f4f] hover:from-[#2d5f4f] hover:to-[#0f3d2e] text-white transition-all duration-300"
                  size="lg"
                >
                  Anmelden
                </Button>
              </form>
            </CardContent>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  )
}
