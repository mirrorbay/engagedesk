import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Custom hook that scrolls to the top of the page whenever the route changes
 */
export const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when pathname changes
    window.scrollTo(0, 0);
  }, [pathname]);
};

export default useScrollToTop;
