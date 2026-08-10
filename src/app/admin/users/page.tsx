import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UsersPage() {
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
          <CardTitle>Próximamente</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p>
            La gestión de usuarios admin (invitar, dar de baja, cambiar
            permisos) requiere la Service Role Key de Supabase, todavía no
            configurada. Se habilita en la próxima etapa.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
