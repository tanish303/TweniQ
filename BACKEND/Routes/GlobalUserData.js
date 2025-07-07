const express   = require("express");
const jwt       = require("jsonwebtoken");   // npm i jsonwebtoken  (if not installed)
const router    = express.Router();
const User      = require("../Models/User");

// Helper to read JWT and return current user's id (or null)
function getCurrentUserId(req) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.split(" ")[1];       // "Bearer <token>"
  if (!token) return null;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload.id || payload.userId || null; // adapt to your payload
  } catch {
    return null; // invalid / expired
  }
}

/* ------------------------------------------------------------
   GET /showuser/:username  →  compact public profile + isFollow
------------------------------------------------------------ */
router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const currentUserId = getCurrentUserId(req);      // may be null

    const user = await User.findOne({ username })
      .select("username socialProfile professionalProfile followers following createdAt")
      .populate("followers", "_id")  // only need IDs for count & isFollow
      .populate("following", "_id")  // "
      .lean();
      console.log(username);
      console.log(currentUserId);

    if (!user) return res.status(404).json({ msg: "User not found" });

    /* ── counts ─────────────────────────────── */
    const followersCount         = user.followers?.length || 0;
    const followingCount         = user.following?.length || 0;
    const socialPostsCount       = user.socialProfile?.posts?.length || 0;
    const professionalPostsCount = user.professionalProfile?.posts?.length || 0;

    /* ── is the requester already a follower? ─ */
    const isFollow = currentUserId
      ? user.followers.some(f => String(f._id) === String(currentUserId))
      : false;

    res.json({
      /* ── core id / joined ── */
      username   : user.username,
      joinedDate : user.createdAt,          // e.g. 2025-07-07T18:30:00.000Z

      /* ── professional persona ── */
      professionalName  : user.professionalProfile.name,
      professionalBio   : user.professionalProfile.bio,
      occupation        : user.professionalProfile.occupation,
      professionalDpUrl : user.professionalProfile.dpUrl,
      professionalPosts : professionalPostsCount,

      /* ── social persona ── */
      socialName  : user.socialProfile.name,
      socialBio   : user.socialProfile.bio,
      hobbies     : user.socialProfile.hobbies,
      socialDpUrl : user.socialProfile.dpUrl,
      socialPosts : socialPostsCount,

      /* ── global stats + follow flag ── */
      followers : followersCount,
      following : followingCount,
      isFollow,
    });
  } catch (err) {
    console.error("❌ Error in /showuser/:username:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/follow/:username", async (req, res) => {
  const targetUsername = req.params.username;
  const currentUserId  = getCurrentUserId(req);

  if (!currentUserId) {
    return res.status(401).json({ success: false, message: "Invalid or missing token" });
  }

  try {
    const [currentUser, targetUser] = await Promise.all([
      User.findById(currentUserId),
      User.findOne({ username: targetUsername }),
    ]);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ success: false, message: "User(s) not found" });
    }

    const alreadyFollowing = currentUser.following.includes(targetUser._id);

    if (alreadyFollowing) {
      /* ---------- UNFOLLOW ---------- */
      await Promise.all([
        User.updateOne(
          { _id: currentUser._id },
          { $pull: { following: targetUser._id }, $inc: { followingCount: -1 } }
        ),
        User.updateOne(
          { _id: targetUser._id },
          { $pull: { followers: currentUser._id }, $inc: { followersCount: -1 } }
        ),
      ]);

      return res.json({ success: true, message: "Unfollowed successfully", isFollow: false });
    } else {
      /* ---------- FOLLOW ---------- */
      await Promise.all([
        User.updateOne(
          { _id: currentUser._id },
          { $addToSet: { following: targetUser._id }, $inc: { followingCount: 1 } }
        ),
        User.updateOne(
          { _id: targetUser._id },
          { $addToSet: { followers: currentUser._id }, $inc: { followersCount: 1 } }
        ),
      ]);

      return res.json({ success: true, message: "Followed successfully", isFollow: true });
    }
  } catch (err) {
    console.error("Error in /follow/:username:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});
module.exports = router;
