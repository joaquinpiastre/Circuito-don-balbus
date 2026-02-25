"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const TEXT_KEYS = [
  { key: "hero_title", label: "Título del hero (home)" },
  { key: "hero_subtitle", label: "Subtítulo del hero" },
  { key: "weather_notice", label: "Aviso clima / cambios" },
  { key: "testimonials", label: "Reseñas de Google (JSON)" },
];

export default function AdminTextosPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const supabase = createClient();

  async function load() {
    const { data } = await supabase.from("site_texts").select("key, value");
    const map: Record<string, string> = {};
    for (const k of TEXT_KEYS) map[k.key] = "";
    for (const row of data || []) {
      const r = row as { key: string; value: string };
      map[r.key] = r.value;
    }
    setValues(map);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  async function save(key: string, value: string) {
    const { error } = await supabase.from("site_texts").upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
    if (error) return showToast("Error: " + error.message);
    setValues((prev) => ({ ...prev, [key]: value }));
    showToast("Guardado");
  }

  if (loading) return <p className="text-gray-400">Cargando...</p>;

  return (
    <div>
      <h1 className="font-display text-2xl uppercase text-white">Textos</h1>
      <p className="mt-2 text-gray-400">Textos editables del sitio (hero, avisos).</p>
      {toast && <p className="mt-4 rounded bg-brand-yellow/20 px-4 py-2 text-brand-yellow">{toast}</p>}
      <div className="mt-8 space-y-6">
        {TEXT_KEYS.map(({ key, label }) => (
          <div key={key} className="card-racing">
            <label className="block font-medium text-gray-300">{label}</label>
            {key === "testimonials" && (
              <p className="mt-1 text-xs text-gray-500">
                Array JSON. Cada item: &quot;author&quot;, &quot;text&quot;, &quot;stars&quot; (1-5), &quot;date&quot; (opcional). Ej: [{`{"author":"Nombre","text":"La reseña...","stars":5,"date":"hace 1 mes"}`}]
              </p>
            )}
            <textarea
              defaultValue={
                key === "testimonials" && !values[key]?.trim()
                  ? '[\n  {"author":"Carlos M.","text":"Excelente circuito, la pista de noche está muy buena iluminada.","stars":5,"date":"hace 2 meses"},\n  {"author":"Juan P.","text":"Muy buena onda el lugar, precios acordes.","stars":5,"date":"hace 1 mes"}\n]'
                  : values[key]
              }
              rows={key === "weather_notice" ? 2 : key === "testimonials" ? 12 : 1}
              className="mt-2 w-full rounded border border-white/20 bg-brand-dark px-3 py-2 text-white font-mono text-sm"
              onBlur={(e) => {
                const v = e.target.value;
                if (v !== values[key]) save(key, v);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
