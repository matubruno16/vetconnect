"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { slugify } from "@/lib/slugify";

export async function registerVeterinarian(formData: FormData) {
  const supabase = await createClient();

  const name = String(formData.get("name"));
  const slug = slugify(name);

  const { error } = await supabase.from("veterinarians").insert({
    name,
    slug,
    license_number: formData.get("license_number"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    city_id: formData.get("city_id"),
    email: formData.get("email"),
    whatsapp: formData.get("whatsapp"),
    website: formData.get("website"),
    description: formData.get("description"),
    latitude: formData.get("latitude") ? Number(formData.get("latitude")) : null,
    longitude: formData.get("longitude") ? Number(formData.get("longitude")) : null,
    is_active: false,
    is_24h: false,
    is_featured: false,
  });

  if (error) {
    console.log(error);
    return;
  }

  redirect("/registrarse/gracias");
}
