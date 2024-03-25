
const email = localStorage.getItem('email')
    
if (!email) {
    console.log('no email cookie is present')
}
console.log(email)
// Connect to the Socket.io server
const socket = io({
    query: {
    email: email
    }
});

const form = document.getElementById('messageForm');
const input = document.getElementById('messageInput');
const thread = document.getElementById('thread');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const roomId = document.getElementById('roomIdInput').value;
    const message = input.value;

    // Send the message to the server
    socket.emit('sendMessage', { roomId, message });

    input.value = '';
});

socket.on('sendMessage', (data) => {
    const message = document.createElement('li');
    console.log(data.message)
    message.textContent = data.message;
    thread.appendChild(message);
});