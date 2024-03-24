const Message = require('../models/messages');
const socketIO = require('socket.io');
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

  //POST request to create new message betweem two users
  static async createMessage(req, res) {
    console.log('Request Body:', req.body);
    try { 
      const { sender, receiver, content } = req.body;

      // Validate input data
      if (!sender) {
        return res.status(400).json({ error: 'Sender field is required' });
      }
       if (!receiver) {
        return res.status(400).json({ error: 'Receiver field is required' });
      }
       if (!content) {
        return res.status(400).json({ error: 'Content field is required' });
      }

      // Create a new message
      const newMessage = new Message({
        sender,
        receiver,
        content
      });

      // Save the message to the database
      await newMessage.save();

      // Emit the new message to WebSocket clients
      if (MessageController.io) {
        MessageController.io.emit('message', newMessage);
      } else {
        console.error('Socket.IO is not properly initialized');
      }

      res.status(201).json({ message: 'Message created successfully', data: newMessage });
    } catch (error) {
      console.error('Error creating message:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  
  // GET request to retrieve messages by user ID
  static async getMessagesByUserID(req, res) {
    try {
      const userID = req.params.userID;

      const messages = await Message.find({
        $or: [{ sender: userID }, { receiver: userID }],
      }).exec();

      res.status(200).json({ messages });
    } catch (error) {
      console.error('Error retrieving messages:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } 


  static async getMessagesBetweenUsers(req, res) {
    try {
      const authenticatedUserID = req.user.id; // Assuming you store user ID in the req.user object after authentication
      const targetUserID = req.params.userID;

      // Query the database to find messages between the authenticated user and the specified user
      const messages = await Message.find({
        $or: [
          { sender: authenticatedUserID, receiver: targetUserID },
          { sender: targetUserID, receiver: authenticatedUserID },
        ],
      }).exec();

      res.status(200).json({ messages });
    } catch (error) {
      console.error('Error retrieving messages:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }


  static async deleteMessage(req, res) {
    try {
      const messageID = req.params.messageID;

      // Find the message by ID and delete it
      const deletedMessage = await Message.findByIdAndDelete(messageID);

      if (!deletedMessage) {
        return res.status(404).json({ error: 'Message not found' });
      }

      // Respond with a success message
      res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
      console.error('Error deleting message:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // GET request to retrieve messages from a specific chat room by room ID
  static async getMessagesByRoom(req, res) {
    try {
      const roomId = req.params.roomId;
      const messages = await Message.find({ room: roomId }).populate('sender', 'username');
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve messages' });
    }
  }

  // POST request to send a new message to a specific chat room
  static async sendMessage(req, res) {
    try {	    
      const { sender, content, room } = req.body;
      const newMessage = await Message.create({ sender, content, room });

      // Emit the new message to all connected clients in the room
      io.to(room).emit('message', newMessage);

      res.status(201).json(newMessage);
    } catch (error) {
      res.status(500).json({ error: 'Failed to send message' });
    }
  }
}

module.exports = MessageController;
