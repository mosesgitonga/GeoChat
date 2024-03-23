const express = require('express');
const { Server } = require('socket.io');
const { createServer } = require('http');
const path = require('path');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  }
});

// Middleware function to log when a user accesses a specific URL
app.use('/inbox', (req, res, next) => {
  console.log('User accessed /inbox URL');
  next();
});

app.use(express.static(path.join(__dirname, '../views')));

class MessageController {
  constructor() {
    httpServer.listen(3001);
    io.on('connection', (socket) => {
      console.log('a user connected');
      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    });
    console.log('socket server started on port 3001');
  }

  // ... rest of the code

}

module.exports = MessageController;
