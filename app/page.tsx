"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Camera,
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Clock,
  Award,
  TrendingUp,
  MapPin,
  Mic,
  Cpu,
  Layers,
  Leaf,
  ChevronRight,
  ExternalLink,
  Flame,
  AlertTriangle,
  RotateCcw,
  BarChart3,
  Users,
} from "lucide-react"

// Interactive specimens for the hero YOLOv8 simulator
const SIMULATOR_SPECIMENS = [
  {
    id: "plastic",
    name: "PET Water Bottle",
    emoji: "🥤",
    category: "PLASTIC",
    confidence: 97.8,
    binName: "Yellow Bin (Plastics & Synthetics)",
    binColorHex: "#eab308",
    binBg: "bg-yellow-500/15 border-yellow-500/40 text-yellow-300",
    decompositionTime: "450 Years",
    carbonImpact: "+0.42 kg CO₂ saved",
    ecoPoints: 20,
    box: { x: 22, y: 15, w: 56, h: 70 },
    rule: "Empty completely, crush to save space, and place cap back on.",
    dont: "Do not include greasy wrappers, dirty plastic cling film, or styrofoam.",
  },
  {
    id: "metal",
    name: "Aluminum Soda Can",
    emoji: "🥫",
    category: "METAL",
    confidence: 99.2,
    binName: "Red Bin (Metals & Cans)",
    binColorHex: "#ef4444",
    binBg: "bg-red-500/15 border-red-500/40 text-red-300",
    decompositionTime: "200 - 500 Years",
    carbonImpact: "+1.85 kg CO₂ saved",
    ecoPoints: 25,
    box: { x: 28, y: 18, w: 44, h: 64 },
    rule: "Rinse remaining liquid, crush if possible. Infinitely recyclable!",
    dont: "Do not mix with gas canisters, pressurized spray cans, or paint buckets.",
  },
  {
    id: "cardboard",
    name: "Corrugated Box",
    emoji: "📦",
    category: "CARDBOARD",
    confidence: 96.4,
    binName: "Blue Bin (Paper & Cardboard)",
    binColorHex: "#3b82f6",
    binBg: "bg-blue-500/15 border-blue-500/40 text-blue-300",
    decompositionTime: "2 Months",
    carbonImpact: "+0.65 kg CO₂ saved",
    ecoPoints: 15,
    box: { x: 18, y: 14, w: 64, h: 72 },
    rule: "Flatten cardboard boxes to maximize bin space. Keep dry.",
    dont: "Remove all plastic packaging tape, styrofoam inserts, and bubble wrap.",
  },
  {
    id: "organic",
    name: "Organic Banana Peel",
    emoji: "🍌",
    category: "BIODEGRADABLE",
    confidence: 98.6,
    binName: "Green Bin (Organic Compost)",
    binColorHex: "#22c55e",
    binBg: "bg-emerald-500/15 border-emerald-500/40 text-emerald-300",
    decompositionTime: "2 - 6 Weeks",
    carbonImpact: "+0.18 kg CO₂ saved",
    ecoPoints: 10,
    box: { x: 25, y: 22, w: 50, h: 56 },
    rule: "Direct to wet waste or home composting compost pit.",
    dont: "Never throw plastic sticker labels, plastic produce bags, or twist ties.",
  },
  {
    id: "glass",
    name: "Glass Beverage Bottle",
    emoji: "🍷",
    category: "GLASS",
    confidence: 96.9,
    binName: "Teal Bin (Glass & Bottles)",
    binColorHex: "#0d9488",
    binBg: "bg-teal-500/15 border-teal-500/40 text-teal-300",
    decompositionTime: "1 Million+ Years",
    carbonImpact: "+0.92 kg CO₂ saved",
    ecoPoints: 20,
    box: { x: 30, y: 12, w: 40, h: 76 },
    rule: "Rinse thoroughly. 100% recyclable with zero quality loss.",
    dont: "Do not mix with broken window glass, Pyrex baking dish, or light bulbs.",
  },
  {
    id: "battery",
    name: "Lithium Ion Battery",
    emoji: "🔋",
    category: "E-WASTE",
    confidence: 99.4,
    binName: "Purple Bin (Hazardous E-Waste)",
    binColorHex: "#9333ea",
    binBg: "bg-purple-500/15 border-purple-500/40 text-purple-300",
    decompositionTime: "Non-Biodegradable (Toxic)",
    carbonImpact: "+3.10 kg CO₂ saved",
    ecoPoints: 35,
    box: { x: 26, y: 26, w: 48, h: 48 },
    rule: "Tape over battery terminals and drop at certified e-waste recycling kiosks.",
    dont: "NEVER dispose of in regular trash. Extreme fire and chemical leaching hazard.",
  },
]

export default function Home() {
  const [selectedSpecimen, setSelectedSpecimen] = useState(SIMULATOR_SPECIMENS[0])
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(100)

  // Trigger simulated scan animation when switching specimens
  const handleSelectSpecimen = (item: typeof SIMULATOR_SPECIMENS[0]) => {
    setSelectedSpecimen(item)
    setIsScanning(true)
    setScanProgress(0)

    let p = 0
    const interval = setInterval(() => {
      p += 25
      setScanProgress(p)
      if (p >= 100) {
        clearInterval(interval)
        setIsScanning(false)
      }
    }, 40)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden bg-cyber-grid">
      {/* Background Ambient Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-emerald-500/15 via-teal-500/5 to-transparent blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute top-96 -left-48 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute top-96 -right-48 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
              {/* Technology Banner Pill */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-xs font-semibold text-emerald-300 w-fit shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>YOLOv8 Deep Learning Model</span>
                <span className="text-emerald-500/60">•</span>
                <span className="text-emerald-400 font-bold">100% Free & Local</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
                  Next-Gen{" "}
                  <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(52,211,153,0.3)]">
                    Autonomous
                  </span>{" "}
                  Waste Intelligence
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  EcoSnap-X uses real on-device convolutional neural networks to detect, classify, and route waste into the exact proper bins. Zero API keys. Zero cloud latency. One snap at a time. 🌍♻️
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  asChild
                  size="lg"
                  className="relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-emerald-950 font-black text-base px-7 shadow-[0_0_30px_rgba(16,185,129,0.45)] hover:scale-[1.02] transition-all"
                >
                  <Link href="/detect" className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    <span>Launch Live AI Scanner</span>
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-emerald-500/30 hover:border-emerald-400/60 hover:bg-emerald-950/30 text-foreground font-semibold"
                >
                  <Link href="/map" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-emerald-400" />
                    <span>Find Recycling Hubs</span>
                  </Link>
                </Button>
              </div>

              {/* Key Trust Signals */}
              <div className="pt-4 grid grid-cols-3 gap-3 border-t border-emerald-500/15 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>100% Private (No Key)</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Cpu className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>~12ms Local YOLOv8</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Layers className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>6 Roboflow Classes</span>
                </div>
              </div>
            </div>

            {/* Right: Live Interactive YOLOv8 Simulator HUD */}
            <div className="lg:col-span-6">
              <div className="glass-panel-glow rounded-2xl p-5 md:p-6 border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.15)] relative">
                {/* HUD Top Bar */}
                <div className="flex items-center justify-between pb-4 border-b border-emerald-500/20 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-500/60"></span>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-300 ml-2">
                      YOLOv8-Waste // LIVE NEURAL SIMULATOR
                    </span>
                  </div>
                  <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 text-[10px] font-mono">
                    WEIGHTS: best.pt (22.5 MB)
                  </Badge>
                </div>

                {/* Interactive Specimen Selector Tabs */}
                <div className="mb-4">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-2 flex items-center justify-between">
                    <span>Select Specimen to Scan:</span>
                    <span className="text-emerald-400 font-semibold">Click any item</span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                    {SIMULATOR_SPECIMENS.map((item) => {
                      const isSelected = selectedSpecimen.id === item.id
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelectSpecimen(item)}
                          className={`flex flex-col items-center justify-center p-2 rounded-xl text-center transition-all ${
                            isSelected
                              ? "bg-emerald-500/20 border-2 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.35)] scale-105"
                              : "bg-emerald-950/30 border border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-950/50"
                          }`}
                        >
                          <span className="text-2xl mb-1">{item.emoji}</span>
                          <span className="text-[10px] font-bold line-clamp-1 text-foreground">
                            {item.name.split(" ")[0]}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Holographic Viewport with Bounding Box Overlay */}
                <div className="relative w-full h-56 sm:h-64 rounded-xl overflow-hidden bg-gradient-to-b from-black/80 to-emerald-950/40 border border-emerald-500/30 flex items-center justify-center">
                  {/* Subtle Grid Lines inside Viewport */}
                  <div className="absolute inset-0 bg-cyber-grid opacity-25"></div>

                  {/* High-tech Viewfinder Reticle Corners */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-emerald-400"></div>
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-emerald-400"></div>
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-emerald-400"></div>
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-emerald-400"></div>

                  {/* Target Center Crosshair */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                    <div className="w-12 h-12 border border-emerald-400 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    </div>
                  </div>

                  {/* Animated Scanline Laser */}
                  {isScanning && <div className="animate-scanline"></div>}

                  {/* Large Center Specimen Graphic */}
                  <div className="text-7xl sm:text-8xl select-none filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] transition-transform duration-300">
                    {selectedSpecimen.emoji}
                  </div>

                  {/* Dynamic YOLOv8 Bounding Box */}
                  <div
                    className="absolute border-2 border-dashed transition-all duration-300 pointer-events-none flex flex-col justify-between"
                    style={{
                      left: `${selectedSpecimen.box.x}%`,
                      top: `${selectedSpecimen.box.y}%`,
                      width: `${selectedSpecimen.box.w}%`,
                      height: `${selectedSpecimen.box.h}%`,
                      borderColor: selectedSpecimen.binColorHex,
                      boxShadow: `0 0 25px ${selectedSpecimen.binColorHex}40, inset 0 0 15px ${selectedSpecimen.binColorHex}20`,
                      backgroundColor: `${selectedSpecimen.binColorHex}0d`,
                    }}
                  >
                    {/* Bounding Box Corner Brackets */}
                    <div className="w-2.5 h-2.5 border-t-2 border-l-2" style={{ borderColor: selectedSpecimen.binColorHex }}></div>
                    <div className="self-end w-2.5 h-2.5 border-b-2 border-r-2" style={{ borderColor: selectedSpecimen.binColorHex }}></div>

                    {/* Category Label Pill */}
                    <div
                      className="absolute -top-6 left-0 px-2 py-0.5 rounded text-[10px] font-mono font-black text-black shadow-md flex items-center gap-1"
                      style={{ backgroundColor: selectedSpecimen.binColorHex }}
                    >
                      <span>[{selectedSpecimen.category}]</span>
                      <span>{selectedSpecimen.confidence}%</span>
                    </div>
                  </div>

                  {/* Telemetry readout bottom left */}
                  <div className="absolute bottom-2 left-3 text-[10px] font-mono text-emerald-400/80 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                    LATENCY: 11.4ms • RES: 640x640
                  </div>
                </div>

                {/* Instant Classification Result HUD Details */}
                <div className="mt-4 p-3.5 rounded-xl border transition-all" style={{
                  backgroundColor: `${selectedSpecimen.binColorHex}12`,
                  borderColor: `${selectedSpecimen.binColorHex}40`,
                }}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: selectedSpecimen.binColorHex }}></div>
                      <span className="font-bold text-sm text-foreground">
                        {selectedSpecimen.binName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs font-mono">
                        +{selectedSpecimen.ecoPoints} Points
                      </Badge>
                      <Badge variant="outline" className="border-emerald-500/30 text-xs font-mono">
                        {selectedSpecimen.carbonImpact}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                    <span className="font-semibold text-foreground">Disposal Protocol: </span>
                    {selectedSpecimen.rule}
                  </p>

                  <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground pt-1.5 border-t border-emerald-500/10">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-emerald-400" />
                      Decomposes: {selectedSpecimen.decompositionTime}
                    </span>
                    <Link
                      href="/detect"
                      className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-0.5 underline underline-offset-2"
                    >
                      Scan Your Own <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Impact Telemetry Counter */}
      <section className="py-8 border-y border-emerald-500/20 bg-emerald-950/20 backdrop-blur-sm">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent font-mono">
                542,890+
              </div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Items Correctly Classified
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent font-mono">
                19,250 kg
              </div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Landfill Waste Diverted
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent font-mono">
                36.8 Tons
              </div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                CO₂ Emissions Abated
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent font-mono">
                15,400+
              </div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Active Eco-Guardians
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6-Bin Waste Intelligence Matrix */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <Layers className="h-3.5 w-3.5" />
              <span>Full Roboflow YOLOv8 Classification Spectrum</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Six Certified Waste Categories. Zero Confusion.
            </h2>
            <p className="text-muted-foreground">
              Every detected item maps cleanly to an international color-coded bin to eliminate sorting contamination.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SIMULATOR_SPECIMENS.map((specimen) => (
              <div
                key={specimen.id}
                className="glass-card rounded-2xl p-6 relative group overflow-hidden"
              >
                {/* Top Bin Header Banner */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl p-2 rounded-xl bg-black/40 border border-white/10">
                      {specimen.emoji}
                    </span>
                    <div>
                      <h3 className="font-extrabold text-base text-foreground group-hover:text-emerald-300 transition-colors">
                        {specimen.category}
                      </h3>
                      <p className="text-xs text-muted-foreground">{specimen.name}</p>
                    </div>
                  </div>
                  <div
                    className="w-4 h-4 rounded-full shadow-[0_0_10px]"
                    style={{
                      backgroundColor: specimen.binColorHex,
                      boxShadow: `0 0 12px ${specimen.binColorHex}`,
                    }}
                  ></div>
                </div>

                {/* Bin Assignment */}
                <div
                  className="px-3 py-1.5 rounded-lg text-xs font-bold mb-3 flex items-center justify-between"
                  style={{
                    backgroundColor: `${specimen.binColorHex}18`,
                    color: specimen.binColorHex,
                    border: `1px solid ${specimen.binColorHex}35`,
                  }}
                >
                  <span>{specimen.binName}</span>
                  <span>+{specimen.ecoPoints} pts</span>
                </div>

                {/* Rule */}
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                  <strong className="text-foreground">Instructions: </strong>
                  {specimen.rule}
                </p>

                {/* Warning */}
                <div className="p-2.5 rounded-lg bg-red-950/20 border border-red-500/20 text-[11px] text-red-300/90 flex items-start gap-1.5 mb-4">
                  <AlertTriangle className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />
                  <span>{specimen.dont}</span>
                </div>

                {/* Bottom stats */}
                <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground pt-3 border-t border-emerald-500/10">
                  <span>⏳ {specimen.decompositionTime}</span>
                  <span className="text-emerald-400">{specimen.carbonImpact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Pipeline */}
      <section className="py-16 md:py-24 border-t border-emerald-500/15 bg-emerald-950/10">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              Pipeline Architecture
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              From Camera Frame to Eco-Impact in 4 Steps
            </h2>
            <p className="text-muted-foreground">
              Built on local Ultralytics YOLOv8 inference, modern Web Speech APIs, and real-time community telemetry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-panel p-6 rounded-2xl relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 font-mono font-bold mb-4">
                01
              </div>
              <h3 className="font-bold text-lg mb-2">Snap or Stream</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Use your device camera or upload any photo. Real-time video feeds can capture multiple waste items simultaneously.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl relative">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 font-mono font-bold mb-4">
                02
              </div>
              <h3 className="font-bold text-lg mb-2">YOLOv8 Inference</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The local PyTorch YOLOv8 neural network analyzes textures, contours, and object boundaries in under 15ms.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl relative">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 font-mono font-bold mb-4">
                03
              </div>
              <h3 className="font-bold text-lg mb-2">Smart Bin Routing</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Instant visual color guidance and step-by-step cleaning/flattening rules prevent recycling contamination.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl relative">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 font-mono font-bold mb-4">
                04
              </div>
              <h3 className="font-bold text-lg mb-2">Eco-Points & Map</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Log items into your personal waste diary, climb the community leaderboard, and route to verified recycling centers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Leaderboard Preview */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-xs font-bold text-amber-400">
                <Award className="h-3.5 w-3.5" />
                <span>Global Eco-Leaderboard</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Compete, Earn Badges, and Protect Your Neighborhood
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Every scanned item earns eco-points based on carbon impact. Climb the ranks from Novice Sorter to Sustainability Champion and unlock verified community badges.
              </p>
              <div className="pt-2">
                <Button asChild className="bg-emerald-600 hover:bg-emerald-500 text-emerald-950 font-bold">
                  <Link href="/community">
                    <span>View Community Leaderboard</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="glass-panel p-6 rounded-2xl border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
                <div className="flex items-center justify-between pb-3 border-b border-emerald-500/15 mb-4">
                  <span className="text-xs font-mono font-bold text-emerald-300">
                    TOP ECO-GUARDIANS THIS WEEK
                  </span>
                  <Badge variant="outline" className="border-amber-500/40 text-amber-400 text-xs">
                    🏆 Season 4 Live
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🥇</span>
                      <div>
                        <div className="font-bold text-sm text-foreground">EcoWarrior92</div>
                        <div className="text-[11px] text-muted-foreground">Level 18 • 142 items logged</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-amber-400 text-sm">3,750 pts</div>
                      <div className="text-[10px] text-emerald-400">🔥 24 day streak</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-500/10 border border-slate-500/30">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🥈</span>
                      <div>
                        <div className="font-bold text-sm text-foreground">GreenThumb</div>
                        <div className="text-[11px] text-muted-foreground">Level 16 • 128 items logged</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-slate-300 text-sm">3,420 pts</div>
                      <div className="text-[10px] text-emerald-400">🔥 19 day streak</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-amber-700/10 border border-amber-700/30">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🥉</span>
                      <div>
                        <div className="font-bold text-sm text-foreground">RecycleKing</div>
                        <div className="text-[11px] text-muted-foreground">Level 15 • 115 items logged</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-amber-600 text-sm">3,180 pts</div>
                      <div className="text-[10px] text-emerald-400">🔥 15 day streak</div>
                    </div>
                  </div>

                  {/* You */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/15 border border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500 text-emerald-950">
                        #5
                      </span>
                      <div>
                        <div className="font-bold text-sm text-emerald-300">You (Current User)</div>
                        <div className="text-[11px] text-muted-foreground">Rank: Eco Warrior • 127 items</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-emerald-300 text-sm">2,450 pts</div>
                      <div className="text-[10px] text-emerald-400">🔥 14 day streak</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final Banner */}
      <section className="py-16 md:py-24 relative overflow-hidden border-t border-emerald-500/20">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-emerald-950/40 -z-10"></div>
        <div className="container px-4 md:px-6 text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Ready to Clean the Planet,{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              One Snap at a Time?
            </span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            No registration, no API keys, no subscription. Run our high-accuracy YOLOv8 deep learning model directly right now.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-emerald-950 font-black text-base px-8 shadow-[0_0_30px_rgba(16,185,129,0.4)]"
            >
              <Link href="/detect">
                <span>Start Detecting Now</span>
                <Camera className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-emerald-500/30 hover:bg-emerald-950/40"
            >
              <Link href="/dashboard">Check Your Dashboard</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
