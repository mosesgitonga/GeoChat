const injectRoutes = require('./routes/index.js')
const DbClient = require('./utils/db.js');
const express = require('express')
const cookieParser = require('cookie-parser');
const { createServer } = require('http');
const { join } = require('path');
const { Server } = require('socket.io');
const { getUser } = require('./services/socketServices.js')

//const dbClient = new DbClient;

const app = express()
app.use(express.json());
app.use(cookieParser());

app.use('/api', injectRoutes())
const server = createServer(app);
const io = new Server(server)  // socket.io server

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, './views/chat-box.html'))
})
//

socketIdMapWithUserId = new Map()

io.on('connection', async (socket) => {
    console.log('user connected', socket.id)
    try {
    user = await getUser(socket)
    socketIdMapWithUserId.set(user.id, socket.id)
    } catch(error) {
        console.log(error)
    }
    console.log(socketIdMapWithUserId)
    socket.on('error', (error) => {
        console.log(error)
    })
 
    socket.on('disconnect', () => {
        console.log('user disconnected')
        socketIdMapWithUserId.delete(user.id, socket.id)
    })

    socket.on('message', (data) => {
        console.log('message: ' + data.message)
        io.emit('message', data)})
        
    })
//

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

module.exports = server
