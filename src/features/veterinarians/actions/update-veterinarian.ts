"use server";

import { createClient } from "@/lib/supabase/server";

export async function updateVeterinarian(id: string, formData: FormData) {
  const supabase = await createClient();

  await supabase
    .from("veterinarians")
    .update({
      name: formData.get("name"),
      license_number: formData.get("license_number"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      city_id: formData.get("city_id"),
      is_active: formData.get("is_active") === "on",
      is_24h: formData.get("is_24h") === "on",
      is_featured: formData.get("is_featured") === "on",
      description: formData.get("description"),
      email: formData.get("email"),
      whatsapp: formData.get("whatsapp"),
      website: formData.get("website"),
      instagram: formData.get("instagram"),
      latitude: formData.get("latitude") ? Number(formData.get("latitude")) : null,
      longitude: formData.get("longitude") ? Number(formData.get("longitude")) : null,
    })
    .eq("id", id);

  const specialties = formData.getAll("specialties") as string[];

  await supabase
    .from("veterinarian_specialties")
    .delete()
    .eq("veterinarian_id", id);

  if (specialties.length > 0) {
    const rows = specialties.map((specialtyId) => ({
      veterinarian_id: id,
      specialty_id: specialtyId,
    }));

    const { error } = await supabase
      .from("veterinarian_specialties")
      .insert(rows);

    if (error) {
      console.log(error);
    }
  }
}
