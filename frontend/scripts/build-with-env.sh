#!/bin/bash
# This script runs the build process and injects environment variables into the debug.html file

# Run the debug environment script to see what variables are available
echo "Running debug environment script..."
node scripts/debug-env.js

# Echo environment variables for debugging (without showing full values)
echo "Building with environment variables:"
echo "REACT_APP_SUPABASE_URL: ${REACT_APP_SUPABASE_URL:+"Set (starts with ${REACT_APP_SUPABASE_URL:0:5})"}"
echo "REACT_APP_SUPABASE_ANON_KEY: ${REACT_APP_SUPABASE_ANON_KEY:+"Set (starts with ${REACT_APP_SUPABASE_ANON_KEY:0:5})"}"

# Manually set the Supabase credentials if they're not available
# This is a fallback for testing - in production, these should be set in Vercel
if [ -z "$REACT_APP_SUPABASE_URL" ] || [ -z "$REACT_APP_SUPABASE_ANON_KEY" ]; then
  echo "WARNING: Environment variables not found, checking for .env.production file"
  if [ -f "../.env.production" ]; then
    echo "Found .env.production file, sourcing it"
    source ../.env.production
    echo "After sourcing: REACT_APP_SUPABASE_URL: ${REACT_APP_SUPABASE_URL:+"Set"}"
    echo "After sourcing: REACT_APP_SUPABASE_ANON_KEY: ${REACT_APP_SUPABASE_ANON_KEY:+"Set"}"
  else
    echo "No .env.production file found"
  fi
fi

# Run the standard build process
echo "Running react-scripts build..."
CI=false react-scripts build

# Create a runtime-config.js file with environment variables
echo "Creating runtime-config.js with environment variables"
cat > build/runtime-config.js << EOL
// Runtime configuration generated during build
// Generated on: $(date)
window.RUNTIME_CONFIG = {
  REACT_APP_SUPABASE_URL: "${REACT_APP_SUPABASE_URL}",
  REACT_APP_SUPABASE_ANON_KEY: "${REACT_APP_SUPABASE_ANON_KEY}"
};
EOL
echo "runtime-config.js created"

# Create a debug file to show what was actually injected
echo "Creating debug-values.js with actual injected values"
cat > build/debug-values.js << EOL
// Debug values generated during build
// Generated on: $(date)
window.DEBUG_VALUES = {
  buildTime: "$(date)",
  REACT_APP_SUPABASE_URL_SET: "${REACT_APP_SUPABASE_URL:+yes}",
  REACT_APP_SUPABASE_ANON_KEY_SET: "${REACT_APP_SUPABASE_ANON_KEY:+yes}",
  REACT_APP_SUPABASE_URL_PREFIX: "${REACT_APP_SUPABASE_URL:0:5}",
  REACT_APP_SUPABASE_ANON_KEY_PREFIX: "${REACT_APP_SUPABASE_ANON_KEY:0:5}"
};
EOL
echo "debug-values.js created"
