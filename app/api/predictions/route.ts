import { NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { readJson, writeJson } from "@/lib/db"

interface StoredPrediction {
  userId: string
  username: string
  homeScore: number
  awayScore: number
  firstGoalMinute: number
  firstScorerId: number
  corners: number
  possession: number
  submittedAt: string
}

export async function GET() {
  const payload = await verifyToken()
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const predictions = await readJson<StoredPrediction[]>("predictions.json")
  const userPrediction = predictions.find((p) => p.userId === payload.userId)

  return NextResponse.json({ prediction: userPrediction || null })
}

export async function POST(request: Request) {
  const payload = await verifyToken()
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { homeScore, awayScore, firstGoalMinute, firstScorerId, corners, possession } = body

    if (
      homeScore === undefined ||
      awayScore === undefined ||
      firstGoalMinute === undefined ||
      firstScorerId === undefined ||
      corners === undefined ||
      possession === undefined
    ) {
      return NextResponse.json(
        { error: "All prediction fields are required" },
        { status: 400 }
      )
    }

    const predictions = await readJson<StoredPrediction[]>("predictions.json")
    const existingIndex = predictions.findIndex(
      (p) => p.userId === payload.userId
    )

    const newPrediction: StoredPrediction = {
      userId: payload.userId,
      username: payload.username,
      homeScore: Number(homeScore),
      awayScore: Number(awayScore),
      firstGoalMinute: Number(firstGoalMinute),
      firstScorerId: Number(firstScorerId),
      corners: Number(corners),
      possession: Number(possession),
      submittedAt: new Date().toISOString(),
    }

    if (existingIndex >= 0) {
      predictions[existingIndex] = newPrediction
    } else {
      predictions.push(newPrediction)
    }

    await writeJson("predictions.json", predictions)

    return NextResponse.json({ prediction: newPrediction })
  } catch (error) {
    console.error("Prediction error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
