"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { markerIcon, TANDIL_CENTER } from "@/components/maps/marker-icon";

interface LocationPickerProps {
  defaultLatitude: number | null;
  defaultLongitude: number | null;
}

function ClickHandler({
  onPick,
}: {
  onPick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function LocationPicker({
  defaultLatitude,
  defaultLongitude,
}: LocationPickerProps) {
  const initial: [number, number] =
    defaultLatitude != null && defaultLongitude != null
      ? [defaultLatitude, defaultLongitude]
      : TANDIL_CENTER;

  const [position, setPosition] = useState<[number, number]>(initial);

  return (
    <div className="space-y-2">
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={false}
        className="h-64 w-full rounded-xl"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={markerIcon} />
        <ClickHandler
          onPick={(lat, lng) => setPosition([lat, lng])}
        />
      </MapContainer>

      <p className="text-xs text-muted-foreground">
        Hacé click en el mapa para marcar la ubicación exacta.
      </p>

      <input type="hidden" name="latitude" value={position[0]} />
      <input type="hidden" name="longitude" value={position[1]} />
    </div>
  );
}
