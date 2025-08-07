// Performance optimization utilities for better SEO and Core Web Vitals

// Preload critical resources
export const preloadCriticalResources = () => {
  // Preload hero image
  const heroImage = new Image();
  heroImage.src = "/1.png";

  // Preload other critical images
  const criticalImages = ["/2.png", "/3.png", "/4.png"];
  criticalImages.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
};

// Lazy load images with intersection observer
export const setupLazyLoading = () => {
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove("lazy");
          img.classList.add("loaded");
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll("img[data-src]").forEach((img) => {
      imageObserver.observe(img);
    });
  }
};

// Optimize font loading
export const optimizeFontLoading = () => {
  // Add font-display: swap to improve CLS
  const style = document.createElement("style");
  style.textContent = `
    @font-face {
      font-family: system-ui;
      font-display: swap;
    }
  `;
  document.head.appendChild(style);
};

// Measure and report Core Web Vitals
export const measureCoreWebVitals = () => {
  // Only measure in production
  if (process.env.NODE_ENV !== "production") return;

  // Measure CLS (Cumulative Layout Shift)
  let clsValue = 0;
  let clsEntries = [];

  const observer = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
        clsEntries.push(entry);
      }
    }
  });

  observer.observe({ type: "layout-shift", buffered: true });

  // Measure LCP (Largest Contentful Paint)
  const lcpObserver = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const lastEntry = entries[entries.length - 1];

    // Report to analytics (Google Analytics 4)
    if (typeof gtag !== "undefined") {
      gtag("event", "web_vitals", {
        name: "LCP",
        value: Math.round(lastEntry.startTime),
        event_category: "Web Vitals",
      });
    }
  });

  lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });

  // Measure FID (First Input Delay)
  const fidObserver = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      // Report to analytics
      if (typeof gtag !== "undefined") {
        gtag("event", "web_vitals", {
          name: "FID",
          value: Math.round(entry.processingStart - entry.startTime),
          event_category: "Web Vitals",
        });
      }
    }
  });

  fidObserver.observe({ type: "first-input", buffered: true });

  // Report CLS when page is hidden
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      if (typeof gtag !== "undefined") {
        gtag("event", "web_vitals", {
          name: "CLS",
          value: Math.round(clsValue * 1000),
          event_category: "Web Vitals",
        });
      }
    }
  });
};

// Optimize third-party scripts
export const optimizeThirdPartyScripts = () => {
  // Defer non-critical scripts
  const scripts = document.querySelectorAll("script[src]");
  scripts.forEach((script) => {
    if (!script.hasAttribute("async") && !script.hasAttribute("defer")) {
      // Add defer to non-critical scripts
      if (!script.src.includes("gtag") && !script.src.includes("fbevents")) {
        script.defer = true;
      }
    }
  });
};

// Initialize all performance optimizations
export const initPerformanceOptimizations = () => {
  // Run immediately
  preloadCriticalResources();
  optimizeFontLoading();

  // Run when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      setupLazyLoading();
      optimizeThirdPartyScripts();
    });
  } else {
    setupLazyLoading();
    optimizeThirdPartyScripts();
  }

  // Run when page is loaded
  window.addEventListener("load", () => {
    measureCoreWebVitals();
  });
};
