// connects client and server
const socket = io()

const message = document.getElementById('message'),
      handle = document.getElementById('handle'),
      output = document.getElementById('output'),
      typing = document.getElementById('typing'),
      button = document.getElementById('button');

      // will allow other clients to know client is typing
      message.addEventListener('keypress', () => {
        socket.emit('userTyping', handle.value);
      });

      // sends messages to clients
      button.addEventListener('click', () => {
        socket.emit('userMessage', {
          handle: handle.value,
          message: message.value
        });
        document.getElementById('message').value="";
      });


      // listens for userMessage being sent from other clients
      socket.on('userMessage', (data) => {
        typing.innerHTML = "";
        output.innerHTML += '<p> <strong>' + data.handle +': </strong>' + data.message + '</p>';
      });

      // listens for userTyping 
      socket.on('userTyping', (data) => {
        typing.innerHTML = '<p> <em>' + data + ' is typing...</em></p>';
      });

      // uses peer for signaling server for video chat
      function getLVideo(callbacks) {
        navigator.mediaDevices.getUserMedia = navigator.mediaDevices.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        var constraints = {
          audio: true,
          video: true
        }
        navigator.mediaDevices.getUserMedia(constraints, callbacks.success, callbacks.error)
      }

      function recStream(stream, elemid) {
        var video = document.getElementById(elemid);

        video.srcObject = stream;

        window.peer_stream = stream;
      }

      // get the local video and display it with permission
      getLVideo({
        success: function(stream){
          window.localstream = stream;
          recStream(stream, 'lVideo');
        },
        error: function(err){
          alert('cannot access your camera');
          console.log(err);
        }
      })

      var conn;
      var peer_id;

      // create a peer connection with peer object
      var peer = new Peer();

      // display the peer ID on the DOM
      peer.on('open', function() {
        document.getElementById('displayID').innerHTML = peer.id
      });

      peer.on('connection', function(connection){
        conn = connection;
        peer_id = connection.peer;

        document.getElementById('connId').value = peer_id;
      });

      peer.on('error', function(err){
        alert('an error has taken place:' + err);
        console.log(err);
      })
      // onClick with connection button and exchange peer ID's (expose ICE info)
      document.getElementById('conn_button').addEventListener('click', function(){
        peer_id = document.getElementById('connId').value;

        if(peer_id){
          conn = peer.connect(peer_id)
        } else{
          alert('enter an ID');
          return false;
        }
      })

      // call onClick sends offer and answer is exchanged
      peer.on('call', function(call){
        var acceptCall = confirm('Do you want to answer this call?');

        if(acceptCall){
          call.answer(window.localstream);

          call.on('stream', function(stream){
            window.peer_stream = stream;

            recStream(stream, 'rVideo')
          });

          call.on('close', function(){
            alert('The call has ended.');
          })
        } else{
          console.log('Call denied.')
        }
      });

      // ask to call
      document.getElementById('call_button').addEventListener('click', function(){
        console.log('Calling a peer:' + peer_id);
        console.log('Peer object', peer);

        var call = peer.call(peer_id, window.localstream);

        call.on('stream', function(stream){
          window.peer_stream = stream;

          recStream(stream, 'rVideo');
        })
      })

      // accept call
      // display the remote and local video on the clients

