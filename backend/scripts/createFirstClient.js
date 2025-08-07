const mongoose = require("mongoose");
require("dotenv").config();

// Import the models
const Client = require("../models/Client");
const Team = require("../models/Team");

// Connect to MongoDB using the URI from .env
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async () => {
  console.log("Connected to MongoDB");

  try {
    // Find the team member to assign as client captain
    const teamMember = await Team.findOne({
      email: "fei.aaron.fang@gmail.com",
    });

    if (!teamMember) {
      console.error(
        "Error: Team member with email fei.aaron.fang@gmail.com not found. Please create the team member first."
      );
      return;
    }

    // Create the first client
    const firstClient = new Client({
      firstName: "fei",
      lastName: "fang",
      nickname: "aaron",
      email: "fei.aaron.fang@gmail.com",
      clientCaptains: [teamMember._id],
    });

    // Save the client to the database
    const savedClient = await firstClient.save();
    console.log("First client created successfully:");
    console.log({
      id: savedClient._id,
      firstName: savedClient.firstName,
      lastName: savedClient.lastName,
      nickname: savedClient.nickname,
      email: savedClient.email,
      clientCaptains: savedClient.clientCaptains,
      createdAt: savedClient.createdAt,
    });
  } catch (error) {
    if (error.code === 11000) {
      console.error("Error: A client with this email already exists.");
    } else {
      console.error("Error creating client:", error.message);
    }
  } finally {
    // Close the database connection
    mongoose.connection.close();
    console.log("Database connection closed.");
  }
});
