"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createCity(formData: FormData) {
  const supabase = await createClient();

  await supabase.from("cities").insert({
    name: formData.get("name"),
    province: formData.get("province"),
    country: (formData.get("country") as string) || "Argentina",
  });

  revalidatePath("/admin/cities");
}

export async function deleteCity(id: string) {
  const supabase = await createClient();

  await supabase.from("cities").delete().eq("id", id);

  revalidatePath("/admin/cities");
}
