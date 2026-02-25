-- Circuito Don Balbus - Schema inicial
-- Ejecutar en Supabase SQL Editor o con Supabase CLI

-- Horarios de entrenamiento (por día)
CREATE TABLE IF NOT EXISTS schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  open_time TIME NOT NULL,
  close_time TIME NOT NULL,
  label TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(day_of_week)
);

-- Tarifas
CREATE TABLE IF NOT EXISTS prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Eventos / Calendario
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME,
  description TEXT,
  flyer_url TEXT,
  external_link TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Galería (metadata; archivos en Storage)
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path TEXT NOT NULL,
  public_url TEXT,
  category TEXT NOT NULL CHECK (category IN ('nocturno', 'entrenamientos', 'eventos')),
  caption TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Textos editables (hero, avisos)
CREATE TABLE IF NOT EXISTS site_texts (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_texts ENABLE ROW LEVEL SECURITY;

-- Lectura pública para tablas de contenido
CREATE POLICY "schedules_public_read" ON schedules FOR SELECT USING (true);
CREATE POLICY "prices_public_read" ON prices FOR SELECT USING (true);
CREATE POLICY "events_public_read" ON events FOR SELECT USING (is_published = true);
CREATE POLICY "gallery_public_read" ON gallery FOR SELECT USING (true);
CREATE POLICY "site_texts_public_read" ON site_texts FOR SELECT USING (true);

-- Solo autenticados (admin) pueden escribir
CREATE POLICY "schedules_admin" ON schedules FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "prices_admin" ON prices FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "events_admin" ON events FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "gallery_admin" ON gallery FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "site_texts_admin" ON site_texts FOR ALL USING (auth.role() = 'authenticated');

-- Datos iniciales
INSERT INTO schedules (day_of_week, open_time, close_time, label, sort_order) VALUES
  (3, '20:00', '00:00', 'Miércoles nocturno', 0),
  (5, '20:00', '00:00', 'Viernes nocturno', 1)
ON CONFLICT (day_of_week) DO NOTHING;

INSERT INTO prices (name, amount_cents, description, sort_order)
SELECT * FROM (VALUES
  ('Por moto', 2000000, 'Entrada por moto', 0),
  ('Acompañante', 200000, 'Por persona acompañante', 1)
) AS v(name, amount_cents, description, sort_order)
WHERE (SELECT COUNT(*) FROM prices) = 0;

INSERT INTO site_texts (key, value) VALUES
  ('hero_title', 'Motocross Nocturno en San Rafael'),
  ('hero_subtitle', 'Pista iluminada en Las Paredes'),
  ('weather_notice', 'Sujeto a cambios por clima o eventos. Consultá antes de venir.'),
  ('testimonials', '[]')
ON CONFLICT (key) DO NOTHING;

-- Storage: crear bucket "gallery" desde Supabase Dashboard (Storage > New bucket)
-- Nombre: gallery, Public: sí. Luego en Policies agregar:
-- - Policy "Allow public read" para SELECT (public)
-- - Policy "Allow authenticated upload" para INSERT con (bucket_id = 'gallery' AND auth.role() = 'authenticated')
