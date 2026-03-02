export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface Schedule {
  id: string;
  day_of_week: number;
  open_time: string;
  close_time: string;
  label: string | null;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Price {
  id: string;
  name: string;
  amount_cents: number;
  description: string | null;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Event {
  id: string;
  title: string;
  event_date: string;
  event_time: string | null;
  description: string | null;
  flyer_url: string | null;
  external_link: string | null;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export type GalleryCategory = "nocturno" | "entrenamientos" | "eventos";

export interface GalleryImage {
  id: string;
  storage_path: string;
  public_url: string | null;
  category: GalleryCategory;
  caption: string | null;
  sort_order: number;
  created_at?: string;
}

export interface SiteText {
  key: string;
  value: string;
  updated_at?: string;
}

export interface PhoneContact {
  id: string;
  phone_number: string;
  created_at?: string;
}

export interface Campaign {
  id: string;
  name: string;
  message_text: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Testimonial {
  id: string;
  author: string;
  text: string;
  date?: string;
}

/** Reseña tipo Google: autor, texto, estrellas (1-5), fecha opcional */
export interface GoogleReview {
  author: string;
  text: string;
  stars: number;
  date?: string;
}
