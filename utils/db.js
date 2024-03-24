const mongoose = require('mongoose');
const User = require('../models/users')
/**
 * Interacts with db
 * 
 */
const DB_HOST = process.env.HOST  || 'localhost'
const DB_PORT = process.env.PORT || 27017
const uri = `mongodb://${DB_HOST}:${DB_PORT}/GeoChatDB`;
class DbClient {
   constructor() {
        mongoose.connect(uri)

        .then(() => console.log(`connected to mongodb on port ${DB_PORT}`))
        .catch((error) => console.error(`Error connecting to mongodb`, error))
   }

   async getUserByEmail(email) {
        if (!email) {
            console.log('no email passed')
        }
        try {
            const user = await User.findOne({ email: email }); 
            return user
        } catch(error) {
            console.error(error)

        }
   }
   async getUserByUsername(username) {
        if (!username) {
            console.log('no username passed')
        }
        try {
            const user = await User.findOne({ username: username }); 
            return user
        } catch(error) {
            console.error(error)

        }
    }

    async saveFilePath(email, path) {
        try {
            const user = await User.findOneAndUpdate(
                {email: email},
                { $set: {imagePath: path}},
                {new: true}    
            )
            console.log(user)
            console.log('path have been specified in the schema')
            return user
        } catch(error) {
            console.log(error)
        }
    }

    async removeFilePath(email) {
        const path = ''
        try {
            const user = await User.findOneAndUpdate(
                {email: email},
                { $set: {imagePath: path}},
                {new: true}    
            )
        } catch(error) {
            console.error(error)
        }   
    }
}


module.exports = DbClient;
