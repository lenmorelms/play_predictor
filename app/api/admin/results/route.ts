import { NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { readJson, writeJson } from "@/lib/db"
import type { ActualResult } from "@/lib/calculatePoints"

export async function GET() {
  const payload = await verifyToken()
  if (!payload?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const results = await readJson<ActualResult | null>("results.json")
  return NextResponse.json({ results })
}

export async function POST(request: Request) {
  const payload = await verifyToken()
  if (!payload?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { homeScore, awayScore, firstGoalMinute, firstScorerId, corners, possession } = body

    const results: ActualResult = {
      homeScore: Number(homeScore),
      awayScore: Number(awayScore),
      firstGoalMinute: Number(firstGoalMinute),
      firstScorerId: Number(firstScorerId),
      corners: Number(corners),
      possession: Number(possession),
    }

    await writeJson("results.json", results)

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Admin results error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
