"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleLostPetStatus(
  id: string,
  currentStatus: "lost" | "found",
) {
  const supabase = await createClient();

  await supabase
    .from("lost_pets")
    .update({ status: currentStatus === "lost" ? "found" : "lost" })
    .eq("id", id);

  revalidatePath("/admin/lost-pets");
  revalidatePath("/perdidos");
  revalidatePath(`/perdidos/${id}`);
}
