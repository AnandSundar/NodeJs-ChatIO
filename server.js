var express = require('express'),
    app = express();
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    usernames = [];

server.listen(process.env.PORT || 4500);

console.log('Server running on port 4500');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
  console.log('Socket connected');

  socket.on('new user', function(data, callback){
    //username is found in array
    if(usernames.indexOf(data) != -1){
      callback(false);
    }else{ //username not found in array, so add new user
      callback(true);
      socket.username = data;
      usernames.push(socket.username);
      updateUsernames();
    }
  });

  //Update Usernames
  function updateUsernames(){
    io.sockets.emit('usernames', usernames);
  }

  //send message
  socket.on('send message', function(data){
    io.sockets.emit('new message', {msg: data, user: socket.username});
  });

  //disconnect
  socket.on('disconnect', function(data){
    if(!socket.username){
      return;
    }

    usernames.splice(usernames.indexOf(socket.username), 1);
    updateUsernames();
  });
});