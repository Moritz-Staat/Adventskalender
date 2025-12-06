-- Storage Bucket für Adventskalender-Bilder erstellen
INSERT INTO storage.buckets (id, name, public)
VALUES ('advent-images', 'advent-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Jeder kann Bilder hochladen
CREATE POLICY "Public upload access"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'advent-images');

-- Policy: Jeder kann Bilder lesen
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'advent-images');

-- Policy: Jeder kann Bilder aktualisieren
CREATE POLICY "Public update access"
ON storage.objects FOR UPDATE
USING (bucket_id = 'advent-images');
