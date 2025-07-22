require('dotenv').config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const PORT = process.env.PORT || 2020;

// CORS config
const corsOptions = {
  origin: [
    "https://heroic-fairy-60c220.netlify.app",
    // "http://heroic-fairy-60c220.netlify.app",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
};
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
const router = require("./backend/routes/router");
app.use("/", router);

const server = http.createServer(app);
const io = new Server(server, { cors: corsOptions });
// Temporary in-memory storage for messages
const messages = {};

// Add this function
function findMessageById(msgId) {
  return messages[msgId];
}

let users = {};

io.on("connection", (socket) => {
  console.log('🟢 New user connected:', socket.id)
  console.log('socket'),socket;
  ;

  socket.on('register', (username) => {
    username = username.toLowerCase();
    users[username] = socket.id;           //{"arsh": "wheoxnhg34827fhsh"  // this is socket.id}
    console.log('✅ Registered:', username);
    
    // Session timeout
    const timeout = setTimeout(() => {
      if (users[username] === socket.id) {
        socket.emit('sessionExpired', 'Session expired due to inactivity');
        socket.disconnect();
      }
    }, 600000); // 10 minutes
//it runs when user close the tb or refresh the page or internet disonnect e.t.c
    socket.on('disconnect', () => {
      clearTimeout(timeout);
      if (users[username] === socket.id) {
        delete users[username];
      }
    });
  });

  

  // Improved message handling
  socket.on('sendMessage', (msg) => {
    const recipient = msg.recipient?.toLowerCase();
    if (!recipient || !users[recipient]) {
      return socket.emit('error', 'Recipient not found');
    }
      // Save message to temporary storage
  messages[msg.id] = msg;
    const messageWithStatus = {
      ...msg,
    //   id: Date.now(), // Add unique ID for status tracking
      status: 'delivered' // Immediate delivery status
    };

    io.to(users[recipient]).emit('stopTyping');  
    io.to(users[recipient]).emit('sendMessage', messageWithStatus);
    socket.emit('messageStatus', { 
      id: messageWithStatus.id, 
      status: 'delivered' 
    });
  });

  socket.on('messageSeen', (msgId) => {
    // Find user from your database/array
    const msg = findMessageById(msgId); // <-- Ye function aapko banana padega
    if (msg && users[msg.user]) {
      io.to(users[msg.user]).emit('messageStatus', {
        id: msgId,
        status: 'read'  // <-- Status update karo
      });
    }
  });
  


  // Typing indicators with validation
  socket.on('typing', (data) => {
    if (!data?.recipient) return;
    
    const recipient = data.recipient.toLowerCase();
    if (users[recipient]) {
      io.to(users[recipient]).emit('typing', {
        user: data.user,
        isTyping: true
      });
    }
  });

  socket.on('stopTyping', (data) => {
    if (!data?.recipient) return;
    
    const recipient = data.recipient.toLowerCase();
    if (users[recipient]) {
      io.to(users[recipient]).emit('typing', {
        user: data.user,
        isTyping: false
      });
    }
  });
});


server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});