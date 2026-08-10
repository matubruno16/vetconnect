import Link from "next/link";
import { MapPin, Phone, Clock, BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";

interface TodaySchedule {
  is_closed: boolean;
  open_time: string | null;
  close_time: string | null;
}

interface Props {
  veterinarian: {
    id: string;
    name: string;
    slug: string;
    phone: string;
    is_active: boolean;
    is_24h: boolean;
    address: string;
    license_number?: string | null;
    cities?: {
      name: string;
    };
    veterinarian_specialties?: {
      specialties: {
        name: string;
      };
    }[];
  };
  coverImage?: string | null;
  todaySchedule?: TodaySchedule | null;
}

export function VeterinarianCard({
  veterinarian,
  coverImage,
  todaySchedule,
}: Props) {
  const hasSpecialties =
    (veterinarian.veterinarian_specialties?.length ?? 0) > 0;

  return (
    <Link href={`/veterinaria/${veterinarian.slug}`} className="block h-full">
      <div className="flex h-full flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
        <img
          src={coverImage || "/sin_avatar.avif"}
          alt={veterinarian.name}
          className="h-48 w-full object-cover object-center"
        />

        <div className="flex flex-1 flex-col p-5">
          <div className="mb-3 flex items-start justify-between gap-2">
            <h3 className="text-lg font-semibold">{veterinarian.name}</h3>
            <StatusBadge isActive={veterinarian.is_active} />
          </div>

          <div className="space-y-1.5 text-sm text-muted-foreground">
            {veterinarian.cities?.name && (
              <p className="flex items-center gap-2">
                <MapPin size={14} className="shrink-0" />
                {veterinarian.cities.name}
              </p>
            )}
            <p className="flex items-center gap-2">
              <Phone size={14} className="shrink-0" />
              {veterinarian.phone}
            </p>
            {todaySchedule && (
              <p className="flex items-center gap-2">
                <Clock size={14} className="shrink-0" />
                {todaySchedule.is_closed
                  ? "Cerrado hoy"
                  : `Hoy: ${todaySchedule.open_time?.slice(0, 5)} – ${todaySchedule.close_time?.slice(0, 5)}`}
              </p>
            )}
          </div>

          <div className="mt-3 flex flex-1 flex-wrap items-start gap-2">
            {hasSpecialties ? (
              veterinarian.veterinarian_specialties?.map((item, index) => (
                <Badge key={index} variant="secondary">
                  {item.specialties.name}
                </Badge>
              ))
            ) : veterinarian.license_number ? (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <BadgeCheck size={14} className="shrink-0" />
                Matrícula {veterinarian.license_number}
              </p>
            ) : null}
          </div>

          {veterinarian.is_24h && (
            <div className="mt-4 inline-flex items-center gap-1.5 self-start rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Clock size={12} />
              24 Horas
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
