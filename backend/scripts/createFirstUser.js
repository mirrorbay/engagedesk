const mongoose = require("mongoose");
require("dotenv").config();

// Import the Team model
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
    // Create the first user
    const firstUser = new Team({
      firstName: "fei",
      lastName: "fang",
      nickname: "aaron",
      email: "fei.aaron.fang@gmail.com",
      status: "active",
    });

    // Save the user to the database
    const savedUser = await firstUser.save();
    console.log("First user created successfully:");
    console.log({
      id: savedUser._id,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      nickname: savedUser.nickname,
      email: savedUser.email,
      status: savedUser.status,
      createdAt: savedUser.createdAt,
    });
  } catch (error) {
    if (error.code === 11000) {
      console.error("Error: A user with this email already exists.");
    } else {
      console.error("Error creating user:", error.message);
    }
  } finally {
    // Close the database connection
    mongoose.connection.close();
    console.log("Database connection closed.");
  }
});
