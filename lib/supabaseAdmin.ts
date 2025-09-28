import { createClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";

// 🚨 Server-only, full access
export const supabaseAdmin = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // never expose to client
    
  );

// 🌐 Browser-safe, respects RLS
export const supabaseBrowser = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
