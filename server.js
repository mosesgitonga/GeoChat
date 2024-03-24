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

socketIdMapWithUserId = new Map();

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
    
    socketIdMapWithUserId.set(socket.id, user.id)
    } catch(error) {
        console.log(error);
    }
    console.log(socketIdMapWithUserId);
    socket.on('error', (error) => {
        console.log(error);
    });
 
    socket.on('disconnect', () => {
        console.log('user disconnected');
        const userId = socketIdMapWithUserId.get(socket.id)
        
        if (userId) {
            socketIdMapWithUserId.delete(socket.id)
            console.log(`removed socket ${socket.id} from map`)
        } else {
            console.log(`userid not found for socket ${socket.id}`)
        }
    })

    socket.on('message', (data) => {
        console.log('message: ' + data.message);
        io.emit('message', data)});
        
    });

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = server;
