"use client";

import dynamic from "next/dynamic";

const LocationPicker = dynamic(() => import("./location-picker"), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full animate-pulse rounded-xl bg-muted" />
  ),
});

export default LocationPicker;
