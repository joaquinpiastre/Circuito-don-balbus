"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { GalleryImage } from "@/lib/types";

const BUCKET = "gallery";

export default function AdminGaleriaPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const supabase = createClient();

  async function load() {
    const { data } = await supabase.from("gallery").select("*").order("sort_order");
    setImages((data as GalleryImage[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  async function remove(id: string, storagePath: string) {
    if (!confirm("¿Borrar esta imagen?")) return;
    await supabase.storage.from(BUCKET).remove([storagePath]);
    await supabase.from("gallery").delete().eq("id", id);
    showToast("Borrada");
    load();
  }

  if (loading) return <p className="text-gray-400">Cargando...</p>;

  return (
    <div>
      <h1 className="font-display text-2xl uppercase text-white">Galería</h1>
      <p className="mt-2 text-sm text-gray-400">Solo vista. Las fotos nuevas las agrega el programador.</p>
      {toast && <p className="mt-4 rounded bg-brand-yellow/20 px-4 py-2 text-brand-yellow">{toast}</p>}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {images.map((img) => (
          <div key={img.id} className="card-racing relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded">
              <Image
                src={img.public_url || ""}
                alt={img.caption || img.category}
                fill
                className="object-cover"
                sizes="200px"
              />
            </div>
            <p className="mt-2 text-xs text-gray-400">{img.category}</p>
            <button type="button" onClick={() => remove(img.id, img.storage_path)} className="mt-2 text-sm text-red-400 hover:underline">Borrar</button>
          </div>
        ))}
      </div>
      {images.length === 0 && <p className="mt-8 text-gray-500">No hay imágenes en la galería.</p>}
    </div>
  );
}
