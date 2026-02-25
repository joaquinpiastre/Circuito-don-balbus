import { createServerSupabaseClient } from "@/lib/supabase/server";
import type {
  Schedule,
  Price,
  Event,
  GalleryImage,
} from "@/lib/types";

const DAY_NAMES = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

const DEFAULT_SCHEDULES: Schedule[] = [
  { id: "1", day_of_week: 3, open_time: "20:00", close_time: "00:00", label: "Miércoles nocturno", is_active: true, sort_order: 0 },
  { id: "2", day_of_week: 5, open_time: "20:00", close_time: "00:00", label: "Viernes nocturno", is_active: true, sort_order: 1 },
];
const DEFAULT_PRICES: Price[] = [
  { id: "1", name: "Por moto", amount_cents: 2000000, description: "Entrada por moto", is_active: true, sort_order: 0 },
  { id: "2", name: "Acompañante", amount_cents: 200000, description: "Por persona acompañante", is_active: true, sort_order: 1 },
];

export function formatTime(t: string): string {
  const [h, m] = t.split(":");
  return `${h ?? "00"}:${m ?? "00"}`;
}

function hasSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return url && url !== "https://tu-proyecto.supabase.co" && !url.includes("tu-proyecto");
}

export async function getSchedules(): Promise<Schedule[]> {
  if (!hasSupabaseConfig()) return DEFAULT_SCHEDULES;
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("schedules")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");
    if (error) return DEFAULT_SCHEDULES;
    return (data as Schedule[])?.length ? (data as Schedule[]) : DEFAULT_SCHEDULES;
  } catch {
    return DEFAULT_SCHEDULES;
  }
}

export async function getSchedulesFormatted(): Promise<
  { day: string; time: string; label: string | null }[]
> {
  const rows = await getSchedules();
  return rows.map((r) => ({
    day: DAY_NAMES[r.day_of_week] ?? "",
    time: `${formatTime(r.open_time)} - ${formatTime(r.close_time)}`,
    label: r.label,
  }));
}

export async function getPrices(): Promise<Price[]> {
  if (!hasSupabaseConfig()) return DEFAULT_PRICES;
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("prices")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");
    if (error) return DEFAULT_PRICES;
    return (data as Price[])?.length ? (data as Price[]) : DEFAULT_PRICES;
  } catch {
    return DEFAULT_PRICES;
  }
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export async function getUpcomingEvents(): Promise<Event[]> {
  if (!hasSupabaseConfig()) return [];
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("is_published", true)
      .gte("event_date", new Date().toISOString().slice(0, 10))
      .order("event_date")
      .limit(10);
    if (error) return [];
    return (data as Event[]) || [];
  } catch {
    return [];
  }
}

export async function getAllEvents(): Promise<Event[]> {
  if (!hasSupabaseConfig()) return [];
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("is_published", true)
      .order("event_date", { ascending: false });
    if (error) return [];
    return (data as Event[]) || [];
  } catch {
    return [];
  }
}

export async function getGallery(category?: string): Promise<GalleryImage[]> {
  if (!hasSupabaseConfig()) return [];
  try {
    const supabase = await createServerSupabaseClient();
    let q = supabase.from("gallery").select("*").order("sort_order");
    if (category) q = q.eq("category", category);
    const { data, error } = await q;
    if (error) return [];
    return (data as GalleryImage[]) || [];
  } catch {
    return [];
  }
}

export async function getSiteText(key: string): Promise<string> {
  const defaults: Record<string, string> = {
    hero_title: "Circuito Don Balbus en San Rafael",
    hero_subtitle: "Entrenamientos en Las Paredes.",
    weather_notice: "Sujeto a cambios por clima o eventos. Consultá antes de venir.",
    testimonials: "[]",
  };
  if (!hasSupabaseConfig()) return defaults[key] ?? "";
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("site_texts")
      .select("value")
      .eq("key", key)
      .single();
    return (data?.value as string) ?? defaults[key] ?? "";
  } catch {
    return defaults[key] ?? "";
  }
}

export async function getSiteTexts(keys: string[]): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  for (const k of keys) out[k] = await getSiteText(k);
  return out;
}

const DEFAULT_GOOGLE_REVIEWS: { author: string; text: string; stars: number; date?: string }[] = [
  { author: "Carlos M.", text: "Excelente circuito, la pista de noche está muy buena iluminada. Volveré seguro.", stars: 5, date: "hace 2 meses" },
  { author: "Juan P.", text: "Muy buena onda el lugar, precios acordes. Los miércoles y viernes son ideales para entrenar.", stars: 5, date: "hace 1 mes" },
  { author: "Martín R.", text: "La mejor opción para entrenar de noche en la zona. Pista cuidada y buena iluminación.", stars: 5, date: "hace 3 meses" },
];

export async function getGoogleReviews(): Promise<{ author: string; text: string; stars: number; date?: string }[]> {
  const raw = await getSiteText("testimonials");
  if (!raw || raw === "[]") return DEFAULT_GOOGLE_REVIEWS;
  try {
    const parsed = JSON.parse(raw) as { author?: string; text?: string; stars?: number; date?: string }[];
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_GOOGLE_REVIEWS;
    return parsed
      .filter((r) => r && typeof r.author === "string" && typeof r.text === "string")
      .map((r) => ({
        author: r.author ?? "",
        text: r.text ?? "",
        stars: typeof r.stars === "number" && r.stars >= 1 && r.stars <= 5 ? r.stars : 5,
        date: typeof r.date === "string" ? r.date : undefined,
      }));
  } catch {
    return DEFAULT_GOOGLE_REVIEWS;
  }
}
