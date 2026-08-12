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
  PawPrint,
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
    href: "/admin/lost-pets",
    label: "Mascotas perdidas",
    icon: PawPrint,
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

const LABEL_CLASSES =
  "whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover:opacity-100";

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
    <aside className="group fixed inset-y-0 left-0 z-40 flex w-16 flex-col overflow-hidden border-r bg-white p-3 transition-[width] duration-300 ease-in-out hover:w-64 hover:shadow-xl">
      <Link
        href="/"
        className="mb-8 flex items-center gap-3 px-1 text-xl font-bold text-primary"
      >
        <PawPrint size={26} className="shrink-0 text-violet-600" />
        <span className={LABEL_CLASSES}>VetConnect Admin</span>
      </Link>

      <nav className="flex-1 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted"
            >
              <Icon size={18} className="shrink-0 text-violet-400" />
              <span className={LABEL_CLASSES}>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-left text-destructive hover:bg-muted disabled:opacity-50"
      >
        <LogOut size={18} className="shrink-0" />
        <span className={LABEL_CLASSES}>
          {isLoggingOut ? "Saliendo..." : "Cerrar sesión"}
        </span>
      </button>
    </aside>
  );
}
