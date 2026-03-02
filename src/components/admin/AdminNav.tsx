"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  const links = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/horarios", label: "Horarios" },
    { href: "/admin/tarifas", label: "Tarifas" },
    { href: "/admin/eventos", label: "Eventos" },
    { href: "/admin/galeria", label: "Galería" },
    { href: "/admin/contactos", label: "Contactos" },
    { href: "/admin/campanas", label: "Campañas" },
    { href: "/admin/textos", label: "Textos" },
  ];

  return (
    <header className="border-b border-white/10 bg-brand-black">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <nav className="flex gap-4">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm ${pathname === href ? "text-brand-yellow" : "text-gray-400 hover:text-white"}`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-gray-400 hover:text-white">
            Ver sitio
          </Link>
          <button type="button" onClick={signOut} className="text-sm text-gray-400 hover:text-white">
            Salir
          </button>
        </div>
      </div>
    </header>
  );
}
