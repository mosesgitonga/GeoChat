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

    // list all initiated chats involving a specific user.
    static async allChats(username) {
        try {
            //getting distict combinationsof senderName and receiverName
            const chats = await Message.aggregate([
                { $match: {$or: [{senderName: username}, {receiverName: username}]}},
                { $group: { _id: {senderName: '$senderName', receiverName: '$receiverName'}}}

            ])

            const initiatedChats = chats.map(chat => ({
                senderName: chat._id.senderName,
                receiverName: chat._id.receiverName,
                username,
            }))

            return initiatedChats
        } catch(error) {
            console.log('Error retrieving user', error)
        }
    }
}

module.exports = MessageServices