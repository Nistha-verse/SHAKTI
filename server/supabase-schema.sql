-- Shakti API — run in Supabase SQL Editor (once per project)
-- Sessions, messages, pickup requests, and map locations

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES sessions (id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS messages_session_created_idx ON messages (session_id, created_at DESC);

CREATE TABLE IF NOT EXISTS requests (
  id SERIAL PRIMARY KEY,
  name TEXT,
  phone TEXT,
  product TEXT,
  pickup_location TEXT,
  pickup_code TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS locations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('pads', 'clinic', 'camp')),
  timings TEXT,
  verified BOOLEAN DEFAULT TRUE
);

-- Row Level Security: enable and allow anon access for this demo API.
-- For production, prefer the service role key on the server only and tighten policies.

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "sessions_anon_all" ON sessions;
CREATE POLICY "sessions_anon_all" ON sessions FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "messages_anon_all" ON messages;
CREATE POLICY "messages_anon_all" ON messages FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "requests_anon_insert" ON requests;
CREATE POLICY "requests_anon_insert" ON requests FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "locations_anon_select" ON locations;
CREATE POLICY "locations_anon_select" ON locations FOR SELECT TO anon USING (true);

-- Seed: 10 sample locations across India (pads / clinic / camp mix)
INSERT INTO locations (name, address, lat, lng, type, timings, verified)
VALUES
  (
    'Shakti Pad Bank — Andheri West',
    'Near Versova Metro, Andheri West, Mumbai, Maharashtra 400058',
    19.1364,
    72.8296,
    'pads',
    'Mon–Sat 10:00–18:00',
    TRUE
  ),
  (
    'Sakhi Women''s Clinic — Connaught Place',
    'Block B, Inner Circle, Connaught Place, New Delhi 110001',
    28.6315,
    77.2167,
    'clinic',
    'Mon–Sat 09:00–20:00; Sun 10:00–14:00',
    TRUE
  ),
  (
    'Shakti Outreach Camp — Indiranagar',
    '100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038',
    12.9784,
    77.6408,
    'camp',
    '2nd & 4th Sat 09:00–15:00',
    TRUE
  ),
  (
    'Hygiene & Health Hub — T. Nagar',
    'Pondy Bazaar, T. Nagar, Chennai, Tamil Nadu 600017',
    13.0418,
    80.2341,
    'pads',
    'Mon–Sun 09:30–19:30',
    TRUE
  ),
  (
    'Matri Clinic — Salt Lake',
    'Sector V, Salt Lake, Kolkata, West Bengal 700091',
    22.5735,
    88.4338,
    'clinic',
    'Mon–Fri 08:30–21:00; Sat 09:00–17:00',
    TRUE
  ),
  (
    'Shakti Camp — FC Road',
    'Fergusson College Road, Shivajinagar, Pune, Maharashtra 411004',
    18.5089,
    73.8295,
    'camp',
    '1st Sat monthly 10:00–16:00',
    TRUE
  ),
  (
    'Pad Point — Banjara Hills',
    'Road No. 2, Banjara Hills, Hyderabad, Telangana 500034',
    17.4065,
    78.4772,
    'pads',
    'Tue–Sun 10:00–19:00',
    TRUE
  ),
  (
    'Nari Swasthya Kendra — Navrangpura',
    'Near CG Road, Navrangpura, Ahmedabad, Gujarat 380009',
    23.0369,
    72.5626,
    'clinic',
    'Mon–Sat 09:00–18:30',
    TRUE
  ),
  (
    'Shakti Health Camp — Hazratganj',
    'MG Marg, Hazratganj, Lucknow, Uttar Pradesh 226001',
    26.8467,
    80.9462,
    'camp',
    '3rd Sun monthly 08:00–14:00',
    TRUE
  ),
  (
    'Pink Pad Bank — Malviya Nagar',
    'Gaurav Tower Road, Malviya Nagar, Jaipur, Rajasthan 302017',
    26.8600,
    75.8083,
    'pads',
    'Mon–Sat 10:00–18:30',
    TRUE
  );
