document.addEventListener('DOMContentLoaded', () => {
    const usersGrid = document.getElementById('users-grid');
    const profileLink = document.querySelector('nav ul li:last-child a');
    const profileImage = document.querySelector('nav ul li:last-child a img')

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
            

            profileLink.set
            localStorage.setItem( 'id', users._id)
            usersGrid.innerHTML = '';
            console.log(email)
            users.forEach(user => {
                if (user._id === userId) {
                    const imagePath = user.imagePath
                    console.log('image path', imagePath)
                    profileImage.src = `../${imagePath}`
          
                }
                const gridItem = document.createElement('div');
                gridItem.classList.add('users-grid')

                gridItem.setAttribute('user-id', user._id)

                
                gridItem.textContent = `${user.username} - ${user.location.country}, ${user.email}, ${user.location.town}`;
                usersGrid.appendChild(gridItem);
            });

            usersGrid.querySelectorAll('.users-grid').forEach(div => {
                div.addEventListener('click', () => {
                    const recipientId = div.getAttribute('user-id')
                    window.location.href = `/chat-box.html?email=${email}&id=${encodeURIComponent(recipientId)}&userId=${encodeURIComponent(userId)}`
                })
            })
        })

        .catch(error => {
            console.error('Error fetching users:', error);
        });
});
