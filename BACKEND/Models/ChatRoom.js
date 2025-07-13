/**
 * ChatRoom model
 * ---------------
 
 */

const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema(
  {
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],

    mode: {
      type: String,
      enum: ["social", "professional"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.ChatRoom || mongoose.model("ChatRoom", chatRoomSchema);
