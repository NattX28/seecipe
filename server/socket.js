const { Server } = require("socket.io");
const { verifyToken } = require("./src/utils/jwt");
const cookieParser = require("cookie-parser");

let io;
const connectedUsers = new Map();

// Initialize socket server with an HTTP server
function initSocketServer(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.request.cookies["token"];

      if (!token)
        return next(new Error("Authentication error: No token provided"));

      const user = verifyToken(token);
      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user.id;

    // Store user connection
    connectedUsers.set(userId, socket.id);
    console.log(`User ${userId} connected`);

    // Handle disconnection
    socket.on("disconnect", () => {
      connectedUsers.delete(userId);
      console.log(`User ${userId} disconnected`);
    });
  });

  return io;
}

module.exports = {
  initSocketServer,
  getIO: () => io,
  getConnectedUsers: () => connectedUsers,
};
