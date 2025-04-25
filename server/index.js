const PORT = process.env.PORT || 5000;
const express = require("express");
const app = express();
const { readdirSync } = require("fs");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const http = require("http");
const server = http.createServer(app);
const socketService = require("./socket"); // Import the socket module

app.use(
  cors({
    origin: "https://seecipe.vercel.app",
    credentials: true,
  })
);
app.use(
  bodyParser.json({
    limit: "10mb",
  })
);
app.use(cookieParser());
app.use(express.json());

// Initialize the socket server with our HTTP server
socketService.initSocketServer(server);

readdirSync("./src/routes").forEach((file) => {
  const route = require(path.join(__dirname, "src", "routes", file));
  app.use("/", route);
});

// Use server.listen instead of app.listen
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} successfully`);
});

module.exports = app;
