import { createClient } from "@/lib/supabase/server";
import { createVeterinarian } from "@/features/veterinarians/actions/create-veterinarian";
import { VeterinarianForm } from "@/components/forms/veterinarian-form";

export default async function NewVeterinarianPage() {
  const supabase = await createClient();

  const [{ data: cities }, { data: specialties }] = await Promise.all([
    supabase.from("cities").select("*"),
    supabase.from("specialties").select("*"),
  ]);

  return (
    <div className="max-w-2xl space-y-8 lg:max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Nueva Veterinaria</h1>
        <p className="text-muted-foreground">
          Registrá una nueva veterinaria en la cartilla
        </p>
      </div>

      <VeterinarianForm
        cities={cities ?? []}
        specialties={specialties ?? []}
        selectedSpecialtyIds={[]}
        action={createVeterinarian}
        submitLabel="Crear veterinaria"
      />
    </div>
  );
}
