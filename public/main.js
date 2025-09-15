document.addEventListener('DOMContentLoaded', () => {
    // --- Universal Elements ---
    const header = document.getElementById('main-header');
    const dashboardLink = document.getElementById('dashboard-link');

    // Desktop Auth Elements
    const authLinksDesktop = document.getElementById('auth-links-desktop');
    const userMenuDesktop = document.getElementById('user-menu-desktop');
    const navUserName = document.getElementById('nav-user-name');
    const logoutBtnDesktop = document.getElementById('logout-btn-desktop');
    
    // ... Add selectors for mobile elements if you have them ...

    // --- Sticky Header on Scroll ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });
    
    // --- Function to handle Logout ---
    function handleLogout() {
        localStorage.removeItem('token');
        window.location.href = '/public/index.html';
    }

    // --- Main Auth State Function ---
    async function checkAuthState() {
        const token = localStorage.getItem('token');

        if (token) {
            // User is potentially logged in, let's verify token and get user data
            try {
                const res = await fetch('http://localhost:5000/api/dashboard', {
                    headers: { 'x-auth-token': token }
                });

                if (res.ok) {
                    const data = await res.json();
                    const user = data.user;

                    // --- UPDATE UI FOR LOGGED-IN USER ---
                    // Show dashboard link
                    dashboardLink.classList.remove('hidden');

                    // Show user menu and name, hide login/signup
                    if (authLinksDesktop) authLinksDesktop.classList.add('hidden');
                    if (userMenuDesktop) {
                        userMenuDesktop.classList.remove('hidden');
                        navUserName.textContent = user.name.split(' ')[0]; // Show first name
                    }
                    if(logoutBtnDesktop) logoutBtnDesktop.addEventListener('click', handleLogout);

                } else {
                    // Token is invalid or expired
                    localStorage.removeItem('token');
                    updateUIToLoggedOut();
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
                updateUIToLoggedOut();
            }
        } else {
            // User is not logged in
            updateUIToLoggedOut();
        }
    }

    function updateUIToLoggedOut() {
        // --- UPDATE UI FOR LOGGED-OUT USER ---
        // Hide dashboard link
        dashboardLink.classList.add('hidden');
        // Show login/signup, hide user menu
        if (authLinksDesktop) authLinksDesktop.classList.remove('hidden');
        if (userMenuDesktop) userMenuDesktop.classList.add('hidden');
    }

    // Run the authentication check when the page loads
    checkAuthState();

    // You can keep your hamburger menu and active link logic here as well
});