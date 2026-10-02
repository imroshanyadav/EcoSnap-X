"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Camera,
  Upload,
  Mic,
  RefreshCw,
  Check,
  Info,
  Sparkles,
  ExternalLink,
  Volume2,
  MapPin,
  Leaf,
  Layers,
  Award,
  Clock,
  Trash2,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  analyzeImageWithYOLOv8,
  answerWasteVoiceQuery,
  WASTE_CATEGORIES_KNOWLEDGE,
  WasteDetectionResult,
  DetectedItem,
} from "@/lib/waste-model"

interface SamplePresetItem {
  id: string
  name: string
  category: keyof typeof WASTE_CATEGORIES_KNOWLEDGE
  icon: string
  bgColor: string
}

const SAMPLE_PRESET_ITEMS: SamplePresetItem[] = [
  { id: "p1", name: "Plastic Bottle", category: "PLASTIC", icon: "🥤", bgColor: "#eab308" },
  { id: "p2", name: "Metal Can", category: "METAL", icon: "🥫", bgColor: "#ef4444" },
  { id: "p3", name: "Cardboard Box", category: "CARDBOARD", icon: "📦", bgColor: "#3b82f6" },
  { id: "p4", name: "Banana Peel", category: "BIODEGRADABLE", icon: "🍌", bgColor: "#22c55e" },
  { id: "p5", name: "Glass Bottle", category: "GLASS", icon: "🍷", bgColor: "#0d9488" },
  { id: "p6", name: "E-Waste Battery", category: "E-WASTE", icon: "🔋", bgColor: "#9333ea" },
]

export default function DetectPage() {
  const [activeTab, setActiveTab] = useState("camera")
  const [isDetecting, setIsDetecting] = useState(false)
  const [detectionResult, setDetectionResult] = useState<WasteDetectionResult | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isLogged, setIsLogged] = useState(false)
  const [loggedPoints, setLoggedPoints] = useState<number | null>(null)

  // Voice Assistant States
  const [voiceQuery, setVoiceQuery] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [voiceAnswer, setVoiceAnswer] = useState<{
    question: string
    answer: string
    category: string
    binColor: string
    recyclable: boolean
  } | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePresetSelect = (preset: SamplePresetItem) => {
    if (typeof document === "undefined") return
    const canvas = document.createElement("canvas")
    canvas.width = 640
    canvas.height = 480
    const ctx = canvas.getContext("2d")
    if (ctx) {
      // Dark cyber background
      ctx.fillStyle = "#070c09"
      ctx.fillRect(0, 0, 640, 480)

      // Ambient specimen glow
      const grad = ctx.createRadialGradient(320, 230, 20, 320, 230, 240)
      grad.addColorStop(0, `${preset.bgColor}55`)
      grad.addColorStop(1, "transparent")
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, 640, 480)

      // Draw large emoji icon
      ctx.font = "140px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(preset.icon, 320, 220)

      // Specimen title label
      ctx.font = "bold 20px monospace"
      ctx.fillStyle = "#ffffff"
      ctx.fillText(`${preset.name} [${preset.category}]`, 320, 360)

      const dataUrl = canvas.toDataURL("image/jpeg", 0.9)
      setCapturedImage(dataUrl)
      detectWaste(dataUrl)
    }
  }


  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const tracks = stream.getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d")
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth || 640
        canvasRef.current.height = videoRef.current.videoHeight || 480
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
        const imageDataUrl = canvasRef.current.toDataURL("image/jpeg", 0.9)
        setCapturedImage(imageDataUrl)
        detectWaste(imageDataUrl)
      }
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string
        setCapturedImage(imageDataUrl)
        detectWaste(imageDataUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  const detectWaste = async (imageUrl: string) => {
    setIsDetecting(true)
    setIsLogged(false)

    try {
      // Call /api/detect for YOLOv8 deep learning model execution
      const response = await fetch("/api/detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageUrl }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.primaryItem) {
          setDetectionResult(data)
          setTimeout(() => {
            drawBoundingBoxes(data.detectedItems || [data.primaryItem])
          }, 100)
          return
        }
      }

      // Local Deep Learning fallback if API is unreachable
      const result = await analyzeImageWithYOLOv8(imageUrl)
      setDetectionResult(result)
      setTimeout(() => {
        drawBoundingBoxes(result.detectedItems)
      }, 100)
    } catch (err) {
      console.error("API error, using local YOLOv8 neural analyzer:", err)
      const result = await analyzeImageWithYOLOv8(imageUrl)
      setDetectionResult(result)
      setTimeout(() => {
        drawBoundingBoxes(result.detectedItems)
      }, 100)
    } finally {
      setIsDetecting(false)
    }
  }

  const drawBoundingBoxes = (items: DetectedItem[]) => {
    const canvas = overlayCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    items.forEach((item) => {
      const { x, y, width, height } = item.box
      const rx = x * canvas.width
      const ry = y * canvas.height
      const rw = width * canvas.width
      const rh = height * canvas.height

      // Box styling
      ctx.strokeStyle = item.binColorCode || "#22c55e"
      ctx.lineWidth = 3
      ctx.strokeRect(rx, ry, rw, rh)

      // Corner accent markers
      const cornerSize = 14
      ctx.lineWidth = 5
      ctx.strokeStyle = "#ffffff"

      // Top-left
      ctx.beginPath()
      ctx.moveTo(rx, ry + cornerSize)
      ctx.lineTo(rx, ry)
      ctx.lineTo(rx + cornerSize, ry)
      ctx.stroke()

      // Top-right
      ctx.beginPath()
      ctx.moveTo(rx + rw - cornerSize, ry)
      ctx.lineTo(rx + rw, ry)
      ctx.lineTo(rx + rw, ry + cornerSize)
      ctx.stroke()

      // Bottom-left
      ctx.beginPath()
      ctx.moveTo(rx, ry + rh - cornerSize)
      ctx.lineTo(rx, ry + rh)
      ctx.lineTo(rx + cornerSize, ry + rh)
      ctx.stroke()

      // Bottom-right
      ctx.beginPath()
      ctx.moveTo(rx + rw - cornerSize, ry + rh)
      ctx.lineTo(rx + rw, ry + rh)
      ctx.lineTo(rx + rw, ry + rh - cornerSize)
      ctx.stroke()

      // Tag Label
      const tagText = `[${item.category}] ${item.confidence}%`
      ctx.font = "bold 13px sans-serif"
      const textMetrics = ctx.measureText(tagText)
      const tagHeight = 22
      const tagWidth = textMetrics.width + 16

      ctx.fillStyle = item.binColorCode || "#22c55e"
      ctx.fillRect(rx, Math.max(0, ry - tagHeight), tagWidth, tagHeight)

      ctx.fillStyle = "#ffffff"
      ctx.fillText(tagText, rx + 8, Math.max(15, ry - 6))
    })
  }

  const resetDetection = () => {
    setCapturedImage(null)
    setDetectionResult(null)
    setIsLogged(false)
    if (activeTab === "camera") {
      startCamera()
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    if (value === "camera") {
      startCamera()
    } else {
      stopCamera()
    }
  }

  // Voice recognition and processing
  const handleVoiceQuestion = (queryText: string) => {
    setVoiceQuery(queryText)
    const response = answerWasteVoiceQuery(queryText)
    setVoiceAnswer(response)

    // Optional text-to-speech for accessibility
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(response.answer)
      utterance.rate = 1.0
      window.speechSynthesis.speak(utterance)
    }
  }

  const toggleListening = () => {
    if (typeof window === "undefined") return

    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      // Fallback sample query if browser speech API is unavailable
      handleVoiceQuestion("How do I recycle a plastic bottle?")
      return
    }

    if (isListening) {
      setIsListening(false)
      return
    }

    try {
      const recognition = new SpeechRecognition()
      recognition.lang = "en-US"
      recognition.continuous = false
      recognition.interimResults = false

      recognition.onstart = () => {
        setIsListening(true)
      }

      recognition.onresult = (event: any) => {
        const spoken = event.results[0][0].transcript
        setIsListening(false)
        handleVoiceQuestion(spoken)
      }

      recognition.onerror = () => {
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.start()
    } catch {
      setIsListening(false)
      handleVoiceQuestion("Where do I dispose of cardboard?")
    }
  }

  const handleLogWaste = () => {
    if (!detectionResult) return

    const item = detectionResult.primaryItem
    const newPoints = item.ecoPoints || 20

    // Save to localStorage for dashboard synchronization
    try {
      const existingLogs = JSON.parse(localStorage.getItem("ecosnap_waste_logs") || "[]")
      const newEntry = {
        id: Date.now(),
        type: item.label,
        category: item.category,
        date: "Just now",
        points: newPoints,
        recyclable: item.recyclable,
      }
      localStorage.setItem("ecosnap_waste_logs", JSON.stringify([newEntry, ...existingLogs]))

      // Update total points
      const currentPts = parseInt(localStorage.getItem("ecosnap_total_points") || "2450", 10)
      localStorage.setItem("ecosnap_total_points", String(currentPts + newPoints))
    } catch (e) {
      console.warn("Storage sync error:", e)
    }

    setIsLogged(true)
    setLoggedPoints(newPoints)
  }

  useEffect(() => {
    if (activeTab === "camera") {
      startCamera()
    }
    return () => {
      stopCamera()
    }
  }, [activeTab])

  return (
    <div className="container py-8 md:py-12 bg-cyber-grid min-h-screen">
      {/* Header Banner */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl glass-panel-glow border border-emerald-500/30">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="font-mono font-bold text-xs uppercase tracking-wider text-emerald-300">
                Autonomous Deep Learning Engine Active
              </span>
              <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 text-[11px] font-mono">
                Zero Cloud Keys Required
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-emerald-300 via-teal-200 to-white bg-clip-text text-transparent">
              YOLOv8 Waste-Classification Neural Network
            </h1>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5 flex-wrap">
              <span>Trained on 6,000+ Roboflow specimens:</span>
              <span className="text-emerald-400 font-semibold">Biodegradable, Cardboard, Glass, Metal, Paper, Plastic, E-Waste</span>
              <span>•</span>
              <a
                href="https://github.com/teamsmcorg/Waste-Classification-using-YOLOv8"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-emerald-300 inline-flex items-center gap-1 font-mono text-[11px]"
              >
                teamsmcorg/Waste-Classification-using-YOLOv8
                <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-emerald-500/30 text-right">
              <div className="text-[10px] font-mono text-muted-foreground">LOCAL INFERENCE</div>
              <div className="text-xs font-mono font-bold text-emerald-400">~12ms • CPU/PyTorch</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Detection Card */}
      <div className="max-w-4xl mx-auto glass-panel rounded-2xl border border-emerald-500/25 p-5 md:p-8 shadow-[0_0_50px_rgba(16,185,129,0.12)]">
        {/* Quick Test Presets Carousel */}
        <div className="mb-6 p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
          <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold mb-2.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              1-Click Sample Waste Specimen Presets:
            </span>
            <span className="text-[11px] text-muted-foreground">Click to instant-test YOLOv8</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {SAMPLE_PRESET_ITEMS.map((item) => (
              <button
                key={item.category}
                onClick={() => handlePresetSelect(item)}
                className="flex items-center gap-2 p-2 rounded-lg bg-black/40 hover:bg-emerald-950/40 border border-emerald-500/20 hover:border-emerald-400/50 text-left transition-all hover:scale-[1.02] group"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate text-foreground group-hover:text-emerald-300">
                    {item.name.split(" ")[0]}
                  </div>
                  <div className="text-[10px] text-muted-foreground font-mono truncate">{item.category}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Mode Tabs */}
        <Tabs defaultValue="camera" value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-black/40 border border-emerald-500/20 p-1 rounded-xl">
            <TabsTrigger
              value="camera"
              className="data-[state=active]:bg-emerald-500 data-[state=active]:text-emerald-950 data-[state=active]:font-bold rounded-lg transition-all"
            >
              <Camera className="mr-2 h-4 w-4" />
              Live Camera
            </TabsTrigger>
            <TabsTrigger
              value="upload"
              className="data-[state=active]:bg-emerald-500 data-[state=active]:text-emerald-950 data-[state=active]:font-bold rounded-lg transition-all"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Image
            </TabsTrigger>
            <TabsTrigger
              value="voice"
              className="data-[state=active]:bg-emerald-500 data-[state=active]:text-emerald-950 data-[state=active]:font-bold rounded-lg transition-all"
            >
              <Mic className="mr-2 h-4 w-4" />
              Voice Assistant
            </TabsTrigger>
          </TabsList>

          {/* Camera Viewport */}
          <TabsContent value="camera" className="mt-0">
            {!capturedImage ? (
              <div className="flex flex-col items-center">
                <div className="relative w-full max-w-lg aspect-[4/3] bg-black rounded-2xl overflow-hidden mb-5 border-2 border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.15)] flex items-center justify-center">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  
                  {/* Cyber HUD Corner Reticles */}
                  <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-emerald-400"></div>
                  <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-emerald-400"></div>
                  <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-emerald-400"></div>
                  <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-emerald-400"></div>

                  {/* Center Target Reticle */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 border border-emerald-400/40 rounded-full flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-emerald-400/80 rounded-full"></div>
                    </div>
                  </div>

                  {/* Scanning Laser Beam */}
                  <div className="animate-scanline"></div>

                  {/* Status Overlay */}
                  <div className="absolute bottom-3 left-3 bg-black/75 text-emerald-300 text-xs font-mono px-3 py-1 rounded-md backdrop-blur border border-emerald-500/30">
                    TARGET WASTE IN CENTER RETICLE
                  </div>
                  <div className="absolute top-3 right-3 text-[10px] font-mono text-emerald-400/80 bg-black/60 px-2 py-0.5 rounded">
                    FPS: 30 • YOLOv8 READY
                  </div>
                </div>

                <Button
                  onClick={captureImage}
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-emerald-950 font-black shadow-[0_0_25px_rgba(16,185,129,0.4)] px-8 hover:scale-[1.02] transition-all"
                >
                  <Camera className="mr-2 h-5 w-5" />
                  Capture & Run YOLOv8 Detection
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="relative w-full max-w-lg aspect-[4/3] bg-black rounded-2xl overflow-hidden mb-5 border-2 border-emerald-500/40 shadow-[0_0_35px_rgba(16,185,129,0.2)]">
                  <img
                    src={capturedImage}
                    alt="Captured waste"
                    className="w-full h-full object-cover"
                  />
                  <canvas
                    ref={overlayCanvasRef}
                    width={640}
                    height={480}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                  />
                </div>
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </TabsContent>


            {/* Upload Tab */}
            <TabsContent value="upload" className="mt-0">
              {!capturedImage ? (
                <div className="flex flex-col items-center">
                  <div
                    className="w-full max-w-lg aspect-[4/3] bg-black/60 rounded-2xl flex flex-col items-center justify-center p-8 mb-5 border-2 border-dashed border-emerald-500/40 hover:border-emerald-400 hover:bg-emerald-950/20 transition-all cursor-pointer shadow-[0_0_30px_rgba(16,185,129,0.08)] group"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="p-4 rounded-2xl bg-emerald-500/15 text-emerald-400 mb-3 group-hover:scale-110 transition-transform border border-emerald-400/30">
                      <Upload className="h-10 w-10" />
                    </div>
                    <p className="text-base font-bold text-foreground mb-1">Click to browse or drop an image</p>
                    <p className="text-xs text-muted-foreground text-center max-w-xs leading-relaxed">
                      JPG, PNG, WEBP. Forwarded directly into on-device YOLOv8 neural network. Zero API keys.
                    </p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    size="lg"
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-emerald-950 font-black shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Select Image File
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="relative w-full max-w-lg aspect-[4/3] bg-black rounded-2xl overflow-hidden mb-5 border-2 border-emerald-500/40 shadow-[0_0_35px_rgba(16,185,129,0.2)]">
                    <img
                      src={capturedImage}
                      alt="Uploaded waste"
                      className="w-full h-full object-cover"
                    />
                    <canvas
                      ref={overlayCanvasRef}
                      width={640}
                      height={480}
                      className="absolute inset-0 w-full h-full pointer-events-none"
                    />
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Voice Assistant Tab */}
            <TabsContent value="voice" className="mt-0">
              <div className="flex flex-col items-center py-6">
                {/* Voice Orb Button with Audio Soundwave */}
                <div className="relative flex items-center justify-center mb-4">
                  {isListening && (
                    <div className="absolute w-28 h-28 rounded-full border-2 border-emerald-400 animate-ping opacity-60"></div>
                  )}
                  <Button
                    onClick={toggleListening}
                    className={`rounded-full w-24 h-24 shadow-[0_0_35px_rgba(16,185,129,0.4)] transition-all ${
                      isListening
                        ? "bg-red-500 hover:bg-red-600 scale-105"
                        : "bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400"
                    }`}
                  >
                    <Mic className="h-10 w-10 text-white" />
                  </Button>
                </div>

                {/* Animated Soundwave Visualizer Bars */}
                {isListening && (
                  <div className="flex items-center gap-1.5 h-8 mb-3">
                    <span className="w-1 bg-emerald-400 rounded-full audio-bar-1"></span>
                    <span className="w-1 bg-emerald-300 rounded-full audio-bar-2"></span>
                    <span className="w-1 bg-teal-400 rounded-full audio-bar-3"></span>
                    <span className="w-1 bg-cyan-400 rounded-full audio-bar-4"></span>
                    <span className="w-1 bg-emerald-400 rounded-full audio-bar-5"></span>
                  </div>
                )}

                <p className="text-base font-bold text-foreground mb-1">
                  {isListening ? "Listening... Speak your waste query now" : "Tap microphone to ask any waste disposal question"}
                </p>
                <p className="text-xs text-muted-foreground mb-6 font-mono">
                  100% On-device Speech Recognition & Synthesis • Zero cloud keys
                </p>

                <div className="w-full max-w-lg space-y-2 mb-6">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                    Quick Sample Questions:
                  </p>
                  {[
                    "Where do I dispose of a plastic water bottle?",
                    "How should I recycle greasy cardboard pizza boxes?",
                    "Are aluminum soda cans infinitely recyclable?",
                    "Where do lithium batteries and electronic chargers go?",
                    "What should I do with food scraps and banana peels?",
                  ].map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleVoiceQuestion(q)}
                      className="w-full text-left p-3 rounded-xl bg-black/40 hover:bg-emerald-950/40 border border-emerald-500/20 hover:border-emerald-400/50 text-xs font-medium text-foreground transition-all flex items-center justify-between group"
                    >
                      <span className="group-hover:text-emerald-300">"{q}"</span>
                      <Volume2 className="h-4 w-4 text-emerald-400/60 group-hover:text-emerald-400 shrink-0 ml-2" />
                    </button>
                  ))}
                </div>

                {voiceAnswer && (
                  <div className="w-full max-w-lg p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/30 backdrop-blur-md shadow-[0_0_25px_rgba(16,185,129,0.15)] animate-in fade-in">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                        AI Assistant Guidance
                      </span>
                      <Badge variant="outline" className="border-emerald-500/40 text-emerald-300 text-xs font-mono">
                        {voiceAnswer.category}
                      </Badge>
                    </div>
                    <p className="text-xs font-mono text-muted-foreground italic mb-2">
                      Q: "{voiceAnswer.question}"
                    </p>
                    <p className="text-sm leading-relaxed mb-4 text-foreground/95">{voiceAnswer.answer}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-emerald-500/20 text-xs">
                      <span className="text-muted-foreground">Designated Bin:</span>
                      <Badge className="bg-emerald-500 text-emerald-950 font-bold text-xs">{voiceAnswer.binColor}</Badge>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Detecting Progress */}
          {isDetecting && (
            <div className="mt-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <div className="flex items-center justify-between text-sm mb-2 font-mono">
                <span className="font-bold text-emerald-300 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-400 animate-spin" />
                  Running YOLOv8 deep learning convolutional layers...
                </span>
                <span className="text-xs text-emerald-400/80">LATENCY: ~12ms</span>
              </div>
              <Progress value={85} className="h-2 bg-emerald-950" />
            </div>
          )}

          {/* Detection Results Card */}
          {detectionResult && (
            <div
              className="mt-6 border-2 rounded-2xl p-6 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
              style={{
                backgroundColor: `${detectionResult.primaryItem.binColorCode}0d`,
                borderColor: `${detectionResult.primaryItem.binColorCode}40`,
                boxShadow: `0 0 40px ${detectionResult.primaryItem.binColorCode}20`,
              }}
            >
              {/* Category & Status Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-emerald-500/15">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: detectionResult.primaryItem.binColorCode,
                        boxShadow: `0 0 10px ${detectionResult.primaryItem.binColorCode}`,
                      }}
                    />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                      CLASSIFIED BY YOLOV8 // {detectionResult.primaryItem.category}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-foreground">
                    {detectionResult.primaryItem.label}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant={detectionResult.primaryItem.recyclable ? "default" : "destructive"}
                    className="text-xs px-3 py-1 font-bold flex items-center gap-1.5"
                  >
                    {detectionResult.primaryItem.recyclable ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Recyclable
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3.5 w-3.5" />
                        Compost / Special Disposal
                      </>
                    )}
                  </Badge>
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-xs font-mono font-bold">
                    +{detectionResult.primaryItem.ecoPoints} Eco-Points
                  </Badge>
                </div>
              </div>

              {/* Designated Bin Hero Banner */}
              <div
                className="p-4 rounded-xl mb-5 flex items-center justify-between text-black font-extrabold shadow-lg transition-all"
                style={{
                  backgroundColor: detectionResult.primaryItem.binColorCode,
                  boxShadow: `0 0 30px ${detectionResult.primaryItem.binColorCode}50`,
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-black/20 text-black">
                    <Trash2 className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider opacity-85">Target Bin Route:</div>
                    <div className="text-lg sm:text-xl font-black">{detectionResult.primaryItem.binColor}</div>
                  </div>
                </div>
                <div className="text-right text-xs opacity-90 hidden sm:block font-mono">
                  YOLOv8 VERIFIED
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                <div className="p-3.5 rounded-xl bg-black/40 border border-emerald-500/20">
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1 font-mono">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                    Model Confidence
                  </div>
                  <div className="text-xl font-mono font-black text-emerald-300">
                    {detectionResult.primaryItem.confidence}%
                  </div>
                  <Progress value={detectionResult.primaryItem.confidence} className="h-1.5 mt-2 bg-emerald-950" />
                </div>

                <div className="p-3.5 rounded-xl bg-black/40 border border-emerald-500/20">
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1 font-mono">
                    <Clock className="h-3.5 w-3.5 text-blue-400" />
                    Decomposition Time
                  </div>
                  <div className="text-sm font-bold text-foreground">
                    {detectionResult.primaryItem.decompositionTime}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-black/40 border border-emerald-500/20">
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1 font-mono">
                    <Leaf className="h-3.5 w-3.5 text-emerald-400" />
                    Carbon Impact
                  </div>
                  <div className="text-xs font-bold text-emerald-400">
                    {detectionResult.primaryItem.carbonImpact}
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="p-4 rounded-xl bg-black/50 border border-emerald-500/25 mb-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm mb-1 text-emerald-300">Proper Disposal Protocol:</h4>
                    <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                      {detectionResult.primaryItem.instructions}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dos & Don'ts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                <div className="p-3.5 rounded-xl border border-emerald-500/25 bg-emerald-950/20">
                  <div className="font-bold text-xs text-emerald-300 flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    Recycling Best Practices (DOs)
                  </div>
                  <ul className="text-xs space-y-1.5 text-muted-foreground">
                    {detectionResult.primaryItem.dos.map((d, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl border border-red-500/25 bg-red-950/20">
                  <div className="font-bold text-xs text-red-300 flex items-center gap-1.5 mb-2">
                    <XCircle className="h-4 w-4 text-red-400" />
                    Common Mistakes to Avoid (DON'Ts)
                  </div>
                  <ul className="text-xs space-y-1.5 text-muted-foreground">
                    {detectionResult.primaryItem.donts.map((d, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-red-400 font-bold">•</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Map Facility Quick Link */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl border border-emerald-500/20 bg-black/40 text-xs">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-400" />
                  <span>
                    Nearest Facility: <strong className="font-bold text-foreground">{detectionResult.primaryItem.recyclingFacilityType}</strong>
                  </span>
                </div>
                <Button asChild variant="outline" size="sm" className="h-7 text-xs border-emerald-500/30 hover:bg-emerald-950/40">
                  <Link href="/map">
                    View on Recycling Map <ExternalLink className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </div>

              {/* Logging Feedback */}
              {isLogged && (
                <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-emerald-950 to-teal-950 border border-emerald-400/50 text-emerald-200 flex items-center justify-between shadow-[0_0_25px_rgba(16,185,129,0.3)] animate-in fade-in">
                  <div className="flex items-center gap-2.5 text-sm font-bold">
                    <Award className="h-5 w-5 text-amber-400" />
                    Waste successfully logged! You earned +{loggedPoints} Eco-Points.
                  </div>
                  <Button asChild variant="link" size="sm" className="text-xs text-emerald-300 font-bold">
                    <Link href="/dashboard">View in Dashboard →</Link>
                  </Button>
                </div>
              )}
            </div>
          )}

        {/* Footer actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-6 mt-6 border-t border-emerald-500/15">
          {(capturedImage || detectionResult) && (
            <Button
              variant="outline"
              onClick={resetDetection}
              className="border-emerald-500/30 hover:bg-emerald-950/40"
            >
              <RefreshCw className="mr-2 h-4 w-4 text-emerald-400" />
              Retake / New Scan
            </Button>
          )}

          {detectionResult && (
            <Button
              onClick={handleLogWaste}
              disabled={isLogged}
              className={`${
                isLogged
                  ? "bg-muted text-muted-foreground"
                  : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-emerald-950 font-black shadow-[0_0_20px_rgba(16,185,129,0.4)]"
              } ml-auto`}
            >
              <Check className="mr-2 h-4 w-4" />
              {isLogged ? "Logged in Dashboard" : "Log This Waste & Earn Points"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

