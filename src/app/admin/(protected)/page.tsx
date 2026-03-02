import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="font-display text-2xl uppercase text-white">Panel Admin</h1>
      <p className="mt-2 text-gray-400">Editá horarios, tarifas, eventos, galería y textos.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { href: "/admin/horarios", label: "Horarios", desc: "Días y horarios (nocturno y diurno, ej. sábado tarde)" },
          { href: "/admin/tarifas", label: "Tarifas", desc: "Precios por moto y acompañante" },
          { href: "/admin/eventos", label: "Eventos", desc: "Calendario y competencias" },
          { href: "/admin/galeria", label: "Galería", desc: "Fotos por categoría" },
          { href: "/admin/contactos", label: "Contactos", desc: "Números de teléfono para mensajes; importar Excel sin duplicados" },
          { href: "/admin/campanas", label: "Campañas", desc: "Crear campañas con nombre y mensaje para envíos" },
          { href: "/admin/textos", label: "Textos", desc: "Hero, avisos de clima" },
        ].map(({ href, label, desc }) => (
          <Link
            key={href}
            href={href}
            className="card-racing block transition hover:border-brand-yellow/50"
          >
            <h2 className="font-display text-lg text-brand-yellow">{label}</h2>
            <p className="mt-2 text-sm text-gray-400">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
