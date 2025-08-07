const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define input answer item schema for tracking multiple inputs with timestamps
const inputAnswerItemSchema = new Schema(
  {
    value: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { _id: false }
);

// Define Problem Schema (embedded within pages)
const problemSchema = new Schema(
  {
    sequence_number: {
      type: Number,
      required: true,
      min: 1,
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    category: {
      type: String,
    },
    subcategory: {
      type: String,
    },
    difficulty: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    estimatedTimeSeconds: {
      type: Number,
      required: true,
      min: 0,
    },
    input_answer: {
      type: [inputAnswerItemSchema],
      default: [],
    },
    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
  },
  { _id: false }
);

// Define Page Schema (embedded in sessions)
const pageSchema = new Schema(
  {
    page_number: {
      type: Number,
      required: true,
      min: 1,
    },
    presented_at: {
      type: Date,
      required: true,
      default: Date.now,
    },
    submitted_at: {
      type: Date,
    },
    problems: {
      type: [problemSchema],
      required: true,
    },
  },
  { _id: false }
);

// Define Vinci Session Schema
const vinciSessionSchema = new Schema(
  {
    session_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user_id: {
      type: String,
      required: false,
      ref: "VinciUser",
      index: true,
      default: null,
    },
    target_study_time_seconds: {
      type: Number,
      required: true,
      min: 180, // 3 minutes minimum
      max: 1200, // 20 minutes maximum
    },
    target_concepts: {
      type: [String],
      required: true,
    },
    grade_level: {
      type: String,
      required: true,
    },
    semester: {
      type: String,
      required: false,
    },
    pages: {
      type: [pageSchema],
      default: [],
    },
    planned_total_pages: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for common queries
vinciSessionSchema.index({
  user_id: 1,
});
vinciSessionSchema.index({
  createdAt: -1,
});
vinciSessionSchema.index({
  target_concepts: 1,
});

// Compound indexes for performance
vinciSessionSchema.index({
  user_id: 1,
  createdAt: -1,
});
vinciSessionSchema.index({
  user_id: 1,
  target_concepts: 1,
});

// Index for page queries
vinciSessionSchema.index({
  "pages.page_number": 1,
});
vinciSessionSchema.index({
  "pages.presented_at": 1,
});
vinciSessionSchema.index({
  "pages.submitted_at": 1,
});

// Index for problem queries within pages
vinciSessionSchema.index({
  "pages.problems.question": 1,
});
vinciSessionSchema.index({
  "pages.problems.score": 1,
});
vinciSessionSchema.index({
  "pages.problems.category": 1,
});
vinciSessionSchema.index({
  "pages.problems.subcategory": 1,
});
vinciSessionSchema.index({
  "pages.problems.difficulty": 1,
});

// Create the model
const VinciSession = mongoose.model("VinciSession", vinciSessionSchema);

module.exports = VinciSession;
