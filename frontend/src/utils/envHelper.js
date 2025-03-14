/**
 * Environment variable helper utility
 * Helps handle environment variables in Create React App across different environments
 */

/**
 * Gets an environment variable with proper validation
 * @param {string} name - The name of the environment variable
 * @param {string} defaultValue - Default value if not found
 * @returns {string|null} The environment variable value or null
 */
export const getEnvVariable = (name, defaultValue = null) => {
  const value = process.env[name];
  
  // Check if the value exists and is not an empty string
  if (value && value.trim() !== '') {
    return value;
  }
  
  return defaultValue;
};

export default {
  getEnvVariable
};
