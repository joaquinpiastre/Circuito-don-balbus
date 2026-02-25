-- Permite varios horarios el mismo día (ej. Sábado tarde y Sábado noche)
ALTER TABLE schedules DROP CONSTRAINT IF EXISTS schedules_day_of_week_key;
