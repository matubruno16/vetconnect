import { Building2, Camera, Clock, MapPin, Stethoscope, UserRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/shared/submit-button";
import LocationPicker from "@/components/maps/location-picker-loader";
import { ImageUpload } from "@/components/forms/image-upload";
import { FilePicker } from "@/components/forms/file-picker";
import { ScheduleEditor } from "@/components/forms/schedule-editor";
import { SectionHeading } from "@/components/forms/section-heading";

interface VeterinarianFormValues {
  id: string;
  name: string;
  license_number: string | null;
  responsible_name: string | null;
  description: string | null;
  email: string | null;
  whatsapp: string | null;
  website: string | null;
  instagram: string | null;
  phone: string;
  address: string;
  city_id: string;
  is_active: boolean;
  is_24h: boolean;
  is_featured: boolean;
  latitude: number | null;
  longitude: number | null;
}

interface ScheduleRow {
  day_of_week: number;
  is_closed: boolean;
  open_time: string | null;
  close_time: string | null;
}

interface VeterinarianFormProps {
  veterinarian?: VeterinarianFormValues;
  cities: { id: string; name: string }[];
  specialties: { id: string; name: string }[];
  selectedSpecialtyIds: string[];
  schedules?: ScheduleRow[];
  galleryImages?: { id: string; image_url: string }[];
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
  showStatusControls?: boolean;
}

export function VeterinarianForm({
  veterinarian,
  cities,
  specialties,
  selectedSpecialtyIds,
  schedules = [],
  galleryImages = [],
  action,
  submitLabel,
  showStatusControls = true,
}: VeterinarianFormProps) {
  const isEditing = Boolean(veterinarian);

  return (
    <div className="space-y-6">
      <form action={action} className="space-y-6">
      <div className="space-y-4">
        <SectionHeading icon={Building2}>Datos de la veterinaria</SectionHeading>

        <div className="grid gap-4 sm:grid-cols-2 px-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nombre
            </label>
            <Input
              id="name"
              name="name"
              defaultValue={veterinarian?.name ?? ""}
              autoComplete="organization"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="address" className="text-sm font-medium">
              Dirección
            </label>
            <Input
              id="address"
              name="address"
              defaultValue={veterinarian?.address ?? ""}
              autoComplete="street-address"
              required
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 px-6">
          <div className="space-y-2">
            <label htmlFor="city_id" className="text-sm font-medium">
              Ciudad
            </label>

            <select
              id="city_id"
              name="city_id"
              defaultValue={veterinarian?.city_id ?? ""}
              className="w-full rounded-md border pl-3 pr-6 h-8 text-sm"
              required
            >
              <option value="">Seleccionar ciudad</option>
              {cities?.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Teléfono
            </label>
            <Input
              id="phone"
              name="phone"
              defaultValue={veterinarian?.phone ?? ""}
              autoComplete="tel"
              required
            />
          </div>
        </div>

        <div className="space-y-2 px-6">
          <label htmlFor="description" className="text-sm font-medium">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            defaultValue={veterinarian?.description ?? ""}
            className="min-h-28 w-full rounded-md border px-3 py-2"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 px-6">
          <div className="space-y-2">
            <label htmlFor="website" className="text-sm font-medium">
              Website
            </label>
            <Input
              id="website"
              name="website"
              defaultValue={veterinarian?.website ?? ""}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="instagram" className="text-sm font-medium">
              Instagram
            </label>
            <Input
              id="instagram"
              name="instagram"
              defaultValue={veterinarian?.instagram ?? ""}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 px-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={veterinarian?.email ?? ""}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="whatsapp" className="text-sm font-medium">
              WhatsApp
            </label>
            <Input
              id="whatsapp"
              name="whatsapp"
              defaultValue={veterinarian?.whatsapp ?? ""}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <SectionHeading icon={UserRound}>Datos del responsable</SectionHeading>

        <div className="grid gap-4 sm:grid-cols-2 px-6">
          <div className="space-y-2">
            <label htmlFor="responsible_name" className="text-sm font-medium">
              Veterinario responsable
            </label>
            <Input
              id="responsible_name"
              name="responsible_name"
              defaultValue={veterinarian?.responsible_name ?? ""}
              autoComplete="name"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="license_number" className="text-sm font-medium">
              Matrícula
            </label>
            <Input
              id="license_number"
              name="license_number"
              defaultValue={veterinarian?.license_number ?? ""}
              required
            />
          </div>
        </div>
      </div>

        <div className="space-y-2">
          <SectionHeading icon={MapPin}>Ubicación</SectionHeading>
          <div className="px-6">

            <LocationPicker
              defaultLatitude={veterinarian?.latitude ?? null}
              defaultLongitude={veterinarian?.longitude ?? null}
            />
          </div>
        </div>

      <div className="flex flex-wrap items-center gap-6">
        {showStatusControls && (
          <div className="flex items-center gap-3">
            <input
              id="is_active"
              type="checkbox"
              name="is_active"
              defaultChecked={veterinarian ? veterinarian.is_active : true}
            />
            <label htmlFor="is_active" className="text-sm font-medium">
              Veterinaria activa
            </label>
          </div>
        )}

        <div className="flex items-center gap-3 px-6">
          <input
            id="is_24h"
            type="checkbox"
            name="is_24h"
            defaultChecked={veterinarian?.is_24h}
          />
          <label htmlFor="is_24h" className="text-sm font-medium">
            Atención 24 horas
          </label>
        </div>

        {showStatusControls && (
          <div className="flex items-center gap-3">
            <input
              id="is_featured"
              type="checkbox"
              name="is_featured"
              defaultChecked={veterinarian?.is_featured}
            />
            <label htmlFor="is_featured" className="text-sm font-medium">
              Destacado
            </label>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <SectionHeading icon={Stethoscope}>Especialidades</SectionHeading>

        <div className="grid grid-cols-2 gap-3 px-6">
          {specialties?.map((specialty) => (
            <label
              key={specialty.id}
              className="flex items-center gap-2 text-sm"
            >
              <input
                type="checkbox"
                name="specialties"
                value={specialty.id}
                defaultChecked={selectedSpecialtyIds.includes(specialty.id)}
              />
              {specialty.name}
            </label>
          ))}
        </div>
      </div>

      {!isEditing && (
        <div className="space-y-2 border-t pt-6">
          <SectionHeading icon={Camera}>Foto de portada</SectionHeading>
          <FilePicker name="cover_photo" label="Seleccionar imagen" />
        </div>
      )}

      {isEditing && veterinarian && (
        <div className="border-t pt-6">
          <ImageUpload veterinarianId={veterinarian.id} images={galleryImages} />
        </div>
      )}

      <div className="space-y-3 border-t pt-6">
        <SectionHeading icon={Clock}>Horarios de atención</SectionHeading>
        <ScheduleEditor schedules={schedules} />
      </div>

      <div className="flex justify-end pr-6">
        <SubmitButton className="w-[180px]" pendingText="Guardando...">
          {submitLabel}
        </SubmitButton>
      </div>
      </form>
    </div>
  );
}
