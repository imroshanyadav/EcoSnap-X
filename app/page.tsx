import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Camera, MapPin, Trophy, Mic, BarChart3 } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="inline-block px-3 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm font-medium mb-2">
                AI-Powered Waste Management
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                EcoSnap X – Unified Smart Waste Assistant
              </h1>
              <span>Clean Today Green Tomorrow </span>
              <p className="text-muted-foreground md:text-xl">
                Detect, classify, and properly dispose of waste with our AI-powered platform. Join the community making
                our planet cleaner.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                  <Link href="/detect">
                    Start Detecting <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/map">Find Recycling Centers</Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute -top-4 -left-4 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob"></div>
                <div className="absolute -bottom-8 right-4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 -left-20 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-4000"></div>
                <div className="relative">
                  <img
                    alt="EcoSnap X App Interface"
                    className="mx-auto rounded-lg shadow-xl"
                    src="/homeImg.png"
                    width="400"
                    height="600"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block px-3 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm font-medium">
                Core Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                All-in-One Waste Management
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                EcoSnap X combines cutting-edge AI with community engagement to revolutionize waste management.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            <div className="flex flex-col items-center space-y-4 p-6 border rounded-lg shadow-sm bg-card">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <Camera className="w-6 h-6 text-green-700 dark:text-green-300" />
              </div>
              <h3 className="text-xl font-bold">AI Image Detection</h3>
              <p className="text-center text-muted-foreground">
                Detect and classify waste using your phone camera. Works with plastic, glass, metal, e-waste, and more.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 p-6 border rounded-lg shadow-sm bg-card">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <Mic className="w-6 h-6 text-green-700 dark:text-green-300" />
              </div>
              <h3 className="text-xl font-bold">Voice Assistant</h3>
              <p className="text-center text-muted-foreground">
                Ask questions about waste disposal and get instant, location-specific guidance in multiple languages.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 p-6 border rounded-lg shadow-sm bg-card">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <MapPin className="w-6 h-6 text-green-700 dark:text-green-300" />
              </div>
              <h3 className="text-xl font-bold">Map Integration</h3>
              <p className="text-center text-muted-foreground">
                Find nearby recycling centers, trash bins, and report waste hotspots in your community.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 p-6 border rounded-lg shadow-sm bg-card">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <Trophy className="w-6 h-6 text-green-700 dark:text-green-300" />
              </div>
              <h3 className="text-xl font-bold">Gamification & Rewards</h3>
              <p className="text-center text-muted-foreground">
                Earn points, track eco-streaks, and compete with friends to encourage sustainable habits.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 p-6 border rounded-lg shadow-sm bg-card">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <BarChart3 className="w-6 h-6 text-green-700 dark:text-green-300" />
              </div>
              <h3 className="text-xl font-bold">Waste Analytics</h3>
              <p className="text-center text-muted-foreground">
                Track types of waste reported by users in each locality with our comprehensive dashboard.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 p-6 border rounded-lg shadow-sm bg-card">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6 text-green-700 dark:text-green-300"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Community Engagement</h3>
              <p className="text-center text-muted-foreground">
                Connect with NGOs and recyclers, report illegal dumping, and participate in community cleanup events.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50 dark:bg-green-950">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Join the EcoSnap X Community
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Be part of the solution. Start detecting, reporting, and properly disposing of waste today.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                <Link href="/detect">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/dashboard">View Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
