document.addEventListener('DOMContentLoaded', () => {
    const userList = document.getElementById('users-list');


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

            users.forEach(user => {
                const listItem = document.createElement('li');
                listItem.classList.add('user-link')

                listItem.setAttribute('user-id', user._id)

                listItem.textContent = `${user.username} - ${user.location.country}, ${user.email}, ${user.location.town}`;
                userList.appendChild(listItem);
            });

            userList.querySelectorAll('.user-link').forEach(li => {
                li.addEventListener('click', () => {
                    const userId = li.getAttribute('user-id')
                    window.location.href = `/chat-box.html?userId=${userId}`
                })
            })
        })

        .catch(error => {
            console.error('Error fetching users:', error);
        });
});