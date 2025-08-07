const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define Vinci Contact Schema
const vinciContactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    topic: {
      type: String,
      required: true,
      enum: [
        "General Inquiry",
        "Technical Support",
        "Billing & Subscription",
        "Feature Request",
        "Bug Report",
        "Partnership",
        "Other",
      ],
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    // Optional fields for tracking
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "VinciUser",
      default: null,
    },

    status: {
      type: String,
      enum: ["new", "in_progress", "resolved", "closed"],
      default: "new",
    },

    response: {
      type: String,
      default: null,
    },

    responded_at: {
      type: Date,
      default: null,
    },

    responded_by: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // This adds createdAt and updatedAt automatically
  }
);

// Indexes for performance
vinciContactSchema.index({ email: 1 });
vinciContactSchema.index({ topic: 1 });
vinciContactSchema.index({ status: 1 });
vinciContactSchema.index({ createdAt: -1 });

// Compound indexes
vinciContactSchema.index({ status: 1, createdAt: -1 });
vinciContactSchema.index({ topic: 1, status: 1 });

// Instance methods
vinciContactSchema.methods.markAsResolved = function (response, respondedBy) {
  this.status = "resolved";
  this.response = response;
  this.responded_at = new Date();
  this.responded_by = respondedBy;
  return this.save();
};

vinciContactSchema.methods.updateStatus = function (newStatus) {
  this.status = newStatus;
  return this.save();
};

// Static methods
vinciContactSchema.statics.findByStatus = function (status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

vinciContactSchema.statics.findByTopic = function (topic) {
  return this.find({ topic }).sort({ createdAt: -1 });
};

vinciContactSchema.statics.getRecentMessages = function (limit = 50) {
  return this.find().sort({ createdAt: -1 }).limit(limit);
};

// Create the model
const VinciContact = mongoose.model("VinciContact", vinciContactSchema);

module.exports = VinciContact;
