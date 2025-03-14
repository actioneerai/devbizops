/**
 * This script generates config files with environment variables at build time
 * It's designed to be run as part of the Vercel build process
 */

const fs = require('fs');
const path = require('path');

// Get environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';
const nodeEnv = process.env.NODE_ENV || 'production';

// Log what we're doing
console.log('Generating config files with environment variables');
console.log(`Environment: ${nodeEnv}`);
console.log(`Supabase URL: ${supabaseUrl ? 'Set' : 'Not set'}`);
console.log(`Supabase Anon Key: ${supabaseAnonKey ? 'Set' : 'Not set'}`);

// Create the config.js content for the src directory
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

// Write the src/config.js file
const configPath = path.join(__dirname, '..', 'src', 'config.js');
fs.writeFileSync(configPath, configContent);
console.log(`Config file written to ${configPath}`);

// Create the runtime-config.js content for the public directory
const runtimeConfigContent = `// This file is auto-generated during the build process
window.RUNTIME_CONFIG = {
  REACT_APP_SUPABASE_URL: "${supabaseUrl}",
  REACT_APP_SUPABASE_ANON_KEY: "${supabaseAnonKey}"
};`;

// Write the public/runtime-config.js file
const runtimeConfigPath = path.join(__dirname, '..', 'public', 'runtime-config.js');
fs.writeFileSync(runtimeConfigPath, runtimeConfigContent);
console.log(`Runtime config file written to ${runtimeConfigPath}`);

// Create the env-config.js content for the public directory (matching the placeholder format)
const envConfigContent = `// This file is auto-generated during the build process
window.ENV_CONFIG = {
  REACT_APP_SUPABASE_URL: "${supabaseUrl}",
  REACT_APP_SUPABASE_ANON_KEY: "${supabaseAnonKey}"
};`;

// Write the public/env-config.js file
const envConfigPath = path.join(__dirname, '..', 'public', 'env-config.js');
fs.writeFileSync(envConfigPath, envConfigContent);
console.log(`Env config file written to ${envConfigPath}`);

// Create a debug values file
const debugContent = `// This file is auto-generated during the build process
window.DEBUG_VALUES = {
  buildTime: "${new Date().toISOString()}",
  REACT_APP_SUPABASE_URL_SET: ${supabaseUrl ? "true" : "false"},
  REACT_APP_SUPABASE_ANON_KEY_SET: ${supabaseAnonKey ? "true" : "false"},
  REACT_APP_SUPABASE_URL_PREFIX: "${supabaseUrl.substring(0, 10)}...",
  REACT_APP_SUPABASE_ANON_KEY_PREFIX: "${supabaseAnonKey.substring(0, 5)}..."
};`;

// Write the public/debug-values.js file
const debugPath = path.join(__dirname, '..', 'public', 'debug-values.js');
fs.writeFileSync(debugPath, debugContent);
console.log(`Debug values file written to ${debugPath}`);