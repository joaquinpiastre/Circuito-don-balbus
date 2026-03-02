"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Campaign } from "@/lib/types";

export default function AdminCampanasPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [editing, setEditing] = useState<Campaign | null>(null);
  const supabase = createClient();

  async function load() {
    const { data } = await supabase.from("campaigns").select("*").order("created_at", { ascending: false });
    setCampaigns((data as Campaign[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  async function save(row: { name: string; message_text?: string | null }) {
    const payload = {
      name: row.name.trim(),
      message_text: row.message_text?.trim() || null,
      updated_at: new Date().toISOString(),
    };
    if (editing?.id) {
      const { error } = await supabase.from("campaigns").update(payload).eq("id", editing.id);
      if (error) return showToast("Error: " + error.message);
      showToast("Campaña actualizada");
    } else {
      const { error } = await supabase.from("campaigns").insert(payload);
      if (error) return showToast("Error: " + error.message);
      showToast("Campaña creada");
    }
    setEditing(null);
    load();
  }

  async function remove(id: string) {
    if (!confirm("¿Borrar esta campaña?")) return;
    const { error } = await supabase.from("campaigns").delete().eq("id", id);
    if (error) return showToast("Error: " + error.message);
    showToast("Campaña borrada");
    load();
  }

  if (loading) return <p className="text-gray-400">Cargando...</p>;

  return (
    <div>
      <h1 className="font-display text-2xl uppercase text-white">Campañas</h1>
      <p className="mt-1 text-sm text-gray-400">Creá campañas con nombre y mensaje para organizar envíos.</p>
      {toast && <p className="mt-4 rounded bg-brand-yellow/20 px-4 py-2 text-brand-yellow">{toast}</p>}

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-gray-400">
              <th className="pb-2 pr-4">Nombre</th>
              <th className="pb-2 pr-4">Mensaje</th>
              <th className="pb-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c.id} className="border-b border-white/5">
                <td className="py-3 pr-4 text-white">{c.name}</td>
                <td className="max-w-xs truncate py-3 pr-4 text-gray-300" title={c.message_text || ""}>
                  {c.message_text || "—"}
                </td>
                <td className="py-3">
                  <button type="button" onClick={() => setEditing(c)} className="text-brand-yellow hover:underline mr-2">
                    Editar
                  </button>
                  <button type="button" onClick={() => remove(c.id)} className="text-red-400 hover:underline">
                    Borrar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form
        key={editing?.id ?? "new"}
        className="card-racing mt-8 max-w-xl space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const f = e.currentTarget;
          const nameInput = f.querySelector("[name=name]") as HTMLInputElement;
          const messageInput = f.querySelector("[name=message_text]") as HTMLTextAreaElement;
          save({
            name: nameInput.value,
            message_text: messageInput.value || null,
          });
          if (!editing) e.currentTarget.reset();
        }}
      >
        <h3 className="font-display text-lg text-brand-yellow">{editing ? "Editar campaña" : "Nueva campaña"}</h3>
        <div>
          <label htmlFor="campaign-name" className="block text-sm text-gray-400">
            Nombre de la campaña
          </label>
          <input
            id="campaign-name"
            name="name"
            type="text"
            defaultValue={editing?.name ?? ""}
            required
            placeholder="Ej: Aviso horarios febrero"
            className="mt-1 w-full rounded border border-white/20 bg-brand-dark px-3 py-2 text-white placeholder-gray-500"
            autoComplete="off"
          />
        </div>
        <div>
          <label htmlFor="campaign-message" className="block text-sm text-gray-400">
            Mensaje (opcional)
          </label>
          <textarea
            id="campaign-message"
            name="message_text"
            rows={3}
            defaultValue={editing?.message_text ?? ""}
            placeholder="Texto del mensaje a enviar..."
            className="mt-1 w-full rounded border border-white/20 bg-brand-dark px-3 py-2 text-white placeholder-gray-500"
          />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="btn-primary">
            {editing ? "Guardar" : "Crear campaña"}
          </button>
          {editing && (
            <button type="button" onClick={() => setEditing(null)} className="btn-secondary">
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
