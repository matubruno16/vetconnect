import { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
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
import { OpenNowBadge } from "@/components/shared/open-now-badge";
import MapPreview from "@/components/maps/map-preview-loader";
import { WEEKDAYS } from "@/constants/weekdays";

const BASE_URL = "https://vetconnect-tandil.vercel.app";
const SCHEMA_DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const getVeterinarianBySlug = cache(async (slug: string) => {
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

  return veterinarian;
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const veterinarian = await getVeterinarianBySlug(slug);

  if (!veterinarian) {
    return { title: "Veterinaria no encontrada" };
  }

  const cityName = veterinarian.cities?.name;
  const title = cityName
    ? `${veterinarian.name} — Veterinaria en ${cityName}`
    : veterinarian.name;
  const description =
    veterinarian.description ||
    `${veterinarian.name}: dirección, teléfono, horarios y especialidades. Veterinaria habilitada por el Colegio de Veterinarios de Tandil.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/veterinaria/${veterinarian.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/veterinaria/${veterinarian.slug}`,
      type: "website",
    },
  };
}

export default async function VeterinarianDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const veterinarian = await getVeterinarianBySlug(slug);

  if (!veterinarian) {
    return <div>No encontrado</div>;
  }

  const supabase = await createClient();

  const [{ data: schedules }, { data: galleryImages }] = await Promise.all([
    supabase.from("schedules").select("*").eq("veterinarian_id", veterinarian.id),
    supabase
      .from("gallery_images")
      .select("id, image_url")
      .eq("veterinarian_id", veterinarian.id)
      .order("display_order", { ascending: true }),
  ]);

  const coverImage = galleryImages?.[0]?.image_url || "/sin_avatar.avif";
  const otherImages = galleryImages?.slice(1) ?? [];
  const todaySchedule = schedules?.find(
    (s) => s.day_of_week === new Date().getDay(),
  );

  const veterinaryCareJsonLd = {
    "@context": "https://schema.org",
    "@type": "VeterinaryCare",
    name: veterinarian.name,
    description: veterinarian.description || undefined,
    url: `${BASE_URL}/veterinaria/${veterinarian.slug}`,
    telephone: veterinarian.phone || undefined,
    email: veterinarian.email || undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: veterinarian.address,
      addressLocality: veterinarian.cities?.name,
      addressCountry: "AR",
    },
    geo:
      veterinarian.latitude && veterinarian.longitude
        ? {
            "@type": "GeoCoordinates",
            latitude: veterinarian.latitude,
            longitude: veterinarian.longitude,
          }
        : undefined,
    image: galleryImages?.[0]?.image_url || undefined,
    openingHoursSpecification: veterinarian.is_24h
      ? [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
            opens: "00:00",
            closes: "23:59",
          },
        ]
      : schedules
            ?.filter((s) => !s.is_closed && s.open_time && s.close_time)
            .map((s) => ({
              "@type": "OpeningHoursSpecification",
              dayOfWeek: SCHEMA_DAY_NAMES[s.day_of_week],
              opens: s.open_time?.slice(0, 5),
              closes: s.close_time?.slice(0, 5),
            })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: BASE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: veterinarian.name,
        item: `${BASE_URL}/veterinaria/${veterinarian.slug}`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-muted/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(veterinaryCareJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <section className="mx-auto max-w-4xl px-6 py-16">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
        >
          <ArrowLeft size={16} />
          Volver al listado
        </Link>
        <div className="overflow-hidden rounded-2xl bg-card shadow-sm border">
          <div className="relative h-72 w-full sm:h-96">
            <Image
              src={coverImage}
              alt={veterinarian.name}
              fill
              sizes="100vw"
              priority
              className="object-cover object-center"
            />
          </div>

          <div className="space-y-8 p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">{veterinarian.name}</h1>

              <p className="mt-2 flex items-center gap-2 text-muted-foreground">
                <MapPin size={16} />
                {veterinarian.cities?.name}
              </p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <StatusBadge isActive={veterinarian.is_active} />
              <OpenNowBadge
                is24h={veterinarian.is_24h}
                todaySchedule={todaySchedule}
              />
            </div>
          </div>

          {veterinarian.is_24h && (
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Clock size={16} />
              Atención 24 Horas
            </div>
          )}

          <div className="space-y-4">
            {veterinarian.responsible_name && (
              <div>
                <h2 className="font-semibold">Veterinario responsable</h2>
                <p>{veterinarian.responsible_name}</p>
              </div>
            )}

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
                      className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
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

          {otherImages.length > 0 && (
            <div>
              <h2 className="mb-3 font-semibold">Fotos</h2>
              <div className="grid grid-cols-2 gap-3 px-6 sm:grid-cols-3">
                {otherImages.map((image, index) => (
                  <div
                    key={image.id}
                    className="relative aspect-square w-full overflow-hidden rounded-lg border"
                  >
                    <Image
                      src={image.image_url}
                      alt={`${veterinarian.name} — foto ${index + 2}`}
                      fill
                      sizes="(min-width: 640px) 33vw, 50vw"
                      className="object-cover object-center"
                    />
                  </div>
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
        </div>
      </section>
    </main>
  );
}
