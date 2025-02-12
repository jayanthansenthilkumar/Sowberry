// Theme toggle
const themeToggle = document.querySelector('.theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const icon = themeToggle.querySelector('i');
    icon.classList.toggle('ri-sun-line');
    icon.classList.toggle('ri-moon-line');
    
    // Update charts color scheme based on theme
    updateChartsTheme(document.body.classList.contains('dark-theme'));
});

const lightThemeColors = {
    primary: '#7c3aed',
    secondary: '#8b5cf6',
    tertiary: '#06b6d4',
    grid: '#e2e8f0'
};

const darkThemeColors = {
    primary: '#a78bfa',
    secondary: '#8b5cf6',
    tertiary: '#22d3ee',
    grid: '#1e293b'
};

function updateChartsTheme(isDark) {
    const colors = isDark ? darkThemeColors : lightThemeColors;
    Chart.defaults.color = isDark ? '#e2e8f0' : '#334155';
    Chart.defaults.borderColor = isDark ? '#1e293b' : '#e2e8f0';
    
    Chart.instances.forEach(chart => {
        chart.data.datasets[0].borderColor = colors.primary;
        chart.data.datasets[0].backgroundColor = colors.primary + '20';
        chart.options.scales.y.grid.color = colors.grid;
        chart.update();
    });
}

// Chart configurations
const chartConfig = {
    type: 'line',
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'var(--card-bg)',
                titleColor: 'var(--text)',
                bodyColor: 'var(--text)',
                borderColor: 'var(--border-color)',
                borderWidth: 1,
                padding: 10,
                cornerRadius: 8
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(99, 102, 241, 0.1)'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        },
        animations: {
            tension: {
                duration: 1000,
                easing: 'linear'
            }
        }
    }
};

// Enhanced chart animations
chartConfig.options.animations = {
    tension: {
        duration: 1000,
        easing: 'easeInOutQuart',
    },
    number: {
        duration: 800,
        easing: 'easeOutQuart'
    }
};

// Create charts
function createChart(id, data, color) {
    const ctx = document.getElementById(id).getContext('2d');
    return new Chart(ctx, {
        ...chartConfig,
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                data: data,
                borderColor: color,
                tension: 0.4,
                fill: true,
                backgroundColor: color + '20'
            }]
        }
    });
}

// Initialize charts
createChart('usersChart', [1200, 1900, 3000, 5000, 8000, 14892], '#4a90e2');
createChart('revenueChart', [15000, 25000, 37000, 45000, 59000, 84392], '#2ecc71');
createChart('sessionsChart', [500, 800, 1200, 1800, 2400, 2942], '#e74c3c');
createChart('studentsChart', [1500, 1800, 2100, 2300, 2600, 2847], '#6366f1');
createChart('completionChart', [45, 52, 60, 65, 72, 78], '#8b5cf6');
createChart('enrollmentsChart', [5000, 6800, 8400, 9900, 11200, 12583], '#06b6d4');

// Add animation delay to cards
document.querySelectorAll('.card').forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
});

// Add stagger animation to activity items
document.querySelectorAll('.activity-item').forEach((item, index) => {
    item.style.animationDelay = `${index * 0.2}s`;
});

// Remove 3D card movement handlers
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        const icon = card.querySelector('.card-header i');
        if (icon) icon.style.animationDuration = '1s';
    });
    
    card.addEventListener('mouseleave', () => {
        const icon = card.querySelector('.card-header i');
        if (icon) icon.style.animationDuration = '2s';
    });
});

// Remove particle background effect

// Search functionality
const searchInput = document.querySelector('.search-bar input');
searchInput.addEventListener('input', (e) => {
    // Add your search logic here
    console.log('Searching:', e.target.value);
});

// Update user profile dropdown
const userProfile = document.getElementById('userProfile');
const profileDropdown = document.querySelector('.profile-dropdown');

// Replace existing user profile click handlers with this:
userProfile.addEventListener('click', function(e) {
    e.stopPropagation();
    const wasActive = this.classList.contains('active');
    
    // Close any open dropdowns first
    document.querySelectorAll('.user-profile.active').forEach(profile => {
        profile.classList.remove('active');
    });
    
    // Toggle current dropdown
    if (!wasActive) {
        this.classList.add('active');
    }
});

// Ensure dropdown closes when clicking outside
document.addEventListener('click', function(e) {
    if (!userProfile.contains(e.target)) {
        userProfile.classList.remove('active');
    }
});

// Add logout functionality
document.querySelector('.logout').addEventListener('click', (e) => {
    e.preventDefault();
    // Add your logout logic here
    console.log('Logging out...');
});

// Remove the entire notification functionality section
document.addEventListener('DOMContentLoaded', () => {
    // Only keep non-notification related code
});

// Mobile menu toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const sidebar = document.querySelector('.sidebar');

mobileMenuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        sidebar.classList.remove('active');
    }
});

// Update chart responsiveness
function updateChartSize() {
    Chart.instances.forEach(chart => {
        chart.resize();
    });
}

// Enhanced mobile touch support
document.addEventListener('touchstart', () => {}, {passive: true});

// Optimize chart responsiveness
function updateChartResponsiveness() {
    const isMobile = window.innerWidth <= 768;
    Chart.instances.forEach(chart => {
        // Adjust chart options for mobile
        chart.options.scales.y.ticks.maxTicksLimit = isMobile ? 5 : 8;
        chart.options.scales.x.ticks.maxRotation = isMobile ? 45 : 0;
        chart.options.scales.x.ticks.minRotation = isMobile ? 45 : 0;
        chart.options.elements.point.radius = isMobile ? 2 : 3;
        chart.options.elements.line.borderWidth = isMobile ? 2 : 3;
        chart.resize();
        chart.update('none'); // Use 'none' mode for better performance
    });
}

window.addEventListener('resize', debounce(updateChartResponsiveness, 250));
window.addEventListener('orientationchange', updateChartResponsiveness);

// Debounce helper
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle mobile menu swipe
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
}, {passive: true});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, {passive: true});

function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;
    const threshold = 50;
    
    if (Math.abs(swipeDistance) > threshold) {
        if (swipeDistance > 0 && touchStartX < 30) {
            // Swipe right from left edge
            sidebar.classList.add('active');
        } else if (swipeDistance < 0 && sidebar.classList.contains('active')) {
            // Swipe left when sidebar is open
            sidebar.classList.remove('active');
        }
    }
}
