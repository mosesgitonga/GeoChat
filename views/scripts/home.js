document.addEventListener('DOMContentLoaded', () => {
    const messagesLink = document.querySelector('#chats');
    const usersGrid = document.getElementById('users-grid');
    const profileLink = document.querySelector('nav ul li:last-child a');
    const profileImage = document.querySelector('nav ul li:last-child a img')
    const searchInputCountry = document.getElementById('search-input-country');
    const searchInputRegion = document.getElementById('search-input-region');
    const searchInputTown = document.getElementById('search-input-town');
    const searchButton = document.getElementById('search-button');
    const prevPageButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');

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

    


    profileLink.href = `./profile.html?email=${encodeURIComponent(email)}&userId=${encodeURIComponent(userId)}`;
    
    let currentPage = 0;

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
            // If no parameters provided, fetch all users
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
                localStorage.setItem( 'id', users._id)

                // Clear users grid
                usersGrid.innerHTML = '';

                // Display users
                users.forEach(user => {
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
