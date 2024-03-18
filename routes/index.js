const express = require('express')
const UsersController = require('../controllers/usersController')

const injectRoutes = () => {
    const router = express.Router()
    router.post('/users', UsersController.createUser);
    return router
}

module.exports = injectRoutes;