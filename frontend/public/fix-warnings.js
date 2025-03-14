// Configuration initialization
// Ensure window.RUNTIME_CONFIG and window.ENV_CONFIG exist
window.RUNTIME_CONFIG = window.RUNTIME_CONFIG || {};
window.ENV_CONFIG = window.ENV_CONFIG || {};
window.DEBUG_VALUES = window.DEBUG_VALUES || {
  buildTime: new Date().toISOString(),
  REACT_APP_SUPABASE_URL_SET: false,
  REACT_APP_SUPABASE_ANON_KEY_SET: false
};

// Handle missing environment scripts by creating a fallback
document.addEventListener('DOMContentLoaded', function() {
  // Check if runtime-config.js was loaded
  if (!window.RUNTIME_CONFIG.REACT_APP_SUPABASE_URL || window.RUNTIME_CONFIG.REACT_APP_SUPABASE_URL === '') {
    console.warn('runtime-config.js not loaded correctly. Creating fallback configuration.');
    // Create element for runtime config if it doesn't exist
    if (!document.getElementById('runtime-config-fallback')) {
      var runtimeScript = document.createElement('script');
      runtimeScript.id = 'runtime-config-fallback';
      runtimeScript.innerHTML = 'window.RUNTIME_CONFIG = window.RUNTIME_CONFIG || {}';
      document.head.appendChild(runtimeScript);
    }
  }

  // Check if env-config.js was loaded
  if (!window.ENV_CONFIG.REACT_APP_SUPABASE_URL || window.ENV_CONFIG.REACT_APP_SUPABASE_URL === '%REACT_APP_SUPABASE_URL%') {
    console.warn('env-config.js not loaded correctly. Creating fallback configuration.');
    // Create element for env config if it doesn't exist
    if (!document.getElementById('env-config-fallback')) {
      var envScript = document.createElement('script');
      envScript.id = 'env-config-fallback';
      envScript.innerHTML = 'window.ENV_CONFIG = window.ENV_CONFIG || {}';
      document.head.appendChild(envScript);
    }
  }
});

// More comprehensive fix for jQuery deprecation warnings
(function() {
  // Wait for jQuery to be available
  function checkForjQuery() {
    if (window.jQuery) {
      // Fix for DOMSubtreeModified deprecation
      const originalOn = jQuery.fn.on;
      jQuery.fn.on = function() {
        if (arguments[0] && typeof arguments[0] === 'string' && 
            arguments[0].indexOf('DOMSubtreeModified') !== -1) {
          console.log('Intercepted deprecated DOMSubtreeModified event. Using MutationObserver instead.');
          
          // Use MutationObserver instead
          const element = this[0];
          if (element) {
            const callback = arguments[1];
            const observer = new MutationObserver(function(mutations) {
              mutations.forEach(function() {
                callback.call(element);
              });
            });
            
            observer.observe(element, { 
              childList: true,
              subtree: true,
              attributes: true,
              characterData: true
            });
          }
          return this;
        }
        return originalOn.apply(this, arguments);
      };
      
      // Also fix .bind() which might be used for the same event
      const originalBind = jQuery.fn.bind;
      if (originalBind) {
        jQuery.fn.bind = function() {
          if (arguments[0] && typeof arguments[0] === 'string' && 
              arguments[0].indexOf('DOMSubtreeModified') !== -1) {
            console.log('Intercepted deprecated .bind(DOMSubtreeModified)');
            return this;
          }
          return originalBind.apply(this, arguments);
        };
      }
      
      console.log('jQuery compatibility fixes applied');
    } else {
      // Check again in a moment
      setTimeout(checkForjQuery, 50);
    }
  }
  
  // Start checking for jQuery
  checkForjQuery();
})();

// Handle 404 errors and other resource loading issues
window.addEventListener('error', function(e) {
  if (e.target && (e.target.tagName === 'LINK' || e.target.tagName === 'SCRIPT' || e.target.tagName === 'IMG')) {
    console.warn('Resource failed to load:', e.target.src || e.target.href);
    // Prevent the error from showing in console
    e.preventDefault();
  }
}, true);

// Fix for 404 on main page
if (window.location.pathname === '/' && document.querySelector('body') && document.querySelector('body').innerHTML === '') {
  console.log('Detected 404 on main page, attempting to fix routing');
  // Force reload with hash to trigger client-side routing
  if (!window.location.hash) {
    window.location.hash = '#/';
  }
}
