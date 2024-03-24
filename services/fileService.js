const multer = require('multer');
const DbClient = require('../utils/db');
const fs = require('fs-extra');

const dbClient = new DbClient();

class FileService {
    constructor() {
        

        this.storage = multer.diskStorage({
            destination: async (req, file, cb) => {
                const directory = `./uploads/profile`;
                await fs.ensureDir(directory);

                cb(null, directory);
            },
            filename: async (req, file, cb) => {
                try {
                    const email = req.cookies.email;
                    const user = await dbClient.getUserByEmail(email);
                    const userId = user._id;

                    const currentImagePath = user.imagePath
                    fs.unlink(currentImagePath, (err) => {
                        if (err) {
                            console.error('unable to delete image in storage, probably no file exists')
                        } else {
                            console.log('deleted image in storage')
                        }
                    })
            
                    dbClient.saveFilePath(email, `./uploads/profile/${userId}-${file.originalname}`)
                    cb(null, `${userId}-${file.originalname}`);
                } catch (error) {
                    console.error('Error getting user from database:', error);
                    cb(error);
                }
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
        const email = req.cookies.email
        const user = await dbClient.getUserByEmail(email)
        if (!user) {
            console.log('could not find user')
            return res.status(400).json({ error: 'User not found while deleting image'})
        }
        const imagePath = user.imagePath
        if (!imagePath) {
            console.log(user)
            console.log('No image path is set in the schema')
            return res.status(400).json({ error: 'No image path is set in schema'})
        }
        try {
            fs.unlink(imagePath, (error) => {
                if (error) {
                    console.log('unable to delete image', error)
                    res.status(400).json({ error: "did not delete Image, probably does not exist"})
                    
                } else {
                    dbClient.removeFilePath(email)
                    console.log('Image deleted Successfully')
                    res.status(200).json({ success: "You have deleted the profile image"})
                    return
                }
            })
        } catch(error) {
            console.error('error while deleting image',error)
            return res.status(500).json({error: 'error while deleting image'})
        }
    }
}

module.exports = FileService;
