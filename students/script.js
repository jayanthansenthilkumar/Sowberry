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

// Initialize after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // AI Chat Panel Toggle
    const aiChatIcon = document.getElementById('aiChatIcon');
    const aiChatPanel = document.getElementById('aiChatPanel');

    aiChatIcon.addEventListener('click', () => {
        aiChatPanel.classList.toggle('active');
    });

    // Close chat panel when clicking outside
    document.addEventListener('click', (e) => {
        if (!aiChatPanel.contains(e.target) && !aiChatIcon.contains(e.target)) {
            aiChatPanel.classList.remove('active');
        }
    });
});