const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    /* ───────── Core Auth Fields ───────── */
username: {
  type: String,
  unique: true,
  sparse: true,  // ✅ allow multiple `null` or missing values
  trim: true,
  default: null  // ✅ explicitly default to null if not set
},    email:    { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },

    otp:          { type: String, default: null },
    otpExpiresAt: { type: Date,   default: null },

    /* ───────── Global Follow Data ────── */
    followers:       [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following:       [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followersCount:  { type: Number, default: 0 },
    followingCount:  { type: Number, default: 0 },

    /* ───────── Social Profile ───────── */
    socialProfile: {
      name:       { type: String, required: true },
      bio:        { type: String, default: "" },
      hobbies:    [String],

      dpUrl:        { type: String, default: "" },  // 🆕 social DP
      posts:        [{ type: mongoose.Schema.Types.ObjectId, ref: "SocialPost" }],
      savedPosts:   [{ type: mongoose.Schema.Types.ObjectId, ref: "SocialPost" }],
      likedPosts:   [{ type: mongoose.Schema.Types.ObjectId, ref: "SocialPost" }],
    },

    /* ──────── Professional Profile ──── */
    professionalProfile: {
      name:       { type: String, required: true },
      bio:        { type: String, default: "" },
      occupation: { type: String, default: "" },

      dpUrl:        { type: String, default: "" },  // 🆕 professional DP
      posts:        [{ type: mongoose.Schema.Types.ObjectId, ref: "ProfessionalPost" }],
      savedPosts:   [{ type: mongoose.Schema.Types.ObjectId, ref: "ProfessionalPost" }],
      likedPosts:   [{ type: mongoose.Schema.Types.ObjectId, ref: "ProfessionalPost" }],
    },
  },
  { timestamps: true }
);

// ✅ Prevent OverwriteModelError during hot reload in dev
module.exports =
  mongoose.models.User || mongoose.model("User", userSchema);
