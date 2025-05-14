require('dotenv').config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const PORT = process.env.PORT || 2020;

// CORS config (place early to affect both HTTP and WebSocket)
const corsOptions = {
  origin: [
    "https://heroic-fairy-60c220.netlify.app",
    "http://heroic-fairy-60c220.netlify.app",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST"],
  credentials: true
};
app.use(cors(corsOptions));

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
const router = require("./routes/router");
app.use("/", router);

// Create server
const server = http.createServer(app);

// Socket.io
const io = new Server(server, {
  cors: corsOptions
});

let users = {};

// WebSocket setup
io.on("connection", (socket) => {
  console.log('🟢 New user connected:', socket.id);
  socket.emit('welcome', 'Welcome to the chat!');

  socket.on('register', (username) => {
    users[username] = socket.id;
    console.log('✅ Registered:', username, socket.id);

    // Session timeout simulation
    setTimeout(() => {
      if (users[username]) {
        socket.emit('sessionExpired', 'Your session has expired due to inactivity.');
        socket.disconnect();
        console.log(`⚠️ ${username}'s session expired`);
      }
    }, 600000); // 10 minutes
  });

  socket.on('sendMessage', (msg) => {
    const recipientSocketId = users[msg.recipient];
    console.log("📩 Message from", msg.sender, "to", msg.recipient, ":", msg.text);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('sendMessage', msg);
    }
  });

  socket.on("disconnect", () => {
    // Optional: remove user from users object
    for (let username in users) {
      if (users[username] === socket.id) {
        console.log(`🔴 ${username} disconnected`);
        delete users[username];
        break;
      }
    }
  });
});

// Start HTTP + WebSocket server
server.listen(PORT, () => {
  console.log(`🚀 Server and WebSocket listening on port ${PORT}`);
});
