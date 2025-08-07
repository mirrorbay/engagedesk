import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { initPerformanceOptimizations } from "./web/utils/performance.js";

// Initialize performance optimizations
initPerformanceOptimizations();

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
