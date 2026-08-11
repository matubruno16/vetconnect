"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function markFoundByOwner(id: string, token: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("mark_lost_pet_found", {
    p_id: id,
    p_token: token,
  });

  if (error) {
    console.log("[markFoundByOwner]", error);
    return { success: false };
  }

  revalidatePath(`/perdidos/${id}`);
  revalidatePath("/perdidos");

  return { success: Boolean(data) };
}
