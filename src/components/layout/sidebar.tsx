"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Building2,
  MapPin,
  Stethoscope,
  Users,
  Settings,
  LogOut,
} from "lucide-react";

const links = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/veterinarians",
    label: "Veterinarias",
    icon: Building2,
  },
  {
    href: "/admin/cities",
    label: "Ciudades",
    icon: MapPin,
  },
  {
    href: "/admin/specialties",
    label: "Especialidades",
    icon: Stethoscope,
  },
  {
    href: "/admin/users",
    label: "Usuarios",
    icon: Users,
  },
  {
    href: "/admin/settings",
    label: "Configuración",
    icon: Settings,
  },
];

export function Sidebar() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <aside className="flex w-64 flex-col border-r bg-white p-4">
      <a href="/" className="mb-8 text-xl font-bold text-primary">
        VetConnect Admin
      </a>

      <nav className="flex-1 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted"
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-left text-destructive hover:bg-muted disabled:opacity-50"
      >
        <LogOut size={18} />
        {isLoggingOut ? "Saliendo..." : "Cerrar sesión"}
      </button>
    </aside>
  );
}