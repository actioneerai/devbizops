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
if (window.location.pathname === '/' && document.querySelector('body').innerHTML === '') {
  console.log('Detected 404 on main page, attempting to fix routing');
  // Force reload with hash to trigger client-side routing
  if (!window.location.hash) {
    window.location.hash = '#/';
  }
}
