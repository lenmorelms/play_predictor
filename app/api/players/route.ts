import { NextResponse } from "next/server"
import { readJson } from "@/lib/db"

interface Player {
  id: number
  name: string
  number: number
}

export async function GET() {
  const players = await readJson<Player[]>("players.json")
  return NextResponse.json({ players })
}
