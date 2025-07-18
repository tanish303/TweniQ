const express = require('express');
const router = express.Router();
const User = require('../Models/User'); // Adjust the path to your User model
const SocialPost = require('../Models/SocialPost');
const ProfessionalPost = require('../Models/ProfessionalPost');
const jwt = require("jsonwebtoken");


// Route to check if a friend exists by username
router.post('/checkfriendexists', async (req, res) => {
  const { username } = req.body;

  try {
    if (!username) {
      return res.status(400).json({ success: false, message: 'Username is required' });
    }

    const friend = await User.findOne({ username: { $regex: `^${username}$`, $options: 'i' } });

    if (friend) {
      return res.status(200).json({ success: true, message: 'Username exists' });
    } else {
      return res.status(404).json({ success: false, message: 'Username not found' });
    }
  } catch (error) {
    console.error('Error checking username existence:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});


router.post("/createsocialpost", async (req, res) => {
  const { title, content, mood, taggedFriend, moodEmoji } = req.body;

  if (!title || !content) {
    return res.status(400).json({ success: false, message: "All required fields must be provided" });
  }

  try {
    /* 1️⃣  Verify JWT & fetch user */
    const token   = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);   // payload must have { userId }
    const user    = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    /* 2️⃣  Validate taggedFriend (optional) */
    let taggedFriendId = null;
    if (taggedFriend) {
      const taggedUser = await User.findOne({ username: taggedFriend });
      if (!taggedUser) {
        return res.status(400).json({ success: false, message: "Tagged friend does not exist" });
      }
      taggedFriendId = taggedUser._id;
    }

    /* 3️⃣  Create and save the post */
    const newPost = await SocialPost.create({
      createdBy: user._id,
      title,
      content,
      mood,
      moodEmoji,
      taggedFriend: taggedFriendId,
    });

    /* 4️⃣  ⬅️  PUSH the post ID into user.socialProfile.posts */
    await User.findByIdAndUpdate(
      user._id,
      { $push: { "socialProfile.posts": newPost._id } },
      { new: true }                       // optional: returns updated doc (not used here)
    );

    /* 5️⃣  Send response */
    res.status(201).json({
      success: true,
      post: {
        id:           newPost._id,
        title:        newPost.title,
        content:      newPost.content,
        mood:         newPost.mood,
        moodEmoji:    newPost.moodEmoji,
        taggedFriend: taggedFriendId,
        createdBy:    user.username,
        createdAt:    newPost.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ success: false, message: "Failed to create post" });
  }
});


//  For Creating a new professional post


router.post("/createprofessionalpost", async (req, res) => {
  const { title, content, Poll } = req.body;

  if (!title || !content) {
    return res
      .status(400)
      .json({ success: false, message: "All required fields must be provided" });
  }

  try {
    /* 1️⃣  Verify JWT & fetch user */
    const token   = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // payload must have { userId }
    const user    = await User.findById(decoded.userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    /* 2️⃣  Create and save the professional post */
    const newPost = await ProfessionalPost.create({
      createdBy: user._id,
      title,
      content,
      Poll,
    });

    /* 3️⃣  ⬅️  PUSH the post ID into user.professionalProfile.posts */
    await User.findByIdAndUpdate(
      user._id,
      { $push: { "professionalProfile.posts": newPost._id } },
      { new: false }
    );

    /* 4️⃣  Send response */
    res.status(201).json({
      success: true,
      post: {
        id:        newPost._id,
        title:     newPost.title,
        content:   newPost.content,
        poll:      newPost.Poll,
        createdBy: user.username,
        createdAt: newPost.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating professional post:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create professional post" });
  }
});


module.exports = router;




