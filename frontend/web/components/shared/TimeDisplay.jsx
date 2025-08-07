import React from "react";

const TimeDisplay = ({ date, className }) => {
  const getRelativeTime = (date) => {
    const now = new Date();
    const targetDate = new Date(date);
    const diffInMs = now - targetDate;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInMonths = Math.floor(diffInDays / 30);

    // Less than 1 hour ago - show minutes
    if (diffInHours < 1) {
      if (diffInMinutes < 1) {
        return "less than 1 min ago";
      }
      return diffInMinutes === 1 ? "1 min ago" : `${diffInMinutes} mins ago`;
    }

    // 1-23 hours ago
    if (diffInHours < 24) {
      return diffInHours === 1 ? "1 hour ago" : `${diffInHours} hours ago`;
    }

    // 1-29 days ago
    if (diffInDays < 30) {
      return diffInDays === 1 ? "1 day ago" : `${diffInDays} days ago`;
    }

    // 1-5 months ago
    if (diffInMonths < 6) {
      return diffInMonths === 1 ? "1 month ago" : `${diffInMonths} months ago`;
    }

    // More than 6 months ago - show US date format
    return targetDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <span className={className} title={new Date(date).toLocaleString()}>
      {getRelativeTime(date)}
    </span>
  );
};

export default TimeDisplay;
