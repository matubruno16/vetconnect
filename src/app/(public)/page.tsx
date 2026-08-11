import { createClient } from "@/lib/supabase/server";
import { VeterinarianCard } from "@/components/shared/veterinarian-card";
import HomeFilters from "@/components/shared/home-filters";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    city?: string;
    specialty?: string;
    open24?: string;
    featured?: string;
  }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const specialtiesJoin = params.specialty
    ? "veterinarian_specialties!inner"
    : "veterinarian_specialties";

  let query = supabase
    .from("veterinarians")
    .select(
      `
    *,
    cities (
      name
    ),
    ${specialtiesJoin} (
      specialty_id,
      specialties (
        id,
        name
      )
    )
  `,
    )
    .eq("is_active", true);

  if (params.search) {
    query = query.ilike("name", `%${params.search}%`);
  }

  if (params.city) {
    query = query.eq("city_id", params.city);
  }

  if (params.open24 === "true") {
    query = query.eq("is_24h", true);
  }

  if (params.featured === "true") {
    query = query.eq("is_featured", true);
  }

  if (params.specialty) {
    query = query.eq(
      "veterinarian_specialties.specialty_id",
      params.specialty,
    );
  }

  const [{ data: veterinarians }, { data: cities }, { data: specialties }] =
    await Promise.all([
      query.order("created_at", { ascending: false }),
      supabase.from("cities").select("*"),
      supabase.from("specialties").select("*"),
    ]);

  const vetIds = veterinarians?.map((vet) => vet.id) ?? [];
  const today = new Date().getDay();

  const [{ data: coverImages }, { data: todaySchedules }] = await Promise.all([
    vetIds.length
      ? supabase
          .from("gallery_images")
          .select("veterinarian_id, image_url")
          .in("veterinarian_id", vetIds)
          .eq("display_order", 0)
      : Promise.resolve({ data: [] }),
    vetIds.length
      ? supabase
          .from("schedules")
          .select("veterinarian_id, is_closed, open_time, close_time")
          .in("veterinarian_id", vetIds)
          .eq("day_of_week", today)
      : Promise.resolve({ data: [] }),
  ]);

  const coverImageByVet = new Map(
    coverImages?.map((row) => [row.veterinarian_id, row.image_url]),
  );
  const todayScheduleByVet = new Map(
    todaySchedules?.map((row) => [row.veterinarian_id, row]),
  );

  return (
    <main className="min-h-screen bg-muted/30">
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10">
          <h1 className="text-5xl font-bold tracking-tight">
            Cartilla Veterinarios
          </h1>

          <p className="mt-3 text-lg text-muted-foreground">
            Encontrá veterinarios y clínicas veterinarias registradas
          </p>
        </div>
        <HomeFilters cities={cities ?? []} specialties={specialties ?? []} />
        {veterinarians?.length === 0 ? (
          <p>No hay veterinarios disponibles.</p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {veterinarians?.map((vet) => (
              <VeterinarianCard
                key={vet.id}
                veterinarian={vet}
                coverImage={coverImageByVet.get(vet.id) ?? null}
                todaySchedule={todayScheduleByVet.get(vet.id) ?? null}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
