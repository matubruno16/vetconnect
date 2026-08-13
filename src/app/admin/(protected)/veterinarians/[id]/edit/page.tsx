import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateVeterinarian } from "@/features/veterinarians/actions/update-veterinarian";
import { updateSchedules } from "@/features/veterinarians/actions/update-schedules";
import { VeterinarianForm } from "@/components/forms/veterinarian-form";

export default async function EditVeterinarianPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const [
    { data: veterinarian },
    { data: cities },
    { data: specialties },
    { data: selectedSpecialties },
    { data: schedules },
    { data: galleryImages },
  ] = await Promise.all([
    supabase.from("veterinarians").select("*").eq("id", id).single(),
    supabase.from("cities").select("*"),
    supabase.from("specialties").select("*"),
    supabase
      .from("veterinarian_specialties")
      .select("specialty_id")
      .eq("veterinarian_id", id),
    supabase.from("schedules").select("*").eq("veterinarian_id", id),
    supabase
      .from("gallery_images")
      .select("id, image_url")
      .eq("veterinarian_id", id)
      .order("display_order", { ascending: true }),
  ]);

  const selectedIds =
    selectedSpecialties?.map((item) => String(item.specialty_id)) || [];

  async function action(formData: FormData) {
    "use server";
    await updateVeterinarian(id, formData);
    await updateSchedules(id, formData);
    redirect("/admin/veterinarians");
  }

  if (!veterinarian) {
    return <div>No encontrada</div>;
  }

  return (
    <div className="max-w-2xl space-y-8 lg:max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold">Editar Veterinaria</h1>
        <p className="text-muted-foreground">
          Modificá la información de la veterinaria
        </p>
      </div>

      <VeterinarianForm
        veterinarian={veterinarian}
        cities={cities ?? []}
        specialties={specialties ?? []}
        selectedSpecialtyIds={selectedIds}
        schedules={schedules ?? []}
        galleryImages={galleryImages ?? []}
        action={action}
        submitLabel="Guardar cambios"
      />
    </div>
  );
}
