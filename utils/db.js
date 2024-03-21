const mongoose = require('mongoose');
const User = require('../models/users');

const DB_HOST = process.env.HOST || 'localhost';
const DB_PORT = process.env.PORT || 27017;
const DB_NAME = process.env.DB_NAME || 'GeoChatDB';

const uri = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;

class DbClient {
    constructor() {
        mongoose.connect(uri)
            .then(() => console.log(`Connected to MongoDB on port ${DB_PORT}`))
            .catch((error) => console.error(`Error connecting to MongoDB`, error));
    }

    async getUserByEmail(email) {
        try {
            const user = await User.findOne({ email });
            return user;
        } catch (error) {
            console.error(error);
            throw new Error('Error fetching user by email');
        }
    }

    async getUsersByCountry(country) {
        try {
            const users = await User.find({ 'location.country': country });
            return users;
        } catch (error) {
            console.error(error);
            throw new Error('Error fetching users by country');
        }
    }

    async getUsersByCountryAndRegion(country, region) {
        try {
            const users = await User.find({ 'location.country': country, 'location.region': region });
            return users;
        } catch (error) {
            console.error(error);
            throw new Error('Error fetching users by country and region');
        }
    }

    async getUsersByCountryRegionAndTown(country, region, town) {
        try {
            const users = await User.find({ 'location.country': country, 'location.region': region, 'location.town': town });
            return users;
        } catch (error) {
            console.error(error);
            throw new Error('Error fetching users by country, region, and town');
        }
    }
}

module.exports = DbClient;

