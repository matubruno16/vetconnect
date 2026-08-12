import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { deleteAdmin } from "@/features/admin-users/actions/delete-admin";
import { InviteAdminForm } from "@/components/forms/invite-admin-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";

export default async function UsersPage() {
  const supabase = await createClient();
  const { data: sessionData } = await supabase.auth.getUser();
  const currentUserId = sessionData.user?.id;

  let users: User[] = [];
  let listError: string | null = null;

  try {
    const admin = createAdminClient();
    const { data, error } = await admin.auth.admin.listUsers();

    if (error) {
      listError = error.message;
    } else {
      users = data.users;
    }
  } catch (err) {
    listError = err instanceof Error ? err.message : "Error inesperado.";
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Usuarios</h1>
        <p className="text-muted-foreground">
          Administradores con acceso al panel
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invitar administrador</CardTitle>
        </CardHeader>
        <CardContent>
          <InviteAdminForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Listado</CardTitle>
        </CardHeader>
        <CardContent>
          {listError ? (
            <p className="text-sm text-destructive">
              No se pudo cargar la lista: {listError}
            </p>
          ) : users.length === 0 ? (
            <p>No hay usuarios.</p>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4"
                >
                  <div>
                    <p className="font-semibold">{user.email}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.email_confirmed_at
                        ? "Confirmado"
                        : "Invitación pendiente"}{" "}
                      · Creado{" "}
                      {new Date(user.created_at).toLocaleDateString("es-AR")}
                      {user.last_sign_in_at &&
                        ` · Último ingreso ${new Date(
                          user.last_sign_in_at,
                        ).toLocaleDateString("es-AR")}`}
                    </p>
                  </div>

                  {user.id !== currentUserId && (
                    <ConfirmDialog
                      trigger={<Button variant="destructive">Eliminar</Button>}
                      title="Eliminar administrador"
                      description={`"${user.email}" ya no va a poder acceder al panel. ¿Confirmás?`}
                      action={deleteAdmin.bind(null, user.id)}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
