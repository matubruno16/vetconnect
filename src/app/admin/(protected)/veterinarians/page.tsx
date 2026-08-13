import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteVeterinarian } from "@/features/veterinarians/actions/delete-veterinarian";
import { toggleVeterinarianStatus } from "@/features/veterinarians/actions/toggle-status";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { StatusBadge } from "@/components/shared/status-badge";
import { SubmitButton } from "@/components/shared/submit-button";

export default async function VeterinariansPage() {
  const supabase = await createClient();

  const { data: veterinarians } = await supabase
    .from("veterinarians")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-4xl space-y-6 mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Veterinarias</h1>
          <p className="text-muted-foreground">
            Gestión de veterinarios registrados
          </p>
        </div>

        <Link href="/admin/veterinarians/new">
          <Button>Nueva veterinaria</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado</CardTitle>
        </CardHeader>

        <CardContent>
          {veterinarians?.length === 0 ? (
            <p>No hay veterinarias cargadas.</p>
          ) : (
            <div className="space-y-4">
              {veterinarians?.map((vet) => (
                <div
                  key={vet.id}
                  className="rounded-lg border p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{vet.name}</p>
                    <p className="text-sm text-muted-foreground">{vet.phone}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge isActive={vet.is_active} />

                    <form
                      action={toggleVeterinarianStatus.bind(
                        null,
                        vet.id,
                        vet.is_active,
                      )}
                    >
                      <SubmitButton
                        variant="outline"
                        pendingText={vet.is_active ? "Desactivando..." : "Activando..."}
                      >
                        {vet.is_active ? "Desactivar" : "Activar"}
                      </SubmitButton>
                    </form>

                    <Link href={`/admin/veterinarians/${vet.id}/edit`}>
                      <Button variant="outline">Editar</Button>
                    </Link>

                    <ConfirmDialog
                      trigger={<Button variant="destructive">Eliminar</Button>}
                      title="Eliminar veterinaria"
                      description={`Esta acción borra "${vet.name}" y no se puede deshacer. ¿Confirmás?`}
                      action={deleteVeterinarian.bind(null, vet.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
