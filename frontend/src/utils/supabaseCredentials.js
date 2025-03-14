/**
 * Supabase credentials configuration
 * 
 * IMPORTANT: This file does NOT contain any actual credentials
 * All credentials must be set in environment variables
 */

// Flag to control whether to use environment variables from window.ENV
// This should be false in production where Vercel environment variables are used directly
export const USE_HARDCODED_CREDENTIALS = false;

// Export these constants for use in supabaseClient.js
export const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Log environment variable status
if (!SUPABASE_URL) {
  console.error('REACT_APP_SUPABASE_URL is not defined in environment variables.');
}
if (!SUPABASE_ANON_KEY) {
  console.error('REACT_APP_SUPABASE_ANON_KEY is not defined in environment variables.');
}
