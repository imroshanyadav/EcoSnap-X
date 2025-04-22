"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix Leaflet icon issues
const fixLeafletIcon = () => {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  })
}

// Custom icons
const recyclingIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
  className: "text-green-500",
})

const hotspotIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
  className: "text-red-500",
})

interface MapComponentProps {
  recyclingCenters: any[]
  wasteHotspots: any[]
  activeTab: string
}

export default function MapComponent({ recyclingCenters, wasteHotspots, activeTab }: MapComponentProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    fixLeafletIcon()
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div className="w-full h-[500px] bg-muted flex items-center justify-center">Loading map...</div>
  }

  // Default to NYC coordinates
  const defaultPosition: [number, number] = [40.7128, -74.006]

  return (
    <MapContainer center={defaultPosition} zoom={13} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Render recycling centers */}
      {(activeTab === "recycling" || activeTab === "all") &&
        recyclingCenters.map((center) => (
          <Marker key={`recycling-${center.id}`} position={center.coordinates} icon={recyclingIcon}>
            <Popup>
              <div>
                <h3 className="font-bold">{center.name}</h3>
                <p>{center.address}</p>
                <p className="text-sm mt-1">
                  <span className="font-medium">Accepts: </span>
                  {center.types.join(", ")}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Distance: </span>
                  {center.distance}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

      {/* Render waste hotspots */}
      {(activeTab === "hotspots" || activeTab === "all") &&
        wasteHotspots.map((hotspot) => (
          <Marker key={`hotspot-${hotspot.id}`} position={hotspot.coordinates} icon={hotspotIcon}>
            <Popup>
              <div>
                <h3 className="font-bold">{hotspot.location}</h3>
                <p>{hotspot.address}</p>
                <p className="text-sm mt-1">
                  <span className="font-medium">Type: </span>
                  {hotspot.wasteType}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Status: </span>
                  {hotspot.status}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Reported: </span>
                  {hotspot.date}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  )
}
