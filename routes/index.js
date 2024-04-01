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
    const router = express.Router();
    // router.get('/message', (req, res) => {
    // res.sendFile(path.join(__dirname, '.', 'views', 'message.html'));
    // });
    router.post('/signup', UsersController.signup);
    router.get('/signup', (req, res) => {
        res.render('signup');
      });
    router.post('/messages', MessageController.saveMessage);
    //router.get('/messages/:userID', MessageController.getMessagesByUserID);
    //router.delete('/messages/:messageID', MessageController.deleteMessage);
    router.post('/login', AuthController.login);
    router.get('/login', authenticateToken, (req, res) => {
        res.render('login'); 
      });
    router.post('/logout',authenticateToken, async (req, res) => await AuthController.logout(req, res))
    router.post('/upload', fileController.handleImageUpload.bind(fileController));
    router.get('/chats', MessageController.getAllChatsForUser)

    router.delete('/user/image', fileService.deleteProfileImage)
   
    router.get('/users/all', UsersController.listAllUsers)
    router.get('/user/profile/:userId', UsersController.getSpecificUser)
    router.get('/user/profile/:userId', (req, res) => {
        res.render('profile');
      });
    router.get('/users/country', UsersController.listUsersByCountry)
    router.get('/users/country/region', UsersController.listUsersByRegion)
    router.get('/users/country/region/town', UsersController.listUsersByTown)

    //rooms
    router.post('/room', RoomController.createRoom)

    return router
}

module.exports = injectRoutes;
