const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../Models/User');
const ProfessionalPost = require('../Models/ProfessionalPost');
const SocialPost = require('../Models/SocialPost');
const { JWT_SECRET } = process.env;

// POST /likeunlike/toggle-like
router.post('/toggle-like', async (req, res) => {
  const { postId, mode } = req.body;

  // ✅ Extract token
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "Authorization token missing" });
  }

  // ✅ Verify token
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(403).json({ success: false, message: "Invalid or expired token" });
  }

  const userId = decoded.userId;
  if (!postId || !userId || !mode) {
    return res.status(400).json({ success: false, message: "postId, userId, and mode are required" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const postModel = mode === 'professional' ? ProfessionalPost : SocialPost;
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const alreadyLiked = post.likes.includes(user._id);
    const profilePath = mode === 'professional' ? 'professionalProfile.likedPosts' : 'socialProfile.likedPosts';

    if (alreadyLiked) {
      // UNLIKE
      await postModel.updateOne({ _id: postId }, { $pull: { likes: user._id } });
      user.set(profilePath, user.get(profilePath).filter(id => id.toString() !== postId));
    } else {
      // LIKE
      await postModel.updateOne({ _id: postId }, { $addToSet: { likes: user._id } });
      user.get(profilePath).push(post._id);
    }

    user.markModified(profilePath);
    await user.save();

    return res.status(200).json({
      success: true,
      isLiked: !alreadyLiked,
      message: alreadyLiked ? "Unliked" : "Liked",
    });
  } catch (error) {
    console.error("Error in toggle-like route:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
