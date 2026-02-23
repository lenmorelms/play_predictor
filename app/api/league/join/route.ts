import { NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { readJson, writeJson } from "@/lib/db"

interface User {
  id: string
  username: string
  password: string
  role: string
  leagueId: string | null
  createdAt: string
}

interface League {
  name: string
  members: string[]
}

export async function POST() {
  console.log("[v0] League join request received")
  const payload = await verifyToken()
  console.log("[v0] Token verification result:", payload ? `user=${payload.userId}` : "null")
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const users = await readJson<User[]>("users.json")
  const league = await readJson<League>("league.json")

  const userIndex = users.findIndex((u) => u.id === payload.userId)
  if (userIndex === -1) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  if (users[userIndex].leagueId) {
    return NextResponse.json({ error: "Already in a league" }, { status: 400 })
  }

  users[userIndex].leagueId = "league_1"

  if (!league.members.includes(payload.userId)) {
    league.members.push(payload.userId)
  }

  await writeJson("users.json", users)
  await writeJson("league.json", league)

  return NextResponse.json({ success: true, leagueId: "league_1" })
}
