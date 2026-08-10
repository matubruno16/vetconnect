import Link from "next/link";
import {
  ArrowLeft,
  Phone,
  MapPin,
  BadgeCheck,
  Clock,
  Globe,
  AtSign,
  Mail,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import MapPreview from "@/components/maps/map-preview-loader";
import { WEEKDAYS } from "@/constants/weekdays";

export default async function VeterinarianDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = await createClient();

  const { data: veterinarian } = await supabase
    .from("veterinarians")
    .select(
      `
    *,
    cities (
      name
    ),
    veterinarian_specialties (
      specialties (
        name
      )
    )
  `,
    )
    .eq("slug", slug)
    .single();

  if (!veterinarian) {
    return <div>No encontrado</div>;
  }

  const [{ data: schedules }, { data: galleryImages }] = await Promise.all([
    supabase.from("schedules").select("*").eq("veterinarian_id", veterinarian.id),
    supabase
      .from("gallery_images")
      .select("id, image_url")
      .eq("veterinarian_id", veterinarian.id)
      .order("display_order", { ascending: true }),
  ]);

  return (
    <main className="min-h-screen bg-muted/30">
      <section className="mx-auto max-w-4xl px-6 py-16">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
        >
          <ArrowLeft size={16} />
          Volver al listado
        </Link>
        <div className="rounded-2xl bg-card p-8 shadow-sm border space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">{veterinarian.name}</h1>

              <p className="mt-2 flex items-center gap-2 text-muted-foreground">
                <MapPin size={16} />
                {veterinarian.cities?.name}
              </p>
            </div>

            <StatusBadge isActive={veterinarian.is_active} />
          </div>

          {veterinarian.is_24h && (
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Clock size={16} />
              Atención 24 Horas
            </div>
          )}

          <div className="space-y-4">
            <div>
              <h2 className="flex items-center gap-2 font-semibold">
                <BadgeCheck size={16} />
                Matrícula
              </h2>
              <p>{veterinarian.license_number}</p>
            </div>

            <div>
              <h2 className="flex items-center gap-2 font-semibold">
                <Phone size={16} />
                Teléfono
              </h2>
              <p>{veterinarian.phone}</p>
            </div>

            <div>
              <h2 className="flex items-center gap-2 font-semibold">
                <MapPin size={16} />
                Dirección
              </h2>
              <p>{veterinarian.address}</p>
            </div>

            <div>
              <h2 className="font-semibold">Descripción</h2>
              <p>{veterinarian.description || "Sin descripción cargada"}</p>
            </div>
            <div>
              <h2 className="font-semibold">Especialidades</h2>

              <div className="flex flex-wrap gap-2 my-2">
                {veterinarian.veterinarian_specialties?.length === 0 ? (
                  <p>Sin especialidades</p>
                ) : (
                  veterinarian.veterinarian_specialties?.map(
                    (
                      item: { specialties: { name: string } },
                      index: number,
                    ) => (
                      <Badge key={index} variant="secondary">
                        {item.specialties.name}
                      </Badge>
                    ),
                  )
                )}
              </div>
              <div className="space-y-3">
                <h2 className="font-semibold">Contacto</h2>

                <div className="flex flex-wrap gap-3">
                  {veterinarian.whatsapp && (
                    <a
                      href={`https://wa.me/${veterinarian.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white"
                    >
                      WhatsApp
                    </a>
                  )}

                  {veterinarian.website && (
                    <a
                      href={veterinarian.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                    >
                      <Globe size={16} />
                      Sitio Web
                    </a>
                  )}

                  {veterinarian.instagram && (
                    <a
                      href={`https://instagram.com/${veterinarian.instagram.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium"
                    >
                      <AtSign size={16} />
                      Instagram
                    </a>
                  )}

                  {veterinarian.email && (
                    <a
                      href={`mailto:${veterinarian.email}`}
                      className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium"
                    >
                      <Mail size={16} />
                      Email
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {galleryImages && galleryImages.length > 0 && (
            <div>
              <h2 className="mb-3 font-semibold">Fotos</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {galleryImages.map((image) => (
                  <img
                    key={image.id}
                    src={image.image_url}
                    alt={veterinarian.name}
                    className="aspect-square w-full rounded-lg border object-cover"
                  />
                ))}
              </div>
            </div>
          )}

          {schedules && schedules.length > 0 && (
            <div>
              <h2 className="mb-3 flex items-center gap-2 font-semibold">
                <Clock size={16} />
                Horarios
              </h2>
              <div className="space-y-1 text-sm">
                {WEEKDAYS.map(({ day_of_week, label }) => {
                  const row = schedules.find(
                    (s) => s.day_of_week === day_of_week,
                  );
                  const isClosed = row?.is_closed ?? true;

                  return (
                    <div
                      key={day_of_week}
                      className="flex justify-between border-b py-1 last:border-0"
                    >
                      <span>{label}</span>
                      <span className="text-muted-foreground">
                        {isClosed
                          ? "Cerrado"
                          : `${row?.open_time?.slice(0, 5)} – ${row?.close_time?.slice(0, 5)}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <h2 className="mb-3 flex items-center gap-2 font-semibold">
              <MapPin size={16} />
              Ubicación
            </h2>
            <MapPreview
              latitude={veterinarian.latitude}
              longitude={veterinarian.longitude}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
