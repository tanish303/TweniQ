const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const SocialPost = require('../Models/SocialPost'); // or ProfessionalPost if needed

router.post('/toggle-like', async (req, res) => {
  const { postId, username } = req.body;

  if (!postId || !username) {
    return res.status(400).json({ success: false, message: "Post ID and username are required" });
  }

  try {
    const user = await User.findOne({ username });
    const post = await SocialPost.findById(postId);

    if (!user || !post) {
      return res.status(404).json({ success: false, message: "User or post not found" });
    }

    const alreadyLiked = post.likes.includes(user._id);

    if (alreadyLiked) {
      // UNLIKE
      await SocialPost.updateOne(
        { _id: postId },
        { $pull: { likes: user._id } }
      );

      await User.updateOne(
        { _id: user._id },
        { $pull: { likedPosts: post._id } }
      );

      return res.status(200).json({ success: true, message: "Unliked", isLiked: false });
    } else {
      // LIKE
      await SocialPost.updateOne(
        { _id: postId },
        { $addToSet: { likes: user._id } }
      );

      await User.updateOne(
        { _id: user._id },
        { $addToSet: { likedPosts: post._id } }
      );

      return res.status(200).json({ success: true, message: "Liked", isLiked: true });
    }
  } catch (error) {
    console.error("Error in toggle-like route:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
