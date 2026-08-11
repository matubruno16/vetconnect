"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteLostPet(id: string, imageUrl: string | null) {
  const supabase = await createClient();

  if (imageUrl) {
    const path = imageUrl.split("/lost-pets/")[1];
    if (path) {
      await supabase.storage.from("lost-pets").remove([path]);
    }
  }

  await supabase.from("lost_pets").delete().eq("id", id);

  revalidatePath("/admin/lost-pets");
  revalidatePath("/perdidos");
}
