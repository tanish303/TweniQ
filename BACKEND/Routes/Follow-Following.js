const express = require('express');
const router = express.Router();
const User = require('../Models/User'); // Adjust the path to your User model

router.post('/follow', async (req, res) => {
  const { whomToFollow, whoIsFollowing } = req.body;

  if (!whomToFollow || !whoIsFollowing) {
    return res.status(400).json({ success: false, message: "Both usernames must be provided" });
  }

  try {
    // Fetch both users
    const follower = await User.findOne({ username: whoIsFollowing });
    const followee = await User.findOne({ username: whomToFollow });

    if (!follower || !followee) {
      return res.status(404).json({ success: false, message: "One or both users not found" });
    }

    // Check if already following
    if (follower.following.includes(followee._id)) {
      return res.status(400).json({ success: false, message: "Already following this user" });
    }

    // Update the followee (whomToFollow)
    followee.followers.push(follower._id);
    followee.followersCount += 1;

    // Update the follower (whoIsFollowing)
    follower.following.push(followee._id);
    follower.followingCount += 1;

    // Save both users
    await followee.save();
    await follower.save();

    res.status(200).json({ success: true, message: "Successfully followed the user" });
  } catch (error) {
    console.error("Error in follow route:", error);
    res.status(500).json({ success: false, message: "An error occurred while following the user" });
  }
});

module.exports = router;
