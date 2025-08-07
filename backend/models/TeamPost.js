const mongoose = require("mongoose");

const messagePostSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    parentPostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeamMessage",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("MessagePost", messagePostSchema);
