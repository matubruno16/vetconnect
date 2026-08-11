import Link from "next/link";
import { PawPrint } from "lucide-react";

export function Navbar() {
  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <PawPrint size={22} className="text-primary" />
          VetConnect
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/perdidos"
            className="text-sm font-medium text-muted-foreground hover:text-amber-600"
          >
            Mascotas perdidas
          </Link>

          <Link
            href="/registrarse"
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Registrar mi veterinaria
          </Link>

          <Link
            href="/admin/login"
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Acceso administradores
          </Link>
        </div>
      </div>
    </header>
  );
}
