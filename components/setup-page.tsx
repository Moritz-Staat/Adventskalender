"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Gift, Plus, Trash2, Crown, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Snowfall from "@/components/snowfall"

interface FamilyMember {
  name: string
  password: string
  isAdmin: boolean
}

interface SetupPageProps {
  onSetupComplete: () => void
}

export default function SetupPage({ onSetupComplete }: SetupPageProps) {
  const [familySize, setFamilySize] = useState<number>(5)
  const [members, setMembers] = useState<FamilyMember[]>([{ name: "", password: "", isAdmin: false }])
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddMember = () => {
    if (members.length < familySize) {
      setMembers([...members, { name: "", password: "", isAdmin: false }])
    }
  }

  const handleRemoveMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index))
  }

  const handleMemberChange = (index: number, field: keyof FamilyMember, value: string | boolean) => {
    const newMembers = [...members]
    newMembers[index] = { ...newMembers[index], [field]: value }
    setMembers(newMembers)
    setError("")
  }

  const handleSetAdmin = (index: number) => {
    const newMembers = members.map((m, i) => ({
      ...m,
      isAdmin: i === index,
    }))
    setMembers(newMembers)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (members.length < 3 || members.length > 6) {
      setError("Du musst 3 bis 6 Familienmitglieder anlegen")
      return
    }

    if (members.length !== familySize) {
      setError(`Du hast ${familySize} Mitglieder gewählt, aber nur ${members.length} angelegt`)
      return
    }

    const hasAdmin = members.some((m) => m.isAdmin)
    if (!hasAdmin) {
      setError("Du musst einen Admin auswählen")
      return
    }

    const emptyNames = members.some((m) => !m.name.trim())
    if (emptyNames) {
      setError("Alle Namen müssen ausgefüllt sein")
      return
    }

    const emptyPasswords = members.some((m) => !m.password.trim())
    if (emptyPasswords) {
      setError("Alle Passwörter müssen ausgefüllt sein")
      return
    }

    const duplicateNames = new Set(members.map((m) => m.name.toLowerCase())).size !== members.length
    if (duplicateNames) {
      setError("Alle Namen müssen eindeutig sein")
      return
    }

    try {
      setIsSubmitting(true)

      // Call setup API
      const response = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ familySize, members }),
      })

      if (!response.ok) {
        throw new Error("Setup fehlgeschlagen")
      }

      onSetupComplete()
    } catch (err) {
      setError("Ein Fehler ist aufgetreten. Bitte versuche es erneut.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#f5e6c8] via-white to-[#f5e6c8] flex items-center justify-center p-4">
      <Snowfall />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-2xl border-2 border-[#0f3d2e]/10">
          <CardHeader className="text-center space-y-4">
            <motion.div
              className="mx-auto w-16 h-16 bg-gradient-to-br from-[#0f3d2e] to-[#2d5f4f] rounded-full flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Gift className="w-8 h-8 text-[#f5e6c8]" />
            </motion.div>
            <CardTitle className="text-3xl font-bold text-[#0f3d2e]">Familien-Adventskalender einrichten</CardTitle>
            <CardDescription className="text-base text-[#0f3d2e]/70">
              Richte deinen Adventskalender ein, indem du deine Familienmitglieder anlegst
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Family Size Selection */}
              <div className="space-y-2">
                <Label htmlFor="familySize" className="text-[#0f3d2e] flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Anzahl der Familienmitglieder
                </Label>
                <Select value={familySize.toString()} onValueChange={(val) => setFamilySize(Number(val))}>
                  <SelectTrigger className="border-[#0f3d2e]/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[3, 4, 5, 6].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} Mitglieder
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Members List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-[#0f3d2e]">
                    Familienmitglieder ({members.length}/{familySize})
                  </Label>
                  {members.length < familySize && (
                    <Button
                      type="button"
                      onClick={handleAddMember}
                      variant="outline"
                      size="sm"
                      className="border-[#0f3d2e]/20 bg-transparent"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Hinzufügen
                    </Button>
                  )}
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {members.map((member, index) => (
                    <Card key={index} className="p-4 bg-[#f5e6c8]/30">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder="Name"
                            value={member.name}
                            onChange={(e) => handleMemberChange(index, "name", e.target.value)}
                            className="flex-1 border-[#0f3d2e]/20"
                            required
                          />
                          <Button
                            type="button"
                            onClick={() => handleSetAdmin(index)}
                            variant={member.isAdmin ? "default" : "outline"}
                            size="icon"
                            className={member.isAdmin ? "bg-[#d4a574]" : ""}
                            title="Als Admin festlegen"
                          >
                            <Crown className="w-4 h-4" />
                          </Button>
                          {members.length > 1 && (
                            <Button
                              type="button"
                              onClick={() => handleRemoveMember(index)}
                              variant="outline"
                              size="icon"
                              className="border-[#b52b3b]/20 text-[#b52b3b]"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <Input
                          type="password"
                          placeholder="Passwort"
                          value={member.password}
                          onChange={(e) => handleMemberChange(index, "password", e.target.value)}
                          className="border-[#0f3d2e]/20"
                          required
                        />
                        {member.isAdmin && (
                          <p className="text-xs text-[#d4a574] flex items-center gap-1">
                            <Crown className="w-3 h-3" />
                            Admin - Kann Bilder nachträglich hochladen
                          </p>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
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
                className="w-full bg-gradient-to-r from-[#0f3d2e] to-[#2d5f4f] hover:from-[#2d5f4f] hover:to-[#0f3d2e] text-white"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Wird eingerichtet..." : "Einrichtung abschließen"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
