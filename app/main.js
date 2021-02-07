const camera = new Camera(document.getElementById('player'))

const _init = () => {
  const messages = new Message()

  window.addEventListener('messages_error', () => {
    toastr.error('Messages could not be retrived.<br>Will keep trying.', 'Network connection error')
  })

  window.addEventListener('new_message', e => {
    renderMessage(e.detail)
  })

  window.addEventListener('messages_ready', () => {
    $('#loader').remove()

    if (!messages.all.length) {
      toastr.info('Add the first message', 'No messages')
    }

    $('#messages').empty()
    messages.all.reverse().forEach(renderMessage)
  })

  // switch camera on
  $('#viewfinder').on('show.bs.modal', () => {
    camera.switch_on()
  })

  // switch camera off
  $('#viewfinder').on('hidden.bs.modal', () => {
    camera.switch_off()
  })

  // take photo
  $('#shutter').on('click', () => {
    let photo = camera.take_photo()
    $('#camera').css('background-image', `url(${photo})`).addClass('withPhoto')
  })

  // submit message
  $('#send').on('click', () => {
    let caption = $('#caption').val().trim()

    if (!camera.photo || !caption) {
      toastr.warning('Photo and caption required!', 'Incomplete message')
      return
    }

    let message = messages.add(camera.photo, caption)

    renderMessage(message)

    $('#caption').val('')
    $('#camera').css('background-image', '').removeClass('withPhoto')

    camera.photo = null
  })
}

const renderMessage = message => {
  let msgHtml = `
    <div style="display: none;" class="row message bg-light mb-2 rounded shadow">
      <div class="col-2 p-1">
        <img src="${message.photo}" class="photo w-100 rounded"/>
      </div>
      <div class="col-10 p-1">
        ${message.caption}
      </div>
    </div>
  `

  $(msgHtml)
    .prependTo('#messages')
    .show(500)
    .find('img')
    .on('click', showPhoto)
}

const showPhoto = e => {
  let photoSrc = $(e.currentTarget).attr('src')

  $('#photoframe img').attr('src', photoSrc)
  $('#photoframe').modal('show')
}