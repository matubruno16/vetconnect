import { createClient } from "@/lib/supabase/server";
import { createSpecialty, deleteSpecialty } from "@/features/specialties/actions";

import { SubmitButton } from "@/components/shared/submit-button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SpecialtiesPage() {
  const supabase = await createClient();

  const { data: specialties } = await supabase
    .from("specialties")
    .select("*")
    .order("name", { ascending: true });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Especialidades</h1>
        <p className="text-muted-foreground">
          Especialidades disponibles para asignar a las veterinarias
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nueva especialidad</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action={createSpecialty}
            className="flex flex-wrap items-end gap-3"
          >
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nombre
              </label>
              <Input id="name" name="name" required />
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
          {specialties?.length === 0 ? (
            <p>No hay especialidades cargadas.</p>
          ) : (
            <div className="space-y-3">
              {specialties?.map((specialty) => (
                <div
                  key={specialty.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <p className="font-semibold">{specialty.name}</p>

                  <form action={deleteSpecialty.bind(null, specialty.id)}>
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
