const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const ChatRoom = require("./Models/ChatRoom");
const Message = require("./Models/Message");

module.exports = (httpServer) => {
  // 1. Create Socket.IO server with CORS enabled
  const io = new Server(httpServer, {
    cors: { origin: "*" } // tighten in production
  });

  // 2. JWT-based authentication middleware
  io.use((socket, next) => {
    try {
      const { token } = socket.handshake.auth; // sent from client
      const { userId } = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = userId; // attach to socket
      next();
    } catch {
      next(new Error("Authentication failed"));
    }
  });

  // 3. Connection handler for each client
  io.on("connection", async (socket) => {
    try {
      // Join all rooms where this user is a participant
      const rooms = await ChatRoom.find({ participants: socket.userId }).select("_id");
      rooms.forEach((r) => socket.join(r._id.toString()));
    } catch (err) {
      console.error("❌ Could not join rooms:", err);
    }

    // 4. Listen for incoming messages from this socket
    socket.on("chat:send", async ({ roomId, text }) => {
      try {
        // Save the message to MongoDB
        const msg = await Message.create({
          room: roomId,
          sender: socket.userId,
          text,
        });

        const payload = {
          ...msg.toObject({ depopulate: true }),
          room: roomId.toString(),
        };

        // ✅ Emit to all clients in the room (including sender)
        io.to(roomId).emit("chat:receive", payload);

        // ❌ Removed: socket.emit(...) to avoid double messages
      } catch (err) {
        console.error("❌ Failed to save or emit message:", err);
      }
    });
  });
};
