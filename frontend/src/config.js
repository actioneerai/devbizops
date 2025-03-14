/**
 * Application configuration
 * This file will be replaced during the build process with environment-specific values
 */

const config = {
  supabase: {
    url: process.env.REACT_APP_SUPABASE_URL || '',
    anonKey: process.env.REACT_APP_SUPABASE_ANON_KEY || ''
  },
  environment: process.env.NODE_ENV || 'development'
};

export default config;
