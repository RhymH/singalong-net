console.log("launching app")
const server_version = "0.1.0"

var express = require('express')
var socket = require('socket.io')

var app = express()
var SERVER_PORT = process.env.PORT || 8080
var server = app.listen(SERVER_PORT)
console.log("........... on port : " + SERVER_PORT);
app.use(express.static('public'))

//=============================================================================

var io = socket(server)
io.sockets.on('connection', newConnection)

var connections = 0


function newConnection(socket) {
  connections++;
  console.log("new connection " + socket.id);
  //events setup for communication
  socket.on('disconnect', clientDisconnection)
  socket.on('message', clientMessage)
  socket.on('data', clientData)

  //on connection
  socket.join("room")
  //send test message
  io.to("room").emit('message', 'users online:' + connections)

  function clientMessage(data) {
    console.log(data);
    //socket.broadcast.emit('message', data) // only others
    //io.sockets.emit('message', data) //everyone connected

  }

  function clientData(dataString) {
    try {
      var data = JSON.parse(dataString)
      if (data.request == "createLobby") {
        createLobby(data)
      }
    } catch (e) {
      console.log(e);
    }
  }

  function clientDisconnection(data) {
    connections--;
    io.to("room").emit('message', 'users online:' + connections)
  }


}





///lobbies

var lobbies_list = []





function createLobby(data) {
  var new_lobby = {
    'lobby_id': data.lobby_id,
    'song_id': data.song_id,
    'title': data.title,
    'artist': data.artist,
    'difficulty': data.difficulty,
    'owner': data.owner,
    'private': data.private,
    'start_time': data.start_time,
    'player_limit': data.player_limit
  }
  console.log(data);
  lobbies_list[lobbies_list.length] = new_lobby

}
