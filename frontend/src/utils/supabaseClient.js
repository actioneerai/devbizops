import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Log environment variables for debugging (without exposing full keys)
console.log('Supabase URL:', supabaseUrl ? 'Set' : 'Not set');
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Set' : 'Not set');
console.log('Environment:', process.env.NODE_ENV);
console.log('Available env vars:', Object.keys(process.env).filter(key => key.startsWith('REACT_APP_')).join(', '));

// Check if environment variables are properly set
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not properly configured. Using mock client.');
  console.warn('Please ensure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY are set in Vercel environment variables.');
}

// Create a single supabase client for interacting with the database
let supabase;

try {
  // Create the Supabase client with proper error handling
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables are missing. Please check Vercel environment configuration.');
  }
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
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
