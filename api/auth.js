// API endpoint for authentication operations
// This runs server-side in Vercel and has access to environment variables
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with server-side environment variables
const getSupabaseClient = () => {
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables are not configured');
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
};

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const supabase = getSupabaseClient();
    const { action, email, password } = req.body;
    
    // Handle different authentication actions
    switch (action) {
      case 'signup':
        // Sign up without email confirmation
        const { data: signupData, error: signupError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            // Skip email verification
            data: {
              email_confirmed: true
            }
          }
        });
        
        if (signupError) {
          return res.status(400).json({ error: signupError.message });
        }
        
        return res.status(200).json({ user: signupData.user });
        
      case 'signin':
        const { data: signinData, error: signinError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signinError) {
          return res.status(400).json({ error: signinError.message });
        }
        
        return res.status(200).json({ 
          user: signinData.user,
          session: signinData.session
        });
        
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('Auth API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
