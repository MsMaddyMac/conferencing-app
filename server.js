const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const PORT = process.env.PORT || 3000

http.listen(PORT, () => {
  console.log("Listening on port " + PORT)
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html")
});

app.use(express.static('public'));

// Set up socket
io.on('connection', function(socket){
  console.log("client is connected" + socket.id)
  // socket listens for userMessage sent from client and emits that data to the other clients
  socket.on('userMessage', (data) => {
    io.sockets.emit('userMessage', data)
  });
  socket.on('userTyping', (data) => {
    socket.broadcast.emit('userTyping', data)
  });
})