const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    otp: { type: String, default: null },
    otpExpiresAt: { type: Date, default: null },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Common followers list
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Common following list
    followersCount: { type: Number, default: 0 }, // Common followers count
    followingCount: { type: Number, default: 0 }, // Common following count
    likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }], // Common liked posts
    socialProfile: {
      name: { type: String, required: true },
      bio: { type: String, default: "" },
      hobbies: [{ type: String }],
      posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }], // Social-specific posts
    },
    professionalProfile: {
      name: { type: String, required: true },
      bio: { type: String, default: "" },
      occupation: { type: String, default: "" },
      posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }], // Professional-specific posts
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
