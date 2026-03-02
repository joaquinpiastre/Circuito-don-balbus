-- Campañas (para mensajes): tienen nombre y texto opcional
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  message_text TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "campaigns_admin_read" ON campaigns FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "campaigns_admin" ON campaigns FOR ALL USING (auth.role() = 'authenticated');
