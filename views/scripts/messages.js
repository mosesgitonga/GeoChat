document.addEventListener('DOMContentLoaded', () => {
    const allChats = document.getElementById('allChats')
    const singleChat = document.getElementById('singleChat')

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
            
        })
    })
})