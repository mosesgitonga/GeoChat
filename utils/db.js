const mongoose = require('mongoose');
const User = require('../models/users'); // Assuming you have a User model defined

class DbClient {
    constructor() {
        this.connect();
    }

    async connect() {
        try {
            await mongoose.connect('mongodb://localhost:27017/GeoChatDB', {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false
            });
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
        }
    }

    async getUserByEmail(email) {
        try {
            const user = await User.findOne({ email });
            return user;
        } catch (error) {
            console.error('Error fetching user by email:', error);
            throw new Error('Error fetching user by email');
        }
    }

    // Add more methods here to interact with your database

    async close() {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

module.exports = DbClient;

