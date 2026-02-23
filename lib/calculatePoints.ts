export interface Prediction {
  homeScore: number
  awayScore: number
  firstGoalMinute: number
  firstScorerId: number
  corners: number
  possession: number
}

export interface ActualResult {
  homeScore: number
  awayScore: number
  firstGoalMinute: number
  firstScorerId: number
  corners: number
  possession: number
}

export interface PointsBreakdown {
  scorePoints: number
  firstGoalPoints: number
  firstScorerPoints: number
  cornersPoints: number
  possessionPoints: number
  total: number
}

function getResultType(home: number, away: number): "W" | "D" | "L" {
  if (home > away) return "W"
  if (home === away) return "D"
  return "L"
}

export function calculatePoints(
  prediction: Prediction,
  actual: ActualResult
): PointsBreakdown {
  let scorePoints = 0
  let firstGoalPoints = 0
  let firstScorerPoints = 0
  let cornersPoints = 0
  let possessionPoints = 0

  // Final Score
  if (
    prediction.homeScore === actual.homeScore &&
    prediction.awayScore === actual.awayScore
  ) {
    scorePoints = 10
  } else if (
    getResultType(prediction.homeScore, prediction.awayScore) ===
    getResultType(actual.homeScore, actual.awayScore)
  ) {
    scorePoints = 5
  }

  // Time of First Goal
  const goalDiff = Math.abs(prediction.firstGoalMinute - actual.firstGoalMinute)
  if (goalDiff === 0) {
    firstGoalPoints = 10
  } else if (goalDiff <= 3) {
    firstGoalPoints = 5
  } else if (goalDiff <= 5) {
    firstGoalPoints = 3
  }

  // First Scorer
  if (prediction.firstScorerId === actual.firstScorerId) {
    firstScorerPoints = 10
  }

  // Corners
  const cornersDiff = Math.abs(prediction.corners - actual.corners)
  if (cornersDiff === 0) {
    cornersPoints = 10
  } else if (cornersDiff <= 1) {
    cornersPoints = 5
  } else if (cornersDiff <= 2) {
    cornersPoints = 3
  }

  // Possession
  const possessionDiff = Math.abs(prediction.possession - actual.possession)
  if (possessionDiff === 0) {
    possessionPoints = 10
  } else if (possessionDiff <= 2) {
    possessionPoints = 5
  } else if (possessionDiff <= 3) {
    possessionPoints = 3
  }

  const total =
    scorePoints +
    firstGoalPoints +
    firstScorerPoints +
    cornersPoints +
    possessionPoints

  return {
    scorePoints,
    firstGoalPoints,
    firstScorerPoints,
    cornersPoints,
    possessionPoints,
    total,
  }
}
