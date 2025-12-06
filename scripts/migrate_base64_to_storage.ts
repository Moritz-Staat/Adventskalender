// Migration Script: Base64-Bilder zu Supabase Storage migrieren
// Dieses Script liest alle bestehenden Base64-Bilder aus der Datenbank und lädt sie in Supabase Storage hoch

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function migrateBase64ToStorage() {
  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log("🔄 Starte Migration von Base64-Bildern zu Supabase Storage...")

  // Alle Ziehungen mit Bildern holen
  const { data: draws, error: fetchError } = await supabase
    .from("daily_draws")
    .select("day, image_url")
    .not("image_url", "is", null)

  if (fetchError) {
    console.error("❌ Fehler beim Laden der Ziehungen:", fetchError)
    return
  }

  if (!draws || draws.length === 0) {
    console.log("✅ Keine Base64-Bilder zum Migrieren gefunden")
    return
  }

  console.log(`📦 ${draws.length} Bilder gefunden`)

  for (const draw of draws) {
    if (!draw.image_url.startsWith("data:image")) {
      console.log(`⏭️  Tag ${draw.day}: Bereits Storage-URL, überspringe`)
      continue
    }

    try {
      console.log(`📤 Migriere Bild für Tag ${draw.day}...`)

      // Base64 zu Blob konvertieren
      const base64Data = draw.image_url.split(",")[1]
      const mimeType = draw.image_url.split(";")[0].split(":")[1]
      const buffer = Buffer.from(base64Data, "base64")
      const blob = new Blob([buffer], { type: mimeType })

      // Dateinamen erstellen
      const extension = mimeType.split("/")[1]
      const fileName = `day-${draw.day}-migrated-${Date.now()}.${extension}`

      // Zu Storage hochladen
      const { error: uploadError } = await supabase.storage.from("advent-images").upload(fileName, blob, {
        contentType: mimeType,
        cacheControl: "3600",
        upsert: false,
      })

      if (uploadError) {
        console.error(`❌ Upload-Fehler für Tag ${draw.day}:`, uploadError)
        continue
      }

      // Öffentliche URL holen
      const {
        data: { publicUrl },
      } = supabase.storage.from("advent-images").getPublicUrl(fileName)

      // Datenbank aktualisieren
      const { error: updateError } = await supabase
        .from("daily_draws")
        .update({ image_url: publicUrl })
        .eq("day", draw.day)

      if (updateError) {
        console.error(`❌ Update-Fehler für Tag ${draw.day}:`, updateError)
        continue
      }

      console.log(`✅ Tag ${draw.day} erfolgreich migriert`)
    } catch (error) {
      console.error(`❌ Fehler bei Tag ${draw.day}:`, error)
    }
  }

  console.log("🎉 Migration abgeschlossen!")
}

migrateBase64ToStorage()
