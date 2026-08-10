"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteGalleryImage(
  veterinarianId: string,
  imageId: string,
  imageUrl: string,
) {
  const supabase = await createClient();

  const path = imageUrl.split("/vet-images/")[1];

  if (path) {
    await supabase.storage.from("vet-images").remove([path]);
  }

  await supabase.from("gallery_images").delete().eq("id", imageId);

  revalidatePath(`/admin/veterinarians/${veterinarianId}/edit`);
}
