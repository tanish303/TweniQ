const mongoose = require('mongoose');

const socialPostSchema = new mongoose.Schema(
  {
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    mood: { type: String, default: "" }, // Mood-specific field for social posts
    moodEmoji: { type: String, default: "" }, // Emoji representing the mood
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [
      {
        commentedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    taggedFriend: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Field for tagged friend
  },
  { timestamps: true }
);

module.exports = mongoose.model('SocialPost', socialPostSchema);
