const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const ProfessionalPost = require("../Models/ProfessionalPost");

router.post("/vote", async (req, res) => {
  const { postId, selectedOption } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  if (!postId || !selectedOption) {
    return res.status(400).json({ success: false, message: "postId and selectedOption are required" });
  }
  if (!token) {
    return res.status(401).json({ success: false, message: "Authorization token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId  = decoded.userId;

    const post = await ProfessionalPost.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    // 1️⃣  Make sure the option exists
    if (!post.Poll.options.includes(selectedOption)) {
      return res.status(400).json({ success: false, message: "Invalid option" });
    }

    // 2️⃣  Check if user already voted
    const alreadyVoted = post.Poll.votes.some(v =>
      v.votedBy?.some(id => id.toString() === userId)
    );
    if (alreadyVoted) {
      return res.status(400).json({ success: false, message: "You have already voted" });
    }

    // 3️⃣  Update or create vote entry
    const voteEntry = post.Poll.votes.find(v => v.option === selectedOption);
    if (voteEntry) {
      voteEntry.count += 1;
      voteEntry.votedBy.push(userId);
    } else {
      post.Poll.votes.push({ option: selectedOption, count: 1, votedBy: [userId] });
    }

    await post.save();

    // 4️⃣  Return fresh vote data to frontend
    const responseVotes = post.Poll.votes.map(v => ({
      option: v.option,
      count:  v.count
    }));
    const totalVotes = responseVotes.reduce((acc, v) => acc + v.count, 0);

res.status(200).json({
  success: true,
  message: "Vote submitted",
  votes: post.Poll.votes,
  userVotedOption: selectedOption, // ✅ return this
});
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});


module.exports = router;
