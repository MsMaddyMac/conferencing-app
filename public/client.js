// connects client and server
const socket = io()

const message = document.getElementById('message'),
      handle = document.getElementById('handle'),
      output = document.getElementById('output'),
      typing = document.getElementById('typing'),
      button = document.getElementById('button');

      // will allow other clients to know client is typing
      message.addEventListener('keypress', () => {
        socket.emit('userTyping', handle.value)
      })

      // sends messages to clients
      button.addEventListener('click', () => {
        socket.emit('userMessage', {
          handle: handle.value,
          message: message.value
        });
        document.getElementById('message').value="";
      })


      // listens for userMessage being sent from other clients
      socket.on('userMessage', (data) => {
        typing.innerHTML = "";
        output.innerHTML += '<p> <strong>' + data.handle +': </strong>' + data.message + '</p>';
      })

      // listens for userTyping 
      socket.on('userTyping', (data) => {
        typing.innerHTML = '<p> <em>' + data + ' is typing...</em></p>';
      })