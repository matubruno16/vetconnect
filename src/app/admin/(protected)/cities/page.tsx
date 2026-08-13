import { createClient } from "@/lib/supabase/server";
import { createCity, deleteCity } from "@/features/cities/actions";

import { SubmitButton } from "@/components/shared/submit-button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function CitiesPage() {
  const supabase = await createClient();

  const { data: cities } = await supabase
    .from("cities")
    .select("*")
    .order("name", { ascending: true });

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Ciudades</h1>
        <p className="text-muted-foreground">
          Ciudades disponibles para asignar a las veterinarias
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nueva ciudad</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createCity} className="flex flex-wrap items-end gap-3">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nombre
              </label>
              <Input id="name" name="name" required />
            </div>

            <div className="space-y-2">
              <label htmlFor="province" className="text-sm font-medium">
                Provincia
              </label>
              <Input id="province" name="province" />
            </div>

            <div className="space-y-2">
              <label htmlFor="country" className="text-sm font-medium">
                País
              </label>
              <Input id="country" name="country" defaultValue="Argentina" />
            </div>

            <SubmitButton pendingText="Agregando...">Agregar</SubmitButton>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Listado</CardTitle>
        </CardHeader>
        <CardContent>
          {cities?.length === 0 ? (
            <p>No hay ciudades cargadas.</p>
          ) : (
            <div className="space-y-3">
              {cities?.map((city) => (
                <div
                  key={city.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-semibold">{city.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {[city.province, city.country].filter(Boolean).join(", ")}
                    </p>
                  </div>

                  <form action={deleteCity.bind(null, city.id)}>
                    <SubmitButton variant="outline" pendingText="Eliminando...">
                      Eliminar
                    </SubmitButton>
                  </form>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
