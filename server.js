const injectRoutes = require('./routes/index.js');
const DbClient = require('./utils/db.js');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const MessageController = require('./controllers/messageController');

const dbClient = new DbClient;

const app = express();
app.use(express.json());

app.use('/api', injectRoutes());

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = socketIO(server);


// Initialize MessageController with the HTTP server instance
MessageController.init(server);

// WebSocket event handling
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle disconnect event
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = server;
