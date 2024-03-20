const express = require('express')
const UsersController = require('../controllers/usersController')
const AuthController = require('../controllers/authController')
const authenticateToken = require('../middleware/authenticateToken')
const FileController = require('../controllers/fileController')
const FileService = require('../services/fileService')

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
    return router
}

module.exports = injectRoutes;