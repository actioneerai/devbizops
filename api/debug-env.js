// This is a Vercel serverless function that will output environment variables
// for debugging purposes

export default function handler(req, res) {
  // Get all environment variables
  const envVars = process.env;
  
  // Create a safe version that doesn't expose full values of sensitive variables
  const safeEnvVars = {};
  
  // Process each environment variable
  Object.keys(envVars).forEach(key => {
    // For sensitive variables, just indicate they're set without showing values
    if (key.includes('KEY') || key.includes('SECRET') || key.includes('PASSWORD') || key.includes('TOKEN')) {
      safeEnvVars[key] = envVars[key] ? '[SET]' : '[NOT SET]';
    } else {
      // For non-sensitive variables, show first few characters
      const value = envVars[key];
      safeEnvVars[key] = value ? `${value.substring(0, 4)}...` : '[NOT SET]';
    }
  });
  
  // Return the safe environment variables
  res.status(200).json({
    message: 'Environment variables debug information',
    environment: process.env.NODE_ENV || 'unknown',
    reactAppVars: Object.keys(process.env)
      .filter(key => key.startsWith('REACT_APP_'))
      .reduce((obj, key) => {
        obj[key] = process.env[key] ? '[SET]' : '[NOT SET]';
        return obj;
      }, {}),
    // Include specific variables we're interested in
    supabaseUrl: process.env.REACT_APP_SUPABASE_URL ? '[SET]' : '[NOT SET]',
    supabaseAnonKey: process.env.REACT_APP_SUPABASE_ANON_KEY ? '[SET]' : '[NOT SET]'
  });
}
