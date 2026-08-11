"use server";

import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { validateImageFile } from "@/lib/gallery";

export async function createLostPet(formData: FormData) {
  const supabase = await createClient();

  let imageUrl: string | null = null;
  const photo = formData.get("photo") as File | null;

  if (photo && photo.size > 0) {
    const validationError = validateImageFile(photo);

    if (validationError) {
      console.log("[createLostPet] foto inválida:", validationError);
    } else {
      const extension = photo.type.split("/")[1];
      const path = `${Date.now()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("lost-pets")
        .upload(path, photo, { contentType: photo.type });

      if (uploadError) {
        console.log("[createLostPet] error subiendo foto:", uploadError);
      } else {
        const { data } = supabase.storage.from("lost-pets").getPublicUrl(path);
        imageUrl = data.publicUrl;
      }
    }
  }

  const { data, error } = await supabase
    .from("lost_pets")
    .insert({
      pet_name: formData.get("pet_name"),
      species: formData.get("species"),
      breed: formData.get("breed"),
      color: formData.get("color"),
      description: formData.get("description"),
      last_seen_location: formData.get("last_seen_location"),
      last_seen_date: formData.get("last_seen_date") || null,
      city_id: formData.get("city_id") || null,
      latitude: formData.get("latitude") ? Number(formData.get("latitude")) : null,
      longitude: formData.get("longitude") ? Number(formData.get("longitude")) : null,
      image_url: imageUrl,
      contact_name: formData.get("contact_name"),
      contact_phone: formData.get("contact_phone"),
      contact_whatsapp: formData.get("contact_whatsapp"),
    })
    .select()
    .single();

  if (error) {
    console.log("[createLostPet]", error);
    return;
  }

  // Token secreto para que esta persona (y solo ella) pueda marcar la
  // mascota como encontrada más adelante sin necesitar login. Se genera
  // aquí, no se vuelve a leer de la base — así nunca queda expuesto por
  // ninguna consulta de lectura pública.
  const token = randomUUID();

  const { error: tokenError } = await supabase
    .from("lost_pet_tokens")
    .insert({ lost_pet_id: data.id, token });

  if (tokenError) {
    console.log("[createLostPet] error guardando token:", tokenError);
  }

  redirect(`/perdidos/${data.id}?token=${token}`);
}
