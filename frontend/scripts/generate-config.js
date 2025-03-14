/**
 * This script generates a config.js file with environment variables at build time
 * It's designed to be run as part of the Vercel build process
 */

const fs = require('fs');
const path = require('path');

// Get environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';
const nodeEnv = process.env.NODE_ENV || 'production';

// Log what we're doing
console.log('Generating config.js with environment variables');
console.log(`Environment: ${nodeEnv}`);
console.log(`Supabase URL: ${supabaseUrl ? 'Set' : 'Not set'}`);
console.log(`Supabase Anon Key: ${supabaseAnonKey ? 'Set' : 'Not set'}`);

// Create the config content
const configContent = `/**
 * Application configuration
 * This file is auto-generated during the build process - DO NOT EDIT MANUALLY
 * Generated on: ${new Date().toISOString()}
 */

const config = {
  supabase: {
    url: "${supabaseUrl}",
    anonKey: "${supabaseAnonKey}"
  },
  environment: "${nodeEnv}"
};

export default config;`;

// Write the config file
const configPath = path.join(__dirname, '..', 'src', 'config.js');
fs.writeFileSync(configPath, configContent);

console.log(`Config file written to ${configPath}`);
