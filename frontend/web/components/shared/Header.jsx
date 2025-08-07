import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Settings, LogOut } from "lucide-react";
import { useAuth } from "../../utils/AuthContext";
import { useAutoSaveContext } from "../../utils/AutoSaveContext";
import AutoSaveIndicator from "./AutoSaveIndicator";
import styles from "../../styles/header.module.css";

const Header = () => {
  const { user, logout } = useAuth();
  const { autoSaveState } = useAutoSaveContext();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Get display name based on priority: nickname > firstName > lastName > email
  const getDisplayName = () => {
    if (user?.nickname) return user.nickname;
    if (user?.firstName) return user.firstName;
    if (user?.lastName) return user.lastName;
    if (user?.email) return user.email;
    return "User";
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    const displayName = getDisplayName();
    if (displayName === user?.email) {
      return displayName.charAt(0).toUpperCase();
    }
    return displayName.charAt(0).toUpperCase();
  };

  // Get user avatar (icon or initials)
  const getUserAvatar = () => {
    if (user?.icon) {
      return (
        <img
          src={user.icon}
          alt={getDisplayName()}
          className={styles.userAvatarImage}
        />
      );
    }
    return getUserInitials();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSettingsClick = () => {
    setIsDropdownOpen(false);
    navigate("/settings");
  };

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    logout();
  };

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <h1>EngageDesk</h1>
          </div>

          <AutoSaveIndicator
            autoSave={autoSaveState}
            position="inline"
            className={styles.autoSaveIndicator}
          />

          <div className={styles.userSection} ref={dropdownRef}>
            <button
              className={styles.userButton}
              onClick={handleDropdownToggle}
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
            >
              <div className={styles.userAvatar}>{getUserAvatar()}</div>
              <span className={styles.userName}>{getDisplayName()}</span>
              <ChevronDown
                className={`${styles.chevron} ${
                  isDropdownOpen ? styles.chevronOpen : ""
                }`}
                size={16}
              />
            </button>

            {isDropdownOpen && (
              <div className={styles.dropdown}>
                <div className={styles.dropdownHeader}>
                  <div className={styles.userInfo}>
                    <div className={styles.displayName}>{getDisplayName()}</div>
                    <div className={styles.userEmail}>{user?.email}</div>
                  </div>
                </div>

                <div className={styles.dropdownDivider}></div>

                <div className={styles.dropdownMenu}>
                  <button
                    className={styles.dropdownItem}
                    onClick={handleSettingsClick}
                  >
                    <Settings size={16} />
                    <span>Settings</span>
                  </button>

                  <button
                    className={styles.dropdownItem}
                    onClick={handleLogoutClick}
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
