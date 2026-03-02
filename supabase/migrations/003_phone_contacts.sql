-- Contactos (números de teléfono) para envío de mensajes
-- Sin duplicados: UNIQUE en phone_number
CREATE TABLE IF NOT EXISTS phone_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_phone_contacts_number ON phone_contacts (phone_number);

ALTER TABLE phone_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "phone_contacts_admin_read" ON phone_contacts FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "phone_contacts_admin" ON phone_contacts FOR ALL USING (auth.role() = 'authenticated');
