import type { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slugify";
import { saveGalleryImage } from "@/lib/gallery";
import { updateSchedules } from "@/features/veterinarians/actions/update-schedules";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

interface InsertOverrides {
  is_active?: boolean;
  is_featured?: boolean;
}

export async function insertVeterinarian(
  supabase: SupabaseServerClient,
  formData: FormData,
  overrides: InsertOverrides = {},
) {
  const name = String(formData.get("name"));
  const slug = slugify(name);

  const { data, error } = await supabase
    .from("veterinarians")
    .insert({
      name,
      slug,
      license_number: formData.get("license_number"),
      responsible_name: formData.get("responsible_name"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      city_id: formData.get("city_id"),
      email: formData.get("email"),
      whatsapp: formData.get("whatsapp"),
      website: formData.get("website"),
      instagram: formData.get("instagram"),
      description: formData.get("description"),
      is_24h: formData.get("is_24h") === "on",
      is_active: overrides.is_active ?? formData.get("is_active") === "on",
      is_featured:
        overrides.is_featured ?? formData.get("is_featured") === "on",
      latitude: formData.get("latitude")
        ? Number(formData.get("latitude"))
        : null,
      longitude: formData.get("longitude")
        ? Number(formData.get("longitude"))
        : null,
    })
    .select()
    .single();

  if (error || !data) {
    return { data: null, error };
  }

  const specialties = formData.getAll("specialties") as string[];

  if (specialties.length > 0) {
    await supabase.from("veterinarian_specialties").insert(
      specialties.map((specialtyId) => ({
        veterinarian_id: data.id,
        specialty_id: specialtyId,
      })),
    );
  }

  await updateSchedules(data.id, formData);

  const coverPhoto = formData.get("cover_photo") as File | null;
  if (coverPhoto && coverPhoto.size > 0) {
    const { error: photoError } = await saveGalleryImage(
      supabase,
      data.id,
      coverPhoto,
    );
    if (photoError) {
      console.log(photoError);
    }
  }

  return { data, error: null };
}
