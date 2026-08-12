"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateSettings(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("site_settings").upsert({
    id: 1,
    org_name: formData.get("org_name"),
    contact_email: formData.get("contact_email"),
    contact_phone: formData.get("contact_phone"),
    contact_whatsapp: formData.get("contact_whatsapp"),
    address: formData.get("address"),
    instagram: formData.get("instagram"),
    facebook: formData.get("facebook"),
    footer_text: formData.get("footer_text"),
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.log("[updateSettings]", error);
    return;
  }

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
}
