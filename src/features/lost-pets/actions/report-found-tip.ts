"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function reportFoundTip(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("report_lost_pet_found_tip", {
    p_id: id,
  });

  if (error) {
    console.log("[reportFoundTip]", error);
    return { success: false };
  }

  revalidatePath(`/perdidos/${id}`);
  revalidatePath("/admin/lost-pets");

  return { success: Boolean(data) };
}
