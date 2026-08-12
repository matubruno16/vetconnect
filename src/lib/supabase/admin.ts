import { createClient } from "@supabase/supabase-js";

// Cliente con la Service Role Key — salta RLS por completo y es el único
// que puede usar las funciones de administración de usuarios de Supabase
// Auth (auth.admin.*). Nunca importar esto desde un componente "use client":
// la key no tiene el prefijo NEXT_PUBLIC_ a propósito, para que Next.js no
// la incluya en el bundle del navegador.
export function createAdminClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "Falta SUPABASE_SERVICE_ROLE_KEY en las variables de entorno.",
    );
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
