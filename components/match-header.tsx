"use client"

import { Calendar, MapPin, Clock } from "lucide-react"

export function MatchHeader() {
  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl bg-navy shadow-xl">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-gold/15 blur-3xl" />
        <div className="animate-shimmer absolute inset-0" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="relative z-10 p-6">
        {/* League badge */}
        <div className="mb-5 flex justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            Castle Challenge Cup
          </span>
        </div>

        {/* Teams */}
        <div className="flex items-center justify-between">
          <div className="flex flex-1 flex-col items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.08] text-2xl font-black text-white shadow-lg backdrop-blur-sm">
              SC
            </div>
            <div className="text-center">
              <span className="block text-sm font-bold text-white">Scottland FC</span>
              <span className="text-[10px] uppercase tracking-wider text-white/40">Home</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1 px-4">
            <div className="animate-pulse-glow flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary/40 bg-primary/10">
              <span className="text-lg font-black tracking-tighter text-white">VS</span>
            </div>
          </div>

          <div className="flex flex-1 flex-col items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.08] text-2xl font-black text-white shadow-lg backdrop-blur-sm">
              DY
            </div>
            <div className="text-center">
              <span className="block text-sm font-bold text-white">Dynamos FC</span>
              <span className="text-[10px] uppercase tracking-wider text-white/40">Away</span>
            </div>
          </div>
        </div>

        {/* Match info chips */}
        <div className="mt-5 flex items-center justify-center gap-3">
          <span className="flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1.5 text-[11px] text-white/60">
            <Calendar className="h-3 w-3" />
            Match Day
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1.5 text-[11px] text-white/60">
            <MapPin className="h-3 w-3" />
            Rufaro, Harare
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1.5 text-[11px] text-white/60">
            <Clock className="h-3 w-3" />
            15:00
          </span>
        </div>
      </div>
    </div>
  )
}
