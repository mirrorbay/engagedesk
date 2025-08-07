const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

// Import all models to register schemas
require("./models/ActionCalendar");
require("./models/Analytics");
require("./models/Client");
require("./models/ClientInteraction");
require("./models/Knowledge");
require("./models/Team");
require("./models/TeamMessage");
require("./models/TeamPost");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: true, // Allow all origins
    credentials: false,
  })
);
app.use(express.json());

// Serve static files for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Routes
app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running" });
});

// Warm endpoint for UptimeRobot to keep backend and database active
app.get("/api/warm", async (req, res) => {
  try {
    // Perform a lightweight database operation to keep connection active
    const Client = require("./models/Client");
    const clientCount = await Client.countDocuments();

    // Get database connection status
    const dbStatus =
      mongoose.connection.readyState === 1 ? "connected" : "disconnected";

    res.json({
      message: "Backend and database are warm",
      timestamp: new Date().toISOString(),
      database: {
        status: dbStatus,
        clientCount: clientCount,
      },
      uptime: process.uptime(),
    });
  } catch (error) {
    console.error("Warm endpoint error:", error);
    res.status(500).json({
      message: "Warm endpoint error",
      timestamp: new Date().toISOString(),
      error: error.message,
      uptime: process.uptime(),
    });
  }
});

// API routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/analytics", require("./routes/analytics"));
app.use("/api/clients", require("./routes/client"));
// app.use('/api/actions', require('./routes/actions'));
// app.use('/api/team', require('./routes/team'));
// app.use('/api/knowledge', require('./routes/knowledge'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
