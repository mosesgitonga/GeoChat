document.addEventListener('DOMContentLoaded', () => {
    const usersGrid = document.getElementById('users-grid');
    const profileLink = document.querySelector('nav ul li:last-child a');
    const profileImage = document.querySelector('nav ul li:last-child a img')
    const searchInputCountry = document.getElementById('search-input-country');
    const searchInputRegion = document.getElementById('search-input-region');
    const searchInputTown = document.getElementById('search-input-town');

    const urlParams = new URLSearchParams(window.location.search)
    const email = urlParams.get('email')
    const userId = urlParams.get('userId')
    
    profileLink.href = `./profile.html?email=${encodeURIComponent(email)}&userId=${encodeURIComponent(userId)}`;
    
    // Function to fetch all users
    const fetchAllUsers = () => {
        fetch('/api/users/all')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                return response.json();
            })
            .then(data => {
		console.log(data)    
                const users = data.users
            
            // setting profile image
           // const currentUser = users.find(user => user._id === userId);
           // if (currentUser) {
           //     const imagePath = currentUser.imagePath;
           //     profileImage.src = `../${imagePath}`;
           // }

           // profileLink.set
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
                    userDetails.textContent = `${user.username} - ${user.location.country}-${user.location.region}-${user.location.town}`;
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
    };

    // Function to fetch users by country
    const fetchUsersByCountry = (country) => {
        fetch(`/api/users/country?country=${encodeURIComponent(country)}`)
	    .then(response => {
	        if (!response.ok) {
		    throw new Error('Failed to fetch users by country');
		}
	        return response.json();
	    })
	    .then(data => {
		const users = data.users
	        localStorage.setItem( 'id', users._id)

	        // Clear users grid
                usersGrid.innerHTML = '';

	        // Display users
                users.forEach(user => {
		    if (user._id) {	
		        if (user._id != userId) {
		            const gridItem = document.createElement('div');
		            gridItem.classList.add('users-grid');
                            gridItem.setAttribute('user-id', user._id);

                            // Appended the image
                            const image = document.createElement('img');
                            image.src = `../${user.imagePath}`;
                            gridItem.appendChild(image);

		            const userDetails = document.createElement('div');
                            userDetails.textContent = `${user.username} - ${user.location.country}-${user.location.region}-${user.location.town}`;
                            gridItem.appendChild(userDetails);

                            usersGrid.appendChild(gridItem);
			}
		    } else {
		        console.error('User object does not have _id property:', user);
		    }
		});
	    })
	    .catch(error => {
                console.error('Error fetching users by country:', error);
            });
    };

    // Event listener for search input
    searchButton.addEventListener('click', (event) => {
        const country = searchInput.value.trim();
        if (country.length > 0) {
            fetchUsersByCountry(country);
        } else {
            fetchAllUsers();
        }
    });

    fetchAllUsers();
    
    fetch(`/api/user/profile/${userId}`)
        .then(response => response.json())
        .then(data => {
	    const imagePath = data.user.imagePath;
	    profileImage.src = `../${imagePath}`;
	})
        .catch(error => {
            console.error('Error fetching user profile:', error);
        });
});
