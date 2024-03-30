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

    socket.on('getMessage', ({senderName, receiverName, message, time, senderId, receiverId}) => {
        const thread = document.getElementById('thread')
       
        const messageItem = document.createElement('div')

        messageItem.textContent = `${time}-${senderName}: ${message}`

        //implementation of css class
        if (senderId === userId) {
            messageItem.classList.add('sender')
         
        } else if (receiverId === userId) {
            messageItem.classList.add('receiver')
        }
       
        thread.appendChild(messageItem);
    });

    socket.on('previousMessages', function(previousMessages) {
        previousMessages.forEach(message => {
            const div = document.createElement('div')
            div.classList.add('message-div')
            const messageItem = document.createElement('li');
            messageItem.textContent = `sender ${message.senderName} - message ${message.message}`
            console.log( 'id',message.senderId)
            if (message.senderId === userId) {
                messageItem.classList.add('sender');
            } else if (message.receiverId === userId) {
                messageItem.classList.add('receiver');
            }

            div.appendChild(messageItem);
            thread.appendChild(div);
        })
    })
})
