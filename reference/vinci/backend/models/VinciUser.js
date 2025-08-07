const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define Vinci User Schema
const vinciUserSchema = new Schema(
  {
    first_name: {
      type: String,
      trim: true,
    },

    last_name: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    // Student information fields (all optional)
    student_info: {
      first_name: {
        type: String,
        trim: true,
        default: null,
      },
      last_name: {
        type: String,
        trim: true,
        default: null,
      },
      date_of_birth: {
        type: Date,
        default: null,
      },
      country: {
        type: String,
        trim: true,
        default: null,
      },
      gender: {
        type: String,
        enum: [null, "Male", "Female", "Non-binary", "Prefer not to say"],
        default: null,
      },
      special_consideration: {
        type: String,
        trim: true,
        default: null,
      },
      grade: {
        level: {
          type: String,
          required: true,
          enum: [
            "Kindergarten",
            "1st Grade",
            "2nd Grade",
            "3rd Grade",
            "4th Grade",
            "5th Grade",
            "6th Grade",
            "7th Grade",
            "8th Grade",
            "9th Grade",
            "10th Grade",
            "11th Grade",
            "12th Grade",
          ],
          default: "3rd Grade",
        },
        semester: {
          type: String,
          required: true,
          enum: ["Fall", "Spring"],
          default: function () {
            // Automatically detect semester based on current month
            // Fall semester: August - December (months 8-12)
            // Spring semester: January - July (months 1-7)
            const currentMonth = new Date().getMonth() + 1; // getMonth() returns 0-11
            return currentMonth >= 8 ? "Fall" : "Spring";
          },
        },
      },
      info_completed: {
        type: Boolean,
        default: false,
      },
      info_completed_at: {
        type: Date,
        default: null,
      },
    },

    last_login: {
      type: Date,
      default: Date.now,
    },

    // Google OAuth specific fields
    google_id: {
      type: String,
      unique: true,
      index: true,
    },

    google_profile: {
      id: String,
      displayName: String,
      name: {
        familyName: String,
        givenName: String,
      },
      emails: [
        {
          value: String,
          verified: Boolean,
        },
      ],
      photos: [
        {
          value: String,
        },
      ],
      provider: {
        type: String,
        default: "google",
      },
    },

    // User status
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // This adds createdAt and updatedAt automatically
  }
);

// Indexes for performance
vinciUserSchema.index({ email: 1 });
vinciUserSchema.index({ google_id: 1 });
vinciUserSchema.index({ last_login: -1 });
vinciUserSchema.index({ createdAt: -1 });

// Compound indexes
vinciUserSchema.index({ email: 1, is_active: 1 });
vinciUserSchema.index({ google_id: 1, is_active: 1 });

// Pre-save middleware to update last_login
vinciUserSchema.pre("save", function (next) {
  if (this.isNew || this.isModified("last_login")) {
    this.last_login = new Date();
  }
  next();
});

// Instance methods
vinciUserSchema.methods.updateLastLogin = function () {
  this.last_login = new Date();
  return this.save();
};

vinciUserSchema.methods.getFullName = function () {
  if (this.last_name) {
    return `${this.first_name} ${this.last_name}`;
  }
  return this.first_name;
};

vinciUserSchema.methods.getStudentFullName = function () {
  if (this.student_info.last_name) {
    return `${this.student_info.first_name} ${this.student_info.last_name}`;
  }
  return this.student_info.first_name;
};

vinciUserSchema.methods.updateStudentInfo = function (studentData) {
  this.student_info = { ...this.student_info, ...studentData };
  if (
    studentData.first_name ||
    studentData.last_name ||
    studentData.date_of_birth ||
    studentData.country ||
    studentData.grade
  ) {
    this.student_info.info_completed = true;
    this.student_info.info_completed_at = new Date();
  }
  return this.save();
};

vinciUserSchema.methods.hasStudentInfo = function () {
  return this.student_info.info_completed;
};

// Static methods
vinciUserSchema.statics.findByGoogleId = function (googleId) {
  return this.findOne({ google_id: googleId, is_active: true });
};

vinciUserSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase(), is_active: true });
};

// Create the model
const VinciUser = mongoose.model("VinciUser", vinciUserSchema);

module.exports = VinciUser;
