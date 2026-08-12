import Link from "next/link";
import { Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { deleteLostPet } from "@/features/lost-pets/actions/delete-lost-pet";
import { toggleLostPetStatus } from "@/features/lost-pets/actions/toggle-lost-pet-status";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { SubmitButton } from "@/components/shared/submit-button";

export default async function AdminLostPetsPage() {
  const supabase = await createClient();

  const { data: pets } = await supabase
    .from("lost_pets")
    .select("*, cities (name)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mascotas perdidas</h1>
        <p className="text-muted-foreground">
          Moderá los avisos publicados por la comunidad
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado</CardTitle>
        </CardHeader>
        <CardContent>
          {pets?.length === 0 ? (
            <p>No hay avisos cargados.</p>
          ) : (
            <div className="space-y-4">
              {pets?.map((pet) => (
                <div
                  key={pet.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4"
                >
                  <div>
                    <p className="flex items-center gap-2 font-semibold">
                      {pet.pet_name}
                      {pet.found_reported_at && (
                        <Badge className="bg-violet-100 text-violet-700">
                          <Bell size={12} />
                          Avisaron que la encontraron
                        </Badge>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {pet.last_seen_location}
                      {pet.cities?.name ? ` — ${pet.cities.name}` : ""} ·{" "}
                      {pet.contact_name} ({pet.contact_phone})
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge
                      variant="secondary"
                      className={
                        pet.status === "found"
                          ? "bg-violet-100 text-violet-700"
                          : "bg-amber-100 text-amber-700"
                      }
                    >
                      {pet.status === "found" ? "Encontrada" : "Perdida"}
                    </Badge>

                    <form
                      action={toggleLostPetStatus.bind(null, pet.id, pet.status)}
                    >
                      <SubmitButton variant="outline" pendingText="Guardando...">
                        {pet.status === "found"
                          ? "Marcar como perdida"
                          : "Marcar como encontrada"}
                      </SubmitButton>
                    </form>

                    <Link href={`/perdidos/${pet.id}`} target="_blank">
                      <Button variant="outline">Ver ficha</Button>
                    </Link>

                    <ConfirmDialog
                      trigger={<Button variant="destructive">Eliminar</Button>}
                      title="Eliminar aviso"
                      description={`Esta acción borra el aviso de "${pet.pet_name}" y no se puede deshacer. ¿Confirmás?`}
                      action={deleteLostPet.bind(null, pet.id, pet.image_url)}
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
