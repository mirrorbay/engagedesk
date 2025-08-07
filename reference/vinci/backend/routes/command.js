const express = require("express");
const router = express.Router();
const {
  getDashboardOverview,
  getUserRecords,
  getStudySessions,
  getContactMessages,
  updateContactStatus,
  getAnalyticsData,
  getAnalyticsSummary,
  getReferralSourceBreakdown,
  getDailyAnalyticsChart,
  getNewsletterSubscribers,
  getLocalhostExclusionConfig,
} = require("../command/dashboardController");

// Dashboard routes
// GET /api/command/overview - Get dashboard overview statistics
router.get("/overview", getDashboardOverview);

// GET /api/command/users - Get user records with payment information
router.get("/users", getUserRecords);

// GET /api/command/sessions - Get study session information
router.get("/sessions", getStudySessions);

// GET /api/command/contacts - Get contact messages
router.get("/contacts", getContactMessages);

// PUT /api/command/contacts/:id - Update contact message status
router.put("/contacts/:id", updateContactStatus);

// GET /api/command/analytics/data - Get analytics data with geolocation
router.get("/analytics/data", getAnalyticsData);

// GET /api/command/analytics/summary - Get analytics summary
router.get("/analytics/summary", getAnalyticsSummary);

// GET /api/command/analytics/referral-sources - Get referral source breakdown
router.get("/analytics/referral-sources", getReferralSourceBreakdown);

// GET /api/command/analytics/daily-chart - Get daily analytics chart data
router.get("/analytics/daily-chart", getDailyAnalyticsChart);

// GET /api/command/newsletter/subscribers - Get newsletter subscribers
router.get("/newsletter/subscribers", getNewsletterSubscribers);

// GET /api/command/config/localhost-exclusion - Get localhost exclusion configuration
router.get("/config/localhost-exclusion", getLocalhostExclusionConfig);

module.exports = router;
