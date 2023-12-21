const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { json } = require("body-parser");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(json());

const sendToDb = (message, chatType, users, room) => {
  fetch("http://localhost:8089/Chat_Application/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
      message: message,
      room: room,
      users: users,
      chatType: chatType,
    }),
  })
    // .then((response) => response.json())
    // .then((data) => console.log(data))
    .catch((error) => console.error(error));
};

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Run when client connects
io.sockets.on("connection", (socket) => {
  console.log(`${socket.id} connected`);

  socket.on("join-room", (room) => {
    console.log(`user joined room ${room}`);
    socket.join(room);
  });

  socket.on("chat-message", ({ message, chatType, users }, room) => {
    console.log(message);
    console.log(message, chatType, users);
    sendToDb(message, chatType, users, room);
    io.to(room).emit("chat-message", message);
  });

  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
  });
});

httpServer.listen(4000, () => {
  console.log("App running at port 4000");
});
