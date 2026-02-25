import { ContactForm } from "./ContactForm";

const FACEBOOK = "https://www.facebook.com/p/Circuito-Motocross-Don-Balbus-100057403362304/?locale=es_LA";
const WHATSAPP = "5492604674619";

export const metadata = {
  title: "Contacto | Circuito Motocross Don Balbus",
  description:
    "Contacto por WhatsApp +54 260 467-4619 o Facebook. San Rafael, Mendoza.",
};

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-brand-black">
      <section className="py-20">
        <div className="mx-auto max-w-2xl px-4 md:px-6">
          <h1 className="section-title">Contacto</h1>
          <p className="mt-4 text-gray-400">
            Escribinos por WhatsApp o enviá el formulario y te respondemos a la brevedad.
          </p>

          <div className="mt-10 card-racing">
            <h2 className="font-display text-lg uppercase text-brand-yellow">WhatsApp / Teléfono</h2>
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block text-xl text-white hover:text-brand-yellow"
            >
              +54 260 467-4619
            </a>
            <h2 className="mt-6 font-display text-lg uppercase text-brand-yellow">Facebook</h2>
            <a
              href={FACEBOOK}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block text-white hover:text-brand-yellow"
            >
              Circuito Motocross Don Balbus
            </a>
          </div>

          <div className="mt-10 card-racing">
            <h2 className="font-display text-lg uppercase text-brand-yellow">Enviar consulta</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
