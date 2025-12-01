// Utility function to scroll to top of page
export const scrollToTop = () => {
  window.scrollTo({ 
    top: 0, 
    behavior: 'smooth' 
  });
};

// Hook to add scroll to top functionality on route changes
export const useScrollToTop = () => {
  const scrollToTopOnClick = (callback) => {
    return (...args) => {
      scrollToTop();
      if (callback) {
        callback(...args);
      }
    };
  };

  return { scrollToTopOnClick };
};