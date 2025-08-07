const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define Vinci Newsletter Schema
const vinciNewsletterSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    user_id: {
      type: Schema.Types.ObjectId,
      ref: "VinciUser",
      default: null,
    },

    status: {
      type: String,
      enum: ["active", "unsubscribed"],
      default: "active",
    },

    unsubscribed_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
vinciNewsletterSchema.index({ email: 1 });
vinciNewsletterSchema.index({ status: 1 });
vinciNewsletterSchema.index({ createdAt: -1 });

// Create the model
const VinciNewsletter = mongoose.model(
  "VinciNewsletter",
  vinciNewsletterSchema
);

module.exports = VinciNewsletter;
