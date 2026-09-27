import {
  SUPABASE_URL,
  SUPABASE_KEY
} from "./config.js";

if (!window.supabase) {
  throw new Error(
    "Supabase SDK не загрузился"
  );
}

export const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );