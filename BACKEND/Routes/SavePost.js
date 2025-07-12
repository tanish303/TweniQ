const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../Models/User');
const { JWT_SECRET } = process.env;

// POST /savepost/toggle-save-post
router.post('/toggle-save-post', async (req, res) => {
  const { postId, mode } = req.body;

  // 🔐 Extract token
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "Authorization token missing" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(403).json({ success: false, message: "Invalid or expired token" });
  }

  const userId = decoded.userId;
  if (!userId || !postId || !mode) {
    return res.status(400).json({ success: false, message: "userId, postId, and mode are required" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let savedList;
    const profilePath = mode === 'social' ? 'socialProfile.savedPosts' : 'professionalProfile.savedPosts';

    if (mode === "social") {
      if (!user.socialProfile) {
        return res.status(400).json({ success: false, message: "Social profile not found" });
      }
      savedList = user.socialProfile.savedPosts || [];
    } else if (mode === "professional") {
      if (!user.professionalProfile) {
        return res.status(400).json({ success: false, message: "Professional profile not found" });
      }
      savedList = user.professionalProfile.savedPosts || [];
    } else {
      return res.status(400).json({ success: false, message: "Invalid mode" });
    }

    const postIndex = savedList.findIndex(id => id.toString() === postId);
    let isSaved;

    if (postIndex > -1) {
      // UNSAVE
      savedList.splice(postIndex, 1);
      isSaved = false;
    } else {
      // SAVE
      savedList.push(postId);
      isSaved = true;
    }

    user.markModified(profilePath);
    await user.save();

    return res.status(200).json({ success: true, isSaved });
  } catch (err) {
    console.error("Error in toggle-save-post route:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
