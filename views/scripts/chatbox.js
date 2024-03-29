document.addEventListener('DOMContentLoaded', function() {
    const profileLink = document.querySelector('a');

    const urlParams = new URLSearchParams(window.location.search)
    console.log('URL Params: ', window.location.search)
    const email = urlParams.get('email')
    const receiverId = urlParams.get('id')
    const senderId = urlParams.get('userId')

    //renaming senderId for a new variable, this so as not to touch existing code
    const userId = senderId
    


    profileLink.href = `./profile.html?email=${encodeURIComponent(email)}&userId=${encodeURIComponent(receiverId)}`;


    console.log('Email: ',email)
    if (!email) {
        console.log('no email is present in the parameters')
    }
    console.log(email)
    // Connect to the Socket.io server
    const socket = io({
        query: {
        email: email,
        receiverId: receiverId,
        }
    });

    const messageForm = document.getElementById('messageForm');
    const input = document.getElementById('messageInput');

    messageForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const message = input.value.trim()
        if (message) {
            console.log(receiverId)
            socket.emit('sendMessage', { senderId ,receiverId, message })
            messageInput.value = ''
        }

    });

    socket.on('getMessage', ({senderName, receiverName, message, time, senderId}) => {
        const thread = document.getElementById('thread')
        const messageItem = document.createElement('li')

        //implementation of css class
        if (senderId === userId) {
            messageItem.classList.add('sender')
            //thread.appendChild(messageItem)
        } else if (receiverId === userId) {
            messageItem.classList.add('receiver')
            // thread.prepend(messageItem)
        }

        messageItem.textContent = `time: ${time} sender: ${senderName} - message: ${message}`
        thread.appendChild(messageItem);
    });

    socket.on('previousMessages', function(previousMessages) {
        previousMessages.forEach(message => {
            const messageItem = document.createElement('li');
            messageItem.textContent = `sender ${message.senderName} - message ${message.message}`
            thread.appendChild(messageItem)
        })
    })
})
