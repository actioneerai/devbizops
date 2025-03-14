import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY, USE_HARDCODED_CREDENTIALS } from './supabaseCredentials';
import config from '../config';

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

// Try to get credentials from multiple sources in priority order
const getCredentials = () => {
  // 1. Check if window.ENV_CONFIG exists (runtime injection)
  if (window.ENV_CONFIG && 
      window.ENV_CONFIG.REACT_APP_SUPABASE_URL && 
      window.ENV_CONFIG.REACT_APP_SUPABASE_ANON_KEY &&
      window.ENV_CONFIG.REACT_APP_SUPABASE_URL !== '%REACT_APP_SUPABASE_URL%' &&
      window.ENV_CONFIG.REACT_APP_SUPABASE_ANON_KEY !== '%REACT_APP_SUPABASE_ANON_KEY%') {
    console.log('Using Supabase credentials from ENV_CONFIG (runtime injection)');
    return {
      url: window.ENV_CONFIG.REACT_APP_SUPABASE_URL,
      key: window.ENV_CONFIG.REACT_APP_SUPABASE_ANON_KEY
    };
  }

  // 2. Check if window.RUNTIME_CONFIG exists (also runtime injection)
  if (window.RUNTIME_CONFIG && 
      window.RUNTIME_CONFIG.REACT_APP_SUPABASE_URL && 
      window.RUNTIME_CONFIG.REACT_APP_SUPABASE_ANON_KEY) {
    console.log('Using Supabase credentials from RUNTIME_CONFIG');
    return {
      url: window.RUNTIME_CONFIG.REACT_APP_SUPABASE_URL,
      key: window.RUNTIME_CONFIG.REACT_APP_SUPABASE_ANON_KEY
    };
  }
  
  // 3. Check if they exist in the config.js file (build-time injection)
  if (config && config.supabase && config.supabase.url && config.supabase.anonKey) {
    console.log('Using Supabase credentials from config.js (build-time injection)');
    return {
      url: config.supabase.url,
      key: config.supabase.anonKey
    };
  }
  
  // 4. Use from imported environment variables (for development)
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    console.log('Using Supabase credentials from environment variables');
    return {
      url: SUPABASE_URL,
      key: SUPABASE_ANON_KEY
    };
  }
  
  // 5. Last resort - check process.env directly
  if (process.env.REACT_APP_SUPABASE_URL && process.env.REACT_APP_SUPABASE_ANON_KEY) {
    console.log('Using Supabase credentials from process.env');
    return {
      url: process.env.REACT_APP_SUPABASE_URL,
      key: process.env.REACT_APP_SUPABASE_ANON_KEY
    };
  }
  
  console.error('Could not find valid Supabase credentials in any source');
  return { url: '', key: '' };
};

// Get the credentials from the best available source
const credentials = getCredentials();
const effectiveSupabaseUrl = credentials.url;
const effectiveSupabaseAnonKey = credentials.key;

// Log environment variables for debugging (without exposing full keys)
console.log('Supabase URL:', effectiveSupabaseUrl ? `Set (${effectiveSupabaseUrl.substring(0, 10)}...)` : 'Not set');
console.log('Supabase Anon Key:', effectiveSupabaseAnonKey ? `Set (${effectiveSupabaseAnonKey.substring(0, 5)}...)` : 'Not set');
console.log('Environment:', process.env.NODE_ENV || 'unknown');
console.log('Available env vars:', Object.keys(process.env).filter(key => key.startsWith('REACT_APP_')).join(', '));
console.log('Window env available:', window.ENV_CONFIG ? 'Yes' : 'No');
console.log('Window runtime config available:', window.RUNTIME_CONFIG ? 'Yes' : 'No');

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
