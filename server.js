const injectRoutes = require('./routes/index.js');
const DbClient = require('./utils/db.js');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const { init: initMessageController } = require('./controllers/messageController');

const dbClient = new DbClient;

const app = express()
app.use(express.json());

app.use('/api', injectRoutes())


const PORT = process.env.PORT || 3000

const httpServer = http.createServer(app);

const io = socketIO(httpServer);

initMessageController(httpServer);

// WebSocket event handling
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle disconnect event
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

module.exports = server
