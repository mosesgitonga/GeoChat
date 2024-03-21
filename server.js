const injectRoutes = require('./routes/index.js');
const DbClient = require('./utils/db.js');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
// const MessageController = require('./controllers/messageController');

const dbClient = new DbClient;

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '.', 'views', 'index.html'));
});

app.use('/api', injectRoutes());

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {}
});


// Initialize MessageController with the HTTP server instance
// MessageController.init(server);

// WebSocket event handling
io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  // Handle disconnect event
  //socket.on('disconnect', () => {
   // console.log('User disconnected');
  //});
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = server;
