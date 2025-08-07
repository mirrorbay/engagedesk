const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const VinciUser = require("../models/VinciUser");
const { generateToken, verifyToken } = require("../userManagement/jwtLogin");
const FacebookConversionsApi = require("../userManagement/facebookConversionsApi");

const router = express.Router();

// Initialize Facebook Conversions API
const facebookApi = new FacebookConversionsApi();

// Helper function to extract client data from request
const getClientData = (req) => {
  return {
    clientIp:
      req.ip || req.connection.remoteAddress || req.headers["x-forwarded-for"],
    userAgent: req.headers["user-agent"],
    fbc: req.cookies?.fbc || req.headers["x-facebook-click-id"],
    fbp: req.cookies?.fbp || req.headers["x-facebook-browser-id"],
  };
};

// Development login route - only available in non-production environments
router.post("/dev-login", async (req, res) => {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    return res.status(404).json({ error: "Not found" });
  }

  const { email, name } = req.body;

  if (!email || !name) {
    return res.status(400).json({
      success: false,
      message: "Email and name are required",
    });
  }

  try {
    // Check if user exists
    let user = await VinciUser.findOne({ email });
    let isNewUser = false;

    if (!user) {
      // Create new user
      const [firstName, ...lastNameParts] = name.split(" ");
      const lastName = lastNameParts.join(" ") || "";

      const newUser = new VinciUser({
        google_id: `dev-${Date.now()}`, // Fake Google ID for dev
        first_name: firstName,
        last_name: lastName,
        email: email,
        google_profile: {
          id: `dev-${Date.now()}`,
          displayName: name,
          name: { givenName: firstName, familyName: lastName },
          emails: [{ value: email }],
          provider: "dev-mock",
        },
        last_login: new Date(),
        // Initialize student_info with default grade
        student_info: {
          grade: {
            level: "3rd Grade",
            semester: (() => {
              const currentMonth = new Date().getMonth() + 1;
              return currentMonth >= 8 ? "Fall" : "Spring";
            })(),
          },
        },
      });

      user = await newUser.save();
      isNewUser = true;

      // Track new user signup with Facebook Conversions API
      try {
        const clientData = getClientData(req);
        await facebookApi.trackNewUserSignup(user, clientData);
        console.log(
          "[Facebook Tracking] New user signup tracked for:",
          user.email
        );
      } catch (error) {
        console.error(
          "[Facebook Tracking] Error tracking new user signup:",
          error
        );
        // Don't fail the login process if Facebook tracking fails
      }
    } else {
      // Update last login
      await user.updateLastLogin();
    }

    // Generate JWT token
    const token = generateToken(user);

    res.json({
      success: true,
      token,
      isNewUser,
      user: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        full_name: user.getFullName(),
      },
    });
  } catch (error) {
    console.error("Dev login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
});

// Passport serialization (required for session support during OAuth flow)
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await VinciUser.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Configure Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true, // This allows us to access req in the callback
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await VinciUser.findByGoogleId(profile.id);

        if (user) {
          // Update last login and return existing user
          await user.updateLastLogin();
          req.session.isNewUser = false;
          return done(null, user);
        }

        // Create new user
        const newUser = new VinciUser({
          google_id: profile.id,
          first_name: profile.name?.givenName || profile.displayName,
          last_name: profile.name?.familyName,
          email: profile.emails?.[0]?.value,
          google_profile: {
            id: profile.id,
            displayName: profile.displayName,
            name: profile.name,
            emails: profile.emails,
            photos: profile.photos,
            provider: profile.provider,
          },
          last_login: new Date(),
          // Initialize student_info with default grade
          student_info: {
            grade: {
              level: "3rd Grade",
              semester: (() => {
                const currentMonth = new Date().getMonth() + 1;
                return currentMonth >= 8 ? "Fall" : "Spring";
              })(),
            },
          },
        });

        user = await newUser.save();
        req.session.isNewUser = true;

        // Track new user signup with Facebook Conversions API
        try {
          const clientData = getClientData(req);
          await facebookApi.trackNewUserSignup(user, clientData);
          console.log(
            "[Facebook Tracking] New user signup tracked for:",
            user.email
          );
        } catch (error) {
          console.error(
            "[Facebook Tracking] Error tracking new user signup:",
            error
          );
          // Don't fail the OAuth process if Facebook tracking fails
        }

        return done(null, user);
      } catch (error) {
        console.error("Google OAuth error:", error);
        return done(error, null);
      }
    }
  )
);

// Routes
// Initiate Google OAuth
router.get("/google", (req, res, next) => {
  // Store state parameter in session for later retrieval
  if (req.query.state) {
    req.session.oauthState = req.query.state;
  }

  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account", // Force Google to show account selection
  })(req, res, next);
});

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=auth_failed`,
  }),
  (req, res) => {
    console.log("[login debug] Google OAuth callback successful for user:", {
      id: req.user._id,
      email: req.user.email,
      isNewUser: req.session.isNewUser,
    });

    // Generate JWT token
    const token = generateToken(req.user);
    console.log("[login debug] JWT token generated successfully");

    // Build callback URL with token and state parameters
    let callbackUrl = `${process.env.FRONTEND_URL}/auth/callback?token=${token}`;

    // Add isNewUser flag to the callback URL
    if (req.session.isNewUser !== undefined) {
      callbackUrl += `&isNewUser=${req.session.isNewUser}`;
      // Clear the isNewUser flag from session
      delete req.session.isNewUser;
    }

    // Add state parameters if they exist
    if (req.session.oauthState) {
      callbackUrl += `&state=${encodeURIComponent(req.session.oauthState)}`;
      // Clear the state from session
      delete req.session.oauthState;
    }

    // Redirect to frontend with token and state parameters
    res.redirect(callbackUrl);
  }
);

// Get current user (using JWT)
router.get("/user", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log(
    "[login debug] /auth/user endpoint called, token present:",
    !!token
  );

  if (!token) {
    console.log("[login debug] No token provided in /auth/user request");
    return res.status(401).json({
      success: false,
      message: "Not authenticated",
    });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    console.log("[login debug] Invalid token in /auth/user request");
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  console.log("[login debug] Token decoded successfully, user ID:", decoded.id);

  try {
    // Get fresh user data from database
    const user = await VinciUser.findById(decoded.id);
    if (!user) {
      console.log(
        "[login debug] User not found in database for ID:",
        decoded.id
      );
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("[login debug] User found in database:", {
      id: user._id,
      email: user.email,
      has_student_info: user.hasStudentInfo(),
    });

    res.json({
      success: true,
      user: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        last_login: user.last_login,
        full_name: user.getFullName(),
        student_info: user.student_info,
        has_student_info: user.hasStudentInfo(),
      },
    });
  } catch (error) {
    console.error("[login debug] Error fetching user:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Logout (JWT-based - client-side token removal)
router.post("/logout", (req, res) => {
  // With JWT, logout is handled client-side by removing the token
  // Server doesn't need to do anything special
  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

// Update parent/user information
router.post("/user-info", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated",
    });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  try {
    const user = await VinciUser.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { first_name, last_name, email } = req.body;

    // Validate email format if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await VinciUser.findOne({
        email: email.toLowerCase(),
        _id: { $ne: user._id },
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email is already in use by another account",
        });
      }
    }

    // Update user fields
    if (first_name !== undefined) user.first_name = first_name;
    if (last_name !== undefined) user.last_name = last_name;
    if (email !== undefined) user.email = email.toLowerCase();

    await user.save();

    res.json({
      success: true,
      message: "User information updated successfully",
      user: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        full_name: user.getFullName(),
      },
    });
  } catch (error) {
    console.error("Error updating user info:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Update student information
router.post("/student-info", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated",
    });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  try {
    const user = await VinciUser.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const {
      first_name,
      last_name,
      date_of_birth,
      country,
      gender,
      special_consideration,
      grade,
    } = req.body;

    // Validate date_of_birth if provided
    let parsedDateOfBirth = null;
    if (date_of_birth) {
      parsedDateOfBirth = new Date(date_of_birth);
      if (isNaN(parsedDateOfBirth.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid date of birth format",
        });
      }
    }

    // Validate gender if provided
    if (gender) {
      const validGenders = [
        "Male",
        "Female",
        "Non-binary",
        "Prefer not to say",
      ];
      if (!validGenders.includes(gender)) {
        return res.status(400).json({
          success: false,
          message: "Invalid gender option",
        });
      }
    }

    // Validate grade if provided
    if (grade) {
      const validGradeLevels = [
        "Kindergarten",
        "1st Grade",
        "2nd Grade",
        "3rd Grade",
        "4th Grade",
        "5th Grade",
        "6th Grade",
        "7th Grade",
        "8th Grade",
        "9th Grade",
        "10th Grade",
        "11th Grade",
        "12th Grade",
      ];
      const validSemesters = ["Fall", "Spring"];

      if (grade.level && !validGradeLevels.includes(grade.level)) {
        return res.status(400).json({
          success: false,
          message: "Invalid grade level",
        });
      }

      if (grade.semester && !validSemesters.includes(grade.semester)) {
        return res.status(400).json({
          success: false,
          message: "Invalid semester",
        });
      }
    }

    // Handle optional fields - allow null/empty values to be saved
    const studentData = {};

    // Optional fields - allow null/empty string values
    if (first_name !== undefined) {
      studentData.first_name = first_name || null;
    }
    if (last_name !== undefined) {
      studentData.last_name = last_name || null;
    }
    if (date_of_birth !== undefined) {
      studentData.date_of_birth = parsedDateOfBirth;
    }
    if (country !== undefined) {
      studentData.country = country || null;
    }
    if (gender !== undefined) {
      studentData.gender = gender || null;
    }
    if (special_consideration !== undefined) {
      studentData.special_consideration = special_consideration || null;
    }

    // Required fields - ensure they have valid values or use schema defaults
    if (grade !== undefined) {
      const validGradeLevels = [
        "Kindergarten",
        "1st Grade",
        "2nd Grade",
        "3rd Grade",
        "4th Grade",
        "5th Grade",
        "6th Grade",
        "7th Grade",
        "8th Grade",
        "9th Grade",
        "10th Grade",
        "11th Grade",
        "12th Grade",
      ];
      const validSemesters = ["Fall", "Spring"];

      // Get current semester for default
      const getCurrentSemester = () => {
        const currentMonth = new Date().getMonth() + 1;
        return currentMonth >= 8 ? "Fall" : "Spring";
      };

      studentData.grade = {
        level:
          grade.level && validGradeLevels.includes(grade.level)
            ? grade.level
            : "3rd Grade",
        semester:
          grade.semester && validSemesters.includes(grade.semester)
            ? grade.semester
            : getCurrentSemester(),
      };
    }

    await user.updateStudentInfo(studentData);

    res.json({
      success: true,
      message: "Student information updated successfully",
      student_info: user.student_info,
    });
  } catch (error) {
    console.error("Error updating student info:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Check authentication status
router.get("/status", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log(
    "[login debug] /auth/status endpoint called, token present:",
    !!token
  );

  if (!token) {
    console.log(
      "[login debug] No token in /auth/status, returning not authenticated"
    );
    return res.json({
      isAuthenticated: false,
      user: null,
    });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    console.log(
      "[login debug] Invalid token in /auth/status, returning not authenticated"
    );
    return res.json({
      isAuthenticated: false,
      user: null,
    });
  }

  console.log(
    "[login debug] Token decoded in /auth/status, user ID:",
    decoded.id
  );

  try {
    // Get fresh user data from database
    const user = await VinciUser.findById(decoded.id);
    if (!user) {
      console.log(
        "[login debug] User not found in /auth/status for ID:",
        decoded.id
      );
      return res.json({
        isAuthenticated: false,
        user: null,
      });
    }

    console.log("[login debug] /auth/status returning authenticated user:", {
      id: user._id,
      email: user.email,
      has_student_info: user.hasStudentInfo(),
    });

    res.json({
      isAuthenticated: true,
      user: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        full_name: user.getFullName(),
        student_info: user.student_info,
        has_student_info: user.hasStudentInfo(),
      },
    });
  } catch (error) {
    console.error("[login debug] Error checking auth status:", error);
    res.json({
      isAuthenticated: false,
      user: null,
    });
  }
});

module.exports = router;
