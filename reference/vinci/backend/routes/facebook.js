const express = require("express");
const FacebookConversionsApi = require("../userManagement/facebookConversionsApi");

const router = express.Router();

// Initialize Facebook Conversions API
const facebookApi = new FacebookConversionsApi();

// Test endpoint for Facebook Conversions API
router.post("/test-event", async (req, res) => {
  try {
    const { testEventCode } = req.body;
    const result = await facebookApi.sendTestEvent(
      testEventCode || "TEST79388"
    );

    res.json({
      success: true,
      message: "Test event sent to Facebook",
      testEventCode: testEventCode || "TEST79388",
      result: result,
    });
  } catch (error) {
    console.error("Error sending test event:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send test event",
      error: error.message,
    });
  }
});

// Manual trigger for new user signup event (for testing)
router.post("/test-signup", async (req, res) => {
  try {
    const { email, firstName, lastName, testEventCode } = req.body;

    if (!email || !firstName) {
      return res.status(400).json({
        success: false,
        message: "Email and firstName are required for test signup",
      });
    }

    // Create a mock user object for testing
    const mockUser = {
      _id: `test_${Date.now()}`,
      email: email,
      first_name: firstName,
      last_name: lastName || "User",
    };

    // Mock request data
    const mockRequestData = {
      clientIp: req.ip || req.connection.remoteAddress,
      userAgent: req.headers["user-agent"],
    };

    // Add test event code if provided
    if (testEventCode) {
      mockRequestData.testEventCode = testEventCode;
    }

    const result = await facebookApi.trackNewUserSignup(
      mockUser,
      mockRequestData
    );

    res.json({
      success: true,
      message: "Test signup event sent to Facebook",
      mockUser: {
        id: mockUser._id,
        email: mockUser.email,
        name: `${mockUser.first_name} ${mockUser.last_name}`,
      },
      result: result,
    });
  } catch (error) {
    console.error("Error sending test signup event:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send test signup event",
      error: error.message,
    });
  }
});

// Get Facebook API configuration status
router.get("/status", async (req, res) => {
  const hasAccessToken = !!process.env.FACEBOOK_ACCESS_TOKEN;
  const hasPixelId = !!process.env.FACEBOOK_PIXEL_ID;

  res.json({
    success: true,
    configuration: {
      hasAccessToken,
      hasPixelId,
      isConfigured: hasAccessToken && hasPixelId,
      accessTokenLength: hasAccessToken
        ? process.env.FACEBOOK_ACCESS_TOKEN.length
        : 0,
      pixelId: hasPixelId ? process.env.FACEBOOK_PIXEL_ID : "Not configured",
    },
  });
});

module.exports = router;
