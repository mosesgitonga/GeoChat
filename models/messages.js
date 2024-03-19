const mongoose = require('mongoose');

// Define the schema for the Message model
const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  // room: {
  // type: mongoose.Schema.Types.ObjectId,
  // ref: 'Room',
  // require: true,
  // },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Create and export the Message model
const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
