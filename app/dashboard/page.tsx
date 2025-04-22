"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"
import { Trophy, Users, Leaf, TrendingUp, Calendar, Award } from "lucide-react"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("personal")

  // Mock data for personal stats
  const personalStats = {
    totalItems: 127,
    weeklyStreak: 14,
    ecoPoints: 2450,
    rank: "Eco Warrior",
    nextRank: "Sustainability Champion",
    pointsToNextRank: 550,
    recentActivity: [
      { id: 1, type: "Plastic Bottle", date: "Today, 2:30 PM", points: 10 },
      { id: 2, type: "Glass Container", date: "Today, 11:15 AM", points: 15 },
      { id: 3, type: "Aluminum Can", date: "Yesterday, 5:45 PM", points: 10 },
      { id: 4, type: "Paper Waste", date: "Yesterday, 1:20 PM", points: 5 },
      { id: 5, type: "E-Waste (Battery)", date: "Apr 20, 10:30 AM", points: 25 },
    ],
  }

  // Mock data for charts
  const wasteTypeData = [
    { name: "Plastic", value: 45 },
    { name: "Paper", value: 20 },
    { name: "Glass", value: 15 },
    { name: "Metal", value: 10 },
    { name: "E-Waste", value: 5 },
    { name: "Other", value: 5 },
  ]

  const weeklyActivityData = [
    { name: "Mon", items: 5 },
    { name: "Tue", items: 8 },
    { name: "Wed", items: 3 },
    { name: "Thu", items: 10 },
    { name: "Fri", items: 7 },
    { name: "Sat", items: 12 },
    { name: "Sun", items: 6 },
  ]

  const monthlyTrendData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    items: Math.floor(Math.random() * 15) + 1,
  }))

  // Mock data for community leaderboard
  const leaderboard = [
    { id: 1, name: "EcoWarrior92", avatar: "EW", points: 3750, rank: 1 },
    { id: 2, name: "GreenThumb", avatar: "GT", points: 3420, rank: 2 },
    { id: 3, name: "RecycleKing", avatar: "RK", points: 3180, rank: 3 },
    { id: 4, name: "EarthDefender", avatar: "ED", points: 2890, rank: 4 },
    { id: 5, name: "You", avatar: "YO", points: 2450, rank: 5, isCurrentUser: true },
    { id: 6, name: "PlanetProtector", avatar: "PP", points: 2340, rank: 6 },
    { id: 7, name: "WasteWarrior", avatar: "WW", points: 2120, rank: 7 },
  ]

  // Mock data for community impact
  const communityImpact = {
    totalUsers: 12458,
    itemsRecycled: 1245890,
    co2Saved: 325,
    topLocation: "Central Park Area",
    mostRecycled: "Plastic Bottles",
    activeCleanups: 8,
  }

  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger value="personal">Personal Stats</TabsTrigger>
          <TabsTrigger value="community">Community Impact</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{personalStats.totalItems}</div>
                <p className="text-xs text-muted-foreground">+12 from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Weekly Streak</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{personalStats.weeklyStreak} days</div>
                <p className="text-xs text-muted-foreground">Keep it up!</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Eco Points</CardTitle>
                <Leaf className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{personalStats.ecoPoints}</div>
                <p className="text-xs text-muted-foreground">+120 this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Current Rank</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{personalStats.rank}</div>
                <p className="text-xs text-muted-foreground">{personalStats.pointsToNextRank} points to next rank</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Waste Type Distribution</CardTitle>
                <CardDescription>Breakdown of your recycled waste by type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <PieChart
                    data={wasteTypeData}
                    index="name"
                    category="value"
                    valueFormatter={(value) => `${value}%`}
                    colors={["#16a34a", "#22c55e", "#4ade80", "#86efac", "#bbf7d0", "#dcfce7"]}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
                <CardDescription>Number of items recycled each day this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <BarChart
                    data={weeklyActivityData}
                    index="name"
                    categories={["items"]}
                    colors={["#16a34a"]}
                    valueFormatter={(value) => `${value} items`}
                    yAxisWidth={30}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Monthly Trend</CardTitle>
                <CardDescription>Your recycling activity over the past 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <LineChart
                    data={monthlyTrendData}
                    index="day"
                    categories={["items"]}
                    colors={["#16a34a"]}
                    valueFormatter={(value) => `${value} items`}
                    yAxisWidth={30}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest recycling entries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {personalStats.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{activity.type}</p>
                        <p className="text-sm text-muted-foreground">{activity.date}</p>
                      </div>
                      <Badge variant="outline">+{activity.points} pts</Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Button variant="outline" className="w-full">
                    View All Activity
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="community">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Community Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{communityImpact.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+245 new members this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Items Recycled</CardTitle>
                <Leaf className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{communityImpact.itemsRecycled.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+12,450 this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">CO₂ Saved (tons)</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{communityImpact.co2Saved}</div>
                <p className="text-xs text-muted-foreground">Equivalent to planting 5,200 trees</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Community Leaderboard</CardTitle>
                <CardDescription>Top contributors in your community</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboard.map((user) => (
                    <div
                      key={user.id}
                      className={`flex items-center justify-between p-2 rounded-md ${user.isCurrentUser ? "bg-muted" : ""}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="font-medium w-6 text-center">{user.rank}</div>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={user.name} />
                          <AvatarFallback>{user.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium leading-none">
                            {user.name}
                            {user.isCurrentUser && <span className="ml-2 text-xs text-muted-foreground">(You)</span>}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Leaf className="h-4 w-4 text-green-600" />
                        <span className="font-medium">{user.points}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Button variant="outline" className="w-full">
                    View Full Leaderboard
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Community Impact</CardTitle>
                <CardDescription>Collective environmental impact statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Most Active Location</p>
                      <p className="text-sm">{communityImpact.topLocation}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Most Recycled Item</p>
                      <p className="text-sm">{communityImpact.mostRecycled}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Active Cleanup Events</p>
                      <p className="text-sm">{communityImpact.activeCleanups}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">Progress to Community Goal</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm">1.5M Items Recycled</p>
                        <p className="text-sm font-medium">83%</p>
                      </div>
                      <Progress value={83} className="h-2" />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">Upcoming Community Events</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 mt-0.5 text-green-600" />
                        <div>
                          <p className="text-sm font-medium">Beach Cleanup</p>
                          <p className="text-xs text-muted-foreground">Apr 28, 9:00 AM</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 mt-0.5 text-green-600" />
                        <div>
                          <p className="text-sm font-medium">Recycling Workshop</p>
                          <p className="text-xs text-muted-foreground">May 5, 2:00 PM</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Button variant="outline" className="w-full">
                    Join Community Event
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Achievement Badges</CardTitle>
              <CardDescription>Earn badges by completing eco-friendly challenges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-2">
                    <Award className="h-8 w-8 text-green-600 dark:text-green-300" />
                  </div>
                  <p className="text-xs font-medium text-center">First Recycle</p>
                  <p className="text-xs text-muted-foreground text-center">Completed</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-2">
                    <Award className="h-8 w-8 text-green-600 dark:text-green-300" />
                  </div>
                  <p className="text-xs font-medium text-center">Week Streak</p>
                  <p className="text-xs text-muted-foreground text-center">Completed</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-2">
                    <Award className="h-8 w-8 text-green-600 dark:text-green-300" />
                  </div>
                  <p className="text-xs font-medium text-center">100 Items</p>
                  <p className="text-xs text-muted-foreground text-center">Completed</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-2">
                    <Award className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-xs font-medium text-center">E-Waste Pro</p>
                  <p className="text-xs text-muted-foreground text-center">3/5 completed</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-2">
                    <Award className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-xs font-medium text-center">Community Leader</p>
                  <p className="text-xs text-muted-foreground text-center">1/3 completed</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-2">
                    <Award className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-xs font-medium text-center">Cleanup Hero</p>
                  <p className="text-xs text-muted-foreground text-center">0/1 completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
