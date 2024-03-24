const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    name: { type: String, required: true },
    participants: {type: mongoose.Schema.Types.ObjectId, required: true },
    timeStamps: { type: Date, default: Date.now()}
})

const Room = mongoose.model('Room', roomSchema)

module.exports = Room
