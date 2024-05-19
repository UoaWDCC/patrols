import { createClient } from "@supabase/supabase-js";

const supabaseUrl: string = "https://uwfsywtrderpzyneshop.supabase.co";
const supabaseKey: string = import.meta.env.VITE_SUPABASE_KEY as string;

export const supabaseClient = createClient(supabaseUrl, supabaseKey);
