"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { insertVeterinarian } from "@/features/veterinarians/actions/insert-veterinarian";

export async function createVeterinarian(formData: FormData) {
  const supabase = await createClient();
  const { data, error } = await insertVeterinarian(supabase, formData);

  if (error || !data) {
    console.log(error);
    return;
  }

  redirect(`/admin/veterinarians/${data.id}/edit`);
}
