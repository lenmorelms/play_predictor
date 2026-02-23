"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import {
  Target,
  Clock,
  User,
  CornerDownRight,
  Percent,
  Check,
  Loader2,
  Minus,
  Plus,
  Send,
} from "lucide-react"

interface Player {
  id: number
  name: string
  number: number
}

export function PredictionForm() {
  const [players, setPlayers] = useState<Player[]>([])
  const [homeScore, setHomeScore] = useState(1)
  const [awayScore, setAwayScore] = useState(0)
  const [firstGoalMinute, setFirstGoalMinute] = useState(25)
  const [firstScorerId, setFirstScorerId] = useState<string>("")
  const [corners, setCorners] = useState(8)
  const [possession, setPossession] = useState(55)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  const loadData = useCallback(async () => {
    try {
      const [playersRes, predRes] = await Promise.all([
        fetch("/api/players"),
        fetch("/api/predictions"),
      ])

      const playersData = await playersRes.json()
      setPlayers(playersData.players)

      if (predRes.ok) {
        const predData = await predRes.json()
        if (predData.prediction) {
          setHomeScore(predData.prediction.homeScore)
          setAwayScore(predData.prediction.awayScore)
          setFirstGoalMinute(predData.prediction.firstGoalMinute)
          setFirstScorerId(String(predData.prediction.firstScorerId))
          setCorners(predData.prediction.corners)
          setPossession(predData.prediction.possession)
          setSubmitted(true)
        }
      }
    } catch {
      toast.error("Failed to load data")
    } finally {
      setInitialLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!firstScorerId) {
      toast.error("Please select the first goal scorer")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          homeScore,
          awayScore,
          firstGoalMinute,
          firstScorerId: Number(firstScorerId),
          corners,
          possession,
        }),
      })

      if (res.ok) {
        toast.success(
          submitted ? "Prediction updated!" : "Prediction submitted!"
        )
        setSubmitted(true)
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to submit prediction")
      }
    } catch {
      toast.error("Network error")
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-xs uppercase tracking-wider text-muted-foreground">Loading predictions...</span>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 pb-8">
      {submitted && (
        <div className="flex items-center gap-3 rounded-xl border border-success/20 bg-success/5 p-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-success/10">
            <Check className="h-4 w-4 text-success" />
          </div>
          <p className="text-sm text-success">
            Prediction saved. You can update anytime before kickoff.
          </p>
        </div>
      )}

      {/* Final Score */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center gap-3 border-b border-border bg-muted/50 px-5 py-3.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <Target className="h-4.5 w-4.5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-card-foreground">Final Score</h3>
            <p className="text-[11px] text-muted-foreground">Predict the match result</p>
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-3">
            {/* Home team */}
            <div className="flex flex-1 flex-col items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Scottland</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setHomeScore(Math.max(0, homeScore - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-muted/50 text-foreground transition-colors hover:bg-muted active:scale-95"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-navy text-2xl font-black text-white">
                  {homeScore}
                </div>
                <button
                  type="button"
                  onClick={() => setHomeScore(Math.min(15, homeScore + 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-muted/50 text-foreground transition-colors hover:bg-muted active:scale-95"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="flex h-16 items-center justify-center">
              <span className="text-xl font-black text-muted-foreground/40">:</span>
            </div>

            {/* Away team */}
            <div className="flex flex-1 flex-col items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Dynamos</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAwayScore(Math.max(0, awayScore - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-muted/50 text-foreground transition-colors hover:bg-muted active:scale-95"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-navy text-2xl font-black text-white">
                  {awayScore}
                </div>
                <button
                  type="button"
                  onClick={() => setAwayScore(Math.min(15, awayScore + 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-muted/50 text-foreground transition-colors hover:bg-muted active:scale-95"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* First Goal Minute */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center gap-3 border-b border-border bg-muted/50 px-5 py-3.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/10">
            <Clock className="h-4.5 w-4.5 text-gold" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-card-foreground">First Goal Minute</h3>
            <p className="text-[11px] text-muted-foreground">When will the first goal be scored?</p>
          </div>
        </div>
        <div className="p-5">
          <div className="mb-4 flex justify-center">
            <div className="inline-flex items-baseline gap-1 rounded-xl bg-navy px-5 py-2.5">
              <span className="text-3xl font-black text-white">{firstGoalMinute}</span>
              <span className="text-sm font-bold text-white/50">{"'"}</span>
            </div>
          </div>
          <Slider
            value={[firstGoalMinute]}
            onValueChange={([v]) => setFirstGoalMinute(v)}
            min={1}
            max={90}
            step={1}
            className="py-2"
          />
          <div className="mt-2 flex items-center justify-between text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            <span>{"1'"}</span>
            <span>{"45'"}</span>
            <span>{"90'"}</span>
          </div>
        </div>
      </div>

      {/* First Goal Scorer */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center gap-3 border-b border-border bg-muted/50 px-5 py-3.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-success/10">
            <User className="h-4.5 w-4.5 text-success" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-card-foreground">First Goal Scorer</h3>
            <p className="text-[11px] text-muted-foreground">Which player will score first?</p>
          </div>
        </div>
        <div className="p-5">
          <Select value={firstScorerId} onValueChange={setFirstScorerId}>
            <SelectTrigger className="h-12 rounded-xl">
              <SelectValue placeholder="Select a player..." />
            </SelectTrigger>
            <SelectContent>
              {players.map((player) => (
                <SelectItem key={player.id} value={String(player.id)}>
                  <span className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-muted text-[10px] font-bold text-muted-foreground">
                      {player.number}
                    </span>
                    <span className="font-medium">{player.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Total Corners */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center gap-3 border-b border-border bg-muted/50 px-5 py-3.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-destructive/10">
            <CornerDownRight className="h-4.5 w-4.5 text-destructive" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-card-foreground">Total Corners</h3>
            <p className="text-[11px] text-muted-foreground">Combined corners in the match</p>
          </div>
        </div>
        <div className="p-5">
          <div className="mb-4 flex justify-center">
            <div className="inline-flex items-baseline gap-1 rounded-xl bg-navy px-5 py-2.5">
              <span className="text-3xl font-black text-white">{corners}</span>
            </div>
          </div>
          <Slider
            value={[corners]}
            onValueChange={([v]) => setCorners(v)}
            min={0}
            max={25}
            step={1}
            className="py-2"
          />
          <div className="mt-2 flex items-center justify-between text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            <span>0</span>
            <span>12</span>
            <span>25</span>
          </div>
        </div>
      </div>

      {/* Possession */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center gap-3 border-b border-border bg-muted/50 px-5 py-3.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-chart-1/10">
            <Percent className="h-4.5 w-4.5 text-chart-1" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-card-foreground">Ball Possession</h3>
            <p className="text-[11px] text-muted-foreground">Scottland FC possession percentage</p>
          </div>
        </div>
        <div className="p-5">
          <div className="mb-4 flex justify-center">
            <div className="inline-flex items-baseline gap-1 rounded-xl bg-navy px-5 py-2.5">
              <span className="text-3xl font-black text-white">{possession}</span>
              <span className="text-sm font-bold text-white/50">%</span>
            </div>
          </div>
          <Slider
            value={[possession]}
            onValueChange={([v]) => setPossession(v)}
            min={20}
            max={80}
            step={1}
            className="py-2"
          />
          {/* Possession bar visual */}
          <div className="mt-3 overflow-hidden rounded-full bg-muted">
            <div className="flex h-6">
              <div
                className="flex items-center justify-center bg-primary transition-all duration-300"
                style={{ width: `${possession}%` }}
              >
                <span className="text-[9px] font-bold text-primary-foreground">{possession}%</span>
              </div>
              <div className="flex flex-1 items-center justify-center bg-navy/10">
                <span className="text-[9px] font-bold text-foreground/60">{100 - possession}%</span>
              </div>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] font-medium text-muted-foreground">
            <span>Scottland FC</span>
            <span>Dynamos FC</span>
          </div>
        </div>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        size="lg"
        disabled={loading}
        className="mt-2 h-14 rounded-2xl bg-gradient-to-r from-primary to-primary/90 text-sm font-bold uppercase tracking-wider shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Submitting...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            {submitted ? "Update Prediction" : "Submit Prediction"}
          </span>
        )}
      </Button>
    </form>
  )
}
