import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { LostPetCard } from "@/components/shared/lost-pet-card";
import { Button } from "@/components/ui/button";

export default async function LostPetsPage() {
  const supabase = await createClient();

  const { data: pets } = await supabase
    .from("lost_pets")
    .select("*, cities (name)")
    .eq("status", "lost")
    .order("created_at", { ascending: false });

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
      </section>
    </main>
  );
}
