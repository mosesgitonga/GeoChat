const mongoose = require('mongoose');
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
   
}

module.exports = DbClient;
