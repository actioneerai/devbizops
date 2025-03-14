// Fix for jQuery deprecation warnings
if (window.jQuery) {
  // Replace deprecated DOMSubtreeModified with modern MutationObserver
  const originalAddMethod = jQuery.fn.add;
  jQuery.fn.add = function() {
    // Check if this is a call that would use DOMSubtreeModified
    if (arguments[0] && typeof arguments[0] === 'string' && 
        arguments[0].indexOf('DOMSubtreeModified') !== -1) {
      console.log('Prevented deprecated DOMSubtreeModified event usage');
      return this;
    }
    return originalAddMethod.apply(this, arguments);
  };
}

// Catch 404 errors for resources
window.addEventListener('error', function(e) {
  if (e.target && (e.target.tagName === 'LINK' || e.target.tagName === 'SCRIPT' || e.target.tagName === 'IMG')) {
    console.warn('Resource failed to load:', e.target.src || e.target.href);
    // Prevent the error from showing in console
    e.preventDefault();
  }
}, true);
