const mongoose = require('mongoose')
/**
 * User schema
 * 
 */

//location schema. it will be a subdocument in user schema
const locationSchema = new mongoose.Schema({
    country: { type: String, required: true },
    region: { type: String, required: true },
    town: { type: String, required: true },
    latitude: { type: Number, required: false, default: 0 },
    longitude: { type: Number, required: false, default: 0 },
}, { _id: false }) //disables auto generation of id's for this sub doc

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true},
    course: { type: String, required: true },
    cohort: { type: String, required: true },
    email : { type: String, required: true, unique: true },
    password: { type: String, required: true },
    imagePath: { type: String, required: false},
    location: { type: locationSchema, required: true }// i called the location sub doc defined above
}, { timestamps: true }) 

const User = mongoose.model('User', userSchema);

module.exports = User;
