import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackPageVisit, trackClickEvents } from "../services/analyticsApi";

// Custom hook for analytics tracking
export const useAnalytics = () => {
  const location = useLocation();
  const pageStartTime = useRef(Date.now());
  const clickBuffer = useRef([]);
  const clickTimeoutRef = useRef(null);

  // Track page visit on location change
  useEffect(() => {
    const handlePageVisit = () => {
      const pageData = {
        page_path: location.pathname,
        referrer: document.referrer || "",
      };

      trackPageVisit(pageData);
    };

    handlePageVisit();
  }, [location.pathname]);

  // Send any remaining click events on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Send any remaining click events
      if (clickBuffer.current.length > 0) {
        sendClickEvents();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [location.pathname]);

  // Function to send click events
  const sendClickEvents = () => {
    if (clickBuffer.current.length > 0) {
      const clickData = {
        page_path: location.pathname,
        click_events: [...clickBuffer.current],
      };

      trackClickEvents(clickData);
      clickBuffer.current = [];
    }
  };

  // Track click events
  useEffect(() => {
    const handleClick = (event) => {
      const target = event.target;

      // Only track meaningful clicks (buttons, links, form elements)
      const trackableElements = ["BUTTON", "A", "INPUT", "SELECT", "TEXTAREA"];
      const isTrackable =
        trackableElements.includes(target.tagName) ||
        target.getAttribute("role") === "button" ||
        target.classList.contains("clickable");

      if (!isTrackable) return;

      const clickEvent = {
        element_id: target.id || "",
        element_class: target.className || "",
        element_text: target.textContent?.trim().substring(0, 100) || "",
        element_tag: target.tagName.toLowerCase(),
        click_timestamp: new Date().toISOString(),
        page_path: location.pathname,
      };

      clickBuffer.current.push(clickEvent);

      // Send click events immediately
      sendClickEvents();
    };

    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, [location.pathname]);

  // Return analytics functions for manual tracking if needed
  return {
    trackCustomEvent: (eventData) => {
      const clickEvent = {
        ...eventData,
        click_timestamp: new Date().toISOString(),
        page_path: location.pathname,
      };
      clickBuffer.current.push(clickEvent);

      if (clickBuffer.current.length >= 10) {
        sendClickEvents();
      }
    },
    flushEvents: sendClickEvents,
  };
};

// Higher-order component for analytics tracking
export const withAnalytics = (WrappedComponent) => {
  return function AnalyticsWrapper(props) {
    useAnalytics();
    return <WrappedComponent {...props} />;
  };
};
