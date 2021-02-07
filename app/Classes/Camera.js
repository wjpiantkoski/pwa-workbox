class Camera {
  constructor(video_node) {
    this.video_node = video_node
  }

  switch_on() {
    navigator.mediaDevices.getUserMedia({
      video: {
        width: 600,
        height: 600
      },
      audio: false
    })
    .then(stream => {
      this.stream = stream
      this.video_node.srcObject = stream
    })
    .catch(err => {
      console.error(err)
      toastr.error('Failed to switch on camera', 'Camera Error', { timeout: 30000 })
    })
  }

  switch_off() {
    this.video_node.pause()
    this.stream.getTracks()[0].stop() 
  }

  take_photo() {
    let canvas = document.createElement('canvas')

    canvas.setAttribute('width', 600)
    canvas.setAttribute('height', 600)

    let context = canvas.getContext('2d')

    context.drawImage(this.video_node, 0, 0, canvas.width, canvas.height)

    this.photo = context.canvas.toDataURL()

    context = null
    canvas = null

    return this.photo
  }
}