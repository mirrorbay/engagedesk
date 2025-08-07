import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Play } from "lucide-react";
import styles from "../styles/header.module.css";
import { useAuth } from "../hooks/useAuthContext.jsx";
import AutosaveSpinner from "./AutosaveSpinner";
import NewsletterBanner from "./NewsletterBanner";

const Header = ({ breadcrumbs = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState("idle");

  // Check if we're on the home page
  const isOnHomePage = location.pathname === "/";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest(`.${styles.userMenu}`)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showUserMenu]);

  useEffect(() => {
    // Listen for autosave status changes
    const handleAutosaveStatusChange = (e) => {
      setAutosaveStatus(e.detail.status);
    };

    window.addEventListener("autosaveStatusChange", handleAutosaveStatusChange);

    return () => {
      window.removeEventListener(
        "autosaveStatusChange",
        handleAutosaveStatusChange
      );
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setShowUserMenu(false);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const getUserDisplayName = () => {
    if (!user) {
      return "";
    }

    // For the name part: student's first name (if available) or parent's first name, or empty if none
    let name = "";
    if (user.student_info && user.student_info.first_name) {
      name = user.student_info.first_name;
    } else if (user.first_name) {
      name = user.first_name;
    }

    // For the grade info part: level and semester (very important, do not truncate)
    let gradeInfo = "";
    if (user.student_info && user.student_info.grade) {
      const { level, semester } = user.student_info.grade;
      gradeInfo = `${level} ${semester}`;
    }

    // Combine name and grade info
    let displayName = "";
    if (name && gradeInfo) {
      displayName = `${name} (${gradeInfo})`;
    } else if (name) {
      displayName = name;
    } else if (gradeInfo) {
      displayName = `(${gradeInfo})`;
    }

    return displayName;
  };

  const getUserInitials = () => {
    if (!user) {
      return "";
    }

    // Get just the name part (without grade info in parentheses) for initials
    let name = "";
    if (user.student_info && user.student_info.first_name) {
      name = user.student_info.first_name;
    } else if (user.first_name) {
      name = user.first_name;
    }

    if (!name) {
      return "";
    }

    // Return only the first letter of the first name
    return name.charAt(0).toUpperCase();
  };

  return (
    <>
      <NewsletterBanner />
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.logo}>
            <Link to="/" className={styles.logoLink}>
              <div className={styles.logoContainer}>
                <svg
                  className={styles.logoIcon}
                  width="32"
                  height="32"
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="100" height="100" fill="#000000" />
                  <path
                    d="M20 50 L40 70 L80 30"
                    stroke="#ffffff"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
                <h1 className={styles.logoText}>DaVinci Focus</h1>
              </div>
            </Link>
          </div>

          {/* Autosave Toast - positioned globally */}
          <AutosaveSpinner status={autosaveStatus} />

          {breadcrumbs.length > 0 && (
            <div className={styles.centerSection}>
              <nav className={styles.breadcrumb} aria-label="Breadcrumb">
                <ol className={styles.breadcrumbList}>
                  {breadcrumbs.map((crumb, index) => (
                    <li key={index} className={styles.breadcrumbItem}>
                      {index < breadcrumbs.length - 1 ? (
                        <>
                          <Link
                            to={crumb.href}
                            className={styles.breadcrumbLink}
                          >
                            {crumb.label}
                          </Link>
                          <span
                            className={styles.breadcrumbSeparator}
                            aria-hidden="true"
                          >
                            /
                          </span>
                        </>
                      ) : (
                        <span
                          className={styles.breadcrumbCurrent}
                          aria-current="page"
                        >
                          {crumb.label}
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
          )}

          <div className={styles.userSection}>
            {isLoading ? (
              <div className={styles.userLoading}>
                <div className={styles.spinner}></div>
              </div>
            ) : isAuthenticated ? (
              <>
                {/* User Menu */}
                <div className={styles.userMenu}>
                  <button
                    className={styles.userButton}
                    onClick={toggleUserMenu}
                    aria-expanded={showUserMenu}
                    aria-haspopup="true"
                  >
                    <div className={styles.userAvatar}>{getUserInitials()}</div>
                    <span className={styles.userName}>
                      {getUserDisplayName()}
                    </span>
                    <svg
                      className={`${styles.chevron} ${
                        showUserMenu ? styles.chevronUp : ""
                      }`}
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M4.427 9.573l3.396-3.396a.25.25 0 01.354 0l3.396 3.396a.25.25 0 01-.177.427H4.604a.25.25 0 01-.177-.427z" />
                    </svg>
                  </button>

                  {showUserMenu && (
                    <div className={styles.userDropdown}>
                      <div className={styles.userInfo}>
                        <div className={styles.userInfoName}>
                          {getUserDisplayName()}
                        </div>
                        {user.email && (
                          <div className={styles.userInfoEmail}>
                            {user.email}
                          </div>
                        )}
                      </div>
                      <hr className={styles.userDropdownDivider} />

                      <Link
                        to="/user-info"
                        className={styles.userInfoLink}
                        onClick={() => setShowUserMenu(false)}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                        >
                          <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
                        </svg>
                        Settings
                      </Link>
                      <Link
                        to="/progress"
                        className={styles.userInfoLink}
                        onClick={() => setShowUserMenu(false)}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                        >
                          <path d="M1.5 0A1.5 1.5 0 0 0 0 1.5v13A1.5 1.5 0 0 0 1.5 16h13a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 14.5 0h-13zM1 1.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-13z" />
                          <path d="M3.5 3a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H4a.5.5 0 0 1-.5-.5V3zM4 4v1h8V4H4zM3.5 7a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H4a.5.5 0 0 1-.5-.5V7zM4 8v1h8V8H4zM3.5 11a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H4a.5.5 0 0 1-.5-.5v-2zM4 12v1h8v-1H4z" />
                        </svg>
                        Progress
                      </Link>
                      <button
                        className={styles.logoutButton}
                        onClick={handleLogout}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                        >
                          <path d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z" />
                          <path d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  )}
                </div>

                {/* Start CTA Button - Hidden on home page */}
                {!isOnHomePage && (
                  <Link to="/" className={styles.startCTA}>
                    <Play size={18} />
                    <span className={styles.startText}>START</span>
                  </Link>
                )}
              </>
            ) : (
              <div className={styles.loginSection}>
                <Link to="/demo" className={styles.demoLink}>
                  <Play size={16} />
                  Demo
                </Link>
                <button
                  className={styles.loginButton}
                  onClick={handleLoginClick}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                  </svg>
                  Login
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
