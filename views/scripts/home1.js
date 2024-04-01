document.addEventListener('DOMContentLoaded', () => {
    const usersGrid = document.getElementById('users-grid');
    const profileLink = document.querySelector('nav ul li:last-child a');
    const profileImage = document.querySelector('nav ul li:last-child a img');

    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    const userId = urlParams.get('userId');

    profileLink.href = `./profile.html?email=${encodeURIComponent(email)}&userId=${encodeURIComponent(userId)}`;

    fetch('/api/users/all')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            return response.json();
        })
        .then(data => {
            const users = data.users;
            const defaultImagePath = '../default_p.svg';

            usersGrid.innerHTML = '';
            users.forEach(user => {
                const gridItem = document.createElement('div');
                gridItem.classList.add('users-grid');
                gridItem.setAttribute('user-id', user._id);

                // Appending the image
                const image = document.createElement('img');
                const imagePath = user.imagePath || defaultImagePath;
                image.src = `../${imagePath}`;
                gridItem.appendChild(image);

                const userDetails = document.createElement('div');
                userDetails.textContent = `${user.username} - ${user.location.country}-${user.location.region}-${user.location.town}`;
                gridItem.appendChild(userDetails);

                usersGrid.appendChild(gridItem);
            });

            usersGrid.querySelectorAll('.users-grid').forEach(div => {
                div.addEventListener('click', () => {
                    const recipientId = div.getAttribute('user-id');
                    window.location.href = `/chat-box.html?email=${email}&id=${encodeURIComponent(recipientId)}&userId=${encodeURIComponent(userId)}`;
                });
            });
        })
        .catch(error => {
            console.error('Error fetching users:', error);
        });
});
