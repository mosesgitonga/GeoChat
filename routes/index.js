const express = require('express');
const UsersController = require('../controllers/usersController');
const MessagesController = require('../controllers/messageController');

const injectRoutes = () => {
    const router = express.Router();
    router.post('/users', UsersController.createUser);
    router.post('/messages', MessagesController.createMessage);
    router.get('/messages/:userID', MessagesController.getMessagesByUserID);
    router.delete('/messages/:messageID', MessagesController.deleteMessage);
    // Route to retrieve messages between authenticated user and specified user ID
    // router.get('/messages/:userID', authMiddleware, MessageController.getMessagesBetweenUsers);
    return router;
}

module.exports = injectRoutes;
