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
  
            ])

            const initiatedChats = []
            console.log(chats)
            for (const chat of chats) {
                console.log('receiver name', chat._id.senderName)
                //for (const receiver of chat._id.receiverName) {
                    const receiverUsername = await dbClient.getUserByUsername(chat._id.receiverName);
                    const senderUsername = await dbClient.getUserByUsername(chat._id.senderName);
                    console.log('receiver username', receiverUsername)
                    console.log('sender username', senderUsername)
                    console.log('sender Id ', senderUsername._id)
                    console.log('receiver Id ', receiverUsername._id)
                    initiatedChats.push({
                        senderName: chat._id.senderName,
                        receiverName: chat._id.receiverName,
                        username,
                        senderId: senderUsername._id,
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