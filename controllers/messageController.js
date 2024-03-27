const Message = require('../models/messages');

class MessageController {
  static async createMessage(req, res) {
    const newMessage = new Message(req.body)

    try {
        await newMessage.save()
        res.status(201).json(newMessage)
    } catch(error) {
        return res.status(409).json({ message: error.message})


    }
  }
}
module.exports = MessageController;
