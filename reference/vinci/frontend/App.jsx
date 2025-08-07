import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Lazy load the separate app components to avoid CSS conflicts
const WebApp = React.lazy(() => import("./web/WebApp.jsx"));
const CommandApp = React.lazy(() => import("./command/CommandApp.jsx"));

function App() {
  return (
    <Router>
      <Suspense>
        <Routes>
          <Route path="/command/*" element={<CommandApp />} />
          <Route path="/*" element={<WebApp />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
