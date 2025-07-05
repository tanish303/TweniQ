// backend/socket.js
const { Server } = require("socket.io");
const jwt        = require("jsonwebtoken");

const ChatRoom   = require("./Models/ChatRoom");
const Message    = require("./Models/Message");

module.exports = (httpServer) => {
  /* -------------------------------------------------------
   * 1.  Create Socket.IO server and allow CORS in dev
   * ----------------------------------------------------- */
  const io = new Server(httpServer, {
    cors: { origin: "*" }               // tighten this in production!
  });

  /* -------------------------------------------------------
   * 2.  JWT handshake‑level authentication
   * ----------------------------------------------------- */
  io.use((socket, next) => {
    try {
      const { token } = socket.handshake.auth;     // sent from client
      const { userId } = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = userId;                      // stash for later
      return next();
    } catch {
      return next(new Error("Authentication failed"));
    }
  });

  /* -------------------------------------------------------
   * 3.  Per‑connection logic
   * ----------------------------------------------------- */
  io.on("connection", async (socket) => {
    try {
      /* Join every room this user is already a member of ——  */
      const rooms = await ChatRoom.find({ participants: socket.userId })
                                  .select("_id");
      rooms.forEach((r) => socket.join(r._id.toString()));
    } catch (err) {
      console.error("❌ Could not join rooms:", err);
    }

    /* ---------------------------------------------------
     * 4.  chat:send  – client → server
     * ------------------------------------------------- */
    socket.on("chat:send", async ({ roomId, text }) => {
      try {
        /* ⤵️  persist to MongoDB first                      */
        const msg = await Message.create({
          room:   roomId,
          sender: socket.userId,
          text,
        });

        /* 🔊 broadcast to everyone ALREADY in the room      */
        const payload = {
          ...msg.toObject({ depopulate: true }),   // remove ObjectIds→Docs
          room: roomId.toString(),                 // convenience on client
        };
        io.to(roomId).emit("chat:receive", payload);

        /* 📨 ALSO emit directly back to the sender socket   *
         * (covers the “first message before join” problem) */
        socket.emit("chat:receive", payload);

      } catch (err) {
        console.error("❌ Failed to save / emit message:", err);
      }
    });
  });
};
