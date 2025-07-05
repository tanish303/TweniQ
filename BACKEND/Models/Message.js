/**
 * Message model
 * -------------
 * Stores every chat message with sender reference
 * and links back to its parent ChatRoom.
 */

const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatRoom",
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },

    /* For future features (attachments, read receipts, etc.) */
    // read: { type: Boolean, default: false },
    // attachments: [{ type: String }],
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Message || mongoose.model("Message", messageSchema);
