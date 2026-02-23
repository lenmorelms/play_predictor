"use client"

import { useState, useEffect } from "react"
import { AuthPage } from "@/components/auth-page"
import { Dashboard } from "@/components/dashboard"

export default function Home() {
  const [user, setUser] = useState<{
    id: string
    username: string
    role: string
    leagueId: string | null
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
          <p className="text-xs uppercase tracking-widest text-white/40">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthPage onAuth={setUser} />
  }

  return (
    <Dashboard
      user={user}
      onLogout={() => setUser(null)}
      onUserUpdate={setUser}
    />
  )
}
