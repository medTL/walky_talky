const path = require('path');
const express  = require('express');
const socketIO = require('socket.io');
const https = require('https');
const fs = require('fs');
const publicPatch = path.join(__dirname, '/../public');
const port = process.env.PORT || 3000;
var Usercounter = 0;
var options = {
    key: fs.readFileSync(path.resolve('server/server.key')),
    cert: fs.readFileSync(path.resolve('server/server.cert')),
}
let app = express();
let server = https.createServer(options, app);
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


server.listen(3000, ()=>{
    console.log(`server is up on port ${port}`);
}); 



 