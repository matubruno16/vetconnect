"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { WEEKDAYS } from "@/constants/weekdays";

export async function updateSchedules(
  veterinarianId: string,
  formData: FormData,
) {
  const supabase = await createClient();

  const rows = WEEKDAYS.map(({ day_of_week }) => {
    const isClosed = formData.get(`is_closed_${day_of_week}`) === "on";
    const openTime = formData.get(`open_${day_of_week}`);
    const closeTime = formData.get(`close_${day_of_week}`);

    return {
      veterinarian_id: veterinarianId,
      day_of_week,
      is_closed: isClosed,
      open_time: isClosed ? null : openTime || null,
      close_time: isClosed ? null : closeTime || null,
    };
  });

  await supabase
    .from("schedules")
    .upsert(rows, { onConflict: "veterinarian_id,day_of_week" });

  revalidatePath(`/admin/veterinarians/${veterinarianId}/edit`);
}
