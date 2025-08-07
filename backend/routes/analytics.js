const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");

// Track page visit (public - no auth needed)
router.post("/page-visit", analyticsController.trackPageVisit);

// Track click events (public - no auth needed)
router.post("/click-events", analyticsController.trackClickEvents);

// Track visit duration (public - no auth needed)
router.post("/visit-duration", analyticsController.trackVisitDuration);

// Track scroll events (public - no auth needed)
router.post("/scroll-events", analyticsController.trackScrollEvents);

// Get analytics data (public - no auth needed)
router.get("/data", analyticsController.getAnalyticsData);

// Get analytics summary (public - no auth needed)
router.get("/summary", analyticsController.getAnalyticsSummary);

// Get referral source breakdown (public - no auth needed)
router.get("/referral-sources", analyticsController.getReferralSourceBreakdown);

// Get daily analytics chart (public - no auth needed)
router.get("/daily-chart", analyticsController.getDailyAnalyticsChart);

// Get all users (public - no auth needed)
router.get("/users", analyticsController.getAllUsers);

module.exports = router;
