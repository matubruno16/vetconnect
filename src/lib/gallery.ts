import type { SupabaseClient } from "@supabase/supabase-js";

export const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Formato no permitido. Usá JPG, PNG o WEBP.";
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return "La foto no puede pesar más de 5MB.";
  }
  return null;
}

export async function saveGalleryImage(
  supabase: SupabaseClient,
  veterinarianId: string,
  file: File,
): Promise<{ error: string | null }> {
  const validationError = validateImageFile(file);
  if (validationError) {
    return { error: validationError };
  }

  const { count } = await supabase
    .from("gallery_images")
    .select("*", { count: "exact", head: true })
    .eq("veterinarian_id", veterinarianId);

  const extension = file.type.split("/")[1];
  const path = `${veterinarianId}/${Date.now()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("vet-images")
    .upload(path, file, { contentType: file.type });

  if (uploadError) {
    return { error: `No se pudo subir la foto: ${uploadError.message}` };
  }

  const { data: publicUrlData } = supabase.storage
    .from("vet-images")
    .getPublicUrl(path);

  const { error: insertError } = await supabase.from("gallery_images").insert({
    veterinarian_id: veterinarianId,
    image_url: publicUrlData.publicUrl,
    display_order: count ?? 0,
  });

  if (insertError) {
    return { error: `No se pudo guardar la foto: ${insertError.message}` };
  }

  return { error: null };
}
