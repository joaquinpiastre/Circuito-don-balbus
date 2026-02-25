import Link from "next/link";
import Image from "next/image";
import { getAllEvents } from "@/lib/data";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Eventos y Calendario | Circuito Motocross Don Balbus",
  description: "Próximos eventos y fechas en el Circuito Don Balbus. San Rafael, Mendoza.",
};

function formatDate(d: string) {
  return new Date(d + "T12:00:00").toLocaleDateString("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(t: string | null) {
  if (!t) return "";
  const [h, m] = t.split(":");
  return `${h}:${m}`;
}

export default async function EventosPage() {
  const events = await getAllEvents();

  return (
    <div className="min-h-screen bg-brand-black">
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <h1 className="section-title">Eventos</h1>
          <p className="mt-4 text-gray-400">
            Fechas y competencias en el circuito. Consultá por redes para más info.
          </p>

          {events.length === 0 ? (
            <div className="mt-12 card-racing text-center">
              <p className="text-gray-400">Por ahora no hay eventos cargados.</p>
              <p className="mt-2 text-sm text-gray-500">
                Seguinos en Facebook para enterarte de las próximas fechas.
              </p>
              <a
                href="https://www.facebook.com/p/Circuito-Motocross-Don-Balbus-100057403362304/?locale=es_LA"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary mt-6 inline-block"
              >
                Ver Facebook
              </a>
            </div>
          ) : (
            <ul className="mt-10 space-y-8">
              {events.map((ev) => (
                <li key={ev.id} className="card-racing flex flex-col md:flex-row gap-6">
                  {ev.flyer_url && (
                    <div className="relative h-48 w-full md:w-56 shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={ev.flyer_url}
                        alt={ev.title}
                        fill
                        className="object-cover"
                        sizes="224px"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h2 className="font-display text-xl uppercase text-white">{ev.title}</h2>
                    <p className="mt-2 text-brand-yellow">
                      {formatDate(ev.event_date)}
                      {ev.event_time && ` · ${formatTime(ev.event_time)}`}
                    </p>
                    {ev.description && (
                      <p className="mt-3 text-gray-400">{ev.description}</p>
                    )}
                    {ev.external_link && (
                      <a
                        href={ev.external_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-block text-brand-yellow hover:underline"
                      >
                        Más información →
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
