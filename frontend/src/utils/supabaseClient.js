import { createClient } from '@supabase/supabase-js';
import config from '../config';

// Get Supabase credentials from our config file
const supabaseUrl = config.supabase.url;
const supabaseAnonKey = config.supabase.anonKey;

// For debugging, also check direct environment variables
const envSupabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const envSupabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Use the most reliable source of credentials
const effectiveSupabaseUrl = supabaseUrl || envSupabaseUrl || '';
const effectiveSupabaseAnonKey = supabaseAnonKey || envSupabaseAnonKey || '';

// Log environment variables for debugging (without exposing full keys)
console.log('Supabase URL:', effectiveSupabaseUrl ? 'Set' : 'Not set');
console.log('Supabase Anon Key:', effectiveSupabaseAnonKey ? 'Set' : 'Not set');
console.log('Environment:', process.env.NODE_ENV);
console.log('Available env vars:', Object.keys(process.env).filter(key => key.startsWith('REACT_APP_')).join(', '));
console.log('Effective URL:', effectiveSupabaseUrl ? 'Valid' : 'Invalid');
console.log('Effective Key:', effectiveSupabaseAnonKey ? 'Valid' : 'Invalid');

// Check if environment variables are properly set
if (!effectiveSupabaseUrl || !effectiveSupabaseAnonKey) {
  console.warn('Supabase environment variables not properly configured. Using mock client.');
  console.warn('Please ensure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY are set in Vercel environment variables.');
}

// Create a single supabase client for interacting with the database
let supabase;

try {
  // Create the Supabase client with proper error handling
  if (!effectiveSupabaseUrl || !effectiveSupabaseAnonKey) {
    throw new Error('Supabase environment variables are missing. Please check Vercel environment configuration.');
  }
  supabase = createClient(effectiveSupabaseUrl, effectiveSupabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });
  
  // Test the connection
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('Supabase auth state changed:', event, session ? 'Session exists' : 'No session');
  });
  
  console.log('Supabase client initialized successfully');
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  
  // Create a mock client with dummy methods for development
  supabase = {
    auth: {
      signUp: () => {
        console.log('Mock signUp called');
        return Promise.resolve({ data: { user: null }, error: { message: 'Using mock Supabase client' } });
      },
      signInWithPassword: (credentials) => {
        console.log('Mock signInWithPassword called with:', credentials.email);
        return Promise.resolve({ data: { user: null }, error: { message: 'Using mock Supabase client' } });
      },
      signOut: () => {
        console.log('Mock signOut called');
        return Promise.resolve({ error: null });
      },
      onAuthStateChange: (callback) => {
        console.log('Mock onAuthStateChange called');
        return { data: { subscription: { unsubscribe: () => {} } } };
      },
      getUser: () => {
        console.log('Mock getUser called');
        return Promise.resolve({ data: { user: null }, error: null });
      },
      getSession: () => {
        console.log('Mock getSession called');
        return Promise.resolve({ data: { session: null }, error: null });
      },
    },
    from: (table) => {
      console.log(`Mock query on table: ${table}`);
      return {
        select: (...args) => {
          console.log(`Mock select on ${table}:`, args);
          return Promise.resolve({ data: [], error: null });
        },
        insert: (data) => {
          console.log(`Mock insert on ${table}:`, data);
          return Promise.resolve({ data: null, error: null });
        },
        update: (data) => {
          console.log(`Mock update on ${table}:`, data);
          return Promise.resolve({ data: null, error: null });
        },
        delete: () => {
          console.log(`Mock delete on ${table}`);
          return Promise.resolve({ data: null, error: null });
        },
      };
    },
  };
}

export default supabase;
