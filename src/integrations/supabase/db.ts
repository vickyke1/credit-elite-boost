import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "./client";

// The generated `types.ts` does not yet include the checkout tables (orders,
// order_items, etc.) because they were added by a later migration and types
// are only regenerated via the Supabase CLI. Until then, use this untyped
// view of the same client for the new tables so the app still type-checks.
// All security is enforced by RLS + edge functions, not by the TS types.
export const db = supabase as unknown as SupabaseClient;
