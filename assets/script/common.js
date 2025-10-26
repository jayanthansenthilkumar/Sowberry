/**
 * Common Functions for All Pages
 * Handles logout, session checks, and other global functions
 */

// Check if user is logged in on page load
async function checkAuth() {
    try {
        const session = await API.Auth.checkSession();
        if (!session || !session.user) {
            // Redirect to login if not authenticated
            if (window.location.pathname !== '/login.php' && !window.location.pathname.endsWith('/login.php')) {
                window.location.href = 'login.php';
            }
        }
        return session;
    } catch (error) {
        console.error('Auth check failed:', error);
        if (window.location.pathname !== '/login.php' && !window.location.pathname.endsWith('/login.php')) {
            window.location.href = 'login.php';
        }
        return null;
    }
}

// Global logout function
async function handleLogout() {
    const result = await Swal.fire({
        title: 'Logout?',
        text: 'Are you sure you want to logout?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#6c5ce7',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, logout',
        cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
        try {
            await API.Auth.logout();
            window.location.href = 'login.php';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }
}

// Initialize common event listeners when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Add logout handler to all logout buttons
    const logoutButtons = document.querySelectorAll('.logout, a[href*="logout"]');
    logoutButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    });

    // Check authentication (optional - enable if you want to protect all pages)
    // checkAuth();
});

// Export functions for use in other scripts
window.handleLogout = handleLogout;
window.checkAuth = checkAuth;
