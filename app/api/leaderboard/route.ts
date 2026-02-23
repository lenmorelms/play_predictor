import { NextResponse } from "next/server"
import { readJson } from "@/lib/db"
import { calculatePoints, type Prediction, type ActualResult } from "@/lib/calculatePoints"

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
  try {
    const predictions = await readJson<StoredPrediction[]>("predictions.json")
    const results = await readJson<ActualResult | null>("results.json")

    if (!results || !results.homeScore && results.homeScore !== 0) {
      // No results yet, return predictions without points
      const leaderboard = predictions.map((p) => ({
        userId: p.userId,
        username: p.username,
        points: null,
        breakdown: null,
        prediction: {
          homeScore: p.homeScore,
          awayScore: p.awayScore,
        },
      }))

      return NextResponse.json({ leaderboard, resultsAvailable: false })
    }

    const leaderboard = predictions
      .map((p) => {
        const pred: Prediction = {
          homeScore: p.homeScore,
          awayScore: p.awayScore,
          firstGoalMinute: p.firstGoalMinute,
          firstScorerId: p.firstScorerId,
          corners: p.corners,
          possession: p.possession,
        }

        const breakdown = calculatePoints(pred, results)

        return {
          userId: p.userId,
          username: p.username,
          points: breakdown.total,
          breakdown,
          prediction: {
            homeScore: p.homeScore,
            awayScore: p.awayScore,
          },
        }
      })
      .sort((a, b) => (b.points ?? 0) - (a.points ?? 0))

    return NextResponse.json({ leaderboard, resultsAvailable: true })
  } catch (error) {
    console.error("Leaderboard error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
