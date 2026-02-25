"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { GalleryImage } from "@/lib/types";

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80";

type Category = { id: string; label: string };

export function GalleryGrid({
  initialImages,
  categories,
}: {
  initialImages: GalleryImage[];
  categories: Category[];
}) {
  const [filter, setFilter] = useState("");
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);

  const filtered = useMemo(() => {
    if (!filter) return initialImages;
    return initialImages.filter((img) => img.category === filter);
  }, [initialImages, filter]);

  return (
    <>
      <div className="mt-8 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setFilter(c.id)}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
              filter === c.id
                ? "border-brand-yellow bg-brand-yellow/20 text-brand-yellow"
                : "border-white/20 text-gray-400 hover:border-white/40 hover:text-white"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-12 text-center text-gray-500">No hay imágenes en esta categoría.</p>
      ) : (
        <motion.div
          layout
          className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((img, i) => (
              <motion.button
                key={img.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.03 }}
                type="button"
                className="relative aspect-[4/3] overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                onClick={() => setLightbox(img)}
              >
                <Image
                  src={img.public_url || PLACEHOLDER_IMAGE}
                  alt={img.caption || "Circuito Don Balbus"}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lightbox-overlay"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-h-[90vh] max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={lightbox.public_url || "/placeholder.jpg"}
                alt={lightbox.caption || "Circuito Don Balbus"}
                width={1200}
                height={900}
                className="max-h-[90vh] w-auto rounded-lg object-contain"
              />
              {lightbox.caption && (
                <p className="mt-2 text-center text-sm text-gray-400">{lightbox.caption}</p>
              )}
              <button
                type="button"
                className="absolute -top-12 right-0 rounded bg-white/10 px-3 py-1 text-white hover:bg-white/20"
                onClick={() => setLightbox(null)}
              >
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
