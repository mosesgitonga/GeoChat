const injectRoutes = require('./routes/index.js');
const DbClient = require('./utils/db.js');
const express = require('express');
const cookieParser = require('cookie-parser');
const { createServer } = require('http');
const { join } = require('path');
const { Server } = require('socket.io');
const { getUser } = require('./services/socketServices.js');

const dbClient = new DbClient();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.static('views'));

app.use('/api', injectRoutes());
const server = createServer(app);
const io = new Server(server);  // socket.io server

app.get('/inbox', (req, res) => {
    res.sendFile(join(__dirname, './views/chat-box.html'));
});
//

// socketIdMapWithUserId = new Map();

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
    const email = socket.handshake.query.email

    if (email === 'null') { //am using null as a str coz the frontend will return it as string
        console.log('no email found, probably because no cookie was found');
        console.log(email);
    }

    console.log(email);  
    const user = await dbClient.getUserByEmail(email);
    
    onlineStudents.set(user.id, socket.id)
    } catch(error) {
        console.log(error);
    }
    console.log(onlineStudents)
    socket.on('error', (error) => {
        console.log(error);
    });
 
    socket.on('disconnect', () => {
        console.log('user disconnected')
        onlineStudents.delete(getKey(onlineStudents, socket.id))
        socket.emit("getUsers", Array.from(onlineStudents))
        console.log(`user removed from the online students map`)
    })


    socket.on("sendMessage", ({ senderId, receiverId, message }) => {
        const recipientSocketId = onlineStudents.get(receiverId);
        if (recipientSocketId) {
          socket.to(recipientSocketId).emit("getMessage", {
            senderId,
            message,
          });
        } else {
            console.log('Recipient id: ', receiverId)
            console.log('Recipient socket: ', recipientSocketId)
        }
      });

})
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = server;
