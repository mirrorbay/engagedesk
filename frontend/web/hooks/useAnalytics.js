import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  trackPageVisit,
  trackClickEvents,
  trackVisitDuration,
  trackScrollEvents,
} from "../services/analyticsService";

// Custom hook for analytics tracking
export const useAnalytics = () => {
  const location = useLocation();
  const pageStartTime = useRef(Date.now());
  const clickBuffer = useRef([]);
  const clickTimeoutRef = useRef(null);
  const scrollBuffer = useRef([]);
  const maxScrollDepth = useRef(0);
  const lastScrollTime = useRef(Date.now());
  const scrollTimeoutRef = useRef(null);

  // Track page visit on location change
  useEffect(() => {
    const handlePageVisit = () => {
      const pageData = {
        page_path: location.pathname,
        referrer: document.referrer || "",
      };

      trackPageVisit(pageData);

      // Reset tracking variables for new page
      pageStartTime.current = Date.now();
      maxScrollDepth.current = 0;
      scrollBuffer.current = [];
    };

    handlePageVisit();
  }, [location.pathname]);

  // Track visit duration and send data on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Calculate visit duration
      const visitDuration = Date.now() - pageStartTime.current;

      // Send visit duration
      if (visitDuration > 1000) {
        // Only track if stayed more than 1 second
        trackVisitDuration({
          page_path: location.pathname,
          visit_duration: visitDuration,
        });
      }

      // Send any remaining click events
      if (clickBuffer.current.length > 0) {
        sendClickEvents();
      }

      // Send any remaining scroll events
      if (scrollBuffer.current.length > 0) {
        sendScrollEvents();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        handleBeforeUnload();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
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

  // Function to send scroll events
  const sendScrollEvents = () => {
    if (scrollBuffer.current.length > 0) {
      const scrollData = {
        page_path: location.pathname,
        scroll_events: [...scrollBuffer.current],
        max_scroll_depth: maxScrollDepth.current,
      };

      trackScrollEvents(scrollData);
      scrollBuffer.current = [];
    }
  };

  // Track scroll events (only for homepage)
  useEffect(() => {
    // Only track scroll events on homepage
    if (location.pathname !== "/") {
      return;
    }

    const handleScroll = () => {
      try {
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight = Math.max(
          document.body.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.clientHeight,
          document.documentElement.scrollHeight,
          document.documentElement.offsetHeight
        );
        const viewportHeight = window.innerHeight;

        // Calculate scroll depth percentage
        const scrollDepth = Math.min(
          Math.round(((scrollTop + viewportHeight) / documentHeight) * 100),
          100
        );

        // Update max scroll depth
        if (scrollDepth > maxScrollDepth.current) {
          maxScrollDepth.current = scrollDepth;
        }

        // Throttle scroll events - only record significant scroll changes
        const now = Date.now();
        if (now - lastScrollTime.current > 1000) {
          // Every 1 second max
          const scrollEvent = {
            scroll_depth: scrollDepth,
            scroll_timestamp: new Date(),
            viewport_height: viewportHeight,
            document_height: documentHeight,
          };

          scrollBuffer.current.push(scrollEvent);
          lastScrollTime.current = now;

          // Send scroll events in batches
          if (scrollBuffer.current.length >= 5) {
            sendScrollEvents();
          }
        }

        // Clear existing timeout and set new one
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        // Send remaining scroll events after user stops scrolling
        scrollTimeoutRef.current = setTimeout(() => {
          if (scrollBuffer.current.length > 0) {
            sendScrollEvents();
          }
        }, 2000);
      } catch (error) {
        // Silently handle any scroll tracking errors
        console.warn("Scroll tracking error:", error);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [location.pathname]);

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
    return React.createElement(WrappedComponent, props);
  };
};
