const express = require('express');
const UsersController = require('../controllers/usersController');
const MessagesController = require('../controllers/messageController');
const path = require('path');

const injectRoutes = () => {
    const router = express.Router();
    // router.get('/message', (req, res) => {
    // res.sendFile(path.join(__dirname, '.', 'views', 'message.html'));
    // });
    router.post('/users', UsersController.createUser);
    router.post('/messages', MessagesController.createMessage);
    router.get('/messages/:userID', MessagesController.getMessagesByUserID);
    router.delete('/messages/:messageID', MessagesController.deleteMessage);
    // Route to retrieve messages between authenticated user and specified user ID
    // router.get('/messages/:userID', authMiddleware, MessageController.getMessagesBetweenUsers);
    return router;
}

module.exports = injectRoutes;
