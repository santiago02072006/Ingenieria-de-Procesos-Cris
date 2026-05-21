import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente Supabase para componentes de cliente (navegador).
 * Usa cookies gestionadas por @supabase/ssr para alinear la sesión con el middleware.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY en el entorno.");
  }

  return createBrowserClient(url, anonKey);
}
