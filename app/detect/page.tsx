"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, Upload, Mic, RefreshCw, Check, Info } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function DetectPage() {
  const [activeTab, setActiveTab] = useState("camera")
  const [isDetecting, setIsDetecting] = useState(false)
  const [detectionResult, setDetectionResult] = useState<null | {
    type: string
    confidence: number
    instructions: string
    recyclable: boolean
  }>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
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
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
        const imageDataUrl = canvasRef.current.toDataURL("image/png")
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

  const detectWaste = (imageUrl: string) => {
    setIsDetecting(true)

    // Simulate AI detection with a timeout
    setTimeout(() => {
      // Mock detection results
      const wasteTypes = [
        {
          type: "Plastic Bottle",
          confidence: 94,
          instructions: "Clean, remove cap, and place in the blue recycling bin. Caps can be recycled separately.",
          recyclable: true,
        },
        {
          type: "Glass Container",
          confidence: 89,
          instructions: "Rinse thoroughly and place in the green glass recycling bin. Remove any non-glass components.",
          recyclable: true,
        },
        {
          type: "Food Waste",
          confidence: 92,
          instructions: "Place in compost bin or organic waste collection. Not suitable for regular recycling.",
          recyclable: false,
        },
        {
          type: "Aluminum Can",
          confidence: 97,
          instructions: "Rinse and place in the metal recycling bin. Crush if possible to save space.",
          recyclable: true,
        },
        {
          type: "E-Waste (Battery)",
          confidence: 88,
          instructions:
            "Do not place in regular trash. Take to designated e-waste collection point or hazardous waste facility.",
          recyclable: false,
        },
      ]

      // Select a random waste type for the demo
      const result = wasteTypes[Math.floor(Math.random() * wasteTypes.length)]

      setDetectionResult(result)
      setIsDetecting(false)
    }, 2000)
  }

  const resetDetection = () => {
    setCapturedImage(null)
    setDetectionResult(null)
    if (activeTab === "camera") {
      startCamera()
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setCapturedImage(null)
    setDetectionResult(null)

    if (value === "camera") {
      startCamera()
    } else {
      stopCamera()
    }
  }

  // Start camera when component mounts if camera tab is active
  useState(() => {
    if (activeTab === "camera") {
      startCamera()
    }

    // Cleanup function to stop camera when component unmounts
    return () => {
      stopCamera()
    }
  })

  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl font-bold mb-6">Waste Detection</h1>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Detect & Classify Waste</CardTitle>
          <CardDescription>
            Use your camera, upload an image, or use voice commands to identify waste and get proper disposal
            instructions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="camera" value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="camera">
                <Camera className="mr-2 h-4 w-4" />
                Camera
              </TabsTrigger>
              <TabsTrigger value="upload">
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </TabsTrigger>
              <TabsTrigger value="voice">
                <Mic className="mr-2 h-4 w-4" />
                Voice
              </TabsTrigger>
            </TabsList>

            <TabsContent value="camera" className="mt-4">
              {!capturedImage ? (
                <div className="flex flex-col items-center">
                  <div className="relative w-full max-w-md aspect-[3/4] bg-muted rounded-lg overflow-hidden mb-4">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  </div>
                  <Button onClick={captureImage} className="bg-green-600 hover:bg-green-700">
                    <Camera className="mr-2 h-4 w-4" />
                    Capture Image
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="relative w-full max-w-md aspect-[3/4] bg-muted rounded-lg overflow-hidden mb-4">
                    <img
                      src={capturedImage || "/placeholder.svg"}
                      alt="Captured waste"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              <canvas ref={canvasRef} className="hidden" />
            </TabsContent>

            <TabsContent value="upload" className="mt-4">
              {!capturedImage ? (
                <div className="flex flex-col items-center">
                  <div
                    className="w-full max-w-md aspect-[3/4] bg-muted rounded-lg flex flex-col items-center justify-center p-8 mb-4 border-2 border-dashed border-border cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-center text-muted-foreground mb-2">Click to upload an image or drag and drop</p>
                    <p className="text-center text-xs text-muted-foreground">Supports JPG, PNG, WEBP</p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                  <Button onClick={() => fileInputRef.current?.click()} className="bg-green-600 hover:bg-green-700">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="relative w-full max-w-md aspect-[3/4] bg-muted rounded-lg overflow-hidden mb-4">
                    <img
                      src={capturedImage || "/placeholder.svg"}
                      alt="Uploaded waste"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="voice" className="mt-4">
              <div className="flex flex-col items-center py-8">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
                  <Mic className="h-12 w-12 text-muted-foreground" />
                </div>
                <p className="text-center text-muted-foreground mb-6">Tap the microphone and ask a question like:</p>
                <div className="flex flex-col gap-2 mb-6 w-full max-w-md">
                  <div className="bg-muted p-2 px-4 rounded-lg text-sm">"Where do I dispose of a plastic bottle?"</div>
                  <div className="bg-muted p-2 px-4 rounded-lg text-sm">"How do I recycle batteries?"</div>
                  <div className="bg-muted p-2 px-4 rounded-lg text-sm">"Is this pizza box recyclable?"</div>
                </div>
                <Button className="bg-green-600 hover:bg-green-700 rounded-full w-16 h-16">
                  <Mic className="h-6 w-6" />
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {isDetecting && (
            <div className="mt-6">
              <p className="text-center mb-2">Analyzing waste...</p>
              <Progress value={45} className="h-2" />
            </div>
          )}

          {detectionResult && (
            <div className="mt-6 border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{detectionResult.type}</h3>
                <Badge variant={detectionResult.recyclable ? "default" : "destructive"}>
                  {detectionResult.recyclable ? "Recyclable" : "Not Recyclable"}
                </Badge>
              </div>
              <div className="flex items-center mb-2">
                <div className="text-sm font-medium mr-2">Confidence:</div>
                <div className="flex-1">
                  <Progress value={detectionResult.confidence} className="h-2" />
                </div>
                <div className="text-sm ml-2">{detectionResult.confidence}%</div>
              </div>
              <Separator className="my-4" />
              <div className="flex items-start gap-2 mt-4">
                <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{detectionResult.instructions}</p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {(capturedImage || detectionResult) && (
            <Button variant="outline" onClick={resetDetection}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          )}
          {detectionResult && (
            <Button className="bg-green-600 hover:bg-green-700">
              <Check className="mr-2 h-4 w-4" />
              Log This Waste
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
