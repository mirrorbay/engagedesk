const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Import the Team model
const Team = require("../models/Team");

const setUserPassword = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    // Find the user by email
    const email = "fei.aaron.fang@gmail.com";
    const password = "121212";

    const user = await Team.findOne({ email });

    if (!user) {
      console.log(`User with email ${email} not found`);
      process.exit(1);
    }

    console.log(
      `Found user: ${user.firstName} ${user.lastName} (${user.email})`
    );

    // Update the user's password (let the pre-save hook handle hashing)
    user.password = password;
    await user.save();

    console.log(`Password updated successfully for ${email}`);
    console.log("New password:", password);
  } catch (error) {
    console.error("Error setting user password:", error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
};

// Run the script
setUserPassword();
