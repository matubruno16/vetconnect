"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { saveGalleryImage } from "@/lib/gallery";

export interface UploadImageState {
  error: string | null;
}

export async function uploadGalleryImage(
  _prevState: UploadImageState,
  formData: FormData,
): Promise<UploadImageState> {
  const veterinarianId = String(formData.get("veterinarian_id"));
  const file = formData.get("file") as File | null;

  if (!file || file.size === 0) {
    return { error: "Elegí una foto para subir." };
  }

  try {
    const supabase = await createClient();

    const { error } = await saveGalleryImage(supabase, veterinarianId, file);
    if (error) {
      return { error };
    }

    const { data: vet } = await supabase
      .from("veterinarians")
      .select("slug")
      .eq("id", veterinarianId)
      .single();

    revalidatePath(`/admin/veterinarians/${veterinarianId}/edit`);
    revalidatePath("/");
    if (vet?.slug) {
      revalidatePath(`/veterinaria/${vet.slug}`);
    }

    return { error: null };
  } catch (err) {
    return {
      error: `Ocurrió un error inesperado subiendo la foto: ${
        err instanceof Error ? err.message : String(err)
      }`,
    };
  }
}
