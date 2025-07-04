// Routes/Account.js
const express = require("express");
const jwt     = require("jsonwebtoken");
const User    = require("../Models/User");
const SocialPost = require('../Models/SocialPost');
const ProfessionalPost = require('../Models/ProfessionalPost');

const router = express.Router();

/* ---------- JWT helper ----------- */
function verifyToken(req) {
  const raw   = req.headers.authorization || "";   // "Bearer <token>"
  const token = raw.split(" ")[1];
  if (!token) throw { status: 401, msg: "Missing token" };

  try {
    return jwt.verify(token, process.env.JWT_SECRET); // -> { id: userId, … }
  } catch {
    throw { status: 401, msg: "Invalid / expired token" };
  }
}

/* ---------- GET /account/overview ---------- */
router.get("/overview", async (req, res) => {
  try {
    /* 1️⃣  Verify token → get user id */
    const { userId: userId } = verifyToken(req);

    /* 2️⃣  Fetch needed fields only */
    const user = await User.findById(userId)
      .select(
        "username email createdAt followersCount followingCount " +
        "socialProfile professionalProfile"
      )
      .lean();

    if (!user) throw { status: 404, msg: "User not found" };

    /* 3️⃣  Build overview object */
    const social = user.socialProfile       || {};
    const prof   = user.professionalProfile || {};

    const overview = {
      /* ── Identity ── */
      username:  user.username,
      email:     user.email,
      joinedAt:  user.createdAt,

      /* ── Social profile ── */
      socialName:        social.name        || "",
      socialBio:         social.bio         || "",
      hobbies:           social.hobbies     || [],

      /* ── Professional profile ── */
      professionalName:  prof.name          || "",
      professionalBio:   prof.bio           || "",
      occupation:        prof.occupation    || "",

      /* ── Counts (separated) ── */
      numberoffollowers:               user.followersCount,
      numberoffollowing:               user.followingCount,

      socialPostCount:         social.posts?.length        || 0,
      professionalPostCount:   prof.posts?.length          || 0,

      socialSavedCount:        social.savedPosts?.length   || 0,
      professionalSavedCount:  prof.savedPosts?.length     || 0,

      socialLikedCount:        social.likedPosts?.length   || 0,
      professionalLikedCount:  prof.likedPosts?.length     || 0,
    };

    /* 4️⃣  Return JSON */
    res.json(overview);

  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ error: err.msg || "Server error" });
  }
});

router.get("/followers", async (req, res) => {
  try {
    const { userId } = verifyToken(req);

    const user = await User.findById(userId)
      .populate("followers", "username email")
      .lean();

    if (!user) throw { status: 404, msg: "User not found" };

    const users = (user.followers || []).map((u) => ({
      username: u.username,
    }));

    res.json({ users });
  } catch (err) {
    console.error("❌ Followers error:", err);
    res.status(err.status || 500).json({ error: err.msg || "Server error" });
  }
});

/* ---------- GET /account/following ---------- */
router.get("/following", async (req, res) => {
  try {
    const { userId } = verifyToken(req);

    const user = await User.findById(userId)
      .populate("following", "username email")
      .lean();

    if (!user) throw { status: 404, msg: "User not found" };

    const users = (user.following || []).map((u) => ({
      username: u.username,
    }));

    res.json({ users });
  } catch (err) {
    console.error("❌ Following error:", err);
    res.status(err.status || 500).json({ error: err.msg || "Server error" });
  }
});

router.get("/:category", async (req, res) => {
  try {
    console.log("🔍 Route hit: /account/:category");

    const { userId } = verifyToken(req);
    const { category } = req.params;        // posts | saved | liked
    const { mode }     = req.query;         // social | professional

    // Validate route params
    if (!["posts", "saved", "liked"].includes(category))
      throw { status: 400, msg: "Invalid category" };
    if (!["social", "professional"].includes(mode))
      throw { status: 400, msg: "Invalid mode" };

    console.log("User ID:", userId, "| Category:", category, "| Mode:", mode);

    // Fetch user and profile
    const user = await User.findById(userId).lean();
    if (!user) throw { status: 404, msg: "User not found" };

    const profile = user[`${mode}Profile`];
    if (!profile) throw { status: 404, msg: `${mode} profile not found` };

    // Map category to profile field
    const mapKey = {
      posts: "posts",
      saved: "savedPosts",
      liked: "likedPosts",
    }[category];

    const postIds = profile[mapKey] || [];
    const PostModel = mode === "social" ? SocialPost : ProfessionalPost;

    // Query and populate necessary fields
    let query = PostModel.find({ _id: { $in: postIds } })
      .sort({ createdAt: -1 })
      .populate("createdBy", "socialProfile professionalProfile");

    if (mode === "social") {
      query = query.populate("taggedFriend", "username");
    }

    const postsRaw = await query.lean();

    // Build final clean post array
    const posts = postsRaw.map((post) => {
      const ownerName =
        mode === "social"
          ? post.createdBy?.socialProfile?.name || "Unknown"
          : post.createdBy?.professionalProfile?.name || "Unknown";

      const taggedFriendUsername =
        mode === "social" && post.taggedFriend
          ? post.taggedFriend.username
          : null;

      const cleanPost = { ...post };

      // Remove unwanted heavy fields
      delete cleanPost.createdBy;
      delete cleanPost.taggedFriend;

      return {
        ...cleanPost,
        ownerName,
        taggedFriendUsername,
      };
    });

    res.json({ posts });
    console.log("✅ Sent:", posts.length, "posts");
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(err.status || 500).json({ error: err.msg || "Server error" });
  }
});




module.exports = router;