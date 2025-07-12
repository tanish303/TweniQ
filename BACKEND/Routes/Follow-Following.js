const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const { JWT_SECRET } = process.env;

router.post('/toggle-follow', async (req, res) => {
  const { targetUsername } = req.body;

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

  const currentUserId = decoded.userId;

  if (!targetUsername || !currentUserId) {
    return res.status(400).json({ success: false, message: "targetUsername and token user required" });
  }

  try {
    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findOne({ username: targetUsername });

    if (!currentUser || !targetUser) {
      return res.status(404).json({ success: false, message: "User(s) not found" });
    }

    const alreadyFollowing = currentUser.following.includes(targetUser._id);

    if (alreadyFollowing) {
      // UNFOLLOW logic
      await User.updateOne(
        { _id: currentUser._id },
        {
          $pull: { following: targetUser._id },
          $inc: { followingCount: -1 }
        }
      );

      await User.updateOne(
        { _id: targetUser._id },
        {
          $pull: { followers: currentUser._id },
          $inc: { followersCount: -1 }
        }
      );

      return res.status(200).json({ success: true, message: "Unfollowed successfully", isFollowing: false });
    } else {
      // FOLLOW logic
      await User.updateOne(
        { _id: currentUser._id },
        {
          $addToSet: { following: targetUser._id },
          $inc: { followingCount: 1 }
        }
      );

      await User.updateOne(
        { _id: targetUser._id },
        {
          $addToSet: { followers: currentUser._id },
          $inc: { followersCount: 1 }
        }
      );

      return res.status(200).json({ success: true, message: "Followed successfully", isFollowing: true });
    }

  } catch (error) {
    console.error("Error in toggle-follow route:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
