document.addEventListener('DOMContentLoaded', () => {
    const allChats = document.getElementById('allChats')

    const urlParams = new URLSearchParams(window.location.search)
    const email = urlParams.get('email')
    const userId = urlParams.get('userId')

    const chatNames = []

    fetch('/api/chats')
    .then(response => {
        if (!response.ok) {
            const fetchError = document.createElement('div')
            fetchError.textContent = 'Unable to fetch initiated chats. This is our problem not yours'
            allChats.append(fetchError)
        }
        return response.json()

    })
    .then(data => {
        const chats = data.initiatedChats

        chats.forEach(chat => {
            console.log('sender name', chat.senderName, chat.senderId)
            console.log('username', chat.username)
            console.log('receiver name', chat.receiverName, chat.receiverId)
            const receiverId = chat.receiverId

            let otherUser = ''
            if (chat.senderName !== chat.username) {
                otherUser = chat.senderName
            } else if (chat.receiverName !== chat.username){
                otherUser = chat.receiverName
            }

            if (otherUser && !chatNames.includes(otherUser)) {
                chatNames.push(otherUser);
            }

            const singleChat = document.createElement('div')
            singleChat.classList.add('singleChat')
            singleChat.textContent = otherUser
            allChats.append(singleChat)

            // Add event listener with closure to capture the correct receiverId
            singleChat.addEventListener('click', ((id) => {
                return () => {
                    window.location.href = `/chat-box.html?email=${email}&id=${id}&userId=${userId}`;
                };
            })(receiverId));
        })
    })
})
