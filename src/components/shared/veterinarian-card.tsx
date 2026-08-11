import Link from "next/link";
import { MapPin, Phone, MessageCircle, ArrowRight } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { OpenNowBadge } from "@/components/shared/open-now-badge";

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
    whatsapp?: string | null;
    is_active: boolean;
    is_24h: boolean;
    address: string;
    cities?: {
      name: string;
    };
  };
  coverImage?: string | null;
  todaySchedule?: TodaySchedule | null;
}

export function VeterinarianCard({
  veterinarian,
  coverImage,
  todaySchedule,
}: Props) {
  const href = `/veterinaria/${veterinarian.slug}`;

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-violet-100 bg-violet-50/40 shadow-lg shadow-violet-200/40 backdrop-blur-md transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-200/50">
      <Link href={href} className="flex flex-1">
        <div className="relative flex w-32 shrink-0 items-center justify-center overflow-hidden bg-linear-to-br from-violet-100 to-violet-200/70 sm:w-44">
          {coverImage ? (
            <img
              src={coverImage}
              alt={veterinarian.name}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          ) : (
            <img
              src="/sin_avatar.avif"
              alt={veterinarian.name}
              className="h-16 w-16 rounded-full border-4 border-white object-cover object-center shadow-sm sm:h-24 sm:w-24"
            />
          )}
        </div>

        <div className="flex flex-1 flex-col justify-center gap-2 p-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-xl font-semibold text-foreground">
              {veterinarian.name}
            </h3>
            <StatusBadge isActive={veterinarian.is_active} />
          </div>

          <OpenNowBadge is24h={veterinarian.is_24h} todaySchedule={todaySchedule} />

          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {veterinarian.cities?.name && (
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="shrink-0" />
                {veterinarian.cities.name}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Phone size={14} className="shrink-0" />
              {veterinarian.phone}
            </span>
          </p>
          <div className="flex flex-wrap gap-2 pt-5">
            {veterinarian.whatsapp && (
              <a
                href={`https://wa.me/${veterinarian.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-violet-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-violet-700"
              >
                <MessageCircle size={13} />
                WhatsApp
              </a>
            )}

            <Link
              href={href}
              className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 px-3 py-1.5 text-xs font-medium text-violet-700 transition hover:bg-violet-50"
            >
              Ver ficha
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </Link>


    </div>
  );
}
