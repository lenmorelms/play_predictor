"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MatchHeader } from "@/components/match-header"
import { PredictionForm } from "@/components/prediction-form"
import { Leaderboard } from "@/components/leaderboard"
import { AdminPanel } from "@/components/admin-panel"
import { toast } from "sonner"
import {
  Trophy,
  BarChart3,
  Shield,
  LogOut,
  Zap,
  Users,
  ChevronRight,
} from "lucide-react"

interface DashboardProps {
  user: {
    id: string
    username: string
    role: string
    leagueId: string | null
  }
  onLogout: () => void
  onUserUpdate: (user: {
    id: string
    username: string
    role: string
    leagueId: string | null
  }) => void
}

type Tab = "predict" | "leaderboard" | "admin"

export function Dashboard({ user, onLogout, onUserUpdate }: DashboardProps) {
  const [tab, setTab] = useState<Tab>("predict")
  const [joiningLeague, setJoiningLeague] = useState(false)

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    onLogout()
  }

  async function handleJoinLeague() {
    setJoiningLeague(true)
    try {
      const res = await fetch("/api/league/join", { method: "POST" })
      const data = await res.json()
      if (res.ok) {
        onUserUpdate({ ...user, leagueId: data.leagueId })
        toast.success("You have joined the league!")
      } else {
        toast.error(data.error || "Failed to join league")
      }
    } catch {
      toast.error("Network error")
    } finally {
      setJoiningLeague(false)
    }
  }

  if (!user.leagueId) {
    return (
      <div className="flex min-h-screen flex-col bg-navy">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b border-white/[0.06] bg-navy/80 px-4 py-3 backdrop-blur-xl">
          <div className="mx-auto flex max-w-2xl items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
                <Trophy className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-bold text-white">
                Castle Cup Predictor
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-white/50 hover:bg-white/[0.06] hover:text-white"
            >
              <LogOut className="mr-1 h-4 w-4" />
              Logout
            </Button>
          </div>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center p-6">
          {/* Background effects */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
          </div>

          <div className="relative z-10 flex flex-col items-center gap-8 text-center">
            <div className="relative">
              <div className="animate-pulse-glow flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.06]">
                <Users className="h-12 w-12 text-primary" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tight text-white">
                Join the League
              </h2>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/50">
                Welcome, <span className="font-semibold text-gold">{user.username}</span>!
                Join the Castle Challenge Cup Predictor League to start making your predictions.
              </p>
            </div>
            <Button
              size="lg"
              onClick={handleJoinLeague}
              disabled={joiningLeague}
              className="h-14 rounded-xl bg-gradient-to-r from-primary to-primary/90 px-10 text-sm font-bold uppercase tracking-wider shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
            >
              <Zap className="mr-2 h-5 w-5" />
              {joiningLeague ? "Joining..." : "Join League"}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </main>
      </div>
    )
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "predict", label: "Predict", icon: <Zap className="h-4 w-4" /> },
    {
      id: "leaderboard",
      label: "Leaderboard",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    ...(user.role === "admin"
      ? [
          {
            id: "admin" as Tab,
            label: "Admin",
            icon: <Shield className="h-4 w-4" />,
          },
        ]
      : []),
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Dark header */}
      <header className="sticky top-0 z-20 bg-navy px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
              <Trophy className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-bold text-white">
              Castle Cup Predictor
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.08] text-[11px] font-bold text-white">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <span className="hidden text-xs text-white/60 sm:inline">
                {user.username}
              </span>
              {user.role === "admin" && (
                <span className="rounded bg-gold/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-gold">
                  Admin
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="h-8 w-8 p-0 text-white/40 hover:bg-white/[0.06] hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Tab bar */}
      <div className="sticky top-[52px] z-10 bg-navy pb-px">
        <div className="mx-auto flex max-w-2xl">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative flex flex-1 items-center justify-center gap-2 px-4 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                tab === t.id
                  ? "text-white"
                  : "text-white/35 hover:text-white/60"
              }`}
            >
              {t.icon}
              {t.label}
              {tab === t.id && (
                <span className="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>
      </div>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pt-6 pb-8">
        <MatchHeader />

        {tab === "predict" && <PredictionForm />}
        {tab === "leaderboard" && <Leaderboard />}
        {tab === "admin" && <AdminPanel />}
      </main>
    </div>
  )
}
