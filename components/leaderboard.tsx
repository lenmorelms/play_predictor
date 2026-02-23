"use client"

import { useState, useEffect, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Trophy, Medal, RefreshCcw, ChevronDown, ChevronUp } from "lucide-react"
import { toast } from "sonner"

interface LeaderboardEntry {
  userId: string
  username: string
  points: number | null
  breakdown: {
    scorePoints: number
    firstGoalPoints: number
    firstScorerPoints: number
    cornersPoints: number
    possessionPoints: number
    total: number
  } | null
  prediction: {
    homeScore: number
    awayScore: number
  }
}

export function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [resultsAvailable, setResultsAvailable] = useState(false)
  const [loading, setLoading] = useState(true)
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null)

  const loadLeaderboard = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/leaderboard")
      const data = await res.json()
      setEntries(data.leaderboard || [])
      setResultsAvailable(data.resultsAvailable)
    } catch {
      toast.error("Failed to load leaderboard")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadLeaderboard()
  }, [loadLeaderboard])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-xs uppercase tracking-wider text-muted-foreground">Loading leaderboard...</span>
        </div>
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-muted">
          <Trophy className="h-10 w-10 text-muted-foreground/30" />
        </div>
        <h3 className="text-lg font-bold text-foreground">No Predictions Yet</h3>
        <p className="mt-1 max-w-xs text-sm text-muted-foreground">
          Be the first to submit your prediction and appear on the leaderboard!
        </p>
      </div>
    )
  }

  function getRankDisplay(index: number) {
    if (index === 0) return { icon: <Trophy className="h-5 w-5" />, bg: "bg-gold/10 text-gold", ring: "ring-2 ring-gold/30" }
    if (index === 1) return { icon: <Medal className="h-5 w-5" />, bg: "bg-muted text-muted-foreground", ring: "ring-2 ring-muted-foreground/20" }
    if (index === 2) return { icon: <Medal className="h-5 w-5" />, bg: "bg-amber-100 text-amber-700", ring: "ring-2 ring-amber-300/30" }
    return { icon: <span className="text-sm font-black">{index + 1}</span>, bg: "bg-muted text-muted-foreground", ring: "" }
  }

  return (
    <div className="flex flex-col gap-5 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black uppercase tracking-tight text-foreground">Leaderboard</h3>
          <p className="text-xs text-muted-foreground">
            {resultsAvailable
              ? "Final results are in!"
              : "Points calculated after match ends"}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadLeaderboard}
          className="h-8 rounded-lg text-xs"
        >
          <RefreshCcw className="mr-1 h-3 w-3" />
          Refresh
        </Button>
      </div>

      {/* Entries list */}
      <div className="flex flex-col gap-2">
        {entries.map((entry, index) => {
          const rank = getRankDisplay(index)
          const isExpanded = expandedUserId === entry.userId

          return (
            <div
              key={entry.userId}
              className={`overflow-hidden rounded-2xl border bg-card shadow-sm transition-all ${
                index === 0 && resultsAvailable
                  ? "border-gold/30 shadow-gold/5"
                  : "border-border"
              }`}
            >
              <button
                type="button"
                onClick={() => setExpandedUserId(isExpanded ? null : entry.userId)}
                className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-muted/30"
              >
                {/* Rank */}
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${rank.bg} ${rank.ring}`}>
                  {rank.icon}
                </div>

                {/* User info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-card-foreground">{entry.username}</p>
                    {index === 0 && resultsAvailable && (
                      <span className="rounded bg-gold/10 px-1.5 py-0.5 text-[9px] font-bold uppercase text-gold">
                        Leader
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Predicted: <span className="font-semibold text-foreground">{entry.prediction.homeScore} - {entry.prediction.awayScore}</span>
                  </p>
                </div>

                {/* Points */}
                <div className="flex items-center gap-2">
                  {resultsAvailable && entry.points !== null ? (
                    <Badge
                      className={`rounded-lg px-3 py-1 text-sm font-black ${
                        index === 0
                          ? "bg-gold text-gold-foreground"
                          : index === 1
                            ? "bg-muted text-foreground"
                            : index === 2
                              ? "bg-amber-100 text-amber-800"
                              : "bg-muted text-foreground"
                      }`}
                    >
                      {entry.points} pts
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="rounded-lg text-[10px]">
                      Pending
                    </Badge>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </button>

              {/* Breakdown */}
              {isExpanded && entry.breakdown && (
                <div className="border-t border-border bg-muted/30 p-4">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <BreakdownBar label="Score" points={entry.breakdown.scorePoints} max={10} />
                    <BreakdownBar label="First Goal Time" points={entry.breakdown.firstGoalPoints} max={10} />
                    <BreakdownBar label="First Scorer" points={entry.breakdown.firstScorerPoints} max={10} />
                    <BreakdownBar label="Corners" points={entry.breakdown.cornersPoints} max={10} />
                    <BreakdownBar label="Possession" points={entry.breakdown.possessionPoints} max={10} />
                    <div className="flex items-center justify-between rounded-xl bg-primary/10 px-4 py-2.5">
                      <span className="text-xs font-bold text-primary">Total</span>
                      <span className="text-lg font-black text-primary">{entry.breakdown.total}<span className="text-xs font-medium text-primary/60">/50</span></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function BreakdownBar({ label, points, max }: { label: string; points: number; max: number }) {
  const percentage = (points / max) * 100
  const color =
    points === max ? "bg-success" :
    points >= 5 ? "bg-primary" :
    points > 0 ? "bg-gold" :
    "bg-muted-foreground/20"

  return (
    <div className="rounded-xl bg-card px-4 py-2.5">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
        <span className={`text-xs font-bold ${
          points === max ? "text-success" : points > 0 ? "text-foreground" : "text-muted-foreground"
        }`}>
          {points}/{max}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
