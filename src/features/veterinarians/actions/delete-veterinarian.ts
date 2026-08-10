"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteVeterinarian(id: string) {
  const supabase = await createClient();

  await supabase.from("veterinarian_specialties").delete().eq("veterinarian_id", id);
  await supabase.from("veterinarians").delete().eq("id", id);

  revalidatePath("/admin/veterinarians");
}
