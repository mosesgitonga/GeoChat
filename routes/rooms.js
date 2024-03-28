const express = require('express');
const router = express.Router();
const RoomsController = require('../controllers/roomsController');

// Route to create a new room
router.post('/create', RoomsController.createRoom);

// Route to add a user to a room
router.post('/addUser', RoomsController.addUserToRoom);

// Route to send a message in a room
router.post('/sendMessage', RoomsController.sendMessage);

// Other routes for updating, deleting, and fetching individual rooms if needed

module.exports = router;
