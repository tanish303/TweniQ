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

    const friend = await User.findOne({ username });

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



router.post('/createsocialpost', async (req, res) => {
  const { title, content, mood, taggedFriend, moodEmoji } = req.body;

  if (!title || !content) {
    return res.status(400).json({ success: false, message: "All required fields must be provided" });
  }

  try {
    // Extract user information from token
    const token = req.headers.authorization.split(" ")[1]; // Assuming token is sent as "Bearer <token>"
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your JWT secret
    const user = await User.findById(decoded.userId); // Fetch user from database
        console.log(decoded);


    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Validate taggedFriend if provided
    let taggedFriendId = null;
    if (taggedFriend) {
      const taggedUser = await User.findOne({ username: taggedFriend }); // Assuming the friend is searched by username
      if (!taggedUser) {
        return res.status(400).json({ success: false, message: "Tagged friend does not exist" });
      }
      taggedFriendId = taggedUser._id; // Use the friend's ObjectId
    }

    // Create a new post
    const newPost = new SocialPost({
      createdBy: user._id,
      title,
      content,
      mood,
      moodEmoji, // Add the emoji to the post
      taggedFriend: taggedFriendId, // Include taggedFriend ID if available
    });

    await newPost.save();

    // Send the post back as a response with the emoji included
    res.status(201).json({ 
      success: true, 
      post: {
        id: newPost._id,
        title: newPost.title,
        content: newPost.content,
        mood: newPost.mood,
        moodEmoji: newPost.moodEmoji, // Send emoji to the frontend
        taggedFriend: taggedFriendId,
        createdBy: user.username,
        createdAt: newPost.createdAt,
      } 
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ success: false, message: "Failed to create post" });
  }
});


//  For Creating a new professional post


router.post('/createprofessionalpost', async (req, res) => {
  const { title, content, Poll } = req.body;

  if (!title || !content) {
    return res.status(400).json({ success: false, message: "All required fields must be provided" });
  }

  try {
    // Extract token from the Authorization header
    const token = req.headers.authorization.split(" ")[1]; // "Bearer <token>"
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your JWT secret
    const user = await User.findById(decoded.userId); // Fetch the user from the database

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Create a new professional post
    const newPost = new ProfessionalPost({
      createdBy: user._id, // Use the user's ObjectId
      title,
      content,
      Poll,
    });

    await newPost.save();
    res.status(201).json({ success: true, post: newPost });
  } catch (error) {
    console.error("Error creating professional post:", error);
    res.status(500).json({ success: false, message: "Failed to create professional post" });
  }
});

module.exports = router;


