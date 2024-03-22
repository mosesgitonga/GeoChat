const injectRoutes = require('./routes/index.js');
const DbClient = require('./utils/db.js');
const express = require('express');
const http = require('http'); // Import the http module
const socketIO = require('socket.io'); // Import the Socket.IO module

const dbClient = new DbClient();

const app = express();
app.use(express.json());

// Inject routes
app.use('/api', injectRoutes());

const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with the HTTP server
const io = socketIO(server);

// Store the Socket.IO instance so it can be accessed from other modules
app.set('socketio', io);

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = server;
