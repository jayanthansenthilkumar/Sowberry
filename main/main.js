// Theme toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle
    const themeToggle = document.querySelector('.theme-toggle');
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const icon = themeToggle.querySelector('i');
        
        if (icon.classList.contains('ri-sun-line')) {
            icon.classList.remove('ri-sun-line');
            icon.classList.add('ri-moon-line');
        } else {
            icon.classList.remove('ri-moon-line');
            icon.classList.add('ri-sun-line');
        }
    });
    
    // Active navigation state
    const navLinks = document.querySelectorAll('.floating-sidebar nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all links
            navLinks.forEach(link => link.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
        });
    });
});
