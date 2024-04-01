document.addEventListener('DOMContentLoaded', () => {
    const messagesLink = document.querySelector('#chats');
    const usersGrid = document.getElementById('users-grid');
    const profileLink = document.querySelector('nav ul li:last-child a');
    const profileImage = document.querySelector('nav ul li:last-child a img')

    const urlParams = new URLSearchParams(window.location.search)
    const email = urlParams.get('email')
    const userId = urlParams.get('userId')
    
    //messages.href = `./messages.html?userId=${userId}&email=${email}`
    messagesLink.addEventListener('click', () => {
        window.location.href = `messages.html?userId=${userId}&email=${email}`
    })

    const userEmail = localStorage.getItem('email')
    if (email === userEmail) {
        profileLink.href = `./currentUserProfile.html?email=${encodeURIComponent(email)}&userId=${encodeURIComponent(userId)}`;
    } else {
        profileLink.href = `./profile.html?email=${encodeURIComponent(email)}&userId=${encodeURIComponent(userId)}`;
    }

    
    fetch('/api/users/all')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            return response.json();
        })
        .then(data => {
            const users = data.users
            
            // setting profile image
            const currentUser = users.find(user => user._id === userId);
            if (currentUser) {
                const imagePath = currentUser.imagePath;
                profileImage.src = `../${imagePath}`;
            }

            profileLink.set
            localStorage.setItem( 'id', users._id)
            usersGrid.innerHTML = '';
            console.log(email)
            users.forEach(user => {
                if (user._id != userId) {

                

                    const gridItem = document.createElement('div');
                    gridItem.classList.add('users-grid')
                    gridItem.setAttribute('user-id', user._id)

                    // appended the image
                    const image = document.createElement('img')
                    image.src = `../${user.imagePath}`
                    gridItem.appendChild(image)
                

                    const userDetails = document.createElement('div')
                    userDetails.classList.add('user-details')
                    userDetails.textContent = `${user.username}`;
                    gridItem.appendChild(userDetails);

                    usersGrid.appendChild(gridItem)
                }
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
