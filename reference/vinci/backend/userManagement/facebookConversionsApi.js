const crypto = require("crypto");

class FacebookConversionsApi {
  constructor() {
    this.accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
    this.pixelId = process.env.FACEBOOK_PIXEL_ID;
    this.apiVersion = "v18.0";
    this.baseUrl = `https://graph.facebook.com/${this.apiVersion}`;

    if (!this.accessToken || !this.pixelId) {
      console.warn(
        "Facebook Conversions API: Missing access token or pixel ID"
      );
    }
  }

  // Hash user data for privacy (required by Facebook)
  hashUserData(data) {
    if (!data) return null;
    return crypto
      .createHash("sha256")
      .update(data.toLowerCase().trim())
      .digest("hex");
  }

  // Send conversion event to Facebook
  async sendConversionEvent(eventData) {
    if (!this.accessToken || !this.pixelId) {
      console.error("Facebook Conversions API: Missing configuration");
      return { success: false, error: "Missing configuration" };
    }

    try {
      const url = `${this.baseUrl}/${this.pixelId}/events`;

      const payload = {
        data: [eventData],
        access_token: this.accessToken,
      };

      console.log("[Facebook Conversions API] Sending event:", {
        event_name: eventData.event_name,
        user_email: eventData.user_data?.em ? "[HASHED]" : "none",
        event_time: eventData.event_time,
      });

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        console.log(
          "[Facebook Conversions API] Event sent successfully:",
          result
        );
        return { success: true, data: result };
      } else {
        console.error(
          "[Facebook Conversions API] Error sending event:",
          result
        );
        return { success: false, error: result };
      }
    } catch (error) {
      console.error("[Facebook Conversions API] Network error:", error);
      return { success: false, error: error.message };
    }
  }

  // Track new user registration/signup
  async trackNewUserSignup(user, requestData = {}) {
    const eventTime = Math.floor(Date.now() / 1000);

    // Generate a unique event ID for deduplication
    const eventId = `signup_${user._id}_${eventTime}`;

    const eventData = {
      event_name: "CompleteRegistration",
      event_time: eventTime,
      event_id: eventId,
      action_source: "website",
      user_data: {
        em: user.email ? [this.hashUserData(user.email)] : [],
        fn: user.first_name ? [this.hashUserData(user.first_name)] : [],
        ln: user.last_name ? [this.hashUserData(user.last_name)] : [],
        external_id: [user._id.toString()],
      },
      custom_data: {
        content_name: "User Registration",
        content_category: "signup",
        value: 1, // You can set a value for the conversion
        currency: "USD",
      },
    };

    // Add client IP and user agent if available from request
    if (requestData.clientIp) {
      eventData.user_data.client_ip_address = requestData.clientIp;
    }
    if (requestData.userAgent) {
      eventData.user_data.client_user_agent = requestData.userAgent;
    }

    // Add Facebook click ID and browser ID if available from cookies
    if (requestData.fbc) {
      eventData.user_data.fbc = requestData.fbc;
    }
    if (requestData.fbp) {
      eventData.user_data.fbp = requestData.fbp;
    }

    return await this.sendConversionEvent(eventData);
  }

  // Track subscription purchase (optional - for when users upgrade)
  async trackSubscriptionPurchase(user, subscriptionData, requestData = {}) {
    const eventTime = Math.floor(Date.now() / 1000);

    // Generate a unique event ID for deduplication
    const eventId = `purchase_${user._id}_${subscriptionData.plan}_${eventTime}`;

    const eventData = {
      event_name: "Purchase",
      event_time: eventTime,
      event_id: eventId,
      action_source: "website",
      user_data: {
        em: user.email ? [this.hashUserData(user.email)] : [],
        fn: user.first_name ? [this.hashUserData(user.first_name)] : [],
        ln: user.last_name ? [this.hashUserData(user.last_name)] : [],
        external_id: [user._id.toString()],
      },
      custom_data: {
        content_name: `${subscriptionData.plan} Subscription`,
        content_category: "subscription",
        value: subscriptionData.amount || 0,
        currency: subscriptionData.currency || "USD",
      },
    };

    // Add client data if available
    if (requestData.clientIp) {
      eventData.user_data.client_ip_address = requestData.clientIp;
    }
    if (requestData.userAgent) {
      eventData.user_data.client_user_agent = requestData.userAgent;
    }
    if (requestData.fbc) {
      eventData.user_data.fbc = requestData.fbc;
    }
    if (requestData.fbp) {
      eventData.user_data.fbp = requestData.fbp;
    }

    return await this.sendConversionEvent(eventData);
  }

  // Track trial start (optional)
  async trackTrialStart(user, requestData = {}) {
    const eventTime = Math.floor(Date.now() / 1000);

    const eventId = `trial_${user._id}_${eventTime}`;

    const eventData = {
      event_name: "StartTrial",
      event_time: eventTime,
      event_id: eventId,
      action_source: "website",
      user_data: {
        em: user.email ? [this.hashUserData(user.email)] : [],
        fn: user.first_name ? [this.hashUserData(user.first_name)] : [],
        ln: user.last_name ? [this.hashUserData(user.last_name)] : [],
        external_id: [user._id.toString()],
      },
      custom_data: {
        content_name: "Trial Start",
        content_category: "trial",
        value: 0,
        currency: "USD",
      },
    };

    // Add client data if available
    if (requestData.clientIp) {
      eventData.user_data.client_ip_address = requestData.clientIp;
    }
    if (requestData.userAgent) {
      eventData.user_data.client_user_agent = requestData.userAgent;
    }
    if (requestData.fbc) {
      eventData.user_data.fbc = requestData.fbc;
    }
    if (requestData.fbp) {
      eventData.user_data.fbp = requestData.fbp;
    }

    return await this.sendConversionEvent(eventData);
  }

  // Send test event for Facebook verification
  async sendTestEvent(testEventCode = "TEST79388") {
    const eventTime = Math.floor(Date.now() / 1000);

    const eventData = {
      event_name: "CompleteRegistration",
      event_time: eventTime,
      event_id: `test_${testEventCode}_${eventTime}`,
      action_source: "website",
      user_data: {
        em: [this.hashUserData("test@example.com")],
        fn: [this.hashUserData("Test")],
        ln: [this.hashUserData("User")],
        external_id: ["test_user_123"],
      },
      custom_data: {
        content_name: "Test User Registration",
        content_category: "test_signup",
        value: 1,
        currency: "USD",
      },
    };

    // Add test_event_code to the payload level, not event data level
    const payload = {
      data: [eventData],
      test_event_code: testEventCode,
      access_token: this.accessToken,
    };

    console.log(
      "[Facebook Test Event] Sending test event with code:",
      testEventCode
    );

    // Use custom payload for test events
    if (!this.accessToken || !this.pixelId) {
      console.error("Facebook Conversions API: Missing configuration");
      return { success: false, error: "Missing configuration" };
    }

    try {
      const url = `${this.baseUrl}/${this.pixelId}/events`;

      console.log("[Facebook Conversions API] Sending test event:", {
        event_name: eventData.event_name,
        user_email: eventData.user_data?.em ? "[HASHED]" : "none",
        event_time: eventData.event_time,
        test_event_code: testEventCode,
      });

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        console.log(
          "[Facebook Conversions API] Test event sent successfully:",
          result
        );
        return { success: true, data: result };
      } else {
        console.error(
          "[Facebook Conversions API] Error sending test event:",
          result
        );
        return { success: false, error: result };
      }
    } catch (error) {
      console.error("[Facebook Conversions API] Network error:", error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = FacebookConversionsApi;
