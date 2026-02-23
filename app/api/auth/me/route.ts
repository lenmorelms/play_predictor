import { NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { readJson } from "@/lib/db"

interface User {
  id: string
  username: string
  password: string
  role: string
  leagueId: string | null
  createdAt: string
}

export async function GET() {
  const payload = await verifyToken()
  if (!payload) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  const users = await readJson<User[]>("users.json")
  const user = users.find((u) => u.id === payload.userId)

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  return NextResponse.json({
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      leagueId: user.leagueId,
    },
  })
}
