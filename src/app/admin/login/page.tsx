"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const SUPABASE_CONFIG_HINT =
  "Revisá .env.local: tiene que tener NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY con los valores de Supabase (Project Settings → API). Después reiniciá el servidor (Ctrl+C y npm run dev).";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const hasSupabaseConfig =
    typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes("supabase.co") &&
    typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 20;

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!hasSupabaseConfig) {
      setError(SUPABASE_CONFIG_HINT);
      return;
    }
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      setLoading(false);
      const msg = err.message.toLowerCase().includes("fetch") ? `${err.message}. ${SUPABASE_CONFIG_HINT}` : err.message;
      setError(msg);
      return;
    }
    // Redirección completa para que el servidor reciba las cookies de sesión
    window.location.href = "/admin";
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-graphite px-4">
      <div className="w-full max-w-sm card-racing">
        <h1 className="font-display text-2xl uppercase text-white">Admin</h1>
        <p className="mt-2 text-sm text-gray-400">Ingresá con tu cuenta de admin.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-gray-400">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded border border-white/20 bg-brand-dark px-3 py-2 text-white"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm text-gray-400">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full rounded border border-white/20 bg-brand-dark px-3 py-2 text-white"
            />
          </div>
          {!hasSupabaseConfig && (
            <p className="rounded border border-amber-500/50 bg-amber-500/10 p-3 text-sm text-amber-200">
              Falta configurar Supabase. {SUPABASE_CONFIG_HINT}
            </p>
          )}
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
