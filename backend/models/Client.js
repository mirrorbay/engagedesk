const mongoose = require("mongoose");

// Common client tags for preference selection
const CLIENT_TAGS = [
  "Diabetes",
  "Hypertension",
  "Heart Disease",
  "Asthma",
  "Arthritis",
  "Depression",
  "Anxiety",
  "Obesity",
  "High Cholesterol",
  "Chronic Pain",
  "COPD",
  "Osteoporosis",
  "Cancer",
  "Stroke",
  "Kidney Disease",
  "Liver Disease",
  "Thyroid Disorders",
  "Sleep Apnea",
];

const clientSchema = new mongoose.Schema(
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
    company: {
      type: String,
    },
    position: {
      type: String,
    },
    department: {
      type: String,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phones: [
      {
        type: String,
        label: String,
      },
    ],
    interests: [String],
    preferenceTags: [String],
    clientCaptains: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true,
      },
    ],
    teamComments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Team",
        },
        comment: mongoose.Schema.Types.Mixed,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Static method to get client tags
clientSchema.statics.getClientTags = function () {
  return CLIENT_TAGS;
};

module.exports = mongoose.model("Client", clientSchema);
