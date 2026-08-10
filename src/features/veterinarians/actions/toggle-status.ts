"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleVeterinarianStatus(id: string, isActive: boolean) {
  const supabase = await createClient();

  await supabase
    .from("veterinarians")
    .update({ is_active: !isActive })
    .eq("id", id);

  revalidatePath("/admin/veterinarians");
}
