"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { slugify } from "@/lib/slugify";
import { saveGalleryImage } from "@/lib/gallery";
import { updateSchedules } from "@/features/veterinarians/actions/update-schedules";

export async function registerVeterinarian(formData: FormData) {
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
      is_24h: formData.get("is_24h") === "on",
      latitude: formData.get("latitude") ? Number(formData.get("latitude")) : null,
      longitude: formData.get("longitude") ? Number(formData.get("longitude")) : null,
      // Forzado server-side: el registro self-service siempre entra inactivo
      // y no destacado, sin importar lo que venga en el formulario. Lo
      // aprueba un admin desde /admin/veterinarians. La policy de RLS
      // también lo exige, esto es solo para fallar rápido y claro.
      is_active: false,
      is_featured: false,
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

  redirect("/registrarse/gracias");
}
