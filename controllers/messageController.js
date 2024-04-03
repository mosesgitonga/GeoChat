const Message = require('../models/messages');
const MessageServices = require('../services/messageService');
const DbClient = require('../utils/db');
const dbClient = new DbClient

class MessageController {
  static async saveMessage(senderName, receiverName, message) {
      if (!message) {
        console.log('no message specified')
        return
      }
      if (!senderName) {
        console.log('The sender is not specified')
        return
      }
      if (!receiverName) {
        console.log('no receiverName is specifed')
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


  static async handleUserReconnection(socket) {
    try{

      const { senderName, receiverName } = socket
      if (!senderName || !receiverName) {
        console.log('could not find sendername or receivername from socket')
      }

      const previousMessages = await MessageServices.getPreviousMessages(senderName, receiverName)

      socket.emit("previousMessages", previousMessages)

    } catch(error) {
      console.log(error)

    }
  }

  static async getAllChatsForUser(req, res) {
    const { email } = req.cookies
    if (!email) {
      console.log('no email found in cookies')
    }
    console.log('email found', email)
    const user = await dbClient.getUserByEmail(email)
    if (!user) {
      console.log('no user found')
    } 
    console.log('user found', user)
    const username = user.username
    try {
      const initiatedChats = await MessageServices.allChats(username)
      if (!initiatedChats) {
        console.log('unable to get initiated chats')
        return
      }

      res.status(200).json({ initiatedChats })
    } catch(error) {
      console.log('error when getting initiated chats',error)
      res.status(500).json({ error: 'Failed to retrive initiated chats'})
    }
  }
}
module.exports = MessageController;
