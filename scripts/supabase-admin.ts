import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Load .env.local (dotenv/config only loads .env by default)
config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
	console.error(
		"Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local",
	);
	process.exit(1);
}

// Admin client that bypasses RLS (uses service role key)
export const supabase = createClient(supabaseUrl, serviceRoleKey, {
	auth: { persistSession: false },
});
