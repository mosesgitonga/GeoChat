const injectRoutes = require('./routes/index.js');
const Message = require('./models/messages.js')
const DbClient = require('./utils/db.js');
const express = require('express');
const cookieParser = require('cookie-parser');
const { createServer } = require('http');
const { join, format } = require('path');
const { Server } = require('socket.io');
const { getUser } = require('./services/socketServices.js');
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const bodyParser = require('body-parser');
const moment = require('moment')
const MessageController = require('./controllers/messageController.js');
const dbClient = new DbClient();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
const store = new MongoDBStore({
    uri: 'mongodb://localhost:27017/GeoChatDB',
    collection: 'sessions',
})
app.use(session({
    secret: "our_secret_key", //should be placed in the .env incase of productiion
    resave: false,
    saveUninitialized: true,
    store: store
}))

app.use(express.json());
app.use(cookieParser());
app.use(express.static('views'));

app.use('/api', injectRoutes());
const server = createServer(app);
const io = new Server(server);  // socket.io server



app.use('/uploads', express.static(join(__dirname, 'uploads')));



global.onlineStudents = new Map()


//am getting key from map which i will use when removing user from onlineStudets
const getKey = (map, value) => {
    for (let [key, val] of map.entries()) {
        if (val === value) {
            return key
        }
    }
}
io.on('connection', async (socket) => {
    console.log('user connected', socket.id);
    try {
        //get email and receiverId from frontend query
        const email = socket.handshake.query.email
        const receiverId = socket.handshake.query.receiverId

        if (email === 'null') { //am using null as a str coz the frontend will return it as string
            console.log('no email found from the query handshake');
            console.log(email);
        }
        
        const user = await dbClient.getUserByEmail(email);
        senderName = user.username

        if (receiverId === 'null') {
            console.log('no receiver id found fromthe query handshake')
            console.log('sender id', receiverId)
        } 

        const receiverUser = await dbClient.getUserById(receiverId)
        if (!receiverUser) {
            console.log('Error, cant get receiver. perhaps no user id  is found')
        }
        const receiverName = receiverUser.username
        
        //saves the sendername and receivername in the socket process
        socket.senderName = senderName
        socket.receiverName = receiverName
        
        //updates the "onlineStudents" map with userId and socketId 
        onlineStudents.set(user.id, { id: socket.id, username: user.username})
    } catch(error) {
        console.log(error);
    }
    console.log(onlineStudents)
    socket.on('error', (error) => {
        console.log(error);
    });
    
    
    socket.on('disconnect', () => {
        console.log('user disconnected')

        //delete the key and value in map of onlineStudents
        onlineStudents.delete(getKey(onlineStudents, socket.id))
        socket.emit("getUsers", Array.from(onlineStudents))
        console.log(`user removed from the online students map`)
    })

    socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
        const recipientSocket = onlineStudents.get(receiverId);
        const senderSocketId = onlineStudents.get(senderId)
        const senderInfo = onlineStudents.get(senderId)
        const receiverInfo = onlineStudents.get(receiverId)
        
        //set time
        const currentTime = moment()
        const formattedTime = currentTime.format('HH:mm:ss')
        const time = formattedTime
        
        if (recipientSocket && senderInfo) {

            const { username: senderName, id: senderSocketId } = senderInfo
            const { username: receiverName } = receiverInfo

            //saves msg when user is online
            const newMessage = await MessageController.saveMessage(senderName, receiverName, message)
            console.log('sender socket', senderSocketId)
            io.to([recipientSocket.id, senderSocketId]).emit("getMessage", {
                senderName, receiverName, message, time, senderId, receiverId
            }); 

        } else {
            const receiverUser = await dbClient.getUserById(receiverId)
            if (!receiverUser) {
                console.log('no receiver found')
                return
            }
            const receiverName = receiverUser.username
            const { username: senderName } = senderInfo


            //saves msg when user is offline
            const newMessage = await MessageController.saveMessage(senderName, receiverName, message)
         
            console.log('sender socket', senderSocketId.id)
            io.to(senderSocketId.id).emit("getMessage",{
                senderName, receiverName, message, time, senderId, receiverId
            })

            console.log('Recipient id: ', receiverId)
            console.log('Recipient socket: ', recipientSocket)
            console.log('message', message)
        }



      });

    MessageController.handleUserReconnection(socket)

})
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = server;
