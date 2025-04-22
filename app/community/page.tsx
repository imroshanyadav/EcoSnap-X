"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Calendar, Users, ThumbsUp, MessageSquare, Share2, ImageIcon, Send } from "lucide-react"

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("feed")

  // Mock data for community feed
  const communityPosts = [
    {
      id: 1,
      user: {
        name: "Emma Johnson",
        avatar: "EJ",
        role: "Eco Warrior",
      },
      content:
        "Just organized a cleanup at Riverside Park and collected over 50 pounds of trash! Thanks to everyone who joined. Together we can make a difference! 🌱 #CleanupCrew #EcoSnap",
      image: "/placeholder.svg?height=300&width=600",
      location: "Riverside Park",
      time: "2 hours ago",
      likes: 24,
      comments: 8,
      shares: 3,
    },
    {
      id: 2,
      user: {
        name: "Michael Chen",
        avatar: "MC",
        role: "Recycling Expert",
      },
      content:
        "Did you know that the average American generates about 4.9 pounds of waste per day? Let's work together to reduce this number by properly sorting our waste and recycling whenever possible. Here's a quick guide on how to sort different types of plastics:",
      location: "Downtown",
      time: "5 hours ago",
      likes: 42,
      comments: 15,
      shares: 12,
    },
    {
      id: 3,
      user: {
        name: "Sarah Williams",
        avatar: "SW",
        role: "Community Leader",
      },
      content:
        "I found this illegal dumping site near the old factory. Already reported it through EcoSnap X and the local authorities have been notified. They'll be cleaning it up next week. Keep an eye out for these spots in your neighborhood!",
      image: "/placeholder.svg?height=300&width=600",
      location: "Industrial District",
      time: "Yesterday",
      likes: 56,
      comments: 23,
      shares: 18,
    },
  ]

  // Mock data for upcoming events
  const upcomingEvents = [
    {
      id: 1,
      title: "Beach Cleanup Day",
      description: "Join us for our monthly beach cleanup event. Bring gloves and water!",
      date: "April 28, 2023",
      time: "9:00 AM - 12:00 PM",
      location: "Sunset Beach",
      attendees: 45,
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 2,
      title: "Recycling Workshop",
      description: "Learn how to properly sort and recycle different materials. Great for beginners!",
      date: "May 5, 2023",
      time: "2:00 PM - 4:00 PM",
      location: "Community Center",
      attendees: 28,
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 3,
      title: "E-Waste Collection Drive",
      description: "Bring your old electronics for proper disposal and recycling.",
      date: "May 12, 2023",
      time: "10:00 AM - 3:00 PM",
      location: "City Hall Parking Lot",
      attendees: 32,
      image: "/placeholder.svg?height=200&width=400",
    },
  ]

  // Mock data for NGO partners
  const ngoPartners = [
    {
      id: 1,
      name: "Ocean Cleanup Alliance",
      description:
        "Dedicated to removing plastic from the world's oceans and developing advanced technologies to eliminate ocean plastic pollution.",
      logo: "/placeholder.svg?height=100&width=100",
      website: "https://oceancleanup.org",
    },
    {
      id: 2,
      name: "Green Earth Initiative",
      description:
        "Working to promote sustainable living practices and environmental conservation through education and community engagement.",
      logo: "/placeholder.svg?height=100&width=100",
      website: "https://greenearthinitiative.org",
    },
    {
      id: 3,
      name: "Recycling Revolution",
      description:
        "Transforming waste management systems and promoting circular economy principles in communities worldwide.",
      logo: "/placeholder.svg?height=100&width=100",
      website: "https://recyclingrevolution.org",
    },
  ]

  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl font-bold mb-6">Community</h1>

      <Tabs defaultValue="feed" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
          <TabsTrigger value="feed">Community Feed</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="partners">NGO Partners</TabsTrigger>
        </TabsList>

        <TabsContent value="feed">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Create Post Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Share with the Community</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="@username" />
                      <AvatarFallback>UN</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-4">
                      <Textarea placeholder="Share your eco-friendly activities or waste management tips..." />
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm">
                          <ImageIcon className="mr-2 h-4 w-4" />
                          Add Photo
                        </Button>
                        <Button variant="outline" size="sm">
                          <MapPin className="mr-2 h-4 w-4" />
                          Add Location
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Send className="mr-2 h-4 w-4" />
                    Post
                  </Button>
                </CardFooter>
              </Card>

              {/* Community Feed Posts */}
              {communityPosts.map((post) => (
                <Card key={post.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt={post.user.name} />
                        <AvatarFallback>{post.user.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-base">{post.user.name}</CardTitle>
                            <CardDescription>{post.user.role}</CardDescription>
                          </div>
                          <Badge variant="outline">{post.time}</Badge>
                        </div>
                        {post.location && (
                          <div className="flex items-center mt-1 text-xs text-muted-foreground">
                            <MapPin className="mr-1 h-3 w-3" />
                            {post.location}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="mb-3">{post.content}</p>
                    {post.image && (
                      <div className="rounded-md overflow-hidden mt-3">
                        <img
                          src={post.image || "/placeholder.svg"}
                          alt="Post content"
                          className="w-full object-cover"
                        />
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="border-t pt-3 flex justify-between">
                    <div className="flex gap-4">
                      <Button variant="ghost" size="sm">
                        <ThumbsUp className="mr-1 h-4 w-4" />
                        {post.likes}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="mr-1 h-4 w-4" />
                        {post.comments}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="mr-1 h-4 w-4" />
                        {post.shares}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="space-y-6">
              {/* Community Stats Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Community Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">12,458 Members</p>
                        <p className="text-xs text-muted-foreground">245 new this month</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">328 Active Locations</p>
                        <p className="text-xs text-muted-foreground">Across 15 cities</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">12 Upcoming Events</p>
                        <p className="text-xs text-muted-foreground">Join an event near you</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trending Topics Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Trending Topics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">#CleanupCrew</Badge>
                    <Badge variant="secondary">#ZeroWaste</Badge>
                    <Badge variant="secondary">#PlasticFree</Badge>
                    <Badge variant="secondary">#RecyclingTips</Badge>
                    <Badge variant="secondary">#EcoChallenge</Badge>
                    <Badge variant="secondary">#SustainableLiving</Badge>
                    <Badge variant="secondary">#EarthDay</Badge>
                    <Badge variant="secondary">#GreenTech</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Events Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingEvents.slice(0, 2).map((event) => (
                      <div key={event.id} className="flex gap-3">
                        <div className="w-12 h-12 rounded bg-muted flex flex-col items-center justify-center text-center">
                          <span className="text-xs font-medium">{event.date.split(",")[0].split(" ")[0]}</span>
                          <span className="text-lg font-bold leading-none">
                            {event.date.split(",")[0].split(" ")[1]}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{event.title}</p>
                          <p className="text-xs text-muted-foreground">{event.location}</p>
                          <p className="text-xs text-muted-foreground">
                            <Users className="inline h-3 w-3 mr-1" />
                            {event.attendees} attending
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <Button variant="outline" className="w-full" onClick={() => setActiveTab("events")}>
                      View All Events
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="events">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Upcoming Events</h2>
              <Button className="bg-green-600 hover:bg-green-700">Create Event</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle>{event.title}</CardTitle>
                      <div className="w-12 h-12 rounded bg-muted flex flex-col items-center justify-center text-center">
                        <span className="text-xs font-medium">{event.date.split(",")[0].split(" ")[0]}</span>
                        <span className="text-lg font-bold leading-none">{event.date.split(",")[0].split(" ")[1]}</span>
                      </div>
                    </div>
                    <CardDescription>{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>
                          {event.date}, {event.time}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{event.attendees} people attending</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Learn More</Button>
                    <Button className="bg-green-600 hover:bg-green-700">Join Event</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-6">Past Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="overflow-hidden opacity-70">
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src="/placeholder.svg?height=200&width=400"
                      alt="Park Cleanup"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>Park Cleanup Initiative</CardTitle>
                    <CardDescription>A successful community cleanup event at Central Park.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>April 10, 2023</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Central Park</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>65 people attended</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View Photos
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="overflow-hidden opacity-70">
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src="/placeholder.svg?height=200&width=400"
                      alt="Recycling Workshop"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>Recycling Workshop</CardTitle>
                    <CardDescription>Educational workshop on proper recycling techniques.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>March 25, 2023</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Community Center</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>42 people attended</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View Photos
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="partners">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">NGO Partners</h2>
              <div className="flex gap-2">
                <Input placeholder="Search partners..." className="w-60" />
                <Button variant="outline">Filter</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ngoPartners.map((ngo) => (
                <Card key={ngo.id}>
                  <CardHeader className="flex flex-row items-start gap-4 pb-2">
                    <div className="w-16 h-16 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                      <img src={ngo.logo || "/placeholder.svg"} alt={ngo.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <CardTitle>{ngo.name}</CardTitle>
                      <CardDescription>NGO Partner</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{ngo.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Learn More</Button>
                    <Button className="bg-green-600 hover:bg-green-700">Connect</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Become a Partner</CardTitle>
                <CardDescription>
                  Are you an NGO or recycling organization? Partner with EcoSnap X to expand your reach and impact.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="org-name" className="text-sm font-medium">
                        Organization Name
                      </label>
                      <Input id="org-name" placeholder="Enter your organization name" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="org-type" className="text-sm font-medium">
                        Organization Type
                      </label>
                      <Input id="org-type" placeholder="NGO, Recycling Center, etc." />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="org-email" className="text-sm font-medium">
                      Email Address
                    </label>
                    <Input id="org-email" type="email" placeholder="contact@organization.com" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="org-message" className="text-sm font-medium">
                      How would you like to partner with us?
                    </label>
                    <Textarea
                      id="org-message"
                      placeholder="Tell us about your organization and how you'd like to collaborate..."
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-green-600 hover:bg-green-700">Submit Partnership Request</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
