const mongoose = require("mongoose");

// Email subschema for email-specific data
const emailSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
    },
    messageId: {
      type: String,
      required: true,
    },
    fromEmail: {
      type: String,
      required: true,
    },
    fromName: String,
    trackingId: String,
    htmlContent: String,
    status: {
      type: String,
      enum: ["sent", "opened", "clicked", "bounced"],
      default: "sent",
    },
    openedAt: [
      {
        type: Date,
      },
    ],
    clickedAt: [
      {
        url: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { _id: false }
);

const clientInteractionSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    type: {
      type: String,
      enum: ["call", "meeting", "email"],
      required: true,
    },
    subject: {
      type: String,
    },
    content: {
      type: String,
    },
    sentFrom: {
      type: String,
    },
    email: emailSchema,
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

module.exports = mongoose.model("ClientInteraction", clientInteractionSchema);
