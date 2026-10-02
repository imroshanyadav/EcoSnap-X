import Link from "next/link"
import { Leaf, Cpu, ShieldCheck, Heart, Github, Globe, Sparkles } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full border-t border-emerald-500/20 bg-background/90 backdrop-blur-xl relative overflow-hidden">
      {/* Top subtle glow line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>

      <div className="container px-4 md:px-6 py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/40">
                <Leaf className="h-4 w-4 text-emerald-400" />
              </div>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">
                EcoSnap X
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              Autonomous AI-powered smart waste assistant using Ultralytics YOLOv8 deep learning.
              Guiding proper disposal, preventing landfill contamination, and building greener communities.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-xs text-emerald-300">
                <Cpu className="h-3.5 w-3.5 text-emerald-400" />
                <span>YOLOv8s • PyTorch Local</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs text-cyan-300">
                <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
                <span>100% Private • 0 Keys</span>
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Navigation</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/detect" className="hover:text-emerald-300 transition-colors">
                  AI Waste Scanner
                </Link>
              </li>
              <li>
                <Link href="/map" className="hover:text-emerald-300 transition-colors">
                  Recycling Hubs & Map
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-emerald-300 transition-colors">
                  Eco-Dashboard & Analytics
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-emerald-300 transition-colors">
                  Community & Leaderboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Open Source & Credits */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Model & Intelligence</h4>
            <p className="text-xs text-muted-foreground">
              Powered by the open-source YOLOv8 Waste Classification model by SMC Org. Trained on 6,000+ annotated waste specimens.
            </p>
            <a
              href="https://github.com/teamsmcorg/Waste-Classification-using-YOLOv8"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
            >
              <Github className="h-3.5 w-3.5" />
              <span>teamsmcorg/Waste-Classification-using-YOLOv8</span>
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-emerald-500/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} EcoSnap X. Built for a cleaner planet</span>
            <span className="text-emerald-400">🌍♻️</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/detect" className="hover:text-emerald-300">Live Scanner</Link>
            <span>•</span>
            <Link href="/dashboard" className="hover:text-emerald-300">Leaderboard</Link>
            <span>•</span>
            <span className="text-emerald-400/80">Local Inference Ready</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

