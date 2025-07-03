const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const SocialPost = require('../Models/SocialPost');
const ProfessionalPost = require('../Models/ProfessionalPost');
const jwt = require("jsonwebtoken");


router.get("/getcomments", async (req, res) => {
  const { postId, mode } = req.query;

  if (!postId || !mode) {
    return res.status(400).json({ success: false, message: "postId and mode are required" });
  }

  try {
    const PostModel = mode === "professional" ? ProfessionalPost : SocialPost;

    const post = await PostModel.findById(postId)
      .populate("comments.commentedBy")  // populate entire user object
      .lean();

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const formattedComments = post.comments.map(c => {
      const user = c.commentedBy;

      let displayName = "Unknown";
      if (user) {
        displayName = mode === "professional"
          ? user.professionalProfile?.name || "Unknown"
          : user.socialProfile?.name || "Unknown";
      }

      return {
        displayName: displayName,
        text: c.comment,
        createdAt: c.createdAt,
      };
    });

    return res.status(200).json({ success: true, comments: formattedComments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});



router.post("/addcomment", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { postId, comment, mode } = req.body;

  if (!token) {
    return res.status(401).json({ success: false, message: "Authorization token required" });
  }

  if (!postId || !comment || !mode) {
    console.log(postId ,comment,mode);
    return res.status(400).json({ success: false, message: "postId, comment, and mode are required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const PostModel = mode === "professional" ? ProfessionalPost : SocialPost;

    const post = await PostModel.findById(postId);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    const newComment = {
      commentedBy: user._id,
      comment,
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    await post.save();

    return res.status(200).json({ success: true, message: "Comment added successfully" });
  } catch (err) {
    console.error("Error adding comment:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});


module.exports = router;
