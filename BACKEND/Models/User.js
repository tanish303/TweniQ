const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    /* ───────── Core Auth Fields ───────── */
    username: { type: String, required: true, unique: true, trim: true },
    email:    { type: String, required: true, unique: true, trim: true },
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

      posts:        [{ type: mongoose.Schema.Types.ObjectId, ref: "SocialPost" }],
      savedPosts:   [{ type: mongoose.Schema.Types.ObjectId, ref: "SocialPost" }],
      likedPosts:   [{ type: mongoose.Schema.Types.ObjectId, ref: "SocialPost" }], // 🔹 social likes
    },

    /* ──────── Professional Profile ──── */
    professionalProfile: {
      name:       { type: String, required: true },
      bio:        { type: String, default: "" },
      occupation: { type: String, default: "" },

      posts:        [{ type: mongoose.Schema.Types.ObjectId, ref: "ProfessionalPost" }],
      savedPosts:   [{ type: mongoose.Schema.Types.ObjectId, ref: "ProfessionalPost" }],
      likedPosts:   [{ type: mongoose.Schema.Types.ObjectId, ref: "ProfessionalPost" }], // 🔹 professional likes
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
