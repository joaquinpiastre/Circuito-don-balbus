import Link from "next/link";
import Image from "next/image";

const WHATSAPP = "5492604674619";
const FACEBOOK = "https://www.facebook.com/p/Circuito-Motocross-Don-Balbus-100057403362304/?locale=es_LA";

export function Footer() {
  return (
    <footer className="border-t border-brand-yellow/20 bg-brand-graphite">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-8 sm:py-10">
        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Image
              src="/Logo.png"
              alt="Circuito Motocross Don Balbus"
              width={160}
              height={50}
              className="h-10 w-auto"
            />
            <p className="mt-3 text-sm text-gray-400">
              Circuito de motocross en Las Paredes, San Rafael, Mendoza.
            </p>
          </div>
          <div>
            <h4 className="font-display text-sm uppercase tracking-wider text-brand-yellow">
              Horarios
            </h4>
            <p className="mt-2 text-sm text-gray-400">
              Ver horarios en la web
            </p>
          </div>
          <div>
            <h4 className="font-display text-sm uppercase tracking-wider text-brand-yellow">
              Contacto
            </h4>
            <p className="mt-2 text-sm text-gray-400">
              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-red hover:text-brand-yellow transition-colors"
              >
                +54 260 467-4619
              </a>
            </p>
            <p className="mt-1 text-sm text-gray-400">
              Sardini y Calle 9, Las Paredes
            </p>
          </div>
          <div>
            <h4 className="font-display text-sm uppercase tracking-wider text-brand-yellow">
              Redes
            </h4>
            <p className="mt-2">
              <a
                href={FACEBOOK}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-400 hover:text-brand-yellow transition-colors"
              >
                Facebook
              </a>
            </p>
          </div>
        </div>
        <div className="mt-8 sm:mt-10 flex flex-col items-center justify-between gap-4 border-t border-brand-yellow/10 pt-6 sm:pt-8 md:flex-row text-center md:text-left">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Circuito Motocross Don Balbus. San Rafael, Mendoza.
          </p>
          <div className="flex gap-6 text-xs text-gray-500">
            <Link href="/contacto" className="hover:text-brand-yellow transition-colors">
              Contacto
            </Link>
            <span>·</span>
            <span>Créditos: sitio desarrollado para el circuito.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
