import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { LostPetCard } from "@/components/shared/lost-pet-card";
import { Pagination } from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 10;

export default async function LostPetsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const page = Math.max(1, Number(params.page) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE; // uno de más, para saber si hay página siguiente

  const { data: pageRows } = await supabase
    .from("lost_pets")
    .select("*, cities (name)")
    .eq("status", "lost")
    .order("created_at", { ascending: false })
    .range(from, to);

  const hasMore = (pageRows?.length ?? 0) > PAGE_SIZE;
  const pets = pageRows?.slice(0, PAGE_SIZE);

  return (
    <main className="min-h-screen bg-muted/30">
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-5xl font-bold tracking-tight">
              Mascotas perdidas
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Ayudanos a que vuelvan a casa. Reportá o compartí estos avisos.
            </p>
          </div>

          <Link href="/perdidos/reportar">
            <Button>
              <PlusCircle size={16} />
              Reportar mascota perdida
            </Button>
          </Link>
        </div>

        {pets?.length === 0 ? (
          <p>No hay mascotas perdidas reportadas por ahora.</p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {pets?.map((pet) => (
              <LostPetCard key={pet.id} pet={pet} />
            ))}
          </div>
        )}

        <Pagination
          page={page}
          hasMore={hasMore}
          basePath="/perdidos"
          searchParams={params}
        />
      </section>
    </main>
  );
}
