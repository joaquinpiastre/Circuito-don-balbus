"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          phone: data.get("phone"),
          message: data.get("message"),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error al enviar");
      setStatus("success");
      setMessage("Mensaje enviado. Te vamos a responder pronto.");
      form.reset();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Error al enviar. Probá por WhatsApp.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-400">
          Nombre
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-1 w-full rounded-lg border border-white/20 bg-brand-dark px-4 py-2 text-white placeholder-gray-500 focus:border-brand-yellow focus:outline-none focus:ring-1 focus:ring-brand-yellow"
          placeholder="Tu nombre"
        />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-400">
          Teléfono
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          className="mt-1 w-full rounded-lg border border-white/20 bg-brand-dark px-4 py-2 text-white placeholder-gray-500 focus:border-brand-yellow focus:outline-none focus:ring-1 focus:ring-brand-yellow"
          placeholder="+54 260 ..."
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-400">
          Consulta
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className="mt-1 w-full rounded-lg border border-white/20 bg-brand-dark px-4 py-2 text-white placeholder-gray-500 focus:border-brand-yellow focus:outline-none focus:ring-1 focus:ring-brand-yellow"
          placeholder="Tu mensaje..."
        />
      </div>
      {message && (
        <p
          className={`text-sm ${
            status === "success" ? "text-green-400" : "text-red-400"
          }`}
        >
          {message}
        </p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-primary w-full disabled:opacity-50"
      >
        {status === "loading" ? "Enviando..." : "Enviar"}
      </button>
    </form>
  );
}
