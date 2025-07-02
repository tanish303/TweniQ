const express = require('express');
const router = express.Router();
const User = require('../Models/User');

router.post('/toggle-save-post', async (req, res) => {
  const { username, postId, mode } = req.body;

  console.log("Received:", { username, postId, mode });

  if (!username || !postId || !mode) {
    return res.status(400).json({ success: false, message: "username, postId, and mode are required" });
  }

  try {
    // 🔄 Fetch user by username instead of userId
    const user = await User.findOne({ username });
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let savedList;

    if (mode === "social") {
      if (!user.socialProfile) {
        console.log("No socialProfile found");
        return res.status(400).json({ success: false, message: "User does not have a social profile" });
      }
      savedList = user.socialProfile.savedPosts || [];
    } else if (mode === "professional") {
      if (!user.professionalProfile) {
        console.log("No professionalProfile found");
        return res.status(400).json({ success: false, message: "User does not have a professional profile" });
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

    // Mark modified path so Mongoose saves nested updates
    if (mode === "social") {
      user.markModified('socialProfile.savedPosts');
    } else {
      user.markModified('professionalProfile.savedPosts');
    }

    await user.save();

    console.log(`Post ${isSaved ? 'saved' : 'unsaved'} successfully`);

    res.status(200).json({ success: true, isSaved });
  } catch (error) {
    console.error("Error in toggle-save-post route:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
