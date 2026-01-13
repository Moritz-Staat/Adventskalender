import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { familySize, members } = await request.json()

    const supabase = await createClient()

    // Check if setup is already complete
    const { data: setupData } = await supabase.from("app_setup").select("is_setup_complete").eq("id", 1).single()

    if (setupData?.is_setup_complete) {
      return NextResponse.json({ error: "Setup already complete" }, { status: 400 })
    }

    // Delete existing participants (except setup admin)
    await supabase.from("participants").delete().neq("id", "admin")

    // Delete existing draws and cycle state
    await supabase.from("daily_draws").delete().neq("day", 0)
    await supabase.from("user_viewed_draws").delete().neq("day", 0)
    await supabase
      .from("cycle_state")
      .update({
        current_cycle: 1,
        participants_in_cycle: [],
      })
      .eq("id", 1)

    // Insert new participants
    const participantsToInsert = members.map((member: any) => ({
      id: member.name.toLowerCase().replace(/\s+/g, "_"),
      name: member.name,
      is_active: true,
      // Store password hash in a real app, but for simplicity we'll validate client-side
    }))

    const { error: insertError } = await supabase.from("participants").insert(participantsToInsert)

    if (insertError) throw insertError

    // Mark setup as complete
    await supabase
      .from("app_setup")
      .update({
        is_setup_complete: true,
        family_size: familySize,
        setup_completed_at: new Date().toISOString(),
      })
      .eq("id", 1)

    // Deactivate setup admin
    await supabase.from("participants").update({ is_active: false }).eq("id", "admin")

    // Store passwords and admin info in localStorage (client-side validation)
    return NextResponse.json({
      success: true,
      credentials: members.map((m: any) => ({
        name: m.name,
        password: m.password,
        isAdmin: m.isAdmin,
      })),
    })
  } catch (error) {
    console.error("Setup error:", error)
    return NextResponse.json({ error: "Setup failed" }, { status: 500 })
  }
}
