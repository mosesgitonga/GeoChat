document.addEventListener('DOMContentLoaded', () => {
    const userList = document.getElementById('users-list');
    const profileLink = document.querySelector('nav ul li:last-child a');

    const urlParams = new URLSearchParams(window.location.search)
    const email = urlParams.get('email')
    const userId = urlParams.get('userId')
    
    profileLink.href = `./profile.html?email=${encodeURIComponent(email)}&userId=${encodeURIComponent(userId)}`;
    
    fetch('/api/users/all')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            return response.json();
        })
        .then(data => {
            const users = data.users

            localStorage.setItem( 'id', users._id)
            userList.innerHTML = '';
            console.log(email)
            users.forEach(user => {
                const listItem = document.createElement('li');
                listItem.classList.add('user-link')

                listItem.setAttribute('user-id', user._id)

                listItem.textContent = `${user.username} - ${user.location.country}, ${user.email}, ${user.location.town}`;
                userList.appendChild(listItem);
            });

            userList.querySelectorAll('.user-link').forEach(li => {
                li.addEventListener('click', () => {
                    const recipientId = li.getAttribute('user-id')
                    window.location.href = `/chat-box.html?email=${email}&id=${encodeURIComponent(recipientId)}&userId=${encodeURIComponent(userId)}`
                })
            })
        })

        .catch(error => {
            console.error('Error fetching users:', error);
        });
});
