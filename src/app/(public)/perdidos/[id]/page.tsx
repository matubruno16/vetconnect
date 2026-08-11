import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Phone,
  MessageCircle,
  PawPrint,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import MapPreview from "@/components/maps/map-preview-loader";
import { MarkFoundButton } from "@/components/shared/mark-found-button";
import { ReportFoundTipButton } from "@/components/shared/report-found-tip-button";

export default async function LostPetDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { id } = await params;
  const { token } = await searchParams;
  const supabase = await createClient();

  const { data: pet } = await supabase
    .from("lost_pets")
    .select("*, cities (name)")
    .eq("id", id)
    .single();

  if (!pet) {
    return <div>No encontrado</div>;
  }

  const details = [pet.species, pet.breed, pet.color].filter(Boolean).join(" · ");

  return (
    <main className="min-h-screen bg-muted/30">
      <section className="mx-auto max-w-4xl px-6 py-16">
        <Link
          href="/perdidos"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-amber-700"
        >
          <ArrowLeft size={16} />
          Volver al mural
        </Link>

        {token && pet.status === "lost" && (
          <div className="mb-6 space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5">
            <p className="text-sm font-medium text-emerald-800">
              Este es tu aviso. Guardá este enlace — es la única forma de
              marcarlo como encontrado sin tener que loguearte.
            </p>
            <MarkFoundButton id={pet.id} token={token} petName={pet.pet_name} />
          </div>
        )}

        {!token && pet.status === "lost" && !pet.found_reported_at && (
          <div className="mb-6">
            <ReportFoundTipButton id={pet.id} />
          </div>
        )}

        {!token && pet.status === "lost" && pet.found_reported_at && (
          <p className="mb-6 rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
            Ya le avisamos al colegio que esta mascota podría estar
            encontrada — están revisándolo.
          </p>
        )}

        <div className="overflow-hidden rounded-2xl bg-card shadow-sm border">
          <img
            src={pet.image_url || "/sin_avatar.avif"}
            alt={pet.pet_name}
            className="h-72 w-full object-cover object-center sm:h-96"
          />

          <div className="space-y-8 p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold">{pet.pet_name}</h1>
                {details && (
                  <p className="mt-2 flex items-center gap-2 text-muted-foreground">
                    <PawPrint size={16} />
                    {details}
                  </p>
                )}
              </div>

              <Badge
                variant="secondary"
                className={
                  pet.status === "found"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }
              >
                {pet.status === "found" ? "Encontrada" : "Perdida"}
              </Badge>
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="flex items-center gap-2 font-semibold">
                  <MapPin size={16} />
                  Dónde se perdió
                </h2>
                <p>
                  {pet.last_seen_location}
                  {pet.cities?.name ? ` — ${pet.cities.name}` : ""}
                </p>
              </div>

              {pet.last_seen_date && (
                <div>
                  <h2 className="flex items-center gap-2 font-semibold">
                    <Calendar size={16} />
                    Fecha
                  </h2>
                  <p>{new Date(pet.last_seen_date).toLocaleDateString("es-AR")}</p>
                </div>
              )}

              {pet.description && (
                <div>
                  <h2 className="font-semibold">Señas particulares</h2>
                  <p>{pet.description}</p>
                </div>
              )}

              <div className="space-y-3">
                <h2 className="font-semibold">Contacto</h2>
                <p className="text-muted-foreground">{pet.contact_name}</p>

                <div className="flex flex-wrap gap-3">
                  {pet.contact_whatsapp && (
                    <a
                      href={`https://wa.me/${pet.contact_whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white"
                    >
                      <MessageCircle size={16} />
                      WhatsApp
                    </a>
                  )}

                  <a
                    href={`tel:${pet.contact_phone}`}
                    className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium"
                  >
                    <Phone size={16} />
                    {pet.contact_phone}
                  </a>
                </div>
              </div>
            </div>

            {(pet.latitude || pet.longitude) && (
              <div>
                <h2 className="mb-3 flex items-center gap-2 font-semibold">
                  <MapPin size={16} />
                  Ubicación
                </h2>
                <MapPreview latitude={pet.latitude} longitude={pet.longitude} />
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
