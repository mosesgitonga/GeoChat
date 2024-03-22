const Room = require('../models/Room');

class RoomsController {
  // Controller function to add a user to a room
  static async addUserToRoom(req, res) {
    try {
      const { roomId, userId } = req.body;
      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }
      room.users.push(userId);
      await room.save();
      return res.status(200).json({ message: 'User added to room successfully', room });
    } catch (error) {
      console.error('Error adding user to room:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Controller function to create a room
  static async createRoom(req, res) {
    try {
      const { name, description } = req.body;
      const newRoom = await Room.create({ name, description });
      return res.status(201).json({ message: 'Room created successfully', room: newRoom });
    } catch (error) {
      console.error('Error creating room:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Controller function to send a message
  static async sendMessage(req, res) {
    try {
      const { roomId, senderId, content } = req.body;
      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }
      room.messages.push({ sender: senderId, content });
      await room.save();
      req.app.get('socketio').to(roomId).emit('message', { senderId, content });
      return res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
      console.error('Error sending message:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = RoomsController;
