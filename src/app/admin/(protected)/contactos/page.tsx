"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { PhoneContact } from "@/lib/types";

/** Parsea el Excel en un Web Worker para no bloquear la UI (evita que no se pueda escribir en ningún lado). */
function parseExcelInWorker(file: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const worker = new Worker("/workers/parse-excel.worker.js");
    const onMessage = (e: MessageEvent) => {
      worker.terminate();
      if (e.data?.ok) resolve(e.data.numbers || []);
      else reject(new Error(e.data?.error || "Error en el worker"));
    };
    const onError = () => {
      worker.terminate();
      reject(new Error("Error al cargar el worker de Excel"));
    };
    worker.addEventListener("message", onMessage);
    worker.addEventListener("error", onError);
    file.arrayBuffer().then((buffer) => {
      worker.postMessage(buffer, [buffer]);
    }, reject);
  });
}

export default function AdminContactosPage() {
  const [contacts, setContacts] = useState<PhoneContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [toast, setToast] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  async function load() {
    const { data } = await supabase.from("phone_contacts").select("id, phone_number, created_at").order("created_at", { ascending: false });
    setContacts((data as PhoneContact[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const input = e.target;
    if (!file) return;

    setImporting(true);
    try {
      const numbersFromExcel = await parseExcelInWorker(file);

      if (numbersFromExcel.length === 0) {
        showToast("No se encontraron números en el Excel. Usá la primera columna o una columna llamada Teléfono/Numero/Phone.");
        return;
      }

      const { data: existing } = await supabase.from("phone_contacts").select("phone_number");
      const existingSet = new Set((existing || []).map((r: { phone_number: string }) => r.phone_number));

      const toInsert = numbersFromExcel.filter((num) => !existingSet.has(num));
      const skipped = numbersFromExcel.length - toInsert.length;

      if (toInsert.length > 0) {
        const { error } = await supabase.from("phone_contacts").insert(toInsert.map((phone_number) => ({ phone_number })));
        if (error) {
          showToast("Error al guardar: " + error.message);
          return;
        }
        await load();
      }

      if (skipped > 0 && toInsert.length > 0) {
        showToast(`Se agregaron ${toInsert.length} números. ${skipped} ya existían y no se duplicaron.`);
      } else if (skipped > 0) {
        showToast(`Todos los números ya estaban cargados (${skipped}). No se agregaron duplicados.`);
      } else {
        showToast(`Se agregaron ${toInsert.length} números.`);
      }
    } catch (err) {
      showToast("Error al leer el Excel: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setImporting(false);
      input.value = "";
      inputRef.current?.blur();
    }
  }

  async function remove(id: string) {
    if (!confirm("¿Borrar este número?")) return;
    const { error } = await supabase.from("phone_contacts").delete().eq("id", id);
    if (error) return showToast("Error: " + error.message);
    showToast("Número eliminado");
    load();
  }

  if (loading) return <p className="text-gray-400">Cargando...</p>;

  return (
    <div>
      <h1 className="font-display text-2xl uppercase text-white">Contactos (teléfonos)</h1>
      <p className="mt-1 text-sm text-gray-400">Lista de números para mensajes. Al importar Excel solo se agregan números nuevos; los que ya están no se duplican.</p>
      {toast && <p className="mt-4 rounded bg-brand-yellow/20 px-4 py-2 text-brand-yellow">{toast}</p>}

      <div className="card-racing mt-6 max-w-lg">
        <h2 className="font-display text-lg text-brand-yellow">Importar desde Excel</h2>
        <p className="mt-1 text-sm text-gray-400">Subí un .xlsx o .xls. Se usan la primera columna o una columna llamada Teléfono / Numero / Phone / Celular. Solo se agregan números que no estén ya en la lista.</p>
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFile}
          disabled={importing}
          className="mt-3 block w-full text-sm text-gray-400 file:mr-4 file:rounded file:border-0 file:bg-brand-yellow file:px-4 file:py-2 file:text-sm file:font-medium file:text-black hover:file:bg-brand-yellow/90"
        />
        {importing && <p className="mt-2 text-sm text-gray-400">Procesando...</p>}
      </div>

      <div className="mt-8">
        <h2 className="font-display text-lg text-brand-yellow">Números cargados ({contacts.length})</h2>
        <div className="mt-3 max-h-96 overflow-y-auto rounded border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-brand-black">
              <tr className="border-b border-white/10 text-gray-400">
                <th className="px-4 py-2">Número</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c.id} className="border-b border-white/5">
                  <td className="px-4 py-2 font-mono text-white">{c.phone_number}</td>
                  <td className="px-4 py-2">
                    <button type="button" onClick={() => remove(c.id)} className="text-red-400 hover:underline">
                      Borrar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {contacts.length === 0 && (
            <p className="px-4 py-6 text-center text-gray-500">Aún no hay números. Importá un Excel para agregar.</p>
          )}
        </div>
      </div>
    </div>
  );
}
