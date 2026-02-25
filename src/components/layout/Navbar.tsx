"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/la-pista", label: "La Pista" },
  { href: "/horarios-tarifas", label: "Horarios & Tarifas" },
  { href: "/eventos", label: "Eventos" },
  { href: "/galeria", label: "Galería" },
  { href: "/como-llegar", label: "Cómo llegar" },
  { href: "/contacto", label: "Contacto" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-brand-yellow/40 bg-brand-black/98 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8 md:py-4">
        <Link href="/" className="flex items-center shrink-0 min-h-[60px] md:min-h-[80px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Logo.png"
            alt="Circuito Motocross Don Balbus"
            className="h-16 w-auto sm:h-20 md:h-24 lg:h-[88px] object-contain object-left"
            width={320}
            height={100}
          />
        </Link>

        <ul className="hidden items-center gap-2 lg:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`rounded-lg px-4 py-3 text-base font-display uppercase tracking-wider font-medium transition-colors whitespace-nowrap ${
                  pathname === href
                    ? "bg-brand-red/25 text-brand-yellow"
                    : "text-gray-300 hover:bg-brand-yellow/10 hover:text-brand-yellow"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="lg:hidden flex flex-col gap-2 p-3 text-brand-yellow"
          onClick={() => setOpen(!open)}
          aria-label="Menú"
        >
          <span className={`block h-1 w-7 bg-current transition-transform ${open ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block h-1 w-7 bg-current transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`block h-1 w-7 bg-current transition-transform ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-brand-yellow/20 bg-brand-graphite lg:hidden"
          >
            <ul className="flex flex-col px-4 py-4">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`block rounded-lg px-4 py-3.5 text-base font-display uppercase tracking-wider font-medium ${
                      pathname === href ? "text-brand-yellow" : "text-gray-300"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
