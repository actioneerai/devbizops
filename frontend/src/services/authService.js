import supabase from '../utils/supabaseClient';

/**
 * Authentication service for handling user registration, login, and session management
 */
const authService = {
  /**
   * Register a new user
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @param {Object} userData - Additional user data (name, role, etc.)
   * @returns {Promise} - Promise with the registration result
   */
  register: async (email, password, userData = {}) => {
    try {
      console.log('Attempting to register user:', email);
      
      // Use Supabase directly for registration
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      
      if (error) {
        console.error('Registration error:', error.message);
        return { data: null, error };
      }
      
      console.log('User registered successfully');
      return { data, error: null };
    } catch (error) {
      console.error('Unexpected error during registration:', error);
      return { data: null, error };
    }
  },

  /**
   * Log in an existing user
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise} - Promise with the login result
   */
  login: async (email, password) => {
    try {
      console.log('Attempting login for:', email);
      
      // Use Supabase directly for login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Login error:', error.message);
        return { data: null, error };
      }

      console.log('Login successful for:', email);
      return { data, error: null };
    } catch (error) {
      console.error('Unexpected error during login:', error);
      return { data: null, error };
    }
  },

  /**
   * Log out the current user
   * @returns {Promise} - Promise with the logout result
   */
  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  /**
   * Get the current user session
   * @returns {Promise} - Promise with the current session
   */
  getCurrentSession: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Get the current user
   * @returns {Promise} - Promise with the current user
   */
  getCurrentUser: async () => {
    try {
      console.log('Getting current user...');
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Error getting current user:', error);
        throw error;
      }
      
      console.log('Current user data:', data?.user ? 'User found' : 'No user');
      return { data: data?.user, error: null };
    } catch (error) {
      console.error('Unexpected error in getCurrentUser:', error);
      return { data: null, error };
    }
  },

  /**
   * Reset password for a user
   * @param {string} email - User's email
   * @returns {Promise} - Promise with the reset password result
   */
  resetPassword: async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  /**
   * Update user password
   * @param {string} currentPassword - Current password for verification
   * @param {string} newPassword - New password
   * @returns {Promise} - Promise with the update password result
   */
  updatePassword: async (currentPassword, newPassword) => {
    try {
      // First verify the current password by attempting to sign in
      const { data: userData } = await supabase.auth.getUser();
      if (!userData || !userData.user) {
        throw new Error('User not authenticated');
      }
      
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userData.user.email,
        password: currentPassword,
      });
      
      if (signInError) {
        throw new Error('Current password is incorrect');
      }
      
      // If verification successful, update the password
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  },
  
  /**
   * Update user profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise} - Promise with the update profile result
   */
  updateProfile: async (profileData) => {
    try {
      // First update auth metadata
      const { data, error } = await supabase.auth.updateUser({
        data: profileData,
      });
      
      if (error) throw error;
      
      // Then update the profiles table if it exists
      if (data && data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert([
            {
              id: data.user.id,
              name: profileData.name,
              role: profileData.role,
              company: profileData.company,
              updated_at: new Date(),
            },
          ], { onConflict: 'id' });

        if (profileError) throw profileError;
      }
      
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
};

export default authService;