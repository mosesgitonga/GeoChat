const Room = require('../models/rooms')
const { Types: { ObjectId } } = require('mongoose');

class RoomController {
    static async createRoom(req, res) {
        try {
            if (!req.body) {
                console.log('request body is empty')
                res.status(400).json({ error: 'empty request body'})
                return
            } 

            const { name, participants} = req.body

            if (!name) {
                console.log('no name in the request body')
                res.status(400).json({ error: 'Missing group name'})
                return
            }
            if (!participants) {
                console.log('Missing participants')
                return res.status(400).json({ error: 'Missing particpants'})
            }

            const participantsId = participants.map(id => new ObjectId(id))
            const newRoom = await Room.create({ name, participants: participantsId })

            if (!newRoom) {
                console.log('unable to create room')
                res.status(401).json({ error: 'unable to create room' })
                return
            } else {
                console.log('room created successfully')
                res.status(201).json({ success: 'room  created successfully' })
                return
            }


        } catch(error) {
            console.error(error)
            res.status(500).json({ error: 'Internal server error' })
        }

    }
}

module.exports = RoomController