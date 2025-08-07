const VinciNewsletter = require("../models/VinciNewsletter");

// Subscribe to newsletter
const subscribeToNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // Check if user is authenticated and get user ID
    let userId = null;
    if (req.user && req.user.id) {
      userId = req.user.id;
    }

    // Check if email already exists
    const existingSubscription = await VinciNewsletter.findOne({
      email: email.trim().toLowerCase(),
    });

    if (existingSubscription) {
      if (existingSubscription.status === "active") {
        return res.status(200).json({
          success: true,
          message: "You're already subscribed to our newsletter!",
        });
      } else {
        // Reactivate subscription
        existingSubscription.status = "active";
        existingSubscription.unsubscribed_at = null;
        existingSubscription.user_id = userId || existingSubscription.user_id;
        await existingSubscription.save();

        return res.status(200).json({
          success: true,
          message:
            "Welcome back! Your newsletter subscription has been reactivated.",
        });
      }
    }

    // Create new subscription
    const subscription = new VinciNewsletter({
      email: email.trim().toLowerCase(),
      user_id: userId,
    });

    await subscription.save();

    res.status(201).json({
      success: true,
      message:
        "Thank you for subscribing! You'll receive our newsletter with ADHD parenting insights and evidence-based teaching techniques.",
    });
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: validationErrors,
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(200).json({
        success: true,
        message: "You're already subscribed to our newsletter!",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to subscribe. Please try again later.",
    });
  }
};

// Check subscription status
const checkSubscriptionStatus = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const subscription = await VinciNewsletter.findOne({
      email: email.trim().toLowerCase(),
    });

    res.status(200).json({
      success: true,
      data: {
        subscribed: subscription && subscription.status === "active",
      },
    });
  } catch (error) {
    console.error("Error checking subscription status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check subscription status",
    });
  }
};

module.exports = {
  subscribeToNewsletter,
  checkSubscriptionStatus,
};
