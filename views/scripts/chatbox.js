document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search)
    console.log('URL Params: ', window.location.search)
    const email = urlParams.get('email')
    const receiverId = urlParams.get('id')
    const senderId = urlParams.get('userId')

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

        const message = input.value
        if (message) {
            console.log(receiverId)
            socket.emit('sendMessage', { senderId ,receiverId, message })
            messageInput.value = ''
        }

    });

    socket.on('getMessage', (data) => {
        const thread = document.getElementById('thread')

        const messageItem = document.createElement('li')
        messageItem.textContent = `sender: ${data.username} - message: ${data.message}`
        thread.appendChild(messageItem);
    });
})