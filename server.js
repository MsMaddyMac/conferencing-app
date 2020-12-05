const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("Listening on port " + PORT)
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html")
})

app.use(express.static('public'))

// Set up socket
io.on('connection', function(socket){
  console.log("client is connected" + socket.id)
})