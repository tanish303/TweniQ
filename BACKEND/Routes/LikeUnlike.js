const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const SocialPost = require('../Models/SocialPost');
const ProfessionalPost = require('../Models/ProfessionalPost'); // ✅ Required for professional mode



router.post('/toggle-like', async (req, res) => {
  const { postId, username, mode } = req.body;

  if (!postId || !username || !mode) {
    return res.status(400).json({ success: false, message: "postId, username, and mode are required" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const postModel = mode === 'professional' ? ProfessionalPost : SocialPost;
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const alreadyLiked = post.likes.includes(user._id);

    // Choose the correct profile path for likedPosts
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

    return res.status(200).json({ success: true, isLiked: !alreadyLiked, message: alreadyLiked ? "Unliked" : "Liked" });

  } catch (error) {
    console.error("Error in toggle-like route:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;


module.exports = router;
