/**
 * Sowberry Components - Reusable JavaScript Components
 * This file contains all reusable component functionality
 */

// ============================================
// COMPONENT LOADER
// ============================================
class ComponentLoader {
    static async loadComponent(containerId, componentPath) {
        try {
            const response = await fetch(componentPath);
            const html = await response.text();
            document.getElementById(containerId).innerHTML = html;
            return true;
        } catch (error) {
            console.error(`Error loading component: ${componentPath}`, error);
            return false;
        }
    }

    static async loadAll(components) {
        const promises = components.map(({ containerId, path }) => 
            this.loadComponent(containerId, path)
        );
        await Promise.all(promises);
        initializeComponents();
    }
}

// ============================================
// HEADER COMPONENT
// ============================================
function createHeader(userName = 'User', userRole = 'Active') {
    return `
    <header>
        <div class="search-bar">
            <i class="ri-search-line"></i>
            <input type="text" placeholder="Search...">
        </div>
        <div class="header-tools">
            <div class="theme-toggle">
                <i class="ri-sun-line"></i>
            </div>
            <div class="notifications" id="notifications">
                <i class="ri-notification-3-line"></i>
                <span class="notification-badge">3</span>
                <div class="notifications-dropdown">
                    <div class="notifications-header">
                        <h4>Notifications</h4>
                        <a href="#" class="mark-all-read">Mark all as read</a>
                    </div>
                    <div class="notification-list" id="notificationList">
                        <!-- Notifications will be loaded dynamically -->
                    </div>
                    <a href="#" class="view-all">View all notifications</a>
                </div>
            </div>
            <div class="user-profile" id="userProfile">
                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&size=36&background=6c5ce7&color=fff" alt="User" class="user-avatar">
                <div class="user-info">
                    <span class="user-name">${userName}</span>
                    <span class="user-status">
                        <i class="ri-checkbox-blank-circle-fill"></i>
                        ${userRole}
                    </span>
                </div>
                <div class="profile-dropdown">
                    <a href="#" id="profileLink"><i class="ri-user-line"></i> My Profile</a>
                    <a href="#" id="settingsLink"><i class="ri-settings-4-line"></i> Settings</a>
                    <a href="#" id="passwordLink"><i class="ri-lock-password-line"></i> Change Password</a>
                    <div class="dropdown-divider"></div>
                    <a href="#" class="logout" id="logoutLink"><i class="ri-logout-box-line"></i> Logout</a>
                </div>
            </div>
        </div>
    </header>
    `;
}

// ============================================
// SIDEBAR CONFIGURATIONS
// ============================================
const sidebarConfig = {
    admin: {
        brandSuffix: 'ACADEMY',
        links: [
            { href: 'admin.html', icon: 'ri-dashboard-line', text: 'Dashboard' },
            { href: 'manageStudents.html', icon: 'ri-user-line', text: 'Students' },
            { href: 'manageMentors.html', icon: 'ri-team-line', text: 'Mentors' },
            { href: 'coursesOverview.html', icon: 'ri-book-open-line', text: 'Courses' },
            { href: 'performanceAnalytics.html', icon: 'ri-line-chart-line', text: 'Analytics' },
            { href: 'systemReports.html', icon: 'ri-file-chart-line', text: 'Reports' },
            { href: 'adminSettings.html', icon: 'ri-settings-line', text: 'Settings' }
        ]
    },
    mentor: {
        brandSuffix: 'ACADEMY',
        links: [
            { href: 'mentorDashboard.html', icon: 'ri-home-4-line', text: 'Overview' },
            { href: 'newCourses.html', icon: 'ri-book-open-line', text: 'Courses' },
            { href: 'studentsProgress.html', icon: 'ri-user-follow-line', text: 'Students' },
            { href: 'newAssignments.html', icon: 'ri-award-line', text: 'Assignments' },
            { href: 'newEvents.html', icon: 'ri-calendar-event-line', text: 'Events' },
            { href: 'newAptitude.html', icon: 'ri-mental-health-line', text: 'Aptitude' },
            { href: 'newproblemSolving.html', icon: 'ri-code-box-line', text: 'Problem Solving' },
            { href: 'mentorDiscussion.html', icon: 'ri-chat-1-line', text: 'Discussion' }
        ]
    },
    students: {
        brandSuffix: 'LEARNING',
        links: [
            { href: 'studentsDashboard.html', icon: 'ri-dashboard-line', text: 'Dashboard' },
            { href: 'myCourses.html', icon: 'ri-book-open-line', text: 'My Courses' },
            { href: 'myProgress.html', icon: 'ri-line-chart-line', text: 'My Progress' },
            { href: 'myAssignments.html', icon: 'ri-task-line', text: 'Assignments' },
            { href: 'studyMaterial.html', icon: 'ri-folder-5-line', text: 'Study Material' },
            { href: 'myGrades.html', icon: 'ri-medal-line', text: 'Grades' },
            { href: 'aptitudeTests.html', icon: 'ri-brain-line', text: 'Aptitude' },
            { href: 'codingPractice.html', icon: 'ri-code-box-line', text: 'Practice' },
            { href: 'codeEditor.html', icon: 'ri-terminal-box-line', text: 'Code Editor' },
            { href: 'learningGames.html', icon: 'ri-gamepad-line', text: 'Learning Games' },
            { href: 'studentDiscussion.html', icon: 'ri-discuss-line', text: 'Discussion' }
        ]
    }
};

function createSidebar(type, currentPage) {
    const config = sidebarConfig[type];
    if (!config) return '';

    const linksHtml = config.links.map(link => {
        const isActive = currentPage === link.href ? 'class="active"' : '';
        return `<a href="${link.href}" ${isActive}><i class="${link.icon}"></i><span>${link.text}</span></a>`;
    }).join('\n            ');

    return `
    <div class="sidebar-overlay"></div>
    <button class="mobile-menu-toggle">
        <i class="ri-menu-line"></i>
    </button>
    <div class="sidebar">
        <div class="logo">
            <i class="ri-seedling-fill"></i>
            <div class="logo-text">
                <span class="brand-name">Sowberry</span>
                <span class="brand-suffix">${config.brandSuffix}</span>
            </div>
        </div>
        <nav>
            ${linksHtml}
        </nav>
    </div>
    `;
}

// ============================================
// WELCOME SECTION COMPONENT
// ============================================
function createWelcomeSection(title, subtitle, stats) {
    const statsHtml = stats.map((stat, index) => `
        <div class="stat-item floating${index > 0 ? ' delay-' + index : ''}">
            <div class="stat-icon"><i class="${stat.icon}"></i></div>
            <div class="stat-info">
                <h4>${stat.label}</h4>
                <p>${stat.value}</p>
            </div>
        </div>
    `).join('');

    return `
    <div class="welcome-section">
        <div class="welcome-card">
            <div class="welcome-content">
                <div class="welcome-text">
                    <h1>${title}</h1>
                    <p>${subtitle}</p>
                </div>
                <div class="welcome-stats">
                    ${statsHtml}
                </div>
            </div>
        </div>
    </div>
    `;
}

// ============================================
// NOTIFICATIONS COMPONENT
// ============================================
function createNotificationItem(icon, message, time, unread = false) {
    return `
    <a href="#" class="notification-item${unread ? ' unread' : ''}">
        <i class="${icon}"></i>
        <div class="notification-content">
            <p>${message}</p>
            <span>${time}</span>
        </div>
    </a>
    `;
}

function loadNotifications(notifications) {
    const notificationList = document.getElementById('notificationList');
    if (!notificationList) return;

    notificationList.innerHTML = notifications.map(n => 
        createNotificationItem(n.icon, n.message, n.time, n.unread)
    ).join('');
}

// ============================================
// THEME TOGGLE FUNCTIONALITY
// ============================================
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;

    const body = document.body;
    const currentTheme = localStorage.getItem('theme');
    
    if (currentTheme === 'dark-theme') {
        body.classList.add('dark-theme');
        themeToggle.querySelector('i').classList.replace('ri-sun-line', 'ri-moon-line');
    }

    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-theme');
        
        const isDark = body.classList.contains('dark-theme');
        const icon = themeToggle.querySelector('i');
        
        if (isDark) {
            icon.classList.replace('ri-sun-line', 'ri-moon-line');
            localStorage.setItem('theme', 'dark-theme');
        } else {
            icon.classList.replace('ri-moon-line', 'ri-sun-line');
            localStorage.setItem('theme', 'light');
        }
    });
}

// ============================================
// MOBILE MENU FUNCTIONALITY
// ============================================
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    const toggleButton = mobileToggle || hamburgerMenu;
    if (!toggleButton || !sidebar) return;

    toggleButton.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        if (overlay) overlay.classList.toggle('active');
        toggleButton.classList.toggle('active');
    });

    if (overlay) {
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            if (toggleButton) toggleButton.classList.remove('active');
        });
    }
}

// ============================================
// NOTIFICATION & PROFILE DROPDOWN
// ============================================
function initDropdowns() {
    // Click outside to close dropdowns
    document.addEventListener('click', (e) => {
        const notifications = document.getElementById('notifications');
        const userProfile = document.getElementById('userProfile');
        
        if (notifications && !notifications.contains(e.target)) {
            notifications.classList.remove('active');
        }
        
        if (userProfile && !userProfile.contains(e.target)) {
            userProfile.classList.remove('active');
        }
    });

    // Toggle on click for mobile
    const notifications = document.getElementById('notifications');
    const userProfile = document.getElementById('userProfile');

    if (notifications) {
        notifications.addEventListener('click', (e) => {
            e.stopPropagation();
            notifications.classList.toggle('active');
            if (userProfile) userProfile.classList.remove('active');
        });
    }

    if (userProfile) {
        userProfile.addEventListener('click', (e) => {
            e.stopPropagation();
            userProfile.classList.toggle('active');
            if (notifications) notifications.classList.remove('active');
        });
    }
}

// ============================================
// LOGOUT FUNCTIONALITY
// ============================================
function initLogout() {
    const logoutLink = document.getElementById('logoutLink');
    if (!logoutLink) return;

    logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        // Clear session/localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        // Redirect to auth page
        window.location.href = '../auth/index.html';
    });
}

// ============================================
// CHART UTILITIES
// ============================================
const chartDefaults = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
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
            grid: { color: 'rgba(99, 102, 241, 0.1)' }
        },
        x: {
            grid: { display: false }
        }
    }
};

function createLineChart(canvasId, data, labels, color) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;

    return new Chart(canvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                borderColor: color,
                backgroundColor: color + '20',
                tension: 0.4,
                fill: true
            }]
        },
        options: chartDefaults
    });
}

function createDoughnutChart(canvasId, data, labels, colors) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;

    return new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { padding: 20 }
                }
            },
            cutout: '70%'
        }
    });
}

// ============================================
// COUNTER ANIMATION
// ============================================
function animateCounter(elementId, targetValue, duration = 2000, prefix = '', suffix = '') {
    const element = document.getElementById(elementId);
    if (!element) return;

    const start = Number(element.innerText.replace(/[^0-9.-]+/g, '')) || 0;
    const increment = (targetValue - start) / (duration / 16);
    let current = start;

    const animate = () => {
        current += increment;
        if ((increment >= 0 && current >= targetValue) || 
            (increment < 0 && current <= targetValue)) {
            element.textContent = prefix + targetValue.toLocaleString() + suffix;
        } else {
            element.textContent = prefix + Math.round(current).toLocaleString() + suffix;
            requestAnimationFrame(animate);
        }
    };

    animate();
}

// ============================================
// INITIALIZE ALL COMPONENTS
// ============================================
function initializeComponents() {
    initThemeToggle();
    initMobileMenu();
    initDropdowns();
    initLogout();
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeComponents);

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ComponentLoader,
        createHeader,
        createSidebar,
        createWelcomeSection,
        createNotificationItem,
        loadNotifications,
        initializeComponents,
        createLineChart,
        createDoughnutChart,
        animateCounter,
        chartDefaults,
        sidebarConfig
    };
}
