/**
 * Application configuration
 */

const config = {
  supabase: {
    url: process.env.REACT_APP_SUPABASE_URL || '',
    anonKey: process.env.REACT_APP_SUPABASE_ANON_KEY || ''
  },
  environment: process.env.NODE_ENV || 'production'
};

export default config;