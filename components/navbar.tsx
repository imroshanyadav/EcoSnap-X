"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, X, Leaf, Sparkles, Zap, Award, Camera, MapPin, BarChart3, Users } from "lucide-react"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [ecoPoints, setEcoPoints] = useState<number>(2450)
  const pathname = usePathname()

  useEffect(() => {
    const updatePoints = () => {
      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem("ecosnap_total_points")
          if (stored) {
            setEcoPoints(parseInt(stored, 10))
          }
        } catch {}
      }
    }

    updatePoints()
    window.addEventListener("storage", updatePoints)
    // Check every 3 seconds for local updates
    const interval = setInterval(updatePoints, 3000)
    return () => {
      window.removeEventListener("storage", updatePoints)
      clearInterval(interval)
    }
  }, [])

  const navLinks = [
    { href: "/detect", label: "Detect Waste", icon: Camera },
    { href: "/map", label: "Recycling Map", icon: MapPin },
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/community", label: "Community", icon: Users },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-500/20 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Brand & AI Engine Indicator */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400/20 via-emerald-500/30 to-teal-500/10 border border-emerald-400/40 shadow-[0_0_15px_rgba(16,185,129,0.3)] group-hover:scale-105 transition-all">
              <Leaf className="h-5 w-5 text-emerald-400 group-hover:rotate-12 transition-transform duration-300" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping opacity-75"></span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-emerald-300 via-teal-200 to-white bg-clip-text text-transparent">
                  EcoSnap
                </span>
                <span className="text-lg font-black text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]">
                  X
                </span>
              </div>
            </div>
          </Link>

          {/* Model Status Pill */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[11px] font-medium text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>YOLOv8 Local Model (best.pt)</span>
            <span className="text-emerald-500/60">•</span>
            <span className="text-emerald-400 font-semibold">0 API Keys</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-emerald-950/30"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-emerald-400" : "text-muted-foreground"}`} />
                <span>{link.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Right Actions: Points, Theme, CTA */}
        <div className="flex items-center gap-2.5">
          {/* Dynamic Eco Points Display */}
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-950/80 to-teal-950/60 border border-emerald-500/30 hover:border-emerald-400/60 transition-all text-xs font-semibold text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
            title="Your Eco-Points"
          >
            <Award className="h-3.5 w-3.5 text-amber-400" />
            <span>{ecoPoints.toLocaleString()}</span>
            <span className="text-[10px] text-emerald-400/70 font-normal">pts</span>
          </Link>

          <ModeToggle />

          <Button
            asChild
            size="sm"
            className="hidden sm:inline-flex relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-emerald-950 font-bold border-0 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all hover:scale-[1.02]"
          >
            <Link href="/detect" className="flex items-center gap-1.5">
              <Camera className="h-4 w-4" />
              <span>Snap Waste</span>
              <span className="absolute inset-0 w-full h-full animate-shimmer pointer-events-none"></span>
            </Link>
          </Button>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-foreground hover:bg-emerald-950/40"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6 text-emerald-400" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden px-4 py-4 border-t border-emerald-500/20 bg-background/95 backdrop-blur-2xl">
          <div className="flex items-center justify-between p-2.5 mb-3 rounded-lg bg-emerald-950/40 border border-emerald-500/20">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-xs text-emerald-300 font-medium">YOLOv8 Local Model Active</span>
            </div>
            <span className="text-xs font-bold text-amber-400">{ecoPoints.toLocaleString()} pts</span>
          </div>

          <nav className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Icon className="h-4 w-4 text-emerald-400" />
                  <span>{link.label}</span>
                </Link>
              )
            })}
            <Button
              asChild
              className="mt-3 w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-emerald-950 font-bold"
            >
              <Link href="/detect" onClick={() => setIsMenuOpen(false)}>
                Start Waste Detection
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}

