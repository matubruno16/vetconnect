"use client";

import { useEffect, useState } from "react";

interface TodaySchedule {
  is_closed: boolean;
  open_time: string | null;
  close_time: string | null;
}

interface OpenNowBadgeProps {
  is24h: boolean;
  todaySchedule?: TodaySchedule | null;
}

type Status = "open" | "closing-soon" | "closed";

const CLOSING_SOON_THRESHOLD_MINUTES = 30;

function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

const STYLES: Record<Status, { dot: string; text: string; label: string }> = {
  open: { dot: "bg-emerald-500", text: "text-emerald-600", label: "Abierto ahora" },
  "closing-soon": { dot: "bg-amber-500", text: "text-amber-600", label: "Cierra pronto" },
  closed: { dot: "bg-red-500", text: "text-red-500", label: "Cerrado ahora" },
};

export function OpenNowBadge({ is24h, todaySchedule }: OpenNowBadgeProps) {
  // Se calcula en el cliente (useEffect) y no durante el render inicial del
  // servidor, así comparamos contra la hora real de quien está mirando la
  // página en este momento, no la hora del servidor.
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    if (is24h) {
      setStatus("open");
      return;
    }

    if (
      !todaySchedule ||
      todaySchedule.is_closed ||
      !todaySchedule.open_time ||
      !todaySchedule.close_time
    ) {
      setStatus("closed");
      return;
    }

    const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();
    const openMinutes = toMinutes(todaySchedule.open_time);
    const closeMinutes = toMinutes(todaySchedule.close_time);

    if (nowMinutes < openMinutes || nowMinutes >= closeMinutes) {
      setStatus("closed");
      return;
    }

    const minutesUntilClose = closeMinutes - nowMinutes;
    setStatus(
      minutesUntilClose <= CLOSING_SOON_THRESHOLD_MINUTES ? "closing-soon" : "open",
    );
  }, [is24h, todaySchedule]);

  if (status === null) {
    return null;
  }

  const { dot, text, label } = STYLES[status];
  const isOpen = status !== "closed";

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {label}

      {isOpen && !is24h && todaySchedule?.close_time && (
        <span className="font-normal text-muted-foreground">
          · Cierra {todaySchedule.close_time.slice(0, 5)}
        </span>
      )}
    </span>
  );
}
