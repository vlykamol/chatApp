
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
  console.log('client connected with id: ' + socket.id);


  socket.on('send-msg', (message, room) => {
    if(room === null){
      socket.broadcast.emit('receive-msg',room = 'lobby', message);
      console.log(`in ${room} msg`, message);
    }else{
      socket.to(room).emit('receive-msg',room, message);
      console.log(`in ${room} msg`, message);
    }
  })

  socket.on('newConnection', (userName) => {
    console.log('server: usr ' + userName)
    socket.broadcast.emit('newConnection', userName)
  })

  socket.on('join-room',(room, user) => {
    socket.join(room);
    console.log(`${user} is joined room:`,room)
  })
});

httpServer.listen(3000);