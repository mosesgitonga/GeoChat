const Message = require('../models/messages');

class MessageController {
  static async saveMessage(senderName, receiverName, message) {
    if (!senderName || !receiverName || !message) {
      console.log('The body message is not complete')
      return res.status(409).json({ error: 'message not saved' })
    }

    try {
      const newMessage = await Message.create({ senderName, receiverName, message })

      if (newMessage) {
        console.log('message created')
        await newMessage.save()
        console.log('message saved succesfully in the db')
      } else {
        console.log('Message not created')
        return { error: "message not created"}
      }
      return newMessage
  } catch(error) {
    console.log(error)
    return { error: "error saving message to db" }
  }

  }
}
module.exports = MessageController;
