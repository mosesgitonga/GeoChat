const mongoose = require('mongoose');
const Message = require('./Message');
const User = require('./User');

const RoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
}, { timestamps: true });

const Room = mongoose.model('Room', RoomSchema);

class RoomModel {
  constructor(roomData) {
    this.roomData = roomData;
  }

  static async addUserToRoom(roomId, userId) {
    try {
      const room = await Room.findById(roomId);
      const user = await User.findById(userId);
      if (!room || !user) {
        throw new Error('Room or user not found');
      }
      room.users.push(user);
      await room.save();
      return room;
    } catch (error) {
      throw new Error('Error adding user to room: ' + error.message);
    }
  }

  static async createMessage(roomId, senderId, content) {
    try {
      const room = await Room.findById(roomId);
      const message = new Message({
        sender: senderId,
        content,
        room: roomId
      });
      await message.save();
      room.messages.push(message);
      await room.save();
      return message;
    } catch (error) {
      throw new Error('Error creating message: ' + error.message);
    }
  }

  static async getMessages(roomId) {
    try {
      const room = await Room.findById(roomId).populate('messages');
      if (!room) {
        throw new Error('Room not found');
      }
      return room.messages;
    } catch (error) {
      throw new Error('Error getting messages: ' + error.message);
    }
  }
}

module.exports = RoomModel;
