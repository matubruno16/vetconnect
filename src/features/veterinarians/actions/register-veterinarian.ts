"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { insertVeterinarian } from "@/features/veterinarians/actions/insert-veterinarian";

export async function registerVeterinarian(formData: FormData) {
  const supabase = await createClient();

  // Forzado server-side: el registro self-service siempre entra inactivo
  // y no destacado, sin importar lo que venga en el formulario. Lo aprueba
  // un admin desde /admin/veterinarians. La policy de RLS también lo exige,
  // esto es solo para fallar rápido y claro.
  const { data, error } = await insertVeterinarian(supabase, formData, {
    is_active: false,
    is_featured: false,
  });

  if (error || !data) {
    console.log(error);
    return;
  }

  redirect("/registrarse/gracias");
}
