import React from "react";
import styles from "../../styles/shared/userDisplay.module.css";

const UserDisplay = ({ user, size = "sm", showFullName = true }) => {
  // Get display name based on priority: nickname > firstName lastName > email
  const getDisplayName = () => {
    if (!user) return "Unknown User";

    if (user.nickname) {
      if (showFullName && (user.firstName || user.lastName)) {
        const fullName = [user.firstName, user.lastName]
          .filter(Boolean)
          .join(" ");
        return `"${user.nickname}" ${fullName}`;
      }
      return `"${user.nickname}"`;
    }

    if (user.firstName || user.lastName) {
      return [user.firstName, user.lastName].filter(Boolean).join(" ");
    }

    return user.email || "Unknown User";
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return "?";

    if (user.nickname) {
      return user.nickname.charAt(0).toUpperCase();
    }

    if (user.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }

    if (user.lastName) {
      return user.lastName.charAt(0).toUpperCase();
    }

    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }

    return "?";
  };

  // Get user avatar (icon or initials)
  const getUserAvatar = () => {
    if (user?.icon) {
      return (
        <img
          src={user.icon}
          alt={getDisplayName()}
          className={styles.avatarImage}
        />
      );
    }
    return getUserInitials();
  };

  const sizeClass = size === "lg" ? styles.large : styles.small;

  return (
    <div className={`${styles.userDisplay} ${sizeClass}`}>
      <div className={styles.avatar}>{getUserAvatar()}</div>
      <span className={styles.name}>{getDisplayName()}</span>
    </div>
  );
};

export default UserDisplay;
