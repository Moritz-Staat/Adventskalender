-- Setup-Tabelle für Multi-Tenant-Support
CREATE TABLE IF NOT EXISTS app_setup (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  is_setup_complete BOOLEAN NOT NULL DEFAULT FALSE,
  family_size INTEGER CHECK (family_size >= 3 AND family_size <= 6),
  setup_completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial setup state
INSERT INTO app_setup (id, is_setup_complete) 
VALUES (1, FALSE)
ON CONFLICT (id) DO NOTHING;

-- Update participants table to support variable family sizes and roles
ALTER TABLE participants ADD COLUMN IF NOT EXISTS is_setup_admin BOOLEAN DEFAULT FALSE;
ALTER TABLE participants ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Insert the initial setup admin account
INSERT INTO participants (id, name, is_setup_admin, is_active) 
VALUES ('admin', 'Admin', TRUE, TRUE)
ON CONFLICT (id) DO UPDATE SET is_setup_admin = TRUE;

-- RLS policies for setup table
ALTER TABLE app_setup ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for app_setup"
  ON app_setup FOR SELECT
  USING (true);

CREATE POLICY "Public update access for app_setup"
  ON app_setup FOR UPDATE
  USING (true);

-- Update participants policies to include new columns
DROP POLICY IF EXISTS "Public read access for participants" ON participants;
CREATE POLICY "Public read access for participants"
  ON participants FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public insert access for participants" ON participants;
CREATE POLICY "Public insert access for participants"
  ON participants FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public update access for participants" ON participants;
CREATE POLICY "Public update access for participants"
  ON participants FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "Public delete access for participants" ON participants;
CREATE POLICY "Public delete access for participants"
  ON participants FOR DELETE
  USING (true);
