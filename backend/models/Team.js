const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    nickname: {
      type: String,
    },
    title: {
      type: String,
      enum: ["Mr", "Mrs", "Ms", "Dr", "Prof", ""],
    },
    gender: {
      type: String,
      enum: ["male", "female", "non-binary", "prefer-not-to-say", ""],
    },
    position: {
      type: String,
    },
    department: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    icon: {
      type: String,
    },
    phones: [
      {
        number: {
          type: String,
        },
        label: {
          type: String,
        },
      },
    ],
    emergencyContact: {
      name: {
        type: String,
      },
      relationship: {
        type: String,
        enum: [
          "spouse",
          "parent",
          "child",
          "sibling",
          "friend",
          "colleague",
          "other",
          "",
        ],
      },
      phone: {
        type: String,
      },
      email: {
        type: String,
      },
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model("Team", userSchema);
