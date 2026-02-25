"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Schedule } from "@/lib/types";

const DAYS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

export default function AdminHorariosPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Schedule | null>(null);
  const supabase = createClient();

  async function load() {
    setError(null);
    const { data, error: err } = await supabase.from("schedules").select("*").order("sort_order");
    if (err) {
      setError(err.message || "Error al cargar.");
      setSchedules([]);
    } else {
      setSchedules((data as Schedule[]) || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  async function save(row: Partial<Schedule>) {
    if (editing?.id) {
      const { error } = await supabase.from("schedules").update({ ...row, updated_at: new Date().toISOString() }).eq("id", editing.id);
      if (error) return showToast("Error: " + error.message);
      showToast("Horario actualizado");
    } else {
      const { error } = await supabase.from("schedules").insert(row);
      if (error) return showToast("Error: " + error.message);
      showToast("Horario creado");
    }
    setEditing(null);
    load();
  }

  async function remove(id: string) {
    if (!confirm("¿Borrar este horario?")) return;
    const { error } = await supabase.from("schedules").delete().eq("id", id);
    if (error) return showToast("Error: " + error.message);
    showToast("Borrado");
    load();
  }

  if (loading) return <p className="text-gray-400">Cargando...</p>;

  if (error) {
    return (
      <div>
        <h1 className="font-display text-2xl uppercase text-white">Horarios</h1>
        <div className="mt-6 rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-200">
          <p className="font-medium">Error de conexión con Supabase</p>
          <p className="mt-2 text-sm">{error}</p>
          <p className="mt-4 text-sm text-gray-400">
            Verificá: 1) .env.local con NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY correctos. 2) Haber ejecutado el SQL de supabase/migrations/001_initial_schema.sql en Supabase. 3) Que el proyecto no esté pausado.
          </p>
          <button type="button" onClick={() => { setLoading(true); load(); }} className="mt-4 rounded bg-white/10 px-4 py-2 text-sm hover:bg-white/20">Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl uppercase text-white">Horarios</h1>
      <p className="mt-2 text-sm text-gray-400">
        Podés tener varios horarios el mismo día (ej. Sábado tarde 14–18 y Sábado noche 20–00). La etiqueta ayuda a distinguirlos en la web.
      </p>
      {toast && <p className="mt-4 rounded bg-brand-yellow/20 px-4 py-2 text-brand-yellow">{toast}</p>}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-gray-400">
              <th className="pb-2 pr-4">Día</th>
              <th className="pb-2 pr-4">Apertura</th>
              <th className="pb-2 pr-4">Cierre</th>
              <th className="pb-2 pr-4">Etiqueta</th>
              <th className="pb-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((s) => (
              <tr key={s.id} className="border-b border-white/5">
                <td className="py-3 pr-4 text-white">{DAYS[s.day_of_week]}</td>
                <td className="py-3 pr-4 text-gray-300">{s.open_time}</td>
                <td className="py-3 pr-4 text-gray-300">{s.close_time}</td>
                <td className="py-3 pr-4 text-gray-300">{s.label || "—"}</td>
                <td className="py-3">
                  <button type="button" onClick={() => setEditing(s)} className="text-brand-yellow hover:underline mr-2">Editar</button>
                  <button type="button" onClick={() => remove(s.id)} className="text-red-400 hover:underline">Borrar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing && (
        <form
          className="card-racing mt-8 max-w-md space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const f = e.currentTarget;
            save({
              day_of_week: editing.day_of_week,
              open_time: (f.querySelector("[name=open_time]") as HTMLInputElement).value,
              close_time: (f.querySelector("[name=close_time]") as HTMLInputElement).value,
              label: (f.querySelector("[name=label]") as HTMLInputElement).value || null,
              is_active: (f.querySelector("[name=is_active]") as HTMLInputElement).checked,
            });
          }}
        >
          <h3 className="font-display text-lg text-brand-yellow">Editar horario</h3>
          <div>
            <label className="block text-sm text-gray-400">Día</label>
            <select
              name="day_of_week"
              defaultValue={editing.day_of_week}
              className="mt-1 w-full rounded border border-white/20 bg-brand-dark px-3 py-2 text-white"
            >
              {DAYS.map((d, i) => (
                <option key={d} value={i}>{d}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400">Apertura</label>
              <input name="open_time" type="time" defaultValue={editing.open_time} className="mt-1 w-full rounded border border-white/20 bg-brand-dark px-3 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-400">Cierre</label>
              <input name="close_time" type="time" defaultValue={editing.close_time} className="mt-1 w-full rounded border border-white/20 bg-brand-dark px-3 py-2 text-white" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400">Etiqueta (opcional)</label>
            <input name="label" type="text" defaultValue={editing.label || ""} className="mt-1 w-full rounded border border-white/20 bg-brand-dark px-3 py-2 text-white" placeholder="Ej: Miércoles noche o Sábado tarde" />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-400">
            <input name="is_active" type="checkbox" defaultChecked={editing.is_active} />
            Activo
          </label>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary">Guardar</button>
            <button type="button" onClick={() => setEditing(null)} className="btn-secondary">Cancelar</button>
          </div>
        </form>
      )}
      {!editing && (
        <form
          className="card-racing mt-8 max-w-md space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const f = e.currentTarget;
            save({
              day_of_week: parseInt((f.querySelector("[name=day_of_week]") as HTMLSelectElement).value, 10),
              open_time: (f.querySelector("[name=open_time]") as HTMLInputElement).value,
              close_time: (f.querySelector("[name=close_time]") as HTMLInputElement).value,
              label: (f.querySelector("[name=label]") as HTMLInputElement).value || null,
              is_active: true,
            });
            e.currentTarget.reset();
          }}
        >
          <h3 className="font-display text-lg text-brand-yellow">Nuevo horario</h3>
          <div>
            <label className="block text-sm text-gray-400">Día</label>
            <select name="day_of_week" className="mt-1 w-full rounded border border-white/20 bg-brand-dark px-3 py-2 text-white">
              {DAYS.map((d, i) => (
                <option key={d} value={i}>{d}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400">Apertura</label>
              <input name="open_time" type="time" defaultValue="20:00" className="mt-1 w-full rounded border border-white/20 bg-brand-dark px-3 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-400">Cierre</label>
              <input name="close_time" type="time" defaultValue="00:00" className="mt-1 w-full rounded border border-white/20 bg-brand-dark px-3 py-2 text-white" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400">Etiqueta (opcional)</label>
            <input name="label" type="text" className="mt-1 w-full rounded border border-white/20 bg-brand-dark px-3 py-2 text-white" placeholder="Ej: Miércoles noche o Sábado tarde" />
          </div>
          <button type="submit" className="btn-primary">Agregar</button>
        </form>
      )}
    </div>
  );
}
