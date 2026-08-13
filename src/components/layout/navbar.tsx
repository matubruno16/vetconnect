"use client";

import { useState } from "react";
import Link from "next/link";
import { PawPrint, Menu, X } from "lucide-react";

const links = [
  {
    href: "/perdidos",
    label: "Mascotas perdidas",
    hoverClass: "hover:text-amber-600",
  },
  {
    href: "/registrarse",
    label: "Registrar mi veterinaria",
    hoverClass: "hover:text-primary",
  },
  {
    href: "/admin/login",
    label: "Acceso administradores",
    hoverClass: "hover:text-primary",
  },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative border-b bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg"
          onClick={() => setOpen(false)}
        >
          <PawPrint size={22} className="text-primary" />
          VetConnect
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium text-muted-foreground ${link.hoverClass}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          className="relative flex h-9 w-9 items-center justify-center rounded-md text-foreground transition hover:bg-muted md:hidden"
        >
          <Menu
            size={22}
            className={`absolute transition-all duration-200 ${
              open ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
            }`}
          />
          <X
            size={22}
            className={`absolute transition-all duration-200 ${
              open ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
            }`}
          />
        </button>
      </div>

      <nav
        className={`overflow-hidden border-t transition-[max-height,opacity] duration-300 ease-in-out md:hidden ${
          open ? "max-h-60 opacity-100" : "max-h-0 border-t-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-1 px-6 py-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`rounded-md px-2 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-muted/60 ${link.hoverClass}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
