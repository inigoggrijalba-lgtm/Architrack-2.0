import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../constants';

// Only create the client if the URL is provided
export const supabase = SUPABASE_URL 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;
