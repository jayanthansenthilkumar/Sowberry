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
        
        // Update particle colors when theme changes
        updateParticleColors();
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
    
    // Initialize particles
    initParticles();
});

// Initialize particles.js
function initParticles() {
    particlesJS('particles-js', {
        particles: {
            number: { value: 80 },
            color: { value: isDarkTheme() ? '#ff7979' : '#ff6b6b' },  // Updated: using primary colors
            opacity: { value: 0.2 },
            size: { value: 3 },
            line_linked: {
                enable: true,
                distance: 150,
                color: isDarkTheme() ? '#a29bfe' : '#6c5ce7',  // Updated: using secondary colors
                opacity: 0.1,
                width: 1
            },
            move: {
                enable: true,
                speed: 2
            }
        }
    });
}

// Update particle colors based on theme
function updateParticleColors() {
    if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
        const particleColor = isDarkTheme() ? '#ff7979' : '#ff6b6b';  // Updated: using primary colors
        const lineColor = isDarkTheme() ? '#a29bfe' : '#6c5ce7';  // Updated: using secondary colors
        
        window.pJSDom[0].pJS.particles.array.forEach(particle => {
            particle.color.value = particleColor;
            particle.color.rgb = hexToRgb(particleColor);
        });
        
        window.pJSDom[0].pJS.particles.line_linked.color = lineColor;
        window.pJSDom[0].pJS.particles.line_linked.color_rgb_line = hexToRgb(lineColor);
    }
}

// Check if dark theme is active
function isDarkTheme() {
    return document.body.classList.contains('dark-theme');
}

// Helper function to convert hex to RGB
function hexToRgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
