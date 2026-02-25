"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Event } from "@/lib/types";

export default function AdminEventosPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [editing, setEditing] = useState<Event | null>(null);
  const supabase = createClient();

  async function load() {
    const { data } = await supabase.from("events").select("*").order("event_date", { ascending: false });
    setEvents((data as Event[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  async function save(ev: Partial<Event>) {
    const row = {
      title: ev.title,
      event_date: ev.event_date,
      event_time: ev.event_time || null,
      description: ev.description || null,
      flyer_url: ev.flyer_url || null,
      external_link: ev.external_link || null,
      is_published: ev.is_published ?? true,
      updated_at: new Date().toISOString(),
    };
    if (editing?.id) {
      const { error } = await supabase.from("events").update(row).eq("id", editing.id);
      if (error) return showToast("Error: " + error.message);
      showToast("Evento actualizado");
    } else {
      const { error } = await supabase.from("events").insert(row);
      if (error) return showToast("Error: " + error.message);
      showToast("Evento creado");
    }
    setEditing(null);
    load();
  }

  async function remove(id: string) {
    if (!confirm("¿Borrar este evento?")) return;
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) return showToast("Error: " + error.message);
    showToast("Borrado");
    load();
  }

  if (loading) return <p className="text-gray-400">Cargando...</p>;

  return (
    <div>
      <h1 className="font-display text-2xl uppercase text-white">Eventos</h1>
      {toast && <p className="mt-4 rounded bg-brand-yellow/20 px-4 py-2 text-brand-yellow">{toast}</p>}
      <div className="mt-6 space-y-4">
        {events.map((ev) => (
          <div key={ev.id} className="card-racing flex items-center justify-between">
            <div>
              <p className="font-medium text-white">{ev.title}</p>
              <p className="text-sm text-gray-400">{ev.event_date} {ev.event_time || ""}</p>
            </div>
            <div>
              <button type="button" onClick={() => setEditing(ev)} className="text-brand-yellow hover:underline mr-4">Editar</button>
              <button type="button" onClick={() => remove(ev.id)} className="text-red-400 hover:underline">Borrar</button>
            </div>
          </div>
        ))}
      </div>
      <form
        className="card-racing mt-8 max-w-xl space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const f = e.currentTarget;
          save({
            title: (f.querySelector("[name=title]") as HTMLInputElement).value,
            event_date: (f.querySelector("[name=event_date]") as HTMLInputElement).value,
            event_time: (f.querySelector("[name=event_time]") as HTMLInputElement).value || null,
            description: (f.querySelector("[name=description]") as HTMLTextAreaElement).value || null,
            flyer_url: (f.querySelector("[name=flyer_url]") as HTMLInputElement).value || null,
            external_link: (f.querySelector("[name=external_link]") as HTMLInputElement).value || null,
            is_published: (f.querySelector("[name=is_published]") as HTMLInputElement).checked,
          });
          if (!editing) e.currentTarget.reset();
        }}
      >
        <h3 className="font-display text-lg text-brand-yellow">{editing ? "Editar evento" : "Nuevo evento"}</h3>
        <div>
          <label className="block text-sm text-gray-400">Título</label>
          <input name="title" type="text" defaultValue={editing?.title} required className="mt-1 w-full rounded border border-white/20 bg-brand-dark px-3 py-2 text-white" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400">Fecha</label>
            <input name="event_date" type="date" defaultValue={editing?.event_date} required className="mt-1 w-full rounded border border-white/20 bg-brand-dark px-3 py-2 text-white" />
          </div>
          <div>
            <label className="block text-sm text-gray-400">Hora (opcional)</label>
            <input name="event_time" type="time" defaultValue={editing?.event_time || ""} className="mt-1 w-full rounded border border-white/20 bg-brand-dark px-3 py-2 text-white" />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-400">Descripción</label>
          <textarea name="description" rows={3} defaultValue={editing?.description || ""} className="mt-1 w-full rounded border border-white/20 bg-brand-dark px-3 py-2 text-white" />
        </div>
        <div>
          <label className="block text-sm text-gray-400">URL del flyer (opcional)</label>
          <input name="flyer_url" type="url" defaultValue={editing?.flyer_url || ""} className="mt-1 w-full rounded border border-white/20 bg-brand-dark px-3 py-2 text-white" />
        </div>
        <div>
          <label className="block text-sm text-gray-400">Link externo (opcional)</label>
          <input name="external_link" type="url" defaultValue={editing?.external_link || ""} className="mt-1 w-full rounded border border-white/20 bg-brand-dark px-3 py-2 text-white" />
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-400">
          <input name="is_published" type="checkbox" defaultChecked={editing?.is_published ?? true} />
          Publicado
        </label>
        <div className="flex gap-2">
          <button type="submit" className="btn-primary">{editing ? "Guardar" : "Agregar"}</button>
          {editing && <button type="button" onClick={() => setEditing(null)} className="btn-secondary">Cancelar</button>}
        </div>
      </form>
    </div>
  );
}
