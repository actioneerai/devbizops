#!/bin/bash
# This script runs the build process and injects environment variables into the debug.html file

# Echo environment variables for debugging (without showing full values)
echo "Building with environment variables:"
echo "REACT_APP_SUPABASE_URL: ${REACT_APP_SUPABASE_URL:0:5}..."
echo "REACT_APP_SUPABASE_ANON_KEY: ${REACT_APP_SUPABASE_ANON_KEY:0:5}..."

# Run the standard build process
CI=false react-scripts build

# Replace placeholders in debug.html with actual environment variables
if [ -f "build/debug.html" ]; then
  echo "Injecting environment variables into debug.html"
  # Use sed to replace placeholders with actual values
  sed -i.bak "s|%REACT_APP_SUPABASE_URL%|${REACT_APP_SUPABASE_URL}|g" build/debug.html
  sed -i.bak "s|%REACT_APP_SUPABASE_ANON_KEY%|${REACT_APP_SUPABASE_ANON_KEY}|g" build/debug.html
  # Remove backup files
  rm build/debug.html.bak
  echo "Environment variables injected into debug.html"
else
  echo "debug.html not found in build directory"
fi

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
