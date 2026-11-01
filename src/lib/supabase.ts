import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://taqmrxzebtelhzzehhed.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_xvtbe_-F8vHV1IBvyv3rfA_bExPZVek';

export const supabase = createClient(supabaseUrl, supabaseKey);
