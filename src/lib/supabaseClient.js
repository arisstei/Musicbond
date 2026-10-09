import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// SQL snippet to update the profiles table schema in Supabase:
//
// Run this in the Supabase SQL editor (or a migration) once:
//
//   alter table profiles
//   add column if not exists preferences jsonb,
//   add column if not exists current_color text;
//
// The frontend then reads/writes `preferences` (JSON) and `current_color` (hex string)
// via the Supabase client above.
