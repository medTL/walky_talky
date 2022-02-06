const path = require('path');
const express  = require('express');
const socketIO = require('socket.io');
const http = require('http');
const fs = require('fs');
const publicPatch = path.join(__dirname, '/../public');
const port = process.env.PORT || 3000;
var Usercounter = 0;
let app = express();
let server = http.createServer(app);
let io = socketIO(server); 
app.use(express.static(publicPatch));
io.on("connection", function(socket) {
    Usercounter = Usercounter + 1;
    io.emit("user", Usercounter);
    console.log("a user is connected");
    socket.on("disconnect", function() {
      Usercounter = Usercounter - 1;
      io.emit("user", Usercounter);
      console.log("user disconnected");
    });
  
    socket.on("audioMessage", function(msg) {
      socket.broadcast.emit("audioMessage", msg);
    });
  });


server.listen(port, ()=>{
    console.log(`server is up on port ${port}`);
}); 



 