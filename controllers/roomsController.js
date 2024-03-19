const Room = require('../models/Room');

// Controller function to create a room
async function createRoom(req, res) {
  try {
    const { name, description } = req.body;
    const room = new Room({ name, description });
    await room.save();
    return res.status(201).json({ message: 'Room created successfully', room });
  } catch (error) {
    console.error('Error creating room:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Controller function to add a user to a room
async function addUserToRoom(req, res) {
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

module.exports = { createRoom, addUserToRoom };

