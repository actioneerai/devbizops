/**
 * This script logs all environment variables available during the build process
 */

console.log('=================== DEBUG ENVIRONMENT VARIABLES ===================');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('VERCEL:', process.env.VERCEL);
console.log('VERCEL_ENV:', process.env.VERCEL_ENV);

// Log all environment variables that start with REACT_APP_
const reactAppVars = Object.keys(process.env)
  .filter(key => key.startsWith('REACT_APP_'))
  .reduce((obj, key) => {
    obj[key] = process.env[key] || 'undefined';
    return obj;
  }, {});

console.log('REACT_APP_ variables:', JSON.stringify(reactAppVars, null, 2));

// Log all environment variables
console.log('All environment variables (keys only):');
console.log(Object.keys(process.env).join(', '));
console.log('================================================================');
