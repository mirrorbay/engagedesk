const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const passport = require("passport");
const session = require("express-session");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL?.replace("www.", ""),
  process.env.FRONTEND_URL?.replace("https://", "https://www."),
];

// Add development origins when not in production
if (process.env.NODE_ENV !== "production") {
  allowedOrigins.push(
    "http://localhost:3000",
    "http://localhost:5173", // Vite default port
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173"
  );
}

app.use(
  cors({
    origin: allowedOrigins.filter(Boolean),
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware (minimal configuration for OAuth flow only)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 10 * 60 * 1000, // 10 minutes (just for OAuth flow)
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Allow cross-origin in production
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Other routes (after JSON parsing middleware)
app.use("/auth", require("./routes/auth"));
app.use("/web", require("./routes/web"));
app.use("/facebook", require("./routes/facebook"));
app.use("/api/command", require("./routes/command"));

// MongoDB connection
if (process.env.MONGO_URI) {
  // Log the MongoDB URI being used for debugging
  console.log(
    "🔍 DEBUG: Attempting to connect to MongoDB with URI:",
    process.env.MONGO_URI
  );
  console.log(
    "🔍 DEBUG: Full environment check - NODE_ENV:",
    process.env.NODE_ENV
  );
  console.log("🔍 DEBUG: MONGO_URI exists:", !!process.env.MONGO_URI);
  console.log("🔍 DEBUG: MONGO_URI length:", process.env.MONGO_URI.length);

  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("✅ MongoDB connected successfully");
    })
    .catch((err) => {
      console.error("❌ MongoDB connection error occurred:");
      console.error("🔍 DEBUG: Error name:", err.name);
      console.error("🔍 DEBUG: Error message:", err.message);
      console.error("🔍 DEBUG: Error code:", err.code);
      console.error("🔍 DEBUG: Error codeName:", err.codeName);
      console.error(
        "🔍 DEBUG: Connection generation:",
        err.connectionGeneration
      );
      console.error(
        "🔍 DEBUG: Error labels:",
        err[Symbol.for("errorLabels")] || err.errorLabels
      );
      console.error(
        "🔍 DEBUG: Full error object:",
        JSON.stringify(err, null, 2)
      );
      console.error("🔍 DEBUG: Original error stack:", err.stack);
    });
} else {
  console.log("❌ MONGO_URI not found in environment variables");
  console.log(
    "🔍 DEBUG: Available environment variables:",
    Object.keys(process.env).filter((key) => key.includes("MONGO"))
  );
}

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Vinci MERN API Server" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Handle different deployment environments
const PORT = process.env.PORT || 5000;

// Always listen on a port for Render deployment
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

// Export for Vercel compatibility
module.exports = app;
