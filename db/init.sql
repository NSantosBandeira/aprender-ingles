CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  image TEXT,
  roles TEXT[] NOT NULL DEFAULT '{}',
  voice_rate TEXT NOT NULL DEFAULT 'very-slow',
  xp INTEGER NOT NULL DEFAULT 0,
  scores JSONB NOT NULL DEFAULT '{}',
  last_unit TEXT,
  last_mode TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
