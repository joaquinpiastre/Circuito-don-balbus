"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Price } from "@/lib/types";

function formatPrice(cents: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(cents / 100);
}

export default function AdminTarifasPage() {
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [editing, setEditing] = useState<Price | null>(null);
  const supabase = createClient();

  async function load() {
    const { data } = await supabase.from("prices").select("*").order("sort_order");
    setPrices((data as Price[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  async function save(row: { name: string; amount_cents: number; description?: string | null }) {
    if (editing?.id) {
      const { error } = await supabase.from("prices").update({ ...row, updated_at: new Date().toISOString() }).eq("id", editing.id);
      if (error) return showToast("Error: " + error.message);
      showToast("Tarifa actualizada");
    } else {
      const { error } = await supabase.from("prices").insert(row);
      if (error) return showToast("Error: " + error.message);
      showToast("Tarifa creada");
    }
    setEditing(null);
    load();
  }

  async function remove(id: string) {
    if (!confirm("¿Borrar esta tarifa?")) return;
    const { error } = await supabase.from("prices").delete().eq("id", id);
    if (error) return showToast("Error: " + error.message);
    showToast("Borrado");
    load();
  }

  if (loading) return <p className="text-gray-400">Cargando...</p>;

  return (
    <div>
      <h1 className="font-display text-2xl uppercase text-white">Tarifas</h1>
      {toast && <p className="mt-4 rounded bg-brand-yellow/20 px-4 py-2 text-brand-yellow">{toast}</p>}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-gray-400">
              <th className="pb-2 pr-4">Concepto</th>
              <th className="pb-2 pr-4">Precio</th>
              <th className="pb-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {prices.map((p) => (
              <tr key={p.id} className="border-b border-white/5">
                <td className="py-3 pr-4 text-white">{p.name}</td>
                <td className="py-3 pr-4 text-gray-300">{formatPrice(p.amount_cents)}</td>
                <td className="py-3">
                  <button type="button" onClick={() => setEditing(p)} className="text-brand-yellow hover:underline mr-2">Editar</button>
                  <button type="button" onClick={() => remove(p.id)} className="text-red-400 hover:underline">Borrar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form
        key={editing?.id ?? "new"}
        className="card-racing mt-8 max-w-md space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const f = e.currentTarget;
          const amount = Math.round(parseFloat((f.querySelector("[name=amount]") as HTMLInputElement).value) * 100);
          save({
            name: (f.querySelector("[name=name]") as HTMLInputElement).value,
            amount_cents: amount,
            description: (f.querySelector("[name=description]") as HTMLInputElement).value || null,
          });
          if (!editing) e.currentTarget.reset();
        }}
      >
        <h3 className="font-display text-lg text-brand-yellow">{editing ? "Editar tarifa" : "Nueva tarifa"}</h3>
          <div>
            <label className="block text-sm text-gray-400">Concepto</label>
            <input name="name" type="text" defaultValue={editing?.name} required className="mt-1 w-full rounded border border-white/20 bg-brand-dark px-3 py-2 text-white" placeholder="Ej: Por moto" />
          </div>
          <div>
            <label className="block text-sm text-gray-400">Precio (pesos, número)</label>
            <input name="amount" type="number" defaultValue={editing ? editing.amount_cents / 100 : ""} required min="0" step="1" className="mt-1 w-full rounded border border-white/20 bg-brand-dark px-3 py-2 text-white" placeholder="20000" />
          </div>
          <div>
            <label className="block text-sm text-gray-400">Descripción (opcional)</label>
            <input name="description" type="text" defaultValue={editing?.description || ""} className="mt-1 w-full rounded border border-white/20 bg-brand-dark px-3 py-2 text-white" />
          </div>
        <div className="flex gap-2">
          <button type="submit" className="btn-primary">{editing ? "Guardar" : "Agregar"}</button>
          {editing && <button type="button" onClick={() => setEditing(null)} className="btn-secondary">Cancelar</button>}
        </div>
      </form>
    </div>
  );
}
