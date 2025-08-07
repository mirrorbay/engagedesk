import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuthContext.jsx";
import { useAnalytics } from "./hooks/useAnalytics.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Progress from "./pages/Progress.jsx";
import Login from "./pages/Login.jsx";
import AuthCallback from "./pages/AuthCallback.jsx";
import UserInfo from "./pages/UserInfo.jsx";
import Study from "./pages/Study.jsx";
import Results from "./pages/Results.jsx";
import TermsConditions from "./pages/TermsConditions.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Demo from "./pages/Demo.jsx";
import SystemArchitectureDiagram from "./graphs/1.jsx";
import AttentionStateInterventionDiagram from "./graphs/2/index.jsx";
import InventionDisclosure from "../patent/invention.jsx";

function WebApp() {
  const location = useLocation();
  const [studySessionInfo, setStudySessionInfo] = useState(null);

  // Initialize analytics tracking
  useAnalytics();

  // Scroll to top when location changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Listen for study session info updates
  useEffect(() => {
    const handleStudySessionInfo = (event) => {
      setStudySessionInfo(event.detail);
    };

    window.addEventListener("studySessionInfoUpdate", handleStudySessionInfo);

    return () => {
      window.removeEventListener(
        "studySessionInfoUpdate",
        handleStudySessionInfo
      );
    };
  }, []);

  // Clear study session info when leaving study/results pages
  useEffect(() => {
    if (
      !location.pathname.startsWith("/study/") &&
      !location.pathname.startsWith("/results/")
    ) {
      setStudySessionInfo(null);
    }
  }, [location.pathname]);

  // Generate breadcrumbs based on current route
  const getBreadcrumbs = () => {
    const path = location.pathname;
    const breadcrumbs = [];

    if (path === "/") {
      // Don't show breadcrumb on home page
      return breadcrumbs;
    }

    // Always start with Home for non-home pages
    breadcrumbs.push({ label: "Home", href: "/" });

    if (path.startsWith("/study/")) {
      if (studySessionInfo) {
        const { gradeLevel, studyTimeMinutes } = studySessionInfo;
        const label = `${gradeLevel}, ${studyTimeMinutes} min`;
        breadcrumbs.push({ label, href: path });
      } else {
        breadcrumbs.push({ label: "Study", href: path });
      }
    } else if (path.startsWith("/results/")) {
      if (studySessionInfo) {
        const { gradeLevel, studyTimeMinutes } = studySessionInfo;
        const label = `${gradeLevel}, ${studyTimeMinutes} min`;
        breadcrumbs.push({ label, href: path });
      } else {
        breadcrumbs.push({ label: "Results", href: path });
      }
    } else if (path === "/progress") {
      breadcrumbs.push({ label: "Progress", href: path });
    } else if (path === "/user-info") {
      breadcrumbs.push({ label: "Settings", href: path });
    } else if (path === "/terms-conditions") {
      breadcrumbs.push({ label: "Terms", href: path });
    } else if (path === "/privacy-policy") {
      breadcrumbs.push({ label: "Privacy", href: path });
    } else if (path === "/about") {
      breadcrumbs.push({ label: "About", href: path });
    } else if (path === "/login") {
      breadcrumbs.push({ label: "Login", href: path });
    } else if (path === "/contact") {
      breadcrumbs.push({ label: "Contact", href: path });
    } else if (path === "/demo") {
      breadcrumbs.push({ label: "Demo", href: path });
    } else if (path === "/graphs/1") {
      breadcrumbs.push({ label: "Architecture", href: path });
    } else if (path === "/graphs/2") {
      breadcrumbs.push({ label: "Intervention", href: path });
    } else if (path === "/patent/invention") {
      breadcrumbs.push({ label: "Patent", href: path });
    }

    return breadcrumbs;
  };

  return (
    <AuthProvider>
      <div className="app">
        <Header breadcrumbs={getBreadcrumbs()} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/user-info" element={<UserInfo />} />
            <Route path="/study/:sessionId" element={<Study />} />
            <Route path="/results/:sessionId" element={<Results />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/graphs/1" element={<SystemArchitectureDiagram />} />
            <Route
              path="/graphs/2"
              element={<AttentionStateInterventionDiagram />}
            />
            <Route path="/patent/invention" element={<InventionDisclosure />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default WebApp;
