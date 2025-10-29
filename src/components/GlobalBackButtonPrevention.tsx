import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * GlobalBackButtonPrevention Component
 * Prevents browser back button navigation across the entire application
 * Must be used inside a Router component
 */
function GlobalBackButtonPrevention() {
  const location = useLocation();

  useEffect(() => {
    // Prevent back button functionality across the entire application
    const preventBackButton = () => {
      // Push multiple states to completely block back button
      window.history.pushState("", "", window.location.pathname);
      window.history.pushState("", "", window.location.pathname);
      window.history.pushState("", "", window.location.pathname);

      // Register back button click handler
      window.onpopstate = function (e) {
        // Prevent default action on back button click
        e.preventDefault();
        // Push current page back to history immediately
        window.history.pushState("", "", window.location.pathname);
      };
    };

    // Initialize back button prevention
    preventBackButton();

    // Cleanup function
    return () => {
      // Remove the popstate event listener on component unmount
      window.onpopstate = null;
    };
  }, [location.pathname]); // Re-run when route changes

  return null; // This component doesn't render anything
}

export default GlobalBackButtonPrevention;

