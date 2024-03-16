const mongoose = require('mongoose')
/**
 * User schema
 * 
 */

//location schema. it will be a subdocument in user schema
const locationSchema = new mongoose.Schema({
    country: { type: String, required: true },
    state: { type: String, required: true },
    town: { type: String, required: true }
}, { _id: false }) //disables auto generation of id's for this sub doc

const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    secondname: { type: String, required: true },
    course: { type: String, required: true },
    cohort: { type: String, required: true },
    password: { type: String, required: true },
    location: { type: locationSchema, required: true }
    
}, { timestamps: true }) 

const User = mongoose.model('User', userSchema);

export default User;
