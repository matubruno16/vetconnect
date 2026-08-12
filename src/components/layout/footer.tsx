import { createClient } from "@/lib/supabase/server";

export async function Footer() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  const footerText =
    settings?.footer_text ||
    "VetConnect — Cartilla de veterinarios habilitados por el Colegio de Veterinarios.";

  const contactLine = [
    settings?.org_name,
    settings?.address,
    settings?.contact_phone,
    settings?.contact_email,
  ]
    .filter(Boolean)
    .join(" · ");

  const socialLinks = [
    settings?.instagram && {
      label: "Instagram",
      href: `https://instagram.com/${settings.instagram.replace("@", "")}`,
    },
    settings?.facebook && { label: "Facebook", href: settings.facebook },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <footer className="border-t bg-card">
      <div className="mx-auto max-w-6xl space-y-2 px-6 py-8 text-sm text-muted-foreground">
        <p>{footerText}</p>
        {contactLine && <p>{contactLine}</p>}
        {socialLinks.length > 0 && (
          <p className="flex gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                {link.label}
              </a>
            ))}
          </p>
        )}
      </div>
    </footer>
  );
}
