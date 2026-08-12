import { createClient } from "@/lib/supabase/server";
import { createLostPet } from "@/features/lost-pets/actions/create-lost-pet";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/shared/submit-button";
import { SectionHeading } from "@/components/forms/section-heading";
import { FilePicker } from "@/components/forms/file-picker";
import LocationPicker from "@/components/maps/location-picker-loader";
import { PawPrint, Phone } from "lucide-react";
import { PET_SPECIES } from "@/constants/pet-species";

export default async function ReportLostPetPage() {
  const supabase = await createClient();
  const { data: cities } = await supabase.from("cities").select("*");

  return (
    <main className="min-h-screen bg-muted/30">
      <section className="mx-auto max-w-2xl px-6 py-16 lg:max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">
            Reportar mascota perdida
          </h1>
          <p className="mt-3 text-muted-foreground">
            Completá los datos y se publica al instante en el mural de
            mascotas perdidas — cuantos más detalles, más fácil es que alguien
            la reconozca.
          </p>
        </div>

        <form
          action={createLostPet}
          className="space-y-8 rounded-2xl border bg-card p-8 shadow-sm"
        >
          <div className="space-y-4">
            <SectionHeading icon={PawPrint}>Datos de la mascota</SectionHeading>

            <div className="grid gap-4 sm:grid-cols-2 px-6">
              <div className="space-y-2">
                <label htmlFor="pet_name" className="text-sm font-medium">
                  Nombre
                </label>
                <Input id="pet_name" name="pet_name" required />
              </div>

              <div className="space-y-2">
                <label htmlFor="species" className="text-sm font-medium">
                  Especie
                </label>
                <select
                  id="species"
                  name="species"
                  className="w-full rounded-md border pl-3 pr-6 h-8 text-sm"
                  required
                >
                  {PET_SPECIES.map((species) => (
                    <option key={species} value={species}>
                      {species}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 px-6">
              <div className="space-y-2">
                <label htmlFor="breed" className="text-sm font-medium">
                  Raza
                </label>
                <Input id="breed" name="breed" />
              </div>

              <div className="space-y-2">
                <label htmlFor="color" className="text-sm font-medium">
                  Color
                </label>
                <Input id="color" name="color" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Señas particulares
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Tamaño, collar, alguna marca o cicatriz, comportamiento..."
                className="min-h-24 w-full rounded-md border px-3 py-2"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 px-6">
              <div className="space-y-2">
                <label
                  htmlFor="last_seen_location"
                  className="text-sm font-medium"
                >
                  Dónde se perdió
                </label>
                <Input id="last_seen_location" name="last_seen_location" required />
              </div>

              <div className="space-y-2">
                <label htmlFor="last_seen_date" className="text-sm font-medium">
                  Fecha
                </label>
                <Input id="last_seen_date" name="last_seen_date" type="date" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="city_id" className="text-sm font-medium">
                Ciudad
              </label>
              <select
                id="city_id"
                name="city_id"
                className="w-full rounded-md border px-3 h-8 text-sm"
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
              <h2 className="text-sm font-medium">Ubicación exacta (opcional)</h2>
              <LocationPicker defaultLatitude={null} defaultLongitude={null} />
            </div>

            <div className="space-y-2">
              <h2 className="text-sm font-medium">Foto</h2>
              <FilePicker name="photo" label="Seleccionar foto" />
            </div>
          </div>

          <div className="space-y-4">
            <SectionHeading icon={Phone}>Datos de contacto</SectionHeading>

            <div className="space-y-2">
              <label htmlFor="contact_name" className="text-sm font-medium">
                Nombre
              </label>
              <Input id="contact_name" name="contact_name" required />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 px-6">
              <div className="space-y-2">
                <label htmlFor="contact_phone" className="text-sm font-medium">
                  Teléfono
                </label>
                <Input
                  id="contact_phone"
                  name="contact_phone"
                  autoComplete="tel"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="contact_whatsapp" className="text-sm font-medium">
                  WhatsApp
                </label>
                <Input id="contact_whatsapp" name="contact_whatsapp" />
              </div>
            </div>
          </div>

          <SubmitButton className="w-full" pendingText="Publicando...">
            Publicar aviso
          </SubmitButton>
        </form>
      </section>
    </main>
  );
}
