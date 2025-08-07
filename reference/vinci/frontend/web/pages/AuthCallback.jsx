import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuthContext.jsx";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleUserRedirection = (user) => {
    // Check if there's a stored redirect URL
    const storedRedirect = sessionStorage.getItem("postLoginRedirect");

    if (storedRedirect) {
      console.log(
        "[login debug] Frontend: User authenticated, redirecting to stored URL:",
        storedRedirect
      );
      sessionStorage.removeItem("postLoginRedirect");
      navigate(storedRedirect, { replace: true });
    } else {
      // Default redirect to home page
      console.log(
        "[login debug] Frontend: User authenticated, redirecting to home"
      );
      navigate("/", { replace: true });
    }
  };

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Get token, state, and isNewUser from URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      const state = urlParams.get("state");
      const isNewUser = urlParams.get("isNewUser") === "true";
      const storedRedirect = sessionStorage.getItem("postLoginRedirect");

      console.log(
        "[login debug] AuthCallback debug - token:",
        !!token,
        "state:",
        !!state,
        "storedRedirect:",
        storedRedirect,
        "currentURL:",
        window.location.href
      );

      if (token) {
        try {
          console.log("[login debug] Frontend: AuthCallback storing token");

          // Use the centralized login method
          const user = await login(token);

          console.log("[login debug] Frontend: Login successful, user:", user);

          // Check if we have redirect parameters from the state
          if (state) {
            try {
              const stateParams = new URLSearchParams(
                decodeURIComponent(state)
              );
              const redirectUrl = stateParams.get("redirect");

              if (redirectUrl) {
                const decodedUrl = decodeURIComponent(redirectUrl);
                console.log(
                  "[login debug] Frontend: Redirecting to:",
                  decodedUrl
                );
                navigate(decodedUrl, { replace: true });
                return;
              }
            } catch (error) {
              console.error(
                "[login debug] Frontend: Error parsing state parameters:",
                error
              );
            }
          }

          // Default behavior: use new redirection logic
          handleUserRedirection(user);
        } catch (error) {
          console.error("[login debug] Frontend: Login failed:", error);
          navigate("/login?error=login_failed", { replace: true });
        }
      } else {
        console.log(
          "[login debug] Frontend: AuthCallback no token received, redirecting to login"
        );
        navigate("/login?error=no_token", { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate, login]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <div>Processing authentication...</div>
      <div style={{ marginTop: "10px", fontSize: "14px", color: "#666" }}>
        Please wait while we complete your login.
      </div>
    </div>
  );
};

export default AuthCallback;
