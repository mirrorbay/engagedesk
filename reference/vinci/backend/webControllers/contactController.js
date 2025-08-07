const VinciContact = require("../models/VinciContact");

// Get contact information
const getContactInfo = async (req, res) => {
  try {
    const contactInfo = {
      office: {
        address: "1800 Willamette Falls Drive, Suite 200, West Linn, OR 97068",
        phone: "(360) 869 - 0169",
        email: "support@davincifocus.com",
        hours: "Monday - Friday: 9:00 AM - 5:00 PM PST",
      },
      support: {
        email: "support@davincifocus.com",
        response_time: "Within 24 hours",
      },
    };

    res.status(200).json({
      success: true,
      data: contactInfo,
    });
  } catch (error) {
    console.error("Error getting contact info:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get contact information",
    });
  }
};

// Submit a contact message
const submitContactMessage = async (req, res) => {
  try {
    const { name, email, topic, message } = req.body;

    // Validation
    if (!name || !email || !topic || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
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

    // Create new contact message
    const contactMessage = new VinciContact({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      topic,
      message: message.trim(),
      user_id: userId,
    });

    await contactMessage.save();

    res.status(201).json({
      success: true,
      message:
        "Your message has been sent successfully. We'll get back to you soon!",
      data: {
        id: contactMessage._id,
        created_at: contactMessage.createdAt,
      },
    });
  } catch (error) {
    console.error("Error submitting contact message:", error);

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

    res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again later.",
    });
  }
};

// Get contact messages (admin only - for future use)
const getContactMessages = async (req, res) => {
  try {
    const { status, topic, limit = 50, page = 1 } = req.query;

    let query = {};
    if (status) query.status = status;
    if (topic) query.topic = topic;

    const skip = (page - 1) * limit;

    const messages = await VinciContact.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .populate("user_id", "first_name last_name email");

    const total = await VinciContact.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        messages,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(total / limit),
          total_messages: total,
          per_page: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("Error getting contact messages:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get contact messages",
    });
  }
};

module.exports = {
  getContactInfo,
  submitContactMessage,
  getContactMessages,
};
