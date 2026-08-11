import Link from "next/link";
import { MapPin, Calendar, MessageCircle, Phone, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Props {
  pet: {
    id: string;
    pet_name: string;
    species: string;
    breed: string | null;
    color: string | null;
    last_seen_location: string;
    last_seen_date: string | null;
    image_url: string | null;
    contact_phone: string;
    contact_whatsapp: string | null;
    status: "lost" | "found";
    cities?: { name: string } | null;
  };
}

export function LostPetCard({ pet }: Props) {
  const details = [pet.species, pet.breed, pet.color].filter(Boolean).join(" · ");
  const href = `/perdidos/${pet.id}`;

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-amber-100 bg-amber-50/40 shadow-lg shadow-amber-200/40 backdrop-blur-md transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-200/50">
      <Link href={href} className="flex flex-1">
        <div className="relative flex w-32 shrink-0 items-center justify-center overflow-hidden bg-linear-to-br from-amber-100 to-amber-200/70 sm:w-44">
          {pet.image_url ? (
            <img
              src={pet.image_url}
              alt={pet.pet_name}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          ) : (
            <img
              src="/sin_avatar.avif"
              alt={pet.pet_name}
              className="h-16 w-16 rounded-full border-4 border-white object-cover object-center shadow-sm sm:h-24 sm:w-24"
            />
          )}
        </div>

        <div className="flex flex-1 flex-col justify-center gap-2 p-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-xl font-semibold text-foreground">{pet.pet_name}</h3>
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

          {details && <p className="text-sm text-muted-foreground">{details}</p>}

          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin size={14} className="shrink-0" />
              {pet.last_seen_location}
              {pet.cities?.name ? ` (${pet.cities.name})` : ""}
            </span>
            {pet.last_seen_date && (
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="shrink-0" />
                {new Date(pet.last_seen_date).toLocaleDateString("es-AR")}
              </span>
            )}
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {pet.contact_whatsapp ? (
              <a
                href={`https://wa.me/${pet.contact_whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-amber-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-amber-700"
              >
                <MessageCircle size={13} />
                WhatsApp
              </a>
            ) : (
              <a
                href={`tel:${pet.contact_phone}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-amber-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-amber-700"
              >
                <Phone size={13} />
                Llamar
              </a>
            )}

            <Link
              href={href}
              className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 px-3 py-1.5 text-xs font-medium text-amber-700 transition hover:bg-amber-50"
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
