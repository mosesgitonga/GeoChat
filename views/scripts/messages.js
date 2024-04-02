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
            console.log('sender name', chat.senderName)
            console.log('username', chat.username)
            if (chat.senderName != chat.username) {
                if (!chats.includes(chat.senderName)) {
                    chatNames.push(chat.senderName)
                }
            } else if (chat.receiverName === chat.username){
                if (!chats.includes(chat.receiverName)){
                    chatNames.push(chat.receiverName) 
                }
            }
            console.log(chatNames)
            allChats.textContent = ''
            chatNames.forEach(name => {
                
                const singleChat = document.createElement('div')
                singleChat.textContent = name
                allChats.append(singleChat)
            })
           
        })
    })
})