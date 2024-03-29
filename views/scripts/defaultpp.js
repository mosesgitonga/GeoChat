<script>
  document.addEventListener('DOMContentLoaded', () => {
    const profileInfo = document.getElementById('profile-info');
    const profilePic = document.getElementById('profile-pic');
    const heading = document.getElementById('heading')

    const urlParams = new URLSearchParams(window.location.search); 
    const userEmail = urlParams.get('email');
    const userId = urlParams.get('userId');
    fetch(`/api/user/profile/${userId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        const user = data.user;
        // Update profile information
        profileInfo.innerHTML = `
          <p><strong>Username:</strong> ${user.username}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Course:</strong> ${user.course}</p>
          <p><strong>Cohort:</strong> ${user.cohort}</p>
          <p><strong>Country:</strong> ${user.location.country}</p>
          <p><strong>Region:</strong> ${user.location.region}</p>
          <p><strong>Town:</strong> ${user.location.town}</p>
        `;
        // Set profile picture
        if (data.user.imagePath) {
          profilePic.src = data.user.imagePath; // Use user's profile picture
        } else {
          profilePic.src = '/uploads/default_pp.png'; // Use default profile picture
        }
        // Set heading
        heading.textContent = `${data.user.username}'s Profile`;
      })
      .catch(error => {
        console.error('Error fetching user profile:', error.message);
        profileInfo.innerHTML = '<p>Error fetching user profile</p>';
      });
  });
</script>
