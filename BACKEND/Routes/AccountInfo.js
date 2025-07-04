// Routes/Account.js
const express = require("express");
const jwt     = require("jsonwebtoken");
const User    = require("../Models/User");

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

module.exports = router;
