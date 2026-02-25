import Image from "next/image";
import Link from "next/link";
import { getSchedulesFormatted, getPrices, formatPrice, getSiteTexts, getGallery, getUpcomingEvents, getGoogleReviews } from "@/lib/data";
import { Button } from "@/components/ui/Button";

const WHATSAPP = "5492604674619";
const FACEBOOK = "https://www.facebook.com/p/Circuito-Motocross-Don-Balbus-100057403362304/?locale=es_LA";

export default async function HomePage() {
  const [texts, schedules, prices, gallery, events, reviews] = await Promise.all([
    getSiteTexts(["hero_title", "hero_subtitle", "weather_notice"]),
    getSchedulesFormatted(),
    getPrices(),
    getGallery(),
    getUpcomingEvents(),
    getGoogleReviews(),
  ]);
  const heroTitle =
    texts.hero_title === "Motocross Nocturno en San Rafael" || !texts.hero_title
      ? "Circuito Don Balbus en San Rafael"
      : texts.hero_title;
  const heroSubtitle =
    texts.hero_subtitle === "Pista iluminada en Las Paredes" || !texts.hero_subtitle
      ? "Entrenamientos en Las Paredes"
      : texts.hero_subtitle;
  const weatherNotice = texts.weather_notice || "Sujeto a cambios por clima o eventos. Consultá antes de venir.";
  const firstImages = gallery.slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero con imagen de fondo */}
      <section className="relative min-h-[70vh] sm:min-h-[80vh] md:min-h-[85vh] flex flex-col items-center justify-center overflow-hidden bg-brand-black">
        <Image
          src="/imagen_fondo.jpg"
          alt=""
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-4 py-12 sm:py-16 md:py-20 text-center">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl uppercase tracking-wider text-white drop-shadow-[0_0_20px_rgba(255,208,0,0.3)] max-w-4xl">
            {heroTitle}
          </h1>
          <p className="mt-3 sm:mt-4 text-lg sm:text-xl md:text-2xl text-gray-200 max-w-2xl px-2">{heroSubtitle}</p>
          <div className="mt-6 sm:mt-8 md:mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-base sm:text-lg px-4 py-2.5 sm:px-6 sm:py-3"
            >
              Escribinos por WhatsApp
            </a>
            <Button href="/horarios-tarifas" variant="secondary" className="text-base sm:text-lg px-4 py-2.5 sm:px-6 sm:py-3">
              Ver Horarios
            </Button>
          </div>
        </div>
      </section>

      {/* Horarios + Tarifas */}
      <section className="border-t border-brand-yellow/10 bg-brand-graphite py-10 sm:py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <h2 className="section-title text-center text-2xl sm:text-3xl md:text-4xl">Horarios de apertura</h2>
          <p className="mt-3 sm:mt-4 text-center text-gray-400 text-sm sm:text-base px-2">
            Consultá los horarios actuales; a veces abrimos también sábado a la tarde.
          </p>
          <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-4 sm:gap-6">
            {schedules.map((s, i) => (
              <div key={`${s.day}-${s.time}-${i}`} className="card-racing min-w-[140px] sm:min-w-[200px] text-center p-4 sm:p-6">
                <p className="font-display text-xl uppercase text-brand-yellow">{s.day}</p>
                <p className="mt-1 text-white">{s.time}</p>
                {s.label && <p className="mt-1 text-sm text-gray-500">{s.label}</p>}
              </div>
            ))}
          </div>
          <div className="mt-12">
            <h3 className="section-title text-center text-2xl">Tarifas</h3>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              {prices.map((p) => (
                <div key={p.id} className="card-racing">
                  <p className="text-gray-400">{p.name}</p>
                  <p className="font-display text-2xl text-brand-yellow">{formatPrice(p.amount_cents)}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-center text-sm text-gray-500">{weatherNotice}</p>
          </div>
        </div>
      </section>

      {/* Mapa mini */}
      <section className="border-t border-brand-yellow/10 bg-brand-black py-10 sm:py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <h2 className="section-title text-center">Ubicación</h2>
          <p className="mt-3 sm:mt-4 text-center text-gray-400 text-sm sm:text-base px-2">
            Sardini y Calle 9, Las Paredes, San Rafael. Ingresando por Sardini, izquierda por Calle 4, 800 m.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/como-llegar" className="btn-secondary">
              Cómo llegar
            </Link>
          </div>
        </div>
      </section>

      {/* Mini galería */}
      <section className="border-t border-brand-yellow/10 bg-brand-graphite py-10 sm:py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <h2 className="section-title text-center">Galería</h2>
          <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
            {firstImages.length > 0 ? (
              firstImages.map((img) => (
                <Link key={img.id} href="/galeria" className="block overflow-hidden rounded-lg">
                  <Image
                    src={img.public_url || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80"}
                    alt={img.caption || "Circuito Don Balbus"}
                    width={400}
                    height={300}
                    className="h-36 sm:h-44 md:h-48 w-full object-cover transition-transform hover:scale-105"
                  />
                </Link>
              ))
            ) : (
              [...Array(6)].map((_, i) => (
                <div key={i} className="h-36 sm:h-44 md:h-48 rounded-lg bg-brand-dark flex items-center justify-center text-gray-500 text-sm">
                  <span>Foto {i + 1}</span>
                </div>
              ))
            )}
          </div>
          <div className="mt-8 text-center">
            <Button href="/galeria" variant="secondary">
              Ver galería completa
            </Button>
          </div>
        </div>
      </section>

      {/* Reseñas (estilo Google) */}
      <section className="border-t border-brand-yellow/10 bg-brand-black py-10 sm:py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <h2 className="section-title text-center">Lo que dicen</h2>
          <p className="mt-2 text-center text-sm text-gray-500">Reseñas de Google</p>
          <div className="mt-6 sm:mt-8 md:mt-10 grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, i) => (
              <article
                key={i}
                className="card-racing flex flex-col border-brand-yellow/20"
              >
                <div className="flex gap-1 text-brand-yellow" aria-label={`${review.stars} de 5 estrellas`}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="h-5 w-5 shrink-0"
                      fill={star <= review.stars ? "currentColor" : "none"}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  ))}
                </div>
                <p className="mt-4 flex-1 text-gray-300 leading-relaxed">&ldquo;{review.text}&rdquo;</p>
                <footer className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="font-medium text-white">{review.author}</span>
                  {review.date && <span className="text-sm text-gray-500">{review.date}</span>}
                </footer>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="border-t border-brand-yellow/10 bg-brand-graphite py-10 sm:py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 text-center">
          <h2 className="section-title text-2xl sm:text-3xl md:text-4xl">¿Dudas?</h2>
          <p className="mt-3 sm:mt-4 text-gray-400 text-sm sm:text-base">Escribinos por WhatsApp o seguinos en Facebook.</p>
          <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-3 sm:gap-4">
            <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="btn-primary">
              WhatsApp
            </a>
            <a href={FACEBOOK} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              Facebook
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
