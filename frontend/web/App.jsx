import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./utils/AuthContext";
import { AutoSaveProvider } from "./utils/AutoSaveContext";
import { useAnalytics } from "./hooks/useAnalytics";
import { useScrollToTop } from "./hooks/useScrollToTop";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import PublicRoute from "./components/shared/PublicRoute";
import AppLayout from "./components/shared/AppLayout";
import Homepage from "./pages/Homepage";
import Demo from "./pages/Demo";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Maintenance from "./pages/Maintenance";
import Action from "./pages/Action";
import Analytics from "./pages/Analytics";
import Client from "./pages/Client";
import Team from "./pages/Team";
import Knowledge from "./pages/Knowledge";
import Settings from "./pages/Settings";
import styles from "./styles/app.module.css";

// Shared wrapper component for global app functionality
function AppWrapper({ children }) {
  useAnalytics();
  useScrollToTop();
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppWrapper>
          <div className={styles.app}>
            <Routes>
              {/* Public routes - Homepage is accessible to everyone but logs out authenticated users */}
              <Route path="/" element={<Homepage />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/about" element={<About />} />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />

              {/* Maintenance route - accessible to everyone */}
              <Route path="/maintenance" element={<Maintenance />} />

              {/* Public Analytics route - accessible to everyone */}
              <Route path="/analytics" element={<Analytics />} />

              {/* Protected routes - only accessible when authenticated */}
              <Route
                path="/app"
                element={
                  <ProtectedRoute>
                    <AutoSaveProvider>
                      <AppLayout />
                    </AutoSaveProvider>
                  </ProtectedRoute>
                }
              >
                <Route index element={<Action />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="client" element={<Client />} />
                <Route path="team" element={<Team />} />
                <Route path="knowledge" element={<Knowledge />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </AppWrapper>
      </Router>
    </AuthProvider>
  );
}

export default App;
