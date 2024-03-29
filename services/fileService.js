const multer = require('multer');
const DbClient = require('../utils/db');
const fs = require('fs-extra');
const { promisify } = require('util');

const dbClient = new DbClient();
const unlinkAsync = promisify(fs.unlink);

class FileService {
    constructor() {
        this.storage = multer.diskStorage({
            destination: (req, file, cb) => {
                const directory = './uploads/profile';
                fs.ensureDir(directory)
                    .then(() => cb(null, directory))
                    .catch(err => cb(err));
            },
            filename: async (req, file, cb) => {
                const email = req.cookies.email;
                await dbClient.getUserByEmail(email)
                    .then( async user => {
                        const userId = user._id;
                        const currentImagePath = user.imagePath;

                

                        if (currentImagePath) {

                            const path = await dbClient.removeFilePath(email)
                            console.log('image path is present', path)
                            return  unlinkAsync(currentImagePath)
                               .then(async () => await  dbClient.saveFilePath(email, `./uploads/profile/${userId}-${file.originalname}`))
                                .then( () => `${userId}-${file.originalname}`);
                               
                                
                        } else {
                            return await dbClient.saveFilePath(email, `./uploads/profile/${userId}-${file.originalname}`)
                                .then(() => `${userId}-${file.originalname}`);
                        }
                    })
                    .then(filename => cb(null, filename))
                    .catch(error => cb(error));
            }
        });

        this.upload = multer({ storage: this.storage }).single('image');
    }

    async uploadImage(req) {
        return new Promise((resolve, reject) => {
            this.upload(req, null, async (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(req.file);
                }
            });
        });
    }

    async deleteProfileImage(req, res) {
        const email = req.cookies.email;
        try {
            const user = await dbClient.getUserByEmail(email);
            if (!user) {
                console.log('User not found');
                return res.status(404).json({ error: 'User not found' });
            }
            const imagePath = user.imagePath;
            if (!imagePath) {

                console.log('No image path is set in the schema');
                return res.status(404).json({ error: 'No image path is set in  schema' });
            }
            await unlinkAsync(imagePath);
            await dbClient.removeFilePath(email);
            console.log('Image deleted successfully');
            return res.status(200).json({ success: 'You have deleted the profile image' });
        } catch (error) {
            console.error('Error while deleting image', error);
            return res.status(500).json({ error: 'Error while deleting image' });
        }
    }
}

module.exports = FileService;
