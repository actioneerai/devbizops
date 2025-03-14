import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { useNotification } from './NotificationContext';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component that wraps the app and makes auth object available to any
// child component that calls useAuth().
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Get notification functions with fallbacks in case the context isn't available yet
  const notificationContext = useNotification();
  const success = notificationContext?.success || (msg => console.log('Success:', msg));
  const showError = notificationContext?.error || (msg => console.error('Error:', msg));



  useEffect(() => {
    // Check for existing session on component mount
    const checkUser = async () => {
      try {
        const { data: sessionData } = await authService.getCurrentSession();
        if (sessionData?.session) {
          const { data, error } = await authService.getCurrentUser();
          
          if (error) {
            console.error('Error fetching user:', error);
            setUser(null);
          } else if (data) {
            setUser(data);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  // Login function
  const login = async (email, password, rememberMe = false) => {
    setLoading(true);
    try {
      const { data, error } = await authService.login(email, password);
      
      if (error) {
        showError(error.message || 'Login failed');
        return { error };
      }
      
      if (data?.user) {
        setUser(data.user);
        success('Login successful');
        return { success: true };
      }
      
      showError('Login failed');
      return { error: { message: 'Login failed' } };
    } catch (err) {
      showError('An unexpected error occurred');
      return { error: { message: 'An unexpected error occurred' } };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (email, password, userData) => {
    setLoading(true);
    try {
      const { data, error } = await authService.register(email, password, userData);
      
      if (error) {
        showError(error.message || 'Registration failed');
        return { error };
      }
      
      if (data?.user) {
        // Set the user from the session data if available, otherwise use the user data
        if (data.session) {
          console.log('Setting user from session after registration');
          setUser(data.user);
          success('Registration successful');
          return { success: true };
        } else {
          console.log('No session data after registration, checking current user');
          // Double-check if we have a current user
          const { data: userData } = await authService.getCurrentUser();
          if (userData) {
            console.log('Found current user after registration');
            setUser(userData);
            success('Registration successful');
            return { success: true };
          } else {
            console.log('No current user found after registration');
            setUser(data.user); // Fall back to the original user data
            success('Registration successful');
            return { success: true };
          }
        }
      }
      
      showError('Registration failed');
      return { error: { message: 'Registration failed' } };
    } catch (err) {
      console.error('Registration error:', err);
      showError('An unexpected error occurred');
      return { error: { message: 'An unexpected error occurred' } };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const { error } = await authService.logout();
      
      if (error) {
        console.error('Logout error:', error);
        showError(error.message || 'Logout failed');
      } else {
        success('Logged out successfully');
      }
      
      setUser(null);
      navigate('/');
    } catch (err) {
      console.error('Unexpected logout error:', err);
      showError('An unexpected error occurred during logout');
    }
  };

  // Reset password function
  const resetPassword = async (email) => {
    try {
      const { error } = await authService.resetPassword(email);
      
      if (error) {
        showError(error.message || 'Password reset failed');
        return { error };
      }
      
      success('Password reset instructions sent to your email');
      return { success: true };
    } catch (err) {
      showError('An unexpected error occurred');
      return { error: { message: 'An unexpected error occurred' } };
    }
  };

  // Update password function
  const updatePassword = async (currentPassword, newPassword) => {
    try {
      const { error } = await authService.updatePassword(currentPassword, newPassword);
      
      if (error) {
        showError(error.message || 'Password update failed');
        return { error };
      }
      
      success('Password updated successfully');
      return { success: true };
    } catch (err) {
      showError('An unexpected error occurred');
      return { error: { message: 'An unexpected error occurred' } };
    }
  };
  
  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      const { data, error } = await authService.updateProfile(profileData);
      
      if (error) {
        showError(error.message || 'Profile update failed');
        return { error };
      }
      
      if (data?.user) {
        setUser(data.user);
        success('Profile updated successfully');
        return { success: true };
      }
      
      showError('Profile update failed');
      return { error: { message: 'Profile update failed' } };
    } catch (err) {
      showError('An unexpected error occurred');
      return { error: { message: 'An unexpected error occurred' } };
    }
  };

  // Value object that will be passed to any consuming components
  const value = {
    user,
    loading,
    login,
    register,
    logout,
    resetPassword,
    updatePassword,
    updateProfile,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
