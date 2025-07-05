/**
 * ChatRoom model
 * ---------------
 * One document per 1‑on‑1 or group DM.
 * `mode` keeps your “social” and “professional” chats isolated.
 */

const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema(
  {
    /* Exactly two participants for a DM. */
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],

    /* Distinguish chat context */
    mode: {
      type: String,
      enum: ["social", "professional"],
      required: true,
    },
  },
  { timestamps: true }
);

/* Prevent OverwriteModelError when nodemon restarts */
module.exports =
  mongoose.models.ChatRoom || mongoose.model("ChatRoom", chatRoomSchema);
