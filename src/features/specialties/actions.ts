"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createSpecialty(formData: FormData) {
  const supabase = await createClient();

  await supabase.from("specialties").insert({
    name: formData.get("name"),
  });

  revalidatePath("/admin/specialties");
}

export async function deleteSpecialty(id: string) {
  const supabase = await createClient();

  await supabase.from("specialties").delete().eq("id", id);

  revalidatePath("/admin/specialties");
}
