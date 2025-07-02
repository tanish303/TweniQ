const express = require('express');
const router = express.Router();
const User = require('../Models/User'); // Adjust path as needed

router.post('/toggle-follow', async (req, res) => {
  const { targetUsername, currentUsername } = req.body;

  if (!targetUsername || !currentUsername) {
    return res.status(400).json({ success: false, message: "Both usernames must be provided" });
  }

  try {
    const currentUser = await User.findOne({ username: currentUsername });
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
    return res.status(500).json({ success: false, message: "An error occurred while toggling follow status" });
  }
});

module.exports = router;
