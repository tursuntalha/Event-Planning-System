const http = require("http");
const express = require("express");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  },
});

const activeUsers = [];
let messages = []; // Tüm mesajları saklamak için dizi

io.on("connection", (socket) => {
  console.log("Bir kullanıcı bağlandı:", socket.id);

  // Kullanıcı aktif olduğunda
  socket.on("userActive", (userName) => {
    const user = { id: socket.id, userName };
    activeUsers.push(user);

    // Tüm kullanıcılara aktif kullanıcı listesini gönder
    io.emit("activeUsers", activeUsers);

    // Bağlanan kullanıcıya geçmiş mesajları gönder
    socket.emit("previousMessages", messages); // Geçmiş mesajları yolla
  });

  // Mesaj gönderildiğinde
  socket.on("sendMessage", (data) => {
    console.log("Yeni mesaj alındı ve yayımlanıyor:", data);
    messages.push(data); // Mesajı kaydediyoruz
    // Mesajı **tüm bağlı kullanıcılara** gönderiyoruz
    io.emit("receiveMessage", data);  // **Tüm kullanıcılara** mesajı yayınlıyoruz
  });

  // Kullanıcı bağlantısını kopardığında
  socket.on("disconnect", () => {
    console.log("Bir kullanıcı ayrıldı:", socket.id);

    // Kullanıcıyı aktif kullanıcı listesinden çıkarıyoruz
    const index = activeUsers.findIndex((user) => user.id === socket.id);
    if (index !== -1) {
      activeUsers.splice(index, 1);
      io.emit("activeUsers", activeUsers); // Güncellenmiş aktif kullanıcı listesi gönder
    }
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
