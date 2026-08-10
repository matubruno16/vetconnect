"use client";

import { useState } from "react";
import { Copy } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { WEEKDAYS } from "@/constants/weekdays";

interface ScheduleRow {
  day_of_week: number;
  is_closed: boolean;
  open_time: string | null;
  close_time: string | null;
}

interface DayState {
  isOpen: boolean;
  open: string;
  close: string;
}

function buildInitialState(schedules: ScheduleRow[]) {
  const state: Record<number, DayState> = {};

  for (const { day_of_week } of WEEKDAYS) {
    const row = schedules.find((s) => s.day_of_week === day_of_week);

    state[day_of_week] = {
      isOpen: row ? !row.is_closed : false,
      open: row?.open_time?.slice(0, 5) || "09:00",
      close: row?.close_time?.slice(0, 5) || "18:00",
    };
  }

  return state;
}

export function ScheduleEditor({ schedules }: { schedules: ScheduleRow[] }) {
  const [days, setDays] = useState<Record<number, DayState>>(() =>
    buildInitialState(schedules),
  );

  function update(day: number, patch: Partial<DayState>) {
    setDays((prev) => ({ ...prev, [day]: { ...prev[day], ...patch } }));
  }

  function copyToAllDays(day: number) {
    const source = days[day];
    setDays((prev) => {
      const next: Record<number, DayState> = {};
      for (const key of Object.keys(prev)) {
        next[Number(key)] = { ...source };
      }
      return next;
    });
  }

  return (
    <div className="space-y-2">
      {WEEKDAYS.map(({ day_of_week, label }) => {
        const state = days[day_of_week];

        return (
          <div
            key={day_of_week}
            className="flex flex-wrap items-center gap-3 rounded-lg border p-3"
          >
            <span className="w-24 text-sm font-medium">{label}</span>

            <div className="flex items-center gap-2">
              <Switch
                checked={state.isOpen}
                onCheckedChange={(checked) => update(day_of_week, { isOpen: checked })}
              />
              <span className="w-16 text-sm text-muted-foreground">
                {state.isOpen ? "Abierto" : "Cerrado"}
              </span>
            </div>

            {state.isOpen ? (
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={state.open}
                  onChange={(e) => update(day_of_week, { open: e.target.value })}
                  className="rounded-md border px-2 py-1 text-sm"
                />
                <span className="text-sm text-muted-foreground">a</span>
                <input
                  type="time"
                  value={state.close}
                  onChange={(e) => update(day_of_week, { close: e.target.value })}
                  className="rounded-md border px-2 py-1 text-sm"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  title="Copiar este horario a todos los días"
                  onClick={() => copyToAllDays(day_of_week)}
                >
                  <Copy size={14} />
                </Button>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">
                No atiende este día
              </span>
            )}

            <input
              type="hidden"
              name={`is_closed_${day_of_week}`}
              value={state.isOpen ? "" : "on"}
            />
            {state.isOpen && (
              <>
                <input type="hidden" name={`open_${day_of_week}`} value={state.open} />
                <input
                  type="hidden"
                  name={`close_${day_of_week}`}
                  value={state.close}
                />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
