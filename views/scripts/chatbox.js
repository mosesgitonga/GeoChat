document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search)
    console.log('URL Params: ', window.location.search)
    const email = urlParams.get('email')
    const userId = urlParams.get('id')
    console.log("UserId s:", userId)

    console.log('Email: ',email)
    if (!email) {
        console.log('no email is present in the parameters')
    }
    console.log(email)
    // Connect to the Socket.io server
    const socket = io({
        query: {
        email: email
        }
    });

    const messageForm = document.getElementById('messageForm');
    const input = document.getElementById('messageInput');

    messageForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const receiverId = userId
        const message = input.value
        if (message) {
            socket.emit('sendMessage', { userId, message })
            messageInput.value = ''
        }

    });

    socket.on('getMessage', (data) => {
        const thread = document.getElementById('thread')

        const messageItem = document.createElement('li')
        messageItem.textContent = `${data.senderId}  ${data.message}`
        thread.appendChild(messageItem);
    });
})