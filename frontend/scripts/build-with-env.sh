#!/bin/bash
# This script runs the build process with environment variables

# Set environment variables for the build
echo "Building with environment variables:"
echo "REACT_APP_SUPABASE_URL: ${REACT_APP_SUPABASE_URL:+"Set"}"
echo "REACT_APP_SUPABASE_ANON_KEY: ${REACT_APP_SUPABASE_ANON_KEY:+"Set"}"

# Run the standard build process
echo "Running react-scripts build..."
CI=false react-scripts build

# Create a simple config file for Supabase in the build
echo "Creating runtime configuration..."
cat > build/config.js << EOL
// Runtime configuration
window.SUPABASE_CONFIG = {
  url: "${REACT_APP_SUPABASE_URL}",
  key: "${REACT_APP_SUPABASE_ANON_KEY}"
};
EOL

echo "Build completed successfully"