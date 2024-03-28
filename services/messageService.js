const Message = require('../models/messages')

class MessageServices {
    static async getPreviousMessages(senderName, receiverName) {
        try {
            const previousMessages = await Message.find({ 
                $or: [
                    //check messages sent by the sender ro receiver and vise varsa
                    { senderName: senderName, receiverName: receiverName },
                    { senderName: receiverName, receiverName: senderName}
                ]
             }).sort({timestamp: 1})

             return previousMessages
        } catch(error) {
            console.log('Error retrieving messages')
            throw error
        }
    }
}

module.exports = MessageServices