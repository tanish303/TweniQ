const router = require("express").Router();
const jwt = require("jsonwebtoken");
const ChatRoom = require("../Models/ChatRoom");
const Message = require("../Models/Message");
const User = require("../Models/User");

/* 🔐 Inline token validation */
const verifyToken = (req) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  } catch (err) {
    return null;
  }
};

/* 🔍 Search user by username in current mode */
router.get("/search", async (req, res) => {
  const userId = verifyToken(req);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const { q, mode } = req.query;            // ?q=john&mode=social
  if (!q) return res.status(400).json({ message: "Search username missing" });

  const user = await User.findOne(
    { username: new RegExp(`^${q}$`, "i") }   // ← exact match, case-insensitive
  ).lean();

  if (!user) return res.status(404).json({ message: "User not found" });

  const profile = user[`${mode}Profile`];
  if (!profile)
    return res.status(404).json({ message: `User has no ${mode} profile` });

  res.json({
    user: {
      _id:       user._id,
      username:  user.username,
      name:      profile.name,          // ✅ send name based on mode
      dpUrl:     profile.dpUrl || null, // ✅ send dpUrl if present
      followers: user.followersCount,
      following: user.followingCount,
      posts:     profile.posts.length,
    },
  });
});


/* ➕ Create or fetch a DM room */
router.post("/room", async (req, res) => {
  const userId = verifyToken(req);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const { otherUserId, mode } = req.body;

  let room = await ChatRoom.findOne({
    participants: { $all: [userId, otherUserId] },
    mode,
  });

  if (!room) {
    room = await ChatRoom.create({
      participants: [userId, otherUserId],
      mode,
    });
  }

  res.json({ roomId: room._id });
});

/* 💬 Get conversations list */
router.get("/conversations", async (req, res) => {
  const userId = verifyToken(req);
  if (!userId) return res.status(401).json({ message: "Unauthorized token, Please Signin again" });

  const { mode } = req.query;
  if (!mode || !["professional", "social"].includes(mode)) {
    return res.status(400).json({ message: "Invalid or missing mode" });
  }

  try {
    const rooms = await ChatRoom.find({
      participants: userId,
      mode,
    })
      .populate("participants", "username professionalProfile.name professionalProfile.dpUrl socialProfile.name socialProfile.dpUrl")
      .lean();

    // Get the latest message for each room
    const conversations = await Promise.all(
      rooms.map(async (room) => {
        const other = room.participants.find((u) => u._id.toString() !== userId);
        const profile = other?.[`${mode}Profile`] || {};

        const latestMessage = await Message.findOne({ room: room._id })
          .sort({ createdAt: -1 })
          .select("createdAt text")
          .lean();

        return {
          roomId: room._id,
          username: other?.username || "Unknown",
          name: profile.name || "Unnamed",
          dpUrl: profile.dpUrl || null,
          latestMessage,
        };
      })
    );

    // Sort conversations by latest message time
    conversations.sort((a, b) => {
      const aTime = a.latestMessage?.createdAt ? new Date(a.latestMessage.createdAt) : 0;
      const bTime = b.latestMessage?.createdAt ? new Date(b.latestMessage.createdAt) : 0;
      return bTime - aTime;
    });

    res.json({ conversations });
  } catch (err) {
    console.error("Error fetching conversations:", err);
    res.status(500).json({ message: "Server error" });
  }
});



/* 📜 Get messages of a room */
router.get("/room/:id/messages", async (req, res) => {
  const userId = verifyToken(req);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const msgs = await Message.find({ room: req.params.id })
    .sort({ createdAt: 1 })
    .lean();

  res.json({ messages: msgs });
});

/* 👤 Get partner name for a room */
/* 👤 Get partner info for a room */
router.get("/room/:id/info", async (req, res) => {
  const userId = verifyToken(req);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const { mode } = req.query;
  if (!["social", "professional"].includes(mode))
    return res.status(400).json({ message: "Invalid mode" });

  const room = await ChatRoom.findById(req.params.id)
    .populate("participants", "username socialProfile professionalProfile")
    .lean();

  if (!room) return res.status(404).json({ message: "Room not found" });

  const partner = room.participants.find((p) => p._id.toString() !== userId);
  if (!partner) return res.status(400).json({ message: "Partner not found" });

  const profile = partner[`${mode}Profile`];
  if (!profile) return res.status(404).json({ message: `${mode} profile not found` });

  res.json({
    partnerUsername: partner.username,
    name: profile.name,
    dpUrl: profile.dpUrl || null,
  });
});


// ❌ Delete chat room and all messages
router.delete("/room/:id", async (req, res) => {
  const userId = verifyToken(req);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const room = await ChatRoom.findById(req.params.id);
  if (!room) return res.status(404).json({ message: "Room not found" });

  // Make sure user is part of this chat
  if (!room.participants.includes(userId)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await Message.deleteMany({ room: room._id }); // delete all messages in the room
  await ChatRoom.findByIdAndDelete(room._id);   // delete the room

  res.json({ success: true });
});


module.exports = router;
