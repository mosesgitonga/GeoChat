const Message = require('../models/message');

// Controller for handling message-related operations
class MessageController {
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

module.exports = messageController;
