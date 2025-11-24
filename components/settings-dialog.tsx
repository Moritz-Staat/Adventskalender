"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { Settings } from "@/lib/types"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  settings: Settings
  onUpdateSettings: (settings: Settings) => void
}

export default function SettingsDialog({ open, onOpenChange, settings, onUpdateSettings }: SettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-[#0f3d2e]">Einstellungen</DialogTitle>
          <DialogDescription className="text-[#0f3d2e]/70">
            Passe die App-Einstellungen nach deinen Wünschen an.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sound" className="text-[#0f3d2e] font-medium">
                Soundeffekte
              </Label>
              <p className="text-sm text-[#0f3d2e]/70">Spiele Sounds bei der Auslosung ab</p>
            </div>
            <Switch
              id="sound"
              checked={settings.soundEnabled}
              onCheckedChange={(checked) => onUpdateSettings({ ...settings, soundEnabled: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="confetti" className="text-[#0f3d2e] font-medium">
                Konfetti
              </Label>
              <p className="text-sm text-[#0f3d2e]/70">Zeige Konfetti bei der Gewinner-Anzeige</p>
            </div>
            <Switch
              id="confetti"
              checked={settings.confettiEnabled}
              onCheckedChange={(checked) => onUpdateSettings({ ...settings, confettiEnabled: checked })}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
