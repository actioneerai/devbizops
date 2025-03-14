import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY, USE_HARDCODED_CREDENTIALS } from './supabaseCredentials';

// Enhanced debugging
console.log('=================== SUPABASE CLIENT INITIALIZATION ===================');
console.log('Debug values available:', window.DEBUG_VALUES ? 'Yes' : 'No');
if (window.DEBUG_VALUES) {
  console.log('Build time:', window.DEBUG_VALUES.buildTime);
  console.log('SUPABASE_URL set during build:', window.DEBUG_VALUES.REACT_APP_SUPABASE_URL_SET || 'No');
  console.log('SUPABASE_ANON_KEY set during build:', window.DEBUG_VALUES.REACT_APP_SUPABASE_ANON_KEY_SET || 'No');
  console.log('SUPABASE_URL prefix:', window.DEBUG_VALUES.REACT_APP_SUPABASE_URL_PREFIX || 'None');
  console.log('SUPABASE_ANON_KEY prefix:', window.DEBUG_VALUES.REACT_APP_SUPABASE_ANON_KEY_PREFIX || 'None');
}

// Try to get credentials from multiple sources
// 1. Runtime config (injected during build)
// 2. Environment variables (for development)
// 3. Hardcoded values for testing (only if explicitly enabled)
const getRuntimeVar = (name) => {
  // Check if window.RUNTIME_CONFIG exists and has the variable
  if (window.RUNTIME_CONFIG && window.RUNTIME_CONFIG[name] && window.RUNTIME_CONFIG[name] !== 'undefined' && window.RUNTIME_CONFIG[name] !== '') {
    console.log(`${name} found in RUNTIME_CONFIG`);
    return window.RUNTIME_CONFIG[name];
  }
  
  // Fall back to process.env
  if (process.env[name] && process.env[name] !== 'undefined' && process.env[name] !== '') {
    console.log(`${name} found in process.env`);
    return process.env[name];
  }
  
  console.log(`${name} not found in any source`);
  return '';
};

// Get Supabase credentials from runtime config or environment variables
const supabaseUrl = getRuntimeVar('REACT_APP_SUPABASE_URL');
const supabaseAnonKey = getRuntimeVar('REACT_APP_SUPABASE_ANON_KEY');

// For debugging purposes
console.log('Runtime config available:', window.RUNTIME_CONFIG ? 'Yes' : 'No');
if (window.RUNTIME_CONFIG) {
  console.log('RUNTIME_CONFIG contents:', JSON.stringify(window.RUNTIME_CONFIG, null, 2));
}
console.log('Raw SUPABASE_URL:', supabaseUrl || 'Not set');
console.log('Raw SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Has value' : 'No value');

// Use the credentials with fallback to hardcoded values if enabled
let effectiveSupabaseUrl = supabaseUrl || '';
let effectiveSupabaseAnonKey = supabaseAnonKey || '';

// No hardcoded credentials - we only use environment variables

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
