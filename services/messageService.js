const Message = require('../models/messages')
const DbClient = require('../utils/db')

const dbClient = new DbClient

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
                { $group: { _id: {senderName: '$senderName', receiverName: '$receiverName'}}},
                { $sort: { '_id.timestamp': -1}}

            ])

            const initiatedChats = []
            for (const chat of chats) {
                console.log('receiver name', chat._id.receiverName)
                //for (const receiver of chat._id.receiverName) {
                    const receiverUsername = await dbClient.getUserByUsername(chat._id.receiverName);
                    initiatedChats.push({
                        senderName: chat._id.senderName,
                        receiverName: chat._id.receiverName,
                        username,
                        receiverId: receiverUsername._id
                    });
                //}
              
            }

            return initiatedChats
        } catch(error) {
            console.log('Error retrieving user', error)
        }
    }
}

module.exports = MessageServices