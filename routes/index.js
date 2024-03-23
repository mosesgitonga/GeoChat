const UsersController = require('../controllers/usersController')
const AuthController = require('../controllers/authController')
const authenticateToken = require('../middleware/authenticateToken')
const FileController = require('../controllers/fileController')
const FileService = require('../services/fileService')
const MessageController = require('../controllers/messageController')
const RoomController = require('../controllers/roomController')
const { getAllUsers } = require('../services/homepage')
const { join } = require('node:path')
const express = require('express');

const fileController = new FileController();
const fileService = new FileService()

//multer configurationds
//const storage = multer.memoryStorage()


const injectRoutes = () => {
    const router = express.Router()
    router.post('/users', UsersController.createUser);
    router.post('/login', AuthController.login);
    router.get('/login', (req, res) => {
        res.render('login'); 
      });
    router.post('/logout',authenticateToken, async (req, res) => await AuthController.logout(req, res))
    router.post('/upload', fileController.handleImageUpload.bind(fileController));

    router.delete('/user/image', fileService.deleteProfileImage)
    router.get('/homepage', (req, res) => {
      res.sendFile(join(__dirname, '../views/homepage.html'))
    })
    router.get('/inbox', (req, res) => {
      res.sendFile(join(__dirname, '../views/chat-box.html'))
    })
    

    //rooms
    router.post('/room', RoomController.createRoom)

    return router
}

module.exports = injectRoutes;