import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AlertCircle, User } from "lucide-react";
import { useAuth } from "../hooks/useAuthContext.jsx";
import "../styles/global.css";
import styles from "../styles/login.module.css";

function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated, isLoading: authLoading, devLogin } = useAuth();
  const [error, setError] = useState("");
  const [isDevLoading, setIsDevLoading] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    if (!authLoading && isAuthenticated && user) {
      // Handle redirect after authentication
      const redirectUrl = searchParams.get("redirect");

      if (redirectUrl) {
        const decodedUrl = decodeURIComponent(redirectUrl);
        navigate(decodedUrl);
      } else {
        // Apply new redirection logic
        handleUserRedirection(user);
      }
      return;
    }

    // Check for error from OAuth callback
    const authError = searchParams.get("error");
    if (authError === "auth_failed") {
      setError("Authentication failed. Please try again.");
    } else if (authError === "login_failed") {
      setError("Login failed. Please try again.");
    } else if (authError === "no_token") {
      setError("No authentication token received. Please try again.");
    }
  }, [navigate, searchParams, authLoading, isAuthenticated, user]);

  const handleUserRedirection = (user) => {
    // Redirect all authenticated users to home page
    navigate("/");
  };

  const handleGoogleLogin = () => {
    setError("");

    // Get redirect parameters to pass through OAuth flow
    const redirectUrl = searchParams.get("redirect");

    // Build the OAuth URL with state parameter to preserve redirect info
    let oauthUrl = `${
      import.meta.env.VITE_API_URL || "http://localhost:5000"
    }/auth/google`;

    if (redirectUrl) {
      const stateParams = new URLSearchParams();
      stateParams.set("redirect", redirectUrl);
      oauthUrl += `?state=${encodeURIComponent(stateParams.toString())}`;
    }

    window.location.href = oauthUrl;
  };

  const handleDevLogin = async () => {
    setIsDevLoading(true);
    setError("");

    try {
      const user = await devLogin("dev@test.com", "Dev User");

      // Handle redirect after successful dev login
      const redirectUrl = searchParams.get("redirect");

      if (redirectUrl) {
        const decodedUrl = decodeURIComponent(redirectUrl);
        navigate(decodedUrl);
      } else {
        // Apply new redirection logic for dev login too
        handleUserRedirection(user);
      }
    } catch (err) {
      setError("Development login failed: " + err.message);
    } finally {
      setIsDevLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loadingSpinner}>
          <div className="spinner"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.loginContainer}>
      {/* Simple centered heading */}
      <h1 className={styles.mainHeading}>Sign in</h1>

      {/* Error Message */}
      {error && (
        <div className={styles.errorMessage}>
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Simple login form */}
      <div className={styles.loginForm}>
        <button
          className={styles.googleLoginButton}
          onClick={handleGoogleLogin}
          disabled={authLoading}
        >
          <div className={styles.googleIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          </div>
          <span>Continue with Google</span>
        </button>

        <div className={styles.infoText}>
          Just sign in with Google to get started - no registration needed.
        </div>

        {/* Development Login - only show in development */}
        {import.meta.env.DEV && (
          <>
            <div className={styles.divider}>
              <span>OR</span>
            </div>
            <button
              className={styles.devLoginButton}
              onClick={handleDevLogin}
              disabled={isDevLoading}
            >
              <User size={20} />
              <span>
                {isDevLoading ? "Logging in..." : "Dev Login (Test User)"}
              </span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
