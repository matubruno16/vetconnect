import { createClient } from "@/lib/supabase/server";
import { registerVeterinarian } from "@/features/veterinarians/actions/register-veterinarian";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/shared/submit-button";
import LocationPicker from "@/components/maps/location-picker-loader";

export default async function RegisterPage() {
  const supabase = await createClient();
  const { data: cities } = await supabase.from("cities").select("*");

  return (
    <main className="min-h-screen bg-muted/30">
      <section className="mx-auto max-w-2xl px-6 py-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">
            Registrar mi veterinaria
          </h1>
          <p className="mt-3 text-muted-foreground">
            Completá tus datos. El colegio va a revisar la solicitud antes de
            publicarla en la cartilla.
          </p>
        </div>

        <form
          action={registerVeterinarian}
          className="space-y-6 rounded-2xl border bg-card p-8 shadow-sm"
        >
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nombre de la veterinaria
            </label>
            <Input id="name" name="name" autoComplete="organization" required />
          </div>

          <div className="space-y-2">
            <label htmlFor="license_number" className="text-sm font-medium">
              Matrícula
            </label>
            <Input id="license_number" name="license_number" required />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              className="min-h-28 w-full rounded-md border px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input id="email" name="email" type="email" required />
          </div>

          <div className="space-y-2">
            <label htmlFor="whatsapp" className="text-sm font-medium">
              WhatsApp
            </label>
            <Input id="whatsapp" name="whatsapp" />
          </div>

          <div className="space-y-2">
            <label htmlFor="website" className="text-sm font-medium">
              Website
            </label>
            <Input id="website" name="website" />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Teléfono
            </label>
            <Input id="phone" name="phone" autoComplete="tel" required />
          </div>

          <div className="space-y-2">
            <label htmlFor="address" className="text-sm font-medium">
              Dirección
            </label>
            <Input
              id="address"
              name="address"
              autoComplete="street-address"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="city_id" className="text-sm font-medium">
              Ciudad
            </label>
            <select
              id="city_id"
              name="city_id"
              className="w-full rounded-md border px-3 py-2"
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
            <h2 className="text-sm font-medium">Ubicación</h2>
            <LocationPicker defaultLatitude={null} defaultLongitude={null} />
          </div>

          <SubmitButton className="w-full" pendingText="Enviando...">
            Enviar solicitud
          </SubmitButton>
        </form>
      </section>
    </main>
  );
}
