"use client";

import dynamic from "next/dynamic";

const MapPreview = dynamic(() => import("./map-preview"), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full animate-pulse rounded-xl bg-muted" />
  ),
});

export default MapPreview;
