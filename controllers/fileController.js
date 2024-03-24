const FileService = require('../services/fileService');
const fs = require('fs-extra');
const DbClient = require('../utils/db');


const dbClient = new DbClient()

class FileController {
    constructor() {
        this.fileService = new FileService();
    }
 
    async handleImageUpload(req, res) {
        try {
            await this.fileService.uploadImage(req);
            console.log('File upload successful')
            res.status(200).json({ message: 'File uploaded successfully.' });
        } catch (error) {
            console.error('Error handling file upload:', error);
            res.status(500).json({ error: 'Internal server error.' });
        }
    }
}

module.exports = FileController;