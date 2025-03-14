// API endpoint to securely provide environment variables to the frontend
// This runs on the server side in Vercel and has access to environment variables

export default function handler(req, res) {
  // Set CORS headers to allow requests from your domain
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Return only the necessary environment variables
  // This is safer than returning all environment variables
  res.status(200).json({
    // Only return that the variables exist, not their actual values
    // The actual values will be used server-side in the API endpoints
    supabaseUrl: process.env.REACT_APP_SUPABASE_URL ? true : false,
    supabaseAnonKey: process.env.REACT_APP_SUPABASE_ANON_KEY ? true : false
  });
}
