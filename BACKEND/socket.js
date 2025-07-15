const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const ChatRoom = require("./Models/ChatRoom");
const Message = require("./Models/Message");

module.exports = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "https://tweniq.vercel.app",
      methods: ["GET", "POST"],
      credentials: true
    }
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
socket.on("chat:join", (roomId) => {
  console.log(`User ${socket.userId} joined room ${roomId}`);
  socket.join(roomId);
});

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
