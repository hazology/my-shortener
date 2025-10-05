import { createClient } from "@supabase/supabase-js";

// 서버 전용 (Service Role Key)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
