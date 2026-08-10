"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { markerIcon, TANDIL_CENTER } from "@/components/maps/marker-icon";

interface MapPreviewProps {
  latitude: number | null;
  longitude: number | null;
}

export default function MapPreview({ latitude, longitude }: MapPreviewProps) {
  const hasLocation = latitude != null && longitude != null;
  const center: [number, number] = hasLocation
    ? [latitude!, longitude!]
    : TANDIL_CENTER;

  return (
    <MapContainer
      center={center}
      zoom={hasLocation ? 15 : 12}
      scrollWheelZoom={false}
      className="h-64 w-full rounded-xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {hasLocation && <Marker position={center} icon={markerIcon} />}
    </MapContainer>
  );
}
