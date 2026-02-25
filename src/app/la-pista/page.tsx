import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "La Pista | Circuito Motocross Don Balbus",
  description:
    "Conocé el circuito Don Balbus: trazado, iluminación y espacios para preparación. San Rafael, Mendoza.",
};

export default function LaPistaPage() {
  return (
    <div className="min-h-screen bg-brand-black">
      <section className="relative py-20">
        <div className="absolute inset-0 bg-tire-pattern opacity-30" />
        <div className="relative mx-auto max-w-3xl px-4 md:px-6">
          <h1 className="section-title">La Pista</h1>
          <p className="mt-6 text-gray-300 leading-relaxed">
            El Circuito Don Balbus está en Las Paredes, San Rafael. La pista se mantiene para que la circulación
            sea segura y cuenta con iluminación para los horarios de noche. Abrimos según el calendario (consultá la sección Horarios).
          </p>
          <p className="mt-4 text-gray-300 leading-relaxed">
            Hay espacios para preparación de motos y zona de boxes. Si querés más detalles sobre
            medidas del trazado o condiciones puntuales, consultanos por WhatsApp o Facebook.
          </p>
          <ul className="mt-8 space-y-2 text-gray-300">
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand-yellow" />
              Iluminación para horarios de noche
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand-yellow" />
              Trazado preparado para entrenamientos
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand-yellow" />
              Espacios para preparación
            </li>
          </ul>
          <div className="mt-12 flex flex-wrap gap-4">
            <Button href="/galeria" variant="primary">
              Ver galería
            </Button>
            <Button href="/contacto" variant="secondary">
              Contacto
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
