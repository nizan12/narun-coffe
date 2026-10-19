import { createClient } from "@supabase/supabase-js";

/**
 * Membuat Supabase client untuk dipakai di sisi server
 * (Server Component, Server Action, Route Handler).
 * Jangan impor file ini dari komponen "use client".
 */
export function buatClientServer() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) {
    throw new Error(
      "Environment variable SUPABASE_URL dan SUPABASE_SECRET_KEY harus diisi."
    );
  }

  return createClient(url, key);
}
