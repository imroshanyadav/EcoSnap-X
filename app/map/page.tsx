"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, AlertTriangle, Trash, Recycle } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import the Map component to avoid SSR issues with Leaflet
const MapWithNoSSR = dynamic(() => import("@/components/map-component"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-muted flex items-center justify-center">
      <p>Loading map...</p>
    </div>
  ),
})

export default function MapPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("recycling")

  // Mock data for recycling centers
  const recyclingCenters = [
    {
      id: 1,
      name: "City Recycling Center",
      address: "123 Green St, Eco City",
      distance: "0.8 miles",
      types: ["Plastic", "Glass", "Paper", "Metal"],
      coordinates: [40.7128, -74.006],
    },
    {
      id: 2,
      name: "Community Drop-off Station",
      address: "456 Earth Ave, Eco City",
      distance: "1.2 miles",
      types: ["E-Waste", "Batteries", "Plastic"],
      coordinates: [40.7138, -74.005],
    },
    {
      id: 3,
      name: "Green Planet Recyclers",
      address: "789 Sustainable Blvd, Eco City",
      distance: "2.5 miles",
      types: ["Glass", "Metal", "Cardboard"],
      coordinates: [40.7148, -74.007],
    },
  ]

  // Mock data for waste hotspots
  const wasteHotspots = [
    {
      id: 1,
      location: "Riverside Park",
      address: "Near the east entrance",
      reportedBy: "EcoUser123",
      date: "2023-04-15",
      status: "Reported",
      wasteType: "Plastic Litter",
      coordinates: [40.7138, -74.008],
    },
    {
      id: 2,
      location: "Downtown Alley",
      address: "Between Main St and Oak St",
      reportedBy: "GreenWarrior",
      date: "2023-04-10",
      status: "Cleanup Scheduled",
      wasteType: "Illegal Dumping",
      coordinates: [40.7158, -74.004],
    },
  ]

  // Filter locations based on search query
  const filteredLocations =
    activeTab === "recycling"
      ? recyclingCenters.filter(
          (center) =>
            center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            center.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
            center.types.some((type) => type.toLowerCase().includes(searchQuery.toLowerCase())),
        )
      : wasteHotspots.filter(
          (hotspot) =>
            hotspot.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            hotspot.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
            hotspot.wasteType.toLowerCase().includes(searchQuery.toLowerCase()),
        )

  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl font-bold mb-6">Recycling Map</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Find Locations</CardTitle>
              <CardDescription>Search for recycling centers or report waste hotspots</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search by name, address, or type..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button variant="outline" size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>

                <Tabs defaultValue="recycling" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="recycling">
                      <Recycle className="mr-2 h-4 w-4" />
                      Recycling Centers
                    </TabsTrigger>
                    <TabsTrigger value="hotspots">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Waste Hotspots
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {filteredLocations.length > 0 ? (
                    filteredLocations.map((location) => (
                      <Card key={location.id} className="p-3">
                        {activeTab === "recycling" ? (
                          // Recycling center card
                          <div>
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{(location as any).name}</h3>
                                <p className="text-sm text-muted-foreground">{(location as any).address}</p>
                              </div>
                              <Badge variant="outline">{(location as any).distance}</Badge>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {(location as any).types.map((type: string) => (
                                <Badge key={type} variant="secondary" className="text-xs">
                                  {type}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex justify-end mt-2">
                              <Button variant="ghost" size="sm" className="text-xs">
                                <MapPin className="h-3 w-3 mr-1" />
                                Directions
                              </Button>
                            </div>
                          </div>
                        ) : (
                          // Waste hotspot card
                          <div>
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{(location as any).location}</h3>
                                <p className="text-sm text-muted-foreground">{(location as any).address}</p>
                              </div>
                              <Badge variant={(location as any).status === "Reported" ? "destructive" : "outline"}>
                                {(location as any).status}
                              </Badge>
                            </div>
                            <p className="text-sm mt-1">
                              <span className="text-muted-foreground">Type: </span>
                              {(location as any).wasteType}
                            </p>
                            <p className="text-sm">
                              <span className="text-muted-foreground">Reported: </span>
                              {(location as any).date}
                            </p>
                            <div className="flex justify-end mt-2">
                              <Button variant="ghost" size="sm" className="text-xs">
                                <Trash className="h-3 w-3 mr-1" />
                                Volunteer
                              </Button>
                            </div>
                          </div>
                        )}
                      </Card>
                    ))
                  ) : (
                    <p className="text-center py-4 text-muted-foreground">
                      No {activeTab === "recycling" ? "recycling centers" : "waste hotspots"} found
                    </p>
                  )}
                </div>

                <Button className="w-full bg-green-600 hover:bg-green-700">
                  {activeTab === "recycling" ? "Add Missing Recycling Center" : "Report New Waste Hotspot"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Interactive Map</CardTitle>
              <CardDescription>Find recycling centers and waste hotspots near you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] w-full rounded-md overflow-hidden">
                <MapWithNoSSR recyclingCenters={recyclingCenters} wasteHotspots={wasteHotspots} activeTab={activeTab} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
