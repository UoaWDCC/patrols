import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase credentials are not properly set in the environment variables.");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
