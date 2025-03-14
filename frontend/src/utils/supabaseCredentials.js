import { createClient } from '@supabase/supabase-js';

/**
 * Supabase credentials configuration
 * 
 * IMPORTANT: This file does NOT contain any actual credentials
 * All credentials must be set in environment variables
 */

// Flag to control whether to use environment variables from window.ENV
// This should be false in production where Vercel environment variables are used directly
export const USE_HARDCODED_CREDENTIALS = false;

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error('REACT_APP_SUPABASE_URL is not defined in environment variables.');
}
if (!supabaseAnonKey) {
  console.error('REACT_APP_SUPABASE_ANON_KEY is not defined in environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export { supabase };
