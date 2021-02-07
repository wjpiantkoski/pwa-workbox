const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const fs = require('fs')

const app = express()
const server = http.Server(app)
const io = socketio(server)

const messageData = fs.readFileSync(`${__dirname}/db.json`).toString()
const messages = messageData ? JSON.parse(messageData) : []

io.on('connection', socket => {
  socket.emit('all_messages', messages)

  socket.on('new_message', message => {
    messages.unshift(message)
    socket.broadcast.emit('new_message', message)
    fs.writeFileSync(`${__dirname}/db.json`, JSON.stringify(messages))
  })
})

app.use(express.static(path.join(__dirname, '../app')))
app.use('/modules', express.static(path.join(__dirname, '../node_modules')))

server.listen(8000, () => {
  console.log('server runing at localhost:8000')
})