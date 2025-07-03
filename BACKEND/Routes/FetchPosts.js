const express = require('express');
const router = express.Router();
const User = require('../Models/User'); // Adjust the path to your User model
const SocialPost = require('../Models/SocialPost');
const ProfessionalPost = require('../Models/ProfessionalPost');
const jwt = require("jsonwebtoken");



router.get('/fetchsocialposts', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Extract JWT token

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authorization token is required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode JWT
    const currentUserId = decoded.userId; // Current user's ID from the token

    console.log("Decoded JWT:", decoded);
 const currentUser = await User.findById(currentUserId).lean();
    if (!currentUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const savedPostIds = (currentUser.socialProfile?.savedPosts || []).map(id => id.toString());
    const posts = await SocialPost.find()
      .populate('createdBy', 'username') // Populate `createdBy` field to get the `username`
      .populate('comments.commentedBy', 'username') // Populate `commentedBy` field to get the `username` for comments
      .lean();

    const formattedPosts = await Promise.all(
      posts.map(async (post) => {
        let taggedFriendName = null;

        // If there's a taggedFriend, fetch their username
        if (post.taggedFriend) {
          const taggedFriend = await User.findById(post.taggedFriend, 'username').lean();
          taggedFriendName = taggedFriend?.username || null;
        }

        // Format comments
        const formattedComments = post.comments.map(comment => ({
          username: comment.commentedBy?.username || 'Unknown',
          text: comment.comment,
        }));

        // Get author's followers
        const author = await User.findById(post.createdBy._id).lean();
        if (!author) {
          console.error(`Author not found for post: ${post._id}`);
          return null;
        }

        const followers = Array.isArray(author.followers)
          ? author.followers.map(f => f.toString())
          : [];

        // Debug Logs
        console.log("Post ID:", post._id);
        console.log("Author:", post.createdBy.username);
        console.log("Author Followers:", followers);
        console.log("Current User ID:", currentUserId);

        const isFollowing = followers.includes(currentUserId);
        const isLiked = post.likes.some((like) => like.toString() === currentUserId);
        const isSaved = savedPostIds.includes(post._id.toString()); // ✅ New check


        return {
          postId: post._id,
          authorUsername: post.createdBy.username,
          authorName: author.socialProfile?.name || "",   // ✅ new field

          title: post.title,
          content: post.content,
          timestamp: post.createdAt,
          taggedFriend: taggedFriendName,
          mood: post.mood || '',
          moodEmoji: post.moodEmoji || '',
          numberOfLikes: post.likes.length || 0,
          numberOfComments: post.comments.length || 0,
          comments: formattedComments,
          isFollowing,
          isLiked,
           isSaved, // ✅ New field in response

        };
      })
    );

    const validPosts = formattedPosts.filter(post => post !== null);
    res.status(200).json({ success: true, posts: validPosts });

  } catch (error) {
    console.error("Error fetching social posts:", error);
    res.status(500).json({ success: false, message: "Failed to fetch social posts" });
  }
});


router.get("/fetchprofessionalposts", async (req, res) => {
  try {
    // 1️⃣ Verify JWT token
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Authorization token required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUserId = decoded.userId;

    // 2️⃣ Get current user for saved post info
    const currentUser = await User.findById(currentUserId).lean();
    if (!currentUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const savedProfessionalIds = (currentUser.professionalProfile?.savedPosts || []).map(id =>
      id.toString()
    );

    // 3️⃣ Fetch professional posts
    const posts = await ProfessionalPost.find()
      .populate("createdBy", "username")
      .populate("comments.commentedBy", "username")
      .lean();

    // 4️⃣ Format each post
    const formatted = await Promise.all(
      posts.map(async (post) => {
        // Format comments
        const formattedComments = post.comments.map(c => ({
          username: c.commentedBy?.username || "Unknown",
          text: c.comment,
        }));

        // Is current user following the post's author?
        const author = await User.findById(post.createdBy._id).lean();
        if (!author) return null;

        const isFollowing = (author.followers || []).some(f => f.toString() === currentUserId);
        const isLiked = (post.likes || []).some(id => id.toString() === currentUserId);
        const isSaved = savedProfessionalIds.includes(post._id.toString());

        // 🔎 NEW ► Has the user voted? Which option?
        let isVoted = false;
        let userVotedOption = null;

        if (post.Poll && Array.isArray(post.Poll.votes)) {
          for (const v of post.Poll.votes) {
            if (Array.isArray(v.votedBy) && v.votedBy.some(u => u.toString() === currentUserId)) {
              isVoted = true;
              userVotedOption = v.option;
              break;
            }
          }
        }

        return {
          postId: post._id,
          authorUsername: post.createdBy.username,
          authorName: author.professionalProfile?.name || "",

          title: post.title,
          content: post.content,
          Poll: post.Poll || null,
          timestamp: post.createdAt,

          numberOfLikes: post.likes.length || 0,
          numberOfComments: post.comments.length,
          comments: formattedComments,

          isFollowing,
          isLiked,
          isSaved,

          isVoted,               // ✅ boolean
          userVotedOption,       // ✅ string or null
        };
      })
    );

    const validPosts = formatted.filter(Boolean);
    res.status(200).json({ success: true, posts: validPosts });
  } catch (err) {
    console.error("Error fetching professional posts:", err);
    res.status(500).json({ success: false, message: "Failed to fetch professional posts" });
  }
});





module.exports = router;



