/**
 * Sowberry Academy - Reusable Components
 * This file contains all reusable components (Sidebar, Header, Footer)
 * for Admin, Student, and Mentor dashboards
 */

// ==================== SIDEBAR COMPONENTS ====================

// Admin Sidebar Component
function getAdminSidebar(activePage = '') {
    const menuItems = [
        { href: 'admin.html', icon: 'ri-dashboard-line', label: 'Dashboard', key: 'dashboard' },
        { href: 'manageStudents.html', icon: 'ri-user-line', label: 'Students', key: 'students' },
        { href: 'manageMentors.html', icon: 'ri-team-line', label: 'Mentors', key: 'mentors' },
        { href: 'coursesOverview.html', icon: 'ri-book-open-line', label: 'Courses', key: 'courses' },
        { href: 'performanceAnalytics.html', icon: 'ri-line-chart-line', label: 'Analytics', key: 'analytics' },
        { href: 'systemReports.html', icon: 'ri-file-chart-line', label: 'Reports', key: 'reports' },
        { href: 'adminSettings.html', icon: 'ri-settings-line', label: 'Settings', key: 'settings' }
    ];

    const navLinks = menuItems.map(item => 
        `<a href="${item.href}" class="${activePage === item.key ? 'active' : ''}"><i class="${item.icon}"></i><span>${item.label}</span></a>`
    ).join('');

    return `
        <div class="sidebar-overlay"></div>
        <button class="hamburger-menu">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
        </button>
        <button class="mobile-menu-toggle">
            <i class="ri-menu-line"></i>
        </button>
        <div class="sidebar">
            <div class="logo">
                <i class="ri-seedling-fill"></i>
                <div class="logo-text">
                    <span class="brand-name">Sowberry</span>
                    <span class="brand-suffix">ACADEMY</span>
                </div>
            </div>
            <nav>
                ${navLinks}
            </nav>
        </div>
    `;
}

// Student Sidebar Component
function getStudentSidebar(activePage = '') {
    const menuItems = [
        { href: 'studentsDashboard.html', icon: 'ri-dashboard-line', label: 'Dashboard', key: 'dashboard' },
        { href: 'myCourses.html', icon: 'ri-book-open-line', label: 'My Courses', key: 'courses' },
        { href: 'myProgress.html', icon: 'ri-line-chart-line', label: 'My Progress', key: 'progress' },
        { href: 'myAssignments.html', icon: 'ri-task-line', label: 'Assignments', key: 'assignments' },
        { href: 'studyMaterial.html', icon: 'ri-folder-5-line', label: 'Study Material', key: 'material' },
        { href: 'myGrades.html', icon: 'ri-medal-line', label: 'Grades', key: 'grades' },
        { href: 'aptitudeTests.html', icon: 'ri-brain-line', label: 'Aptitude', key: 'aptitude' },
        { href: 'codingPractice.html', icon: 'ri-code-box-line', label: 'Practice', key: 'practice' },
        { href: 'codeEditor.html', icon: 'ri-terminal-box-line', label: 'Code Editor', key: 'editor' },
        { href: 'learningGames.html', icon: 'ri-gamepad-line', label: 'Learning Games', key: 'games' },
        { href: 'studentDiscussion.html', icon: 'ri-discuss-line', label: 'Discussion', key: 'discussion' }
    ];

    const navLinks = menuItems.map(item => 
        `<a href="${item.href}" class="${activePage === item.key ? 'active' : ''}"><i class="${item.icon}"></i><span>${item.label}</span></a>`
    ).join('');

    return `
        <div class="sidebar-overlay"></div>
        <button class="hamburger-menu">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
        </button>
        <button class="mobile-menu-toggle">
            <i class="ri-menu-line"></i>
        </button>
        <div class="sidebar">
            <div class="logo">
                <i class="ri-seedling-fill"></i>
                <div class="logo-text">
                    <span class="brand-name">Sowberry</span>
                    <span class="brand-suffix">ACADEMY</span>
                </div>
            </div>
            <nav>
                ${navLinks}
            </nav>
        </div>
    `;
}

// Mentor Sidebar Component
function getMentorSidebar(activePage = '') {
    const menuItems = [
        { href: 'mentorDashboard.html', icon: 'ri-home-4-line', label: 'Overview', key: 'dashboard' },
        { href: 'newCourses.html', icon: 'ri-book-open-line', label: 'Courses', key: 'courses' },
        { href: 'studentsProgress.html', icon: 'ri-user-follow-line', label: 'Students', key: 'students' },
        { href: 'newAssignments.html', icon: 'ri-award-line', label: 'Assignments', key: 'assignments' },
        { href: 'newEvents.html', icon: 'ri-calendar-event-line', label: 'Events', key: 'events' },
        { href: 'newAptitude.html', icon: 'ri-mental-health-line', label: 'Aptitude', key: 'aptitude' },
        { href: 'newproblemSolving.html', icon: 'ri-code-box-line', label: 'Problem Solving', key: 'problems' },
        { href: 'mentorDiscussion.html', icon: 'ri-chat-1-line', label: 'Discussion', key: 'discussion' }
    ];

    const navLinks = menuItems.map(item => 
        `<a href="${item.href}" class="${activePage === item.key ? 'active' : ''}"><i class="${item.icon}"></i><span>${item.label}</span></a>`
    ).join('');

    return `
        <div class="sidebar-overlay"></div>
        <button class="hamburger-menu">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
        </button>
        <button class="mobile-menu-toggle">
            <i class="ri-menu-line"></i>
        </button>
        <div class="sidebar">
            <div class="logo">
                <i class="ri-seedling-fill"></i>
                <div class="logo-text">
                    <span class="brand-name">Sowberry</span>
                    <span class="brand-suffix">ACADEMY</span>
                </div>
            </div>
            <nav>
                ${navLinks}
            </nav>
        </div>
    `;
}

// ==================== HEADER COMPONENT ====================

function getHeader(userName = 'User', userRole = 'student', authPath = '../auth/index.html') {
    const showSettings = userRole === 'admin';
    
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
                        <div class="notification-list">
                            <a href="#" class="notification-item unread">
                                <i class="ri-message-2-line"></i>
                                <div class="notification-content">
                                    <p>New comment on your post</p>
                                    <span>2 minutes ago</span>
                                </div>
                            </a>
                            <a href="#" class="notification-item unread">
                                <i class="ri-user-follow-line"></i>
                                <div class="notification-content">
                                    <p>New student enrolled in JavaScript course</p>
                                    <span>1 hour ago</span>
                                </div>
                            </a>
                            <a href="#" class="notification-item">
                                <i class="ri-file-list-line"></i>
                                <div class="notification-content">
                                    <p>Assignment deadline reminder</p>
                                    <span>3 hours ago</span>
                                </div>
                            </a>
                        </div>
                        <a href="#" class="view-all">View all notifications</a>
                    </div>
                </div>
                <div class="user-profile" id="userProfile">
                    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&size=30" alt="User" class="user-avatar">
                    <div class="user-info">
                        <span class="user-name">${userName}</span>
                        <span class="user-status">
                            <i class="ri-checkbox-blank-circle-fill"></i>
                            Active
                        </span>
                    </div>
                    <div class="profile-dropdown">
                        <a href="#"><i class="ri-user-line"></i> My Profile</a>
                        ${showSettings ? '<a href="#"><i class="ri-settings-4-line"></i> Settings</a>' : ''}
                        <a href="#"><i class="ri-lock-password-line"></i> Change Password</a>
                        <div class="dropdown-divider"></div>
                        <a href="${authPath}" class="logout"><i class="ri-logout-box-line"></i> Logout</a>
                    </div>
                </div>
            </div>
        </header>
    `;
}

// ==================== FOOTER COMPONENT ====================

function getFooter() {
    const currentYear = new Date().getFullYear();
    
    return `
        <footer class="dashboard-footer">
            <div class="footer-content">
                <div class="footer-left">
                    <p>&copy; ${currentYear} Sowberry Academy. All Rights Reserved.</p>
                </div>
                <div class="footer-right">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                    <a href="#">Support</a>
                </div>
            </div>
        </footer>
    `;
}

// ==================== COMPONENT RENDERER ====================

/**
 * Renders a component into a specified container
 * @param {string} containerId - The ID of the container element
 * @param {string} componentHtml - The HTML string of the component
 */
function renderComponent(containerId, componentHtml) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = componentHtml;
    }
}

/**
 * Inserts component HTML at a specific position
 * @param {string} position - 'beforebegin', 'afterbegin', 'beforeend', 'afterend'
 * @param {string} targetSelector - CSS selector for target element
 * @param {string} componentHtml - The HTML string of the component
 */
function insertComponent(position, targetSelector, componentHtml) {
    const target = document.querySelector(targetSelector);
    if (target) {
        target.insertAdjacentHTML(position, componentHtml);
    }
}

// ==================== INITIALIZATION FUNCTIONS ====================

/**
 * Initialize Admin Dashboard Components
 * @param {string} activePage - The key of the active page in sidebar
 * @param {string} userName - Name of the logged in user
 */
function initAdminComponents(activePage, userName = 'Admin') {
    // Render Sidebar
    const sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer) {
        sidebarContainer.innerHTML = getAdminSidebar(activePage);
    }
    
    // Render Header
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        headerContainer.innerHTML = getHeader(userName, 'admin', '../auth/index.html');
    }
}

/**
 * Initialize Student Dashboard Components
 * @param {string} activePage - The key of the active page in sidebar
 * @param {string} userName - Name of the logged in user
 */
function initStudentComponents(activePage, userName = 'Student') {
    // Render Sidebar
    const sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer) {
        sidebarContainer.innerHTML = getStudentSidebar(activePage);
    }
    
    // Render Header
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        headerContainer.innerHTML = getHeader(userName, 'student', '../auth/index.html');
    }
}

/**
 * Initialize Mentor Dashboard Components
 * @param {string} activePage - The key of the active page in sidebar
 * @param {string} userName - Name of the logged in user
 */
function initMentorComponents(activePage, userName = 'Mentor') {
    // Render Sidebar
    const sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer) {
        sidebarContainer.innerHTML = getMentorSidebar(activePage);
    }
    
    // Render Header
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        headerContainer.innerHTML = getHeader(userName, 'mentor', '../auth/index.html');
    }
}

// Auto-initialize components when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Check for page type and initialize accordingly
    const pageType = document.body.dataset.pageType;
    const activePage = document.body.dataset.activePage;
    const userName = document.body.dataset.userName || 'User';

    switch(pageType) {
        case 'admin':
            initAdminComponents(activePage, userName);
            break;
        case 'student':
            initStudentComponents(activePage, userName);
            break;
        case 'mentor':
            initMentorComponents(activePage, userName);
            break;
    }
});
