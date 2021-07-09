
//server with express
// const express = require('express');
// const app = express();
// app.listen(3000, () => console.log('connected'));


//server with socket.io
const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
  cors : {
    origin:'*'
  }
});

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on('send-msg',(message) => {
    socket.broadcast.emit('receive-msg',(message));
    console.log(message);
  })
});

httpServer.listen(3000);