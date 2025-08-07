const express = require("express");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Team = require("../models/Team");
const auth = require("../middleware/auth");

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads/profiles");
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: userId_timestamp.extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, req.user._id + "_" + uniqueSuffix + extension);
  },
});

const fileFilter = (req, file, cb) => {
  // Check if file is an image
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "365d", // 365 days retention as requested
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName, company, position } =
      req.body;

    // Validate required fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // Check if user already exists
    const existingUser = await Team.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    // Create new user
    const user = new Team({
      email,
      password,
      firstName,
      lastName,
      company,
      position,
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find user by email
    const user = await Team.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if user is active
    if (user.status !== "active") {
      return res.status(400).json({ message: "Account is inactive" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: "Login successful",
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    res.json({
      user: req.user.toJSON(),
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/auth/verify
// @desc    Verify token
// @access  Private
router.post("/verify", auth, async (req, res) => {
  try {
    res.json({
      valid: true,
      user: req.user.toJSON(),
    });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put(
  "/profile",
  auth,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      console.log("[Backend] Profile update request:", req.body);

      const {
        firstName,
        lastName,
        nickname,
        title,
        gender,
        company,
        position,
        department,
        phones,
        emergencyContact,
      } = req.body;
      const userId = req.user._id;

      // Build update object
      const updateData = {};
      if (firstName !== undefined) updateData.firstName = firstName;
      if (lastName !== undefined) updateData.lastName = lastName;
      if (nickname !== undefined) updateData.nickname = nickname;
      if (title !== undefined) updateData.title = title;
      if (gender !== undefined) updateData.gender = gender;
      if (company !== undefined) updateData.company = company;
      if (position !== undefined) updateData.position = position;
      if (department !== undefined) updateData.department = department;

      // Handle phones array
      if (phones !== undefined) {
        try {
          updateData.phones =
            typeof phones === "string" ? JSON.parse(phones) : phones;
        } catch (e) {
          console.error("[Backend] Error parsing phones:", e);
          updateData.phones = [];
        }
      }

      // Handle emergency contact
      if (emergencyContact !== undefined) {
        try {
          updateData.emergencyContact =
            typeof emergencyContact === "string"
              ? JSON.parse(emergencyContact)
              : emergencyContact;
        } catch (e) {
          console.error("[Backend] Error parsing emergencyContact:", e);
          updateData.emergencyContact = {};
        }
      }

      // Handle profile image upload or removal
      if (req.file) {
        // Delete old profile image if it exists
        const user = await Team.findById(userId);
        if (user.icon) {
          const oldImagePath = path.join(
            __dirname,
            "../uploads/profiles",
            path.basename(user.icon)
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }

        // Set new profile image URL
        updateData.icon = `/api/auth/image/${req.file.filename}`;
      } else if (
        req.body.profileImage === "null" ||
        req.body.profileImage === null
      ) {
        // Remove existing profile image
        const user = await Team.findById(userId);
        if (user.icon) {
          const oldImagePath = path.join(
            __dirname,
            "../uploads/profiles",
            path.basename(user.icon)
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }

        // Set icon to null to remove it
        updateData.icon = null;
      }

      console.log("[Backend] Update data:", updateData);

      // Update user in database
      const updatedUser = await Team.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
      });

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      console.log("[Backend] Profile updated successfully");

      res.json({
        message: "Profile updated successfully",
        user: updatedUser.toJSON(),
      });
    } catch (error) {
      console.error("[Backend] Profile update error:", error);

      // Delete uploaded file if there was an error
      if (req.file) {
        const filePath = path.join(
          __dirname,
          "../uploads/profiles",
          req.file.filename
        );
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      if (error.name === "ValidationError") {
        return res.status(400).json({ message: error.message });
      }

      res.status(500).json({ message: "Server error during profile update" });
    }
  }
);

// @route   POST /api/auth/change-password
// @desc    Change user password
// @access  Private
router.post("/change-password", auth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "Old password and new password are required",
      });
    }

    // Validate new password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: "New password must be at least 6 characters long",
      });
    }

    // Find user
    const user = await Team.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Verify old password
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: "Current password is incorrect",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    console.log("[Backend] Password changed successfully for user:", userId);

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      error: "Server error during password change",
    });
  }
});

// @route   GET /api/auth/image/:filename
// @desc    Serve profile images
// @access  Public
router.get("/image/:filename", (req, res) => {
  try {
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, "../uploads/profiles", filename);

    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Set appropriate headers
    const extension = path.extname(filename).toLowerCase();
    let contentType = "image/jpeg"; // default

    switch (extension) {
      case ".png":
        contentType = "image/png";
        break;
      case ".gif":
        contentType = "image/gif";
        break;
      case ".webp":
        contentType = "image/webp";
        break;
    }

    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=31536000"); // Cache for 1 year
    res.sendFile(imagePath);
  } catch (error) {
    console.error("Image serving error:", error);
    res.status(500).json({ message: "Server error serving image" });
  }
});

module.exports = router;
