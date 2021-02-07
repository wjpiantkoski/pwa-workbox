class Message {
  constructor() {
    this.messages = []
    this.socket = io()

    this.socket.once('connect_error', () => {
      window.dispatchEvent(new Event('messages_error'))
    })

    this.socket.on('new_message', message => {
      this.messages.unshift(message)
      window.dispatchEvent(new CustomEvent('new_message', { detail: message }))
    })

    this.socket.on('all_messages', messages => {
      this.messages = messages
      window.dispatchEvent(new Event('messages_ready'))
    })
  }

  get all() {
    return this.messages
  }

  add(photo, caption) {
    let message = { photo, caption }

    this.messages.unshift(message)
    this.socket.emit('new_message', message)

    return message
  }
}