export const metadata = {
  title: "Cómo llegar | Circuito Motocross Don Balbus",
  description:
    "Ubicación: Sardini y Calle 9, Las Paredes, San Rafael. Ingresando por Sardini, izquierda por Calle 4, 800 m.",
};

export default function ComoLlegarPage() {
  return (
    <div className="min-h-screen bg-brand-black">
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <h1 className="section-title">Cómo llegar</h1>
          <p className="mt-4 text-gray-400">
            Distrito Las Paredes, San Rafael, Mendoza.
          </p>

          <div className="mt-8 card-racing">
            <h2 className="font-display text-lg uppercase text-brand-yellow">Dirección</h2>
            <p className="mt-2 text-white">
              Sardini y Calle 9 (o Zardini según referencias). Las Paredes, San Rafael.
            </p>
            <h2 className="mt-6 font-display text-lg uppercase text-brand-yellow">Instrucciones</h2>
            <p className="mt-2 text-gray-300">
              Ingresando por calle Sardini, girar a la izquierda por calle 4 y avanzar aprox. 800 m
              hacia adentro.
            </p>
          </div>

          <div className="mt-10 aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-brand-dark">
            <iframe
              title="Mapa Circuito Don Balbus"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d52588.5!2d-68.35!3d-34.61!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM2JzM2LjAiUyA2OMKwMjEnMDAuMCJX!5e0!3m2!1ses!2sar!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full"
            />
            <p className="p-4 text-center text-sm text-gray-500">
              Mapa de referencia. Para el punto exacto consultá por WhatsApp.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
