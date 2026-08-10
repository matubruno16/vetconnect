"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { slugify } from "@/lib/slugify";
import { saveGalleryImage } from "@/lib/gallery";
import { updateSchedules } from "@/features/veterinarians/actions/update-schedules";

export async function createVeterinarian(formData: FormData) {
  const supabase = await createClient();

  const name = String(formData.get("name"));
  const slug = slugify(name);

  const { data, error } = await supabase
    .from("veterinarians")
    .insert({
      name,
      slug,
      license_number: formData.get("license_number"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      city_id: formData.get("city_id"),
      email: formData.get("email"),
      whatsapp: formData.get("whatsapp"),
      website: formData.get("website"),
      instagram: formData.get("instagram"),
      description: formData.get("description"),
      is_active: formData.get("is_active") === "on",
      is_24h: formData.get("is_24h") === "on",
      is_featured: formData.get("is_featured") === "on",
      latitude: formData.get("latitude") ? Number(formData.get("latitude")) : null,
      longitude: formData.get("longitude") ? Number(formData.get("longitude")) : null,
    })
    .select()
    .single();

  if (error) {
    console.log(error);
    return;
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

  redirect(`/admin/veterinarians/${data.id}/edit`);
}
