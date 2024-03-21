const Message = require('../models/messages');
const { Server } = require('socket.io')
const { createServer } = require('http')

const httpServer = createServer()
const io = new Server(httpServer)

class MessageController {
  constructor() {
    io.on('connection', (socket) => {
      console.log('A new user connected')

      socket.on('error', (error) => {
        console.log('Socket error', error)
      })

      socket.on('disconnect', () => {
        console.log('User disconnected')
      })

    })

    httpServer.listen(3001, () => {
      console.log('Socket server is running on port 3001')
    })
  }   
   
  //send message
  async sendMessage(req, res) {
    if (!req.body) {
      console.log('Missing parameters')
      res.status(400).json({ error: 'Missing parameters'})
      return
    }
    const { roomId, message } = req.body
    if (!roomId) {
      console.log('roomid is missing in req.body')
      res.status(400).json({ error: 'Missing roomId'})
      return
    }
    if (!message) {
      console.log('message is missing in the body')
      res.status(400).json({ error: 'missing message to send'})
      return
    }
    try {
      
      const sent = io.emit(roomId, message)
      if (sent) {
        console.log(sent)
      }
      
      res.status(200).json({ success: 'message sent successfully'})
    } catch(error) {
      console.log('error while sending message', error)
      res.status(500).json({ error: 'internal server error'})

    }
  }
}

module.exports = MessageController
