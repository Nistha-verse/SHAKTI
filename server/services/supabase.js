import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
  console.warn(
    '[shakti-api] SUPABASE_URL and SUPABASE_ANON_KEY must be set for database operations.'
  );
}

export const supabase =
  url && key
    ? createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;

export function requireSupabase() {
  if (!supabase) {
    const err = new Error('Supabase is not configured');
    err.statusCode = 503;
    throw err;
  }
  return supabase;
}
