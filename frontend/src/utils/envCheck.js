// Environment variable check utility
export const checkEnvironmentVariables = () => {
  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    // List all React App environment variables without exposing values
    reactAppVars: Object.keys(process.env)
      .filter(key => key.startsWith('REACT_APP_'))
      .reduce((obj, key) => {
        obj[key] = process.env[key] ? 'Set' : 'Not set';
        return obj;
      }, {})
  };
  
  console.log('Environment Check:', envVars);
  return envVars;
};

export default checkEnvironmentVariables;
