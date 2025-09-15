document.addEventListener('DOMContentLoaded', async () => {
    // Select all the new elements from the page
    const welcomeName = document.getElementById('welcome-name');
    const userName = document.getElementById('user-name');
    const userEmail = document.getElementById('user-email');
    const prakritiBadge = document.getElementById('prakriti-badge');
    const recommendationsContainer = document.getElementById('recommendations-container');
    const noRecommendationsCard = document.getElementById('no-recommendations-card');
    const dietList = document.getElementById('diet-recommendations');
    const lifestyleList = document.getElementById('lifestyle-recommendations');
    const logoutBtn = document.getElementById('logout-btn');

    const token = localStorage.getItem('token');
    if (!token) {
        // If no token, redirect to login page immediately
        window.location.href = '/public/login.html';
        return;
    }

    try {
        const res = await fetch('http://localhost:5000/api/dashboard', {
            headers: { 'x-auth-token': token }
        });

        if (!res.ok) {
            // If token is invalid, remove it and redirect to login
            localStorage.removeItem('token');
            window.location.href = '/public/login.html';
            return;
        }

        const data = await res.json(); // This contains { user, recommendations }
        const user = data.user;
        const recommendations = data.recommendations;

        // Populate the profile card
        welcomeName.textContent = user.name;
        userName.textContent = user.name;
        userEmail.textContent = user.email;
        prakritiBadge.textContent = user.prakriti || 'Not yet determined';

        // Check if recommendations exist and display the correct section
        if (recommendations) {
            // Show the recommendations container
            recommendationsContainer.classList.remove('hidden');

            // Populate diet list
            dietList.innerHTML = '';
            recommendations.diet.forEach(tip => {
                const li = document.createElement('li');
                li.textContent = tip;
                dietList.appendChild(li);
            });

            // Populate lifestyle list
            lifestyleList.innerHTML = '';
            recommendations.lifestyle.forEach(tip => {
                const li = document.createElement('li');
                li.textContent = tip;
                lifestyleList.appendChild(li);
            });
        } else {
            // If no recommendations, show the "call to action" card to take the quiz
            noRecommendationsCard.classList.remove('hidden');
        }

    } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        alert('An error occurred. Please try logging in again.');
        localStorage.removeItem('token');
        window.location.href = '/public/login.html';
    }

    // Logout button functionality
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '/public/index.html';
    });
});