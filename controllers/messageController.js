const Message = require('../models/messages');
const socketIO = require('socket.io');
const { ObjectId } = require('mongoose').Types;

// Ensure that you have Socket.io properly configured and initialized with your HTTP server (httpServer) to enable WebSocket communication.
// Initialize Socket.io with the HTTP server


// Controller for handling message-related operations
class MessageController {
  static io;

  // Initialize the controller with the HTTP server instance
  static init(httpServer) {
    // Create a static instance of the io object
    MessageController.io = socketIO(httpServer);

    // WebSocket event handling
    MessageController.io.on('connection', (socket) => {
      console.log('A user connected');

      // Handle disconnect event
      socket.on('disconnect', () => {
        console.log('User disconnected');
      });
    });
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
      const senderObjectId = new ObjectId(sender);
      const receiverObjectId = new ObjectId(receiver);

      // Create a new message
      const newMessage = new Message({
        sender: senderObjectId,
        receiver: receiverObjectId,
        content
      });

      // Save the message to the database
      await newMessage.save();

      // Emit the new message to WebSocket clients
      if (MessageController.io) {
  MessageController.io.to(room).emit('message', newMessage);
} else {
  console.error('Socket.IO is not properly initialized');
}

      res.status(201).json({ message: 'Message created successfully', data: newMessage });
    } catch (error) {
    console.error('Error creating message:', error);
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

  // PUT request to update a message by message ID
  static async updateMessageById(req, res) {
    try {
      const messageId = req.params.messageId;
      const updatedContent = req.body.content;
      const updatedMessage = await Message.findByIdAndUpdate(messageId, { content: updatedContent }, { new: true });
      res.json(updatedMessage);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update message' });
    }
  }

  // DELETE request to delete a message by message ID
  static async deleteMessageById(req, res) {
    try {
      const messageId = req.params.messageId;
      await Message.findByIdAndDelete(messageId);
      res.json({ message: 'Message deleted successfully' });
    } catch (error) {
     res.status(500).json({ error: 'Failed to delete message' });
    }
  }
}

module.exports = MessageController;
