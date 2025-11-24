-- Tabelle für die Teilnehmer
CREATE TABLE IF NOT EXISTS participants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabelle für die täglichen Ziehungen
CREATE TABLE IF NOT EXISTS daily_draws (
  day INTEGER PRIMARY KEY CHECK (day >= 1 AND day <= 25),
  winner_id TEXT NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  drawn_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  image_url TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE
);

-- Tabelle für die Ziehungshistorie (welcher User hat die Animation gesehen)
CREATE TABLE IF NOT EXISTS user_viewed_draws (
  user_id TEXT NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  day INTEGER NOT NULL CHECK (day >= 1 AND day <= 25),
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, day)
);

-- Tabelle für den Zyklus-Status
CREATE TABLE IF NOT EXISTS cycle_state (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  current_cycle INTEGER NOT NULL DEFAULT 1,
  participants_in_cycle TEXT[] NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Initiale Teilnehmer einfügen
INSERT INTO participants (id, name) VALUES
  ('moritz', 'Moritz'),
  ('claudia', 'Claudia'),
  ('christian', 'Christian'),
  ('ella', 'Ella'),
  ('clara', 'Clara')
ON CONFLICT (id) DO NOTHING;

-- Initialen Zyklus-Status einfügen
INSERT INTO cycle_state (id, current_cycle, participants_in_cycle) 
VALUES (1, 1, '{}')
ON CONFLICT (id) DO NOTHING;

-- RLS aktivieren für alle Tabellen (öffentlich lesbar für alle Familienitglieder)
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_viewed_draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE cycle_state ENABLE ROW LEVEL SECURITY;

-- Policies: Jeder kann lesen (keine Auth erforderlich für diese Familien-App)
CREATE POLICY "Public read access for participants"
  ON participants FOR SELECT
  USING (true);

CREATE POLICY "Public read access for daily_draws"
  ON daily_draws FOR SELECT
  USING (true);

CREATE POLICY "Public read access for user_viewed_draws"
  ON user_viewed_draws FOR SELECT
  USING (true);

CREATE POLICY "Public read access for cycle_state"
  ON cycle_state FOR SELECT
  USING (true);

-- Policies: Jeder kann schreiben (keine Auth erforderlich für diese Familien-App)
CREATE POLICY "Public insert access for daily_draws"
  ON daily_draws FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public update access for daily_draws"
  ON daily_draws FOR UPDATE
  USING (true);

CREATE POLICY "Public insert access for user_viewed_draws"
  ON user_viewed_draws FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public update access for cycle_state"
  ON cycle_state FOR UPDATE
  USING (true);
