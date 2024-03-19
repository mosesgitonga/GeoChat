const express = require('express')
const UsersController = require('../controllers/usersController')
const MessagesController = require('../controllers/messageController');

const injectRoutes = () => {
    const router = express.Router()
    router.post('/users', UsersController.createUser);
    router.post('/messages', MessagesController.createMessage);
    return router
}

module.exports = injectRoutes;
