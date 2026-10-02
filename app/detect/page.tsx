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
    <div className="container py-8 md:py-12">
      {/* Header Banner */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 border border-green-500/20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="font-semibold text-sm text-green-700 dark:text-green-300">
                Real Deep Learning Powered
              </span>
              <Badge variant="outline" className="bg-green-500/20 text-green-700 dark:text-green-300 border-none text-xs">
                Zero API Keys Required
              </Badge>
            </div>
            <h2 className="text-xl font-bold">YOLOv8 Waste-Classification Neural Network</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Based on{" "}
              <a
                href="https://github.com/teamsmcorg/Waste-Classification-using-YOLOv8"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-green-600 inline-flex items-center gap-1"
              >
                teamsmcorg/Waste-Classification-using-YOLOv8
                <ExternalLink className="h-3 w-3" />
              </a>{" "}
              • 6 Core Categories: Biodegradable, Cardboard, Glass, Metal, Paper, Plastic
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 text-xs">
            {Object.keys(WASTE_CATEGORIES_KNOWLEDGE).slice(0, 6).map((cat) => (
              <span
                key={cat}
                className="px-2 py-0.5 rounded-full bg-background/80 border text-muted-foreground font-mono text-[11px]"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>

      <Card className="max-w-4xl mx-auto shadow-lg border-muted">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center justify-between">
            <span>Detect & Classify Waste</span>
            <Badge variant="secondary" className="font-normal text-xs flex items-center gap-1">
              <Layers className="h-3.5 w-3.5 text-green-600" />
              YOLOv8s Model
            </Badge>
          </CardTitle>
          <CardDescription>
            Point your camera or upload a photo to run real-time deep learning object detection with instant disposal instructions.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="camera" value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="camera">
                <Camera className="mr-2 h-4 w-4" />
                Live Camera
              </TabsTrigger>
              <TabsTrigger value="upload">
                <Upload className="mr-2 h-4 w-4" />
                Upload Photo
              </TabsTrigger>
              <TabsTrigger value="voice">
                <Mic className="mr-2 h-4 w-4" />
                Voice Assistant
              </TabsTrigger>
            </TabsList>

            {/* Camera Tab */}
            <TabsContent value="camera" className="mt-4">
              {!capturedImage ? (
                <div className="flex flex-col items-center">
                  <div className="relative w-full max-w-lg aspect-[4/3] bg-muted rounded-xl overflow-hidden mb-4 shadow-inner border">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    <div className="absolute inset-0 border-2 border-green-500/40 pointer-events-none rounded-xl m-4 border-dashed" />
                    <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-md backdrop-blur">
                      Target waste inside the frame
                    </div>
                  </div>
                  <Button onClick={captureImage} size="lg" className="bg-green-600 hover:bg-green-700 shadow">
                    <Camera className="mr-2 h-5 w-5" />
                    Snap & Classify with YOLOv8
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="relative w-full max-w-lg aspect-[4/3] bg-muted rounded-xl overflow-hidden mb-4 shadow border">
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
            <TabsContent value="upload" className="mt-4">
              {!capturedImage ? (
                <div className="flex flex-col items-center">
                  <div
                    className="w-full max-w-lg aspect-[4/3] bg-muted/50 rounded-xl flex flex-col items-center justify-center p-8 mb-4 border-2 border-dashed border-muted-foreground/30 hover:border-green-500 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="p-4 rounded-full bg-green-500/10 text-green-600 mb-3">
                      <Upload className="h-10 w-10" />
                    </div>
                    <p className="text-base font-medium mb-1">Click to upload or drag & drop</p>
                    <p className="text-xs text-muted-foreground text-center max-w-xs">
                      Supports JPG, PNG, WEBP. Analyzed locally with YOLOv8 neural network.
                    </p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                  <Button onClick={() => fileInputRef.current?.click()} size="lg" className="bg-green-600 hover:bg-green-700">
                    <Upload className="mr-2 h-4 w-4" />
                    Select Image File
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="relative w-full max-w-lg aspect-[4/3] bg-muted rounded-xl overflow-hidden mb-4 shadow border">
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
            <TabsContent value="voice" className="mt-4">
              <div className="flex flex-col items-center py-6">
                <Button
                  onClick={toggleListening}
                  className={`rounded-full w-20 h-20 shadow-lg transition-all ${
                    isListening ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  <Mic className="h-8 w-8 text-white" />
                </Button>
                <p className="text-sm font-medium mt-4 mb-2">
                  {isListening ? "Listening... Speak now" : "Tap microphone to ask any waste disposal question"}
                </p>
                <p className="text-xs text-muted-foreground mb-6">Free local NLP knowledge base (no API keys required)</p>

                <div className="w-full max-w-md space-y-2 mb-6">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Or click a sample question:
                  </p>
                  {[
                    "Where do I dispose of a plastic bottle?",
                    "How should I recycle cardboard delivery boxes?",
                    "Are aluminum soda cans recyclable?",
                    "Where do batteries and electronics go?",
                    "What should I do with food scraps and banana peels?",
                  ].map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleVoiceQuestion(q)}
                      className="w-full text-left p-2.5 px-3.5 rounded-lg bg-muted/60 hover:bg-muted text-xs font-medium transition flex items-center justify-between"
                    >
                      <span>"{q}"</span>
                      <Volume2 className="h-3.5 w-3.5 text-muted-foreground opacity-60" />
                    </button>
                  ))}
                </div>

                {voiceAnswer && (
                  <div className="w-full max-w-md p-4 rounded-xl border bg-card shadow-sm animate-in fade-in">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-green-600 uppercase">
                        AI Assistant Guidance
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {voiceAnswer.category}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground italic mb-2">
                      Q: "{voiceAnswer.question}"
                    </p>
                    <p className="text-sm leading-relaxed mb-3">{voiceAnswer.answer}</p>
                    <div className="flex items-center gap-2 pt-2 border-t text-xs font-medium text-muted-foreground">
                      <span>Designated Bin:</span>
                      <Badge className="bg-green-600 text-white text-xs">{voiceAnswer.binColor}</Badge>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Detecting Progress */}
          {isDetecting && (
            <div className="mt-6 p-4 rounded-xl bg-muted/40 border">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-green-600 animate-spin" />
                  Running YOLOv8 deep learning inference...
                </span>
                <span className="text-xs text-muted-foreground">Processing layers</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
          )}

          {/* Detection Results Card */}
          {detectionResult && (
            <div className="mt-6 border rounded-xl p-5 bg-card shadow-sm animate-in fade-in slide-in-from-bottom-2">
              {/* Category & Status Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: detectionResult.primaryItem.binColorCode }}
                    />
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {detectionResult.primaryItem.category}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">
                    {detectionResult.primaryItem.label}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant={detectionResult.primaryItem.recyclable ? "default" : "destructive"}
                    className="text-xs px-3 py-1 flex items-center gap-1"
                  >
                    {detectionResult.primaryItem.recyclable ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Recyclable
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3.5 w-3.5" />
                        Organic / Special Disposal
                      </>
                    )}
                  </Badge>
                  <Badge variant="outline" className="text-xs bg-muted">
                    +{detectionResult.primaryItem.ecoPoints} Points
                  </Badge>
                </div>
              </div>

              {/* Designated Bin Banner */}
              <div
                className="p-3.5 rounded-lg mb-4 flex items-center justify-between text-white"
                style={{ backgroundColor: detectionResult.primaryItem.binColorCode }}
              >
                <div className="flex items-center gap-2.5">
                  <Trash2 className="h-5 w-5" />
                  <div>
                    <div className="text-xs font-semibold uppercase opacity-90">Designated Bin</div>
                    <div className="font-bold text-base">{detectionResult.primaryItem.binColor}</div>
                  </div>
                </div>
                <div className="text-right text-xs opacity-90 hidden sm:block">
                  Verified by YOLOv8 Model
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <div className="p-3 rounded-lg bg-muted/50 border">
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                    <Sparkles className="h-3.5 w-3.5 text-green-600" />
                    Model Confidence
                  </div>
                  <div className="text-lg font-bold">{detectionResult.primaryItem.confidence}%</div>
                  <Progress value={detectionResult.primaryItem.confidence} className="h-1.5 mt-1.5" />
                </div>

                <div className="p-3 rounded-lg bg-muted/50 border">
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                    <Clock className="h-3.5 w-3.5 text-blue-600" />
                    Decomposition Time
                  </div>
                  <div className="text-sm font-semibold">{detectionResult.primaryItem.decompositionTime}</div>
                </div>

                <div className="p-3 rounded-lg bg-muted/50 border">
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                    <Leaf className="h-3.5 w-3.5 text-emerald-600" />
                    Carbon Impact
                  </div>
                  <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                    {detectionResult.primaryItem.carbonImpact}
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="p-4 rounded-xl bg-muted/40 border mb-4">
                <div className="flex items-start gap-2.5">
                  <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Proper Disposal Protocol:</h4>
                    <p className="text-sm text-foreground/90 leading-relaxed">
                      {detectionResult.primaryItem.instructions}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dos & Don'ts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-lg border bg-green-50/50 dark:bg-green-950/20">
                  <div className="font-semibold text-xs text-green-700 dark:text-green-300 flex items-center gap-1 mb-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Recycling Best Practices (DOs)
                  </div>
                  <ul className="text-xs space-y-1.5 text-muted-foreground">
                    {detectionResult.primaryItem.dos.map((d, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-green-600 font-bold">•</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-lg border bg-red-50/50 dark:bg-red-950/20">
                  <div className="font-semibold text-xs text-red-700 dark:text-red-300 flex items-center gap-1 mb-2">
                    <XCircle className="h-4 w-4" />
                    Common Mistakes to Avoid (DON'Ts)
                  </div>
                  <ul className="text-xs space-y-1.5 text-muted-foreground">
                    {detectionResult.primaryItem.donts.map((d, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-red-600 font-bold">•</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Map Facility Quick Link */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-lg border bg-muted/20 text-xs">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-green-600" />
                  <span>
                    Nearest Facility: <strong className="font-medium">{detectionResult.primaryItem.recyclingFacilityType}</strong>
                  </span>
                </div>
                <Button asChild variant="outline" size="sm" className="h-7 text-xs">
                  <Link href="/map">
                    View on Recycling Map <ExternalLink className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </div>

              {/* Logging Feedback */}
              {isLogged && (
                <div className="mt-4 p-3 rounded-lg bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 flex items-center justify-between animate-in fade-in">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Award className="h-5 w-5 text-green-600" />
                    Waste successfully logged! You earned +{loggedPoints} Eco-Points.
                  </div>
                  <Button asChild variant="link" size="sm" className="text-xs text-green-700 dark:text-green-300">
                    <Link href="/dashboard">View in Dashboard →</Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-wrap items-center justify-between gap-3 pt-2">
          {(capturedImage || detectionResult) && (
            <Button variant="outline" onClick={resetDetection}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retake / New Snap
            </Button>
          )}

          {detectionResult && (
            <Button
              onClick={handleLogWaste}
              disabled={isLogged}
              className={`${isLogged ? "bg-muted text-muted-foreground" : "bg-green-600 hover:bg-green-700"} ml-auto`}
            >
              <Check className="mr-2 h-4 w-4" />
              {isLogged ? "Logged in Dashboard" : "Log This Waste & Earn Points"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
