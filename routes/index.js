var express = require('express');
var router = express.Router();
const http = require('http').createServer(express)
const io = require('socket.io')(http);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
io.on('connection', socket => {
  //Get the chatID of the user and join in a room of the same chatID
  chatID = socket.handshake.query.chatID
  socket.join(chatID)

  //Leave the room if the user closes the socket
  socket.on('disconnect', () => {
      socket.leave(chatID)
  })

  //Send message to only a particular user
  socket.on('send_message', message => {
      receiverChatID = message.receiverChatID
      senderChatID = message.senderChatID
      content = message.content

      //Send message to only that particular room
      socket.in(receiverChatID).emit('receive_message', {
          'content': content,
          'senderChatID': senderChatID,
          'receiverChatID':receiverChatID,
      })
  })
});
http.listen(process.env.PORT)
module.exports = router;
