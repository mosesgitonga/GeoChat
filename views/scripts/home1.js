document.addEventListener('DOMContentLoaded', () => {
    const messagesLink = document.querySelector('#chats');
    const usersGrid = document.getElementById('users-grid');
    const profileLink = document.querySelector('nav ul li:last-child a');
    const profileImage = document.querySelector('nav ul li:last-child a img');
    const searchInputCountry = document.getElementById('search-input-country');
    const searchInputRegion = document.getElementById('search-input-region');
    const searchInputTown = document.getElementById('search-input-town');
    const searchButton = document.getElementById('search-button');
    const prevPageButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');

    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    const userId = urlParams.get('userId');

    messagesLink.addEventListener('click', () => {
        window.location.href = `messages.html?userId=${userId}&email=${email}`
    })

    profileLink.href = `./profile.html?email=${encodeURIComponent(email)}&userId=${encodeURIComponent(userId)}`;

    const userEmail = localStorage.getItem('email')
    if (email === userEmail) {
        profileLink.href = `./currentUserProfile.html?email=${encodeURIComponent(email)}&userId=${encodeURIComponent(userId)}`;
    } else {
        profileLink.href = `./profile.html?email=${encodeURIComponent(email)}&userId=${encodeURIComponent(userId)}`;
    }

    let currentPage = 0;
    const defaultImagePath = '../default_p.svg';

    // Event listener for search input
    const fetchUsers = () => {
        const country = searchInputCountry.value.trim();
        const region = searchInputRegion.value.trim();
        const town = searchInputTown.value.trim();

        let endpoint;

        if (country && region && town) {
            endpoint = `/api/users/country/region/town?country=${encodeURIComponent(country)}&region=${encodeURIComponent(region)}&town=${encodeURIComponent(town)}&page=${currentPage}`;
        } else if (country && region) {
            endpoint = `/api/users/country/region?country=${encodeURIComponent(country)}&region=${encodeURIComponent(region)}&page=${currentPage}`;
        } else if (country) {
            endpoint = `/api/users/country?country=${encodeURIComponent(country)}&page=${currentPage}`;
        } else {
            fetchAllUsers();
            return;
        }

        fetch(endpoint)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                return response.json();
            })
            .then(data => {
                const users = data.users
                localStorage.setItem('id', users._id)

                // Clear users grid
                usersGrid.innerHTML = '';

                // Display users
                users.forEach(user => {
                    if (user._id != userId) {
                        const gridItem = document.createElement('div');
                        gridItem.classList.add('users-grid');
                        gridItem.setAttribute('user-id', user._id);

                        const image = document.createElement('img');
                        const imagePath = user.imagePath || defaultImagePath;
                        image.src = `../${imagePath}`;
                        gridItem.appendChild(image);

                        const userDetails = document.createElement('div');
                        userDetails.textContent = `${user.username} - ${user.location.country}-${user.location.region}-${user.location.town}`;
                        gridItem.appendChild(userDetails);

                        usersGrid.appendChild(gridItem);
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

    };

    searchButton.addEventListener('click', fetchUsers);

    prevPageButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchUsers();
        }
    });

    nextPageButton.addEventListener('click', () => {
        currentPage++;
        fetchUsers();
    });

    const fetchAllUsers = () => {
        fetch('/api/users/all')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                return response.json();
            })
            .then(data => {
                const users = data.users;

                usersGrid.innerHTML = users
                    .filter(user => user._id != userId)
                    .map(user => `
                        <div class="user">
                            <div class="users-grid" user-id="${user._id}">
                                <img src="../${user.imagePath || defaultImagePath}" alt="User Image">
                            </div>
                            <div class="actions">
                                <div >${user.username}</div>
                                <button>See Profile</button>
                            </div>
                        </div>
                    `).join('');

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
    };


    fetchAllUsers();

    // setting profile image
    fetch(`/api/user/profile/${userId}`)
        .then(response => response.json())
        .then(data => {
            const imagePath = data.user.imagePath || defaultImagePath;
            profileImage.src = `../${imagePath}`;
        })
        .catch(error => {
            console.error('Error fetching user profile:', error);
        });
});
