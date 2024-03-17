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
            const user = await User.findOne({ email })
            return user
        } catch(error) {
            console.error(error)

        }
   }
}

module.exports = DbClient;
