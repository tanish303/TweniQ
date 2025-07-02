const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    otp: { type: String, default: null },
    otpExpiresAt: { type: Date, default: null },

    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followersCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },

    likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],

    socialProfile: {
      name: { type: String, required: true },
      bio: { type: String, default: "" },
      hobbies: [{ type: String }],
      posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
      savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }] // ✅ Added
    },

    professionalProfile: {
      name: { type: String, required: true },
      bio: { type: String, default: "" },
      occupation: { type: String, default: "" },
      posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
      savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }] // ✅ Added
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
