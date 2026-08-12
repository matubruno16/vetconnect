import { Building2, Phone, Share2, AlignLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { updateSettings } from "@/features/settings/actions/update-settings";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/shared/submit-button";
import { SectionHeading } from "@/components/forms/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configuración</h1>
        <p className="text-muted-foreground">
          Datos institucionales del colegio — se muestran en el pie de página
          del sitio público
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos generales</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateSettings} className="space-y-8">
            <div className="space-y-4">
              <SectionHeading icon={Building2}>Institución</SectionHeading>

              <div className="space-y-2">
                <label htmlFor="org_name" className="text-sm font-medium">
                  Nombre del colegio
                </label>
                <Input
                  id="org_name"
                  name="org_name"
                  defaultValue={settings?.org_name ?? ""}
                  placeholder="Colegio de Veterinarios de Tandil"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium">
                  Dirección
                </label>
                <Input
                  id="address"
                  name="address"
                  defaultValue={settings?.address ?? ""}
                />
              </div>
            </div>

            <div className="space-y-4">
              <SectionHeading icon={Phone}>Contacto</SectionHeading>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="contact_email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="contact_email"
                    name="contact_email"
                    type="email"
                    defaultValue={settings?.contact_email ?? ""}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact_phone" className="text-sm font-medium">
                    Teléfono
                  </label>
                  <Input
                    id="contact_phone"
                    name="contact_phone"
                    defaultValue={settings?.contact_phone ?? ""}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="contact_whatsapp"
                  className="text-sm font-medium"
                >
                  WhatsApp
                </label>
                <Input
                  id="contact_whatsapp"
                  name="contact_whatsapp"
                  defaultValue={settings?.contact_whatsapp ?? ""}
                />
              </div>
            </div>

            <div className="space-y-4">
              <SectionHeading icon={Share2}>Redes sociales</SectionHeading>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="instagram" className="text-sm font-medium">
                    Instagram
                  </label>
                  <Input
                    id="instagram"
                    name="instagram"
                    defaultValue={settings?.instagram ?? ""}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="facebook" className="text-sm font-medium">
                    Facebook
                  </label>
                  <Input
                    id="facebook"
                    name="facebook"
                    defaultValue={settings?.facebook ?? ""}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <SectionHeading icon={AlignLeft}>Pie de página</SectionHeading>

              <div className="space-y-2">
                <label htmlFor="footer_text" className="text-sm font-medium">
                  Texto institucional
                </label>
                <textarea
                  id="footer_text"
                  name="footer_text"
                  defaultValue={settings?.footer_text ?? ""}
                  placeholder="VetConnect — Cartilla de veterinarios habilitados por el Colegio de Veterinarios."
                  className="min-h-24 w-full rounded-md border px-3 py-2"
                />
              </div>
            </div>

            <SubmitButton pendingText="Guardando...">Guardar cambios</SubmitButton>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
