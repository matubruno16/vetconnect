import { createClient } from "@/lib/supabase/server";
import { registerVeterinarian } from "@/features/veterinarians/actions/register-veterinarian";
import { VeterinarianForm } from "@/components/forms/veterinarian-form";

export default async function RegisterPage() {
  const supabase = await createClient();

  const [{ data: cities }, { data: specialties }] = await Promise.all([
    supabase.from("cities").select("*"),
    supabase.from("specialties").select("*"),
  ]);

  return (
    <main className="min-h-screen bg-muted/30">
      <section className="mx-auto max-w-2xl px-6 py-16 lg:max-w-3xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">
            Registrar mi veterinaria
          </h1>
          <p className="mt-3 text-muted-foreground">
            Completá tus datos. El colegio va a revisar la solicitud antes de
            publicarla en la cartilla.
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-8 shadow-sm ">
          <VeterinarianForm
            cities={cities ?? []}
            specialties={specialties ?? []}
            selectedSpecialtyIds={[]}
            action={registerVeterinarian}
            submitLabel="Enviar solicitud"
            showStatusControls={false}
          />
        </div>
      </section>
    </main>
  );
}
