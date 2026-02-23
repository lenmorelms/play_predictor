"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Shield, Loader2, Save, AlertTriangle } from "lucide-react"

interface Player {
  id: number
  name: string
  number: number
}

export function AdminPanel() {
  const [players, setPlayers] = useState<Player[]>([])
  const [homeScore, setHomeScore] = useState(0)
  const [awayScore, setAwayScore] = useState(0)
  const [firstGoalMinute, setFirstGoalMinute] = useState(1)
  const [firstScorerId, setFirstScorerId] = useState<string>("")
  const [corners, setCorners] = useState(0)
  const [possession, setPossession] = useState(50)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  const loadData = useCallback(async () => {
    try {
      const [playersRes, resultsRes] = await Promise.all([
        fetch("/api/players"),
        fetch("/api/admin/results"),
      ])

      const playersData = await playersRes.json()
      setPlayers(playersData.players)

      if (resultsRes.ok) {
        const resultsData = await resultsRes.json()
        if (resultsData.results && typeof resultsData.results.homeScore === "number") {
          setHomeScore(resultsData.results.homeScore)
          setAwayScore(resultsData.results.awayScore)
          setFirstGoalMinute(resultsData.results.firstGoalMinute)
          setFirstScorerId(String(resultsData.results.firstScorerId))
          setCorners(resultsData.results.corners)
          setPossession(resultsData.results.possession)
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
      const res = await fetch("/api/admin/results", {
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
        toast.success("Match results saved! Points have been calculated.")
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to save results")
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
          <span className="text-xs uppercase tracking-wider text-muted-foreground">Loading results...</span>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 pb-8">
      {/* Admin banner */}
      <div className="flex items-center gap-3 rounded-2xl border border-gold/20 bg-gold/5 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/10">
          <Shield className="h-5 w-5 text-gold" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">Admin Panel</p>
          <p className="text-xs text-muted-foreground">
            Enter actual match results to calculate all user points
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 p-3">
        <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />
        <p className="text-xs text-destructive/80">
          Saving results will recalculate all user scores immediately.
        </p>
      </div>

      {/* Actual Final Score */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border bg-muted/50 px-5 py-3.5">
          <h3 className="text-sm font-bold text-card-foreground">Actual Final Score</h3>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Scottland FC
              </Label>
              <Input
                type="number"
                min={0}
                max={15}
                value={homeScore}
                onChange={(e) => setHomeScore(Number(e.target.value))}
                className="h-14 rounded-xl text-center text-2xl font-black"
              />
            </div>
            <span className="mt-6 text-2xl font-black text-muted-foreground/30">:</span>
            <div className="flex-1">
              <Label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Dynamos FC
              </Label>
              <Input
                type="number"
                min={0}
                max={15}
                value={awayScore}
                onChange={(e) => setAwayScore(Number(e.target.value))}
                className="h-14 rounded-xl text-center text-2xl font-black"
              />
            </div>
          </div>
        </div>
      </div>

      {/* First Goal Minute */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border bg-muted/50 px-5 py-3.5">
          <h3 className="text-sm font-bold text-card-foreground">Actual First Goal Minute</h3>
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
          />
          <div className="mt-2 flex items-center justify-between text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            <span>{"1'"}</span>
            <span>{"90'"}</span>
          </div>
        </div>
      </div>

      {/* First Scorer */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border bg-muted/50 px-5 py-3.5">
          <h3 className="text-sm font-bold text-card-foreground">Actual First Scorer</h3>
        </div>
        <div className="p-5">
          <Select value={firstScorerId} onValueChange={setFirstScorerId}>
            <SelectTrigger className="h-12 rounded-xl">
              <SelectValue placeholder="Select the actual first scorer..." />
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
        <div className="border-b border-border bg-muted/50 px-5 py-3.5">
          <h3 className="text-sm font-bold text-card-foreground">Actual Total Corners</h3>
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
          />
          <div className="mt-2 flex items-center justify-between text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            <span>0</span>
            <span>25</span>
          </div>
        </div>
      </div>

      {/* Possession */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border bg-muted/50 px-5 py-3.5">
          <h3 className="text-sm font-bold text-card-foreground">Actual Scottland FC Possession</h3>
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
          />
          <div className="mt-2 flex items-center justify-between text-[10px] font-medium text-muted-foreground">
            <span>20%</span>
            <span>80%</span>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={loading}
        className="mt-2 h-14 rounded-2xl bg-gradient-to-r from-gold to-gold/80 text-sm font-bold uppercase tracking-wider text-gold-foreground shadow-lg shadow-gold/20 transition-all hover:shadow-xl hover:shadow-gold/30"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Saving Results...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Match Results
          </span>
        )}
      </Button>
    </form>
  )
}
