const { Server } = require("socket.io");
const { verifyToken } = require("./src/utils/jwt");

let io;
const connectedUsers = new Map();

// Initialize socket server with an HTTP server
function initSocketServer(server) {
  io = new Server(server);

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    try {
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
