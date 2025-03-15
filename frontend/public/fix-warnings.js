// Handle 404 errors and other resource loading issues
window.addEventListener('error', function(e) {
  if (e.target && (e.target.tagName === 'LINK' || e.target.tagName === 'SCRIPT' || e.target.tagName === 'IMG')) {
    console.warn('Resource failed to load:', e.target.src || e.target.href);
    // Prevent the error from showing in console
    e.preventDefault();
  }
}, true);

// jQuery deprecation warnings fix
(function() {
  function checkForjQuery() {
    if (window.jQuery) {
      // Fix for DOMSubtreeModified deprecation
      const originalOn = jQuery.fn.on;
      jQuery.fn.on = function() {
        if (arguments[0] && typeof arguments[0] === 'string' && 
            arguments[0].indexOf('DOMSubtreeModified') !== -1) {
          const element = this[0];
          if (element) {
            const callback = arguments[1];
            const observer = new MutationObserver(function(mutations) {
              mutations.forEach(function() {
                callback.call(element);
              });
            });
            observer.observe(element, { 
              childList: true, subtree: true, 
              attributes: true, characterData: true 
            });
          }
          return this;
        }
        return originalOn.apply(this, arguments);
      };
      
      // Also fix .bind() for the same event
      const originalBind = jQuery.fn.bind;
      if (originalBind) {
        jQuery.fn.bind = function() {
          if (arguments[0] && typeof arguments[0] === 'string' && 
              arguments[0].indexOf('DOMSubtreeModified') !== -1) {
            return this;
          }
          return originalBind.apply(this, arguments);
        };
      }
    } else {
      setTimeout(checkForjQuery, 50);
    }
  }
  checkForjQuery();
})();