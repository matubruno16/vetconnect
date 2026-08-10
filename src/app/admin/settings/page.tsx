import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configuración</h1>
        <p className="text-muted-foreground">Ajustes generales del sitio</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Próximamente</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p>
            Configuraciones generales del colegio (datos de contacto, redes,
            textos institucionales) se agregan en la próxima etapa.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
