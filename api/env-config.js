// This is a Vercel serverless function that will replace the placeholders in env-config.js
// with the actual environment variables at runtime

export default function handler(req, res) {
  // Get the content of the env-config.js file
  let content = `window.ENV_CONFIG = {
  REACT_APP_SUPABASE_URL: "${process.env.REACT_APP_SUPABASE_URL || ''}",
  REACT_APP_SUPABASE_ANON_KEY: "${process.env.REACT_APP_SUPABASE_ANON_KEY || ''}"
};`;

  // Set the content type to JavaScript
  res.setHeader('Content-Type', 'application/javascript');
  
  // Set cache control headers to prevent caching
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  // Return the content
  res.status(200).send(content);
}
