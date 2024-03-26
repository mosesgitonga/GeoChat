const mongoose = require('mongoose');

// Define the message schema
const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Create and export the Message model
const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
