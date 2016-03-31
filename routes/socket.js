exports.addUser = function (socket) {
  socket.on('addUser', function (data) {
    socket.username = data.username;
		socket.room = data.matchId;
    socket.join(data.matchId);
    socket.emit('user:join', 'SERVER', socket.username + ' you have connected to ' + socket.room);
  });
};

// broadcast a user's message to other users
exports.sendMessage = function (socket, io) {
  socket.on('sendMessage', function (data) {
    io.sockets.in(socket.room).emit('sendMessage', {
      displayName: data.displayName,
      picture: data.picture,
      createdBy: data.createdBy,
      createdAt: data.createdAt,
      text: data.message
    });
  });
};

exports.leave = function (socket) {
  socket.on('leave', function () {
    socket.leave(socket.room);
  });
};

exports.disconnect = function (socket) {
  // clean up when a user leaves
  socket.on('disconnect', function () {
    socket.leave(socket.room);
  });
};
