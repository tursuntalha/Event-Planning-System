const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const socketIo = require("socket.io");
require('dotenv').config();

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const aiRoutes = require('./routes/ai');

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: { origin: '*', methods: ['GET', 'POST'], credentials: true }
});

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/yazlab")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/ai', aiRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const activeUsers = [];
let messages = [];

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("userActive", (userName) => {
    const user = { id: socket.id, userName };
    activeUsers.push(user);
    io.emit("activeUsers", activeUsers);
    socket.emit("previousMessages", messages);
  });

  socket.on("sendMessage", (data) => {
    messages.push(data);
    io.emit("receiveMessage", data);
  });

  socket.on("join-event-room", (eventId) => {
    socket.join(`event:${eventId}`);
    socket.eventRoom = eventId;
  });

  socket.on("event-updated", (eventId) => {
    io.to(`event:${eventId}`).emit("event-refresh", { eventId });
  });

  socket.on("disconnect", () => {
    const idx = activeUsers.findIndex(u => u.id === socket.id);
    if (idx !== -1) {
      activeUsers.splice(idx, 1);
      io.emit("activeUsers", activeUsers);
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`EventAI server running on port ${PORT}`);
});
