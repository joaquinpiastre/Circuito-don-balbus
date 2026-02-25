import { getGallery } from "@/lib/data";
import { GalleryGrid } from "./GalleryGrid";

export const metadata = {
  title: "Galería | Circuito Motocross Don Balbus",
  description: "Fotos del circuito, entrenamientos y eventos. Don Balbus, San Rafael.",
};

const CATEGORIES = [
  { id: "", label: "Todas" },
  { id: "nocturno", label: "Nocturno" },
  { id: "entrenamientos", label: "Entrenamientos" },
  { id: "eventos", label: "Eventos" },
];

export default async function GaleriaPage() {
  const images = await getGallery();

  return (
    <div className="min-h-screen bg-brand-black">
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h1 className="section-title">Galería</h1>
          <p className="mt-4 text-gray-400">
            Fotos de la pista, entrenamientos y eventos.
          </p>
          <GalleryGrid initialImages={images} categories={CATEGORIES} />
        </div>
      </section>
    </div>
  );
}
