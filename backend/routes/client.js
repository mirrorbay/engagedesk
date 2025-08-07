const express = require("express");
const router = express.Router();
const Client = require("../models/Client");
const { sendEmail } = require("../services/emailService");
const ClientInteraction = require("../models/ClientInteraction");
const auth = require("../middleware/auth");

// @desc    Get clients with pagination and sorting
// @route   GET /api/clients
// @access  Public
const getClients = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      search = "",
    } = req.query;

    // Build search query
    const searchQuery = {};
    if (search) {
      searchQuery.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }

    // Calculate skip value for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Execute query with optimized aggregation pipeline
    const [clients, totalCount] = await Promise.all([
      Client.find(searchQuery)
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit))
        .populate("clientCaptains", "firstName lastName")
        .lean(), // Use lean() for better performance
      Client.countDocuments(searchQuery),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.json({
      clients,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get single client
// @route   GET /api/clients/:id
// @access  Public
const getClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id)
      .populate("clientCaptains", "firstName lastName email")
      .populate("teamComments.userId", "firstName lastName icon");

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json(client);
  } catch (error) {
    console.error("Error fetching client:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create new client
// @route   POST /api/clients
// @access  Public
const createClient = async (req, res) => {
  try {
    const client = new Client(req.body);
    const savedClient = await client.save();

    // Populate the saved client before returning
    const populatedClient = await Client.findById(savedClient._id).populate(
      "clientCaptains",
      "firstName lastName"
    );

    res.status(201).json(populatedClient);
  } catch (error) {
    console.error("Error creating client:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Public
const updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("clientCaptains", "firstName lastName")
      .populate("teamComments.userId", "firstName lastName icon");

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json(client);
  } catch (error) {
    console.error("Error updating client:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete client
// @route   DELETE /api/clients/:id
// @access  Public
const deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json({ message: "Client deleted successfully" });
  } catch (error) {
    console.error("Error deleting client:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Send email to client
// @route   POST /api/clients/:id/email
// @access  Public
const sendClientEmail = async (req, res) => {
  try {
    const { id: clientId } = req.params;
    const { userId, subject, htmlContent, fromName, fromEmail } = req.body;

    // Get client to validate and get email
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Validate required fields
    if (!userId || !subject) {
      return res.status(400).json({
        message: "Missing required fields: userId, subject",
      });
    }

    if (!htmlContent) {
      return res.status(400).json({
        message: "HTML content is required",
      });
    }

    if (!fromName) {
      return res.status(400).json({
        message: "From name is required - user information missing",
      });
    }

    if (!fromEmail) {
      return res.status(400).json({
        message: "From email is required - user information missing",
      });
    }

    // Send email using the email service (will use env FROM_EMAIL but log user info)
    const result = await sendEmail({
      clientId,
      userId,
      to: client.email,
      subject,
      htmlContent,
      fromName, // This will be logged but env FROM_EMAIL will be used for actual sending
      fromEmail: process.env.FROM_EMAIL, // Use configured email for sending
    });

    res.json({
      success: true,
      message: "Email sent successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      message: "Failed to send email",
      error: error.message,
    });
  }
};

// @desc    Track email opens
// @route   GET /api/clients/email/track/open
// @access  Public
const trackEmailOpen = async (req, res) => {
  try {
    const { trackingId, clientId } = req.query;

    console.log(
      "\x1b[34m%s\x1b[0m",
      `[Email Tracking] Open tracking pixel triggered - trackingId: ${trackingId}, clientId: ${clientId}`
    );

    if (trackingId && clientId) {
      // Find the interaction by tracking ID
      const interaction = await ClientInteraction.findOne({
        clientId,
        "email.trackingId": trackingId,
      });

      if (interaction) {
        // Record open
        interaction.email.openedAt.push(new Date());
        if (interaction.email.status === "sent") {
          interaction.email.status = "opened";
        }
        await interaction.save();

        console.log(
          "\x1b[34m%s\x1b[0m",
          `[Email Tracking] Email open recorded - interactionId: ${interaction._id}, totalOpens: ${interaction.email.openedAt.length}`
        );
      }
    }

    // Return a transparent 1x1 pixel GIF
    const pixel = Buffer.from(
      "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
      "base64"
    );
    res.writeHead(200, {
      "Content-Type": "image/gif",
      "Content-Length": pixel.length,
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    });
    res.end(pixel);
  } catch (error) {
    console.error("[Email Tracking] Error tracking email open:", error);
    // Still return the tracking pixel even if there's an error
    const pixel = Buffer.from(
      "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
      "base64"
    );
    res.writeHead(200, {
      "Content-Type": "image/gif",
      "Content-Length": pixel.length,
    });
    res.end(pixel);
  }
};

// @desc    Track email link clicks
// @route   GET /api/clients/email/track/click
// @access  Public
const trackEmailClick = async (req, res) => {
  try {
    const { trackingId, clientId, url } = req.query;

    console.log(
      "\x1b[31m%s\x1b[0m",
      `[Email Tracking] Click tracking triggered - trackingId: ${trackingId}, clientId: ${clientId}, url: ${url}`
    );

    if (!trackingId || !clientId || !url) {
      return res.status(400).send("Invalid tracking parameters");
    }

    // Find the interaction by tracking ID
    const interaction = await ClientInteraction.findOne({
      clientId,
      "email.trackingId": trackingId,
    });

    if (interaction) {
      // Record click
      interaction.email.clickedAt.push({
        url: decodeURIComponent(url),
        timestamp: new Date(),
      });
      if (
        interaction.email.status === "sent" ||
        interaction.email.status === "opened"
      ) {
        interaction.email.status = "clicked";
      }
      await interaction.save();

      console.log(
        "\x1b[31m%s\x1b[0m",
        `[Email Tracking] Email click recorded - interactionId: ${interaction._id}, totalClicks: ${interaction.email.clickedAt.length}`
      );
    }

    // Redirect to the original URL
    const decodedUrl = decodeURIComponent(url);
    res.redirect(decodedUrl);
  } catch (error) {
    console.error("[Email Tracking] Error tracking email click:", error);

    // Try to redirect to the URL even if there's an error
    if (req.query.url) {
      const fallbackUrl = decodeURIComponent(req.query.url);
      return res.redirect(fallbackUrl);
    }

    res
      .status(500)
      .send("Error processing click. Please try the link directly.");
  }
};

// @desc    Get all interactions for a client
// @route   GET /api/clients/:id/interactions
// @access  Public
const getClientInteractions = async (req, res) => {
  try {
    const { id: clientId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [interactions, totalCount] = await Promise.all([
      ClientInteraction.find({
        clientId,
      })
        .populate("userId", "firstName lastName")
        .populate("teamComments.userId", "firstName lastName")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      ClientInteraction.countDocuments({
        clientId,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.json({
      interactions,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching client interactions:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get email interactions for a client
// @route   GET /api/clients/:id/email/interactions
// @access  Public
const getEmailInteractions = async (req, res) => {
  try {
    const { id: clientId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [interactions, totalCount] = await Promise.all([
      ClientInteraction.find({
        clientId,
        type: "email",
      })
        .populate("userId", "firstName lastName")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      ClientInteraction.countDocuments({
        clientId,
        type: "email",
      }),
    ]);

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.json({
      interactions,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching email interactions:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get client tags
// @route   GET /api/clients/tags
// @access  Public
const getClientTags = async (req, res) => {
  try {
    const tags = Client.getClientTags();
    res.json({ tags });
  } catch (error) {
    console.error("Error fetching client tags:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Routes - Protected with authentication
router.get("/", auth, getClients);
router.get("/tags", getClientTags); // This should come before /:id to avoid conflicts
router.get("/:id", auth, getClient);
router.post("/", auth, createClient);
router.put("/:id", auth, updateClient);
router.delete("/:id", auth, deleteClient);

// Interaction routes
router.get("/:id/interactions", auth, getClientInteractions);

// Email routes
router.post("/:id/email", auth, sendClientEmail);
// Email tracking routes remain public for tracking functionality
router.get("/email/track/open", trackEmailOpen);
router.get("/email/track/click", trackEmailClick);
router.get("/:id/email/interactions", auth, getEmailInteractions);

module.exports = router;
