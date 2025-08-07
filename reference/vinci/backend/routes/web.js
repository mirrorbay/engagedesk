const express = require("express");
const router = express.Router();
const deliveryController = require("../webControllers/deliveryController");
const progressController = require("../webControllers/progressController");
const chartController = require("../webControllers/chartController");
const contactController = require("../webControllers/contactController");
const newsletterController = require("../webControllers/newsletterController");
const analyticsController = require("../webControllers/analyticsController");
const VinciSession = require("../models/VinciSession");
const {
  authenticateToken,
  optionalAuth,
} = require("../userManagement/jwtLogin");

// Warming endpoint for UptimeRobot to keep the server and database alive
router.get("/warm", async (req, res) => {
  const startTime = Date.now();

  try {
    // Import all models to ensure they're loaded
    const VinciUser = require("../models/VinciUser");
    const VinciContact = require("../models/VinciContact");

    // Perform lightweight database operations to warm all collections
    const [sessionCount, userCount, contactCount] = await Promise.all([
      VinciSession.countDocuments().catch(() => 0),
      VinciUser.countDocuments().catch(() => 0),
      VinciContact.countDocuments().catch(() => 0),
    ]);

    const responseTime = Date.now() - startTime;

    res.status(200).json({
      status: "alive",
      message: "Server and database are warm and running",
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      responseTime: `${responseTime}ms`,
      dbConnected: true,
      collections: {
        sessions: sessionCount,
        users: userCount,
        contacts: contactCount,
      },
      environment: process.env.NODE_ENV || "development",
      nodeVersion: process.version,
    });
  } catch (error) {
    const responseTime = Date.now() - startTime;

    // If database query fails, still return 200 status for UptimeRobot
    // but indicate the issue in the response
    res.status(200).json({
      status: "alive",
      message: "Server is warm but database connection issue",
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      responseTime: `${responseTime}ms`,
      dbConnected: false,
      error: error.message,
      environment: process.env.NODE_ENV || "development",
      nodeVersion: process.version,
    });
  }
});

// Get all concepts for topic selection (now freely accessible)
router.get("/concepts", deliveryController.getConcepts);

// Get past sessions for the authenticated user (optional auth)
router.get("/sessions", optionalAuth, deliveryController.getStudentSessions);

// Create a new study session (now freely accessible)
router.post("/sessions", optionalAuth, deliveryController.createSession);

// Get session problems with pagination (now freely accessible)
router.get(
  "/sessions/:sessionId/problems",
  optionalAuth,
  deliveryController.getSessionProblems
);

// Submit answer for a problem (now freely accessible)
router.post(
  "/sessions/submit-answer",
  optionalAuth,
  deliveryController.submitAnswer
);

// Submit a page (lock it from further edits) (now freely accessible)
router.post(
  "/sessions/submit-page",
  optionalAuth,
  deliveryController.submitPage
);

// Complete a session (now freely accessible)
router.post(
  "/sessions/complete",
  optionalAuth,
  deliveryController.completeSession
);

// Get session details (now freely accessible)
router.get(
  "/sessions/:sessionId/details",
  optionalAuth,
  deliveryController.getSessionDetails
);

// Claim anonymous session for authenticated user
router.post(
  "/sessions/:sessionId/claim",
  authenticateToken,
  deliveryController.claimSession
);

// Get progress analytics data
router.get("/progress", authenticateToken, progressController.getProgressData);

// Delete a session
router.delete(
  "/sessions/:sessionId",
  authenticateToken,
  progressController.deleteSession
);

// Get benchmark data
router.get(
  "/progress/benchmarks",
  authenticateToken,
  progressController.getBenchmarks
);

// Get performance trends over time for charts
router.get(
  "/charts/trends",
  authenticateToken,
  chartController.getPerformanceTrends
);

// Get concept-specific analytics
router.get(
  "/progress/concepts/:conceptId",
  authenticateToken,
  progressController.getConceptAnalytics
);

// Contact routes
// Get contact information (public - no auth needed)
router.get("/contact/info", contactController.getContactInfo);

// Submit contact message (optional auth - can be used by both authenticated and non-authenticated users)
router.post(
  "/contact/message",
  optionalAuth,
  contactController.submitContactMessage
);

// Get contact messages (admin only - for future use)
router.get(
  "/contact/messages",
  authenticateToken,
  contactController.getContactMessages
);

// Newsletter routes
// Subscribe to newsletter (optional auth - can be used by both authenticated and non-authenticated users)
router.post(
  "/newsletter/subscribe",
  optionalAuth,
  newsletterController.subscribeToNewsletter
);

// Check subscription status (public - no auth needed)
router.get("/newsletter/status", newsletterController.checkSubscriptionStatus);

// Analytics routes
// Track page visit (public - no auth needed)
router.post(
  "/analytics/page-visit",
  optionalAuth,
  analyticsController.trackPageVisit
);

// Track click events (public - no auth needed)
router.post(
  "/analytics/click-events",
  optionalAuth,
  analyticsController.trackClickEvents
);

// Get analytics data (no auth required for command dashboard)
router.get("/analytics/data", analyticsController.getAnalyticsData);

// Get analytics summary (no auth required for command dashboard)
router.get("/analytics/summary", analyticsController.getAnalyticsSummary);

module.exports = router;
