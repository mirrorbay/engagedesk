const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define click event schema
const clickEventSchema = new Schema(
  {
    element_id: {
      type: String,
    },
    element_class: {
      type: String,
    },
    element_text: {
      type: String,
      maxlength: 200, // Limit text length
    },
    element_tag: {
      type: String,
    },
    click_timestamp: {
      type: Date,
      required: true,
      default: Date.now,
    },
    page_path: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

// Define Vinci Analytics Schema
const vinciAnalyticsSchema = new Schema(
  {
    // Page visit tracking
    ip_address: {
      type: String,
      required: true,
      index: true,
    },
    user_agent: {
      type: String,
    },
    page_path: {
      type: String,
      required: true,
      index: true,
    },
    referrer: {
      type: String,
    },
    visit_timestamp: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    user_id: {
      type: String,
      ref: "VinciUser",
      index: true,
    },

    // Device and platform information
    device_info: {
      platform: {
        type: String, // 'mobile', 'desktop', 'tablet'
      },
      os: {
        type: String, // 'Windows', 'macOS', 'iOS', 'Android', 'Linux', etc.
      },
      browser: {
        type: String, // 'Chrome', 'Safari', 'Firefox', etc.
      },
    },

    // Click tracking
    click_events: {
      type: [clickEventSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for common queries
vinciAnalyticsSchema.index({
  visit_timestamp: -1,
});
vinciAnalyticsSchema.index({
  ip_address: 1,
  visit_timestamp: -1,
});
vinciAnalyticsSchema.index({
  page_path: 1,
  visit_timestamp: -1,
});
vinciAnalyticsSchema.index({
  user_id: 1,
  visit_timestamp: -1,
});

// TTL index to automatically delete old records after 90 days
vinciAnalyticsSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 90 * 24 * 60 * 60 } // 90 days
);

// Create the model
const VinciAnalytics = mongoose.model("VinciAnalytics", vinciAnalyticsSchema);

module.exports = VinciAnalytics;
