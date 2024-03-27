const Message = require('../models/messages')

class MessageServices {
    static async getPendingMessages(senderName, receiverName) {
        try {
            const pendingMessage = await Message.find({ 
                $or: [
                    { senderName: receiverName },
                    { senderName: receiverName }
                ]
             })
        } catch(error) {

        }
    }
}