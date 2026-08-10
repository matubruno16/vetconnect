import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RegisterThanksPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-6">
      <div className="max-w-md space-y-4 rounded-2xl border bg-card p-10 text-center shadow-sm">
        <CheckCircle2 className="mx-auto text-primary" size={40} />
        <h1 className="text-2xl font-bold">¡Solicitud enviada!</h1>
        <p className="text-muted-foreground">
          El colegio va a revisar tus datos y activar tu ficha en la cartilla
          en los próximos días.
        </p>
        <Link href="/">
          <Button variant="outline">Volver al inicio</Button>
        </Link>
      </div>
    </main>
  );
}
