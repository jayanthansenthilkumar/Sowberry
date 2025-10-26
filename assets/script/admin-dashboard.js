/**
 * Admin Dashboard JavaScript
 * Handles all admin operations with backend API integration
 */

// Check authentication on page load
document.addEventListener('DOMContentLoaded', async function() {
    await checkAdminAuth();
    await loadNotifications();
    initializeAdminHandlers();
});

// Check if user is authenticated as admin
async function checkAdminAuth() {
    try {
        const result = await apiRequest(API_CONFIG.ENDPOINTS.CHECK_SESSION, 'GET');
        
        if (!result.success || result.data.role !== 'admin') {
            showAlert('error', 'Access Denied', 'Please login as an admin');
            setTimeout(() => {
                window.location.href = '../auth/index.html';
            }, 2000);
            return false;
        }
        
        sessionStorage.setItem('userData', JSON.stringify(result.data));
        updateUserProfile(result.data);
        return true;
    } catch (error) {
        console.error('Auth check failed:', error);
        window.location.href = '../auth/index.html';
        return false;
    }
}

// Update user profile in UI
function updateUserProfile(userData) {
    const profileElements = document.querySelectorAll('.user-name, .admin-name');
    profileElements.forEach(el => {
        if (el) el.textContent = userData.full_name || userData.username;
    });
    
    const emailElements = document.querySelectorAll('.user-email, .admin-email');
    emailElements.forEach(el => {
        if (el) el.textContent = userData.email;
    });
}

// Load notifications
async function loadNotifications() {
    try {
        const result = await apiRequest(API_CONFIG.ENDPOINTS.GET_NOTIFICATIONS, 'GET');
        
        if (result.success) {
            displayNotifications(result.data);
        }
    } catch (error) {
        console.error('Failed to load notifications:', error);
    }
}

// Display notifications
function displayNotifications(notifications) {
    const notificationBadge = document.querySelector('.notification-badge');
    const notificationList = document.querySelector('.notification-list');
    
    if (!notificationList) return;
    
    const unreadCount = notifications.filter(n => n.is_read === 0).length;
    
    if (notificationBadge) {
        notificationBadge.textContent = unreadCount;
        notificationBadge.style.display = unreadCount > 0 ? 'block' : 'none';
    }
    
    notificationList.innerHTML = notifications.length > 0 
        ? notifications.map(n => `
            <div class="notification-item ${n.is_read ? '' : 'unread'}">
                <h4>${n.title}</h4>
                <p>${n.message}</p>
                <span>${formatDate(n.created_at)}</span>
            </div>
        `).join('')
        : '<p>No notifications</p>';
}

// Initialize all admin handlers
function initializeAdminHandlers() {
    // Dashboard
    if (document.getElementById('adminDashboard')) {
        loadAdminDashboard();
    }
    
    // Students management
    if (document.getElementById('studentsManagement')) {
        loadStudents();
    }
    
    // Mentors management
    if (document.getElementById('mentorsManagement')) {
        loadMentors();
    }
    
    // Courses overview
    if (document.getElementById('coursesOverview')) {
        loadAllCourses();
    }
    
    // Analytics
    if (document.getElementById('performanceAnalytics')) {
        loadAnalytics();
    }
    
    // Reports
    if (document.getElementById('systemReports')) {
        loadReports();
    }
    
    // Settings
    if (document.getElementById('adminSettings')) {
        loadSettings();
    }
    
    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

// ==================== DASHBOARD ====================
async function loadAdminDashboard() {
    try {
        showLoading('Loading dashboard...');
        
        const result = await apiRequest(API_CONFIG.ENDPOINTS.ADMIN_DASHBOARD, 'GET');
        
        closeAlert();
        
        if (result.success) {
            updateDashboardStats(result.data.stats);
            updateRecentActivities(result.data.recent_activities);
            updateSystemAlerts(result.data.system_alerts);
        }
    } catch (error) {
        closeAlert();
        console.error('Failed to load dashboard:', error);
    }
}

function updateDashboardStats(stats) {
    if (document.getElementById('totalStudents')) {
        document.getElementById('totalStudents').textContent = stats.total_students || 0;
    }
    if (document.getElementById('totalMentors')) {
        document.getElementById('totalMentors').textContent = stats.total_mentors || 0;
    }
    if (document.getElementById('totalCourses')) {
        document.getElementById('totalCourses').textContent = stats.total_courses || 0;
    }
    if (document.getElementById('activeEnrollments')) {
        document.getElementById('activeEnrollments').textContent = stats.active_enrollments || 0;
    }
}

function updateRecentActivities(activities) {
    const container = document.getElementById('recentActivities');
    if (!container) return;
    
    container.innerHTML = activities.length > 0
        ? activities.map(activity => `
            <div class="activity-item">
                <i class="ri-${getActivityIcon(activity.type)}"></i>
                <div>
                    <h4>${activity.title}</h4>
                    <p>${activity.description}</p>
                    <span>${formatDate(activity.created_at)}</span>
                </div>
            </div>
        `).join('')
        : '<p class="no-data">No recent activities</p>';
}

function updateSystemAlerts(alerts) {
    const container = document.getElementById('systemAlerts');
    if (!container) return;
    
    container.innerHTML = alerts.length > 0
        ? alerts.map(alert => `
            <div class="alert-item ${alert.severity}">
                <i class="ri-alert-line"></i>
                <div>
                    <h4>${alert.title}</h4>
                    <p>${alert.message}</p>
                </div>
            </div>
        `).join('')
        : '<p class="no-data">No system alerts</p>';
}

// ==================== STUDENTS MANAGEMENT ====================
async function loadStudents() {
    try {
        showLoading('Loading students...');
        
        const result = await apiRequest(API_CONFIG.ENDPOINTS.GET_STUDENTS, 'GET');
        
        closeAlert();
        
        if (result.success) {
            displayStudents(result.data);
        }
    } catch (error) {
        closeAlert();
        showAlert('error', 'Error', 'Failed to load students');
    }
}

function displayStudents(students) {
    const container = document.getElementById('studentsContainer');
    if (!container) return;
    
    container.innerHTML = students.length > 0
        ? `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Enrolled Courses</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${students.map(student => `
                        <tr>
                            <td>${student.student_id}</td>
                            <td>${student.full_name}</td>
                            <td>${student.email}</td>
                            <td>${student.phone || 'N/A'}</td>
                            <td>${student.enrolled_courses || 0}</td>
                            <td><span class="status-badge ${student.status}">${student.status}</span></td>
                            <td>
                                <button class="btn-sm edit-student" data-id="${student.student_id}">Edit</button>
                                <button class="btn-sm delete-student" data-id="${student.student_id}">Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `
        : '<p class="no-data">No students found</p>';
    
    // Add event listeners
    document.querySelectorAll('.edit-student').forEach(btn => {
        btn.addEventListener('click', () => handleEditStudent(btn.dataset.id));
    });
    
    document.querySelectorAll('.delete-student').forEach(btn => {
        btn.addEventListener('click', () => handleDeleteStudent(btn.dataset.id));
    });
}

// Create student
async function handleCreateStudent() {
    try {
        const { value: formValues } = await Swal.fire({
            title: 'Create Student',
            html: `
                <input id="username" class="swal2-input" placeholder="Username">
                <input id="email" class="swal2-input" type="email" placeholder="Email">
                <input id="password" class="swal2-input" type="password" placeholder="Password">
                <input id="full_name" class="swal2-input" placeholder="Full Name">
                <input id="phone" class="swal2-input" placeholder="Phone">
            `,
            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => ({
                username: document.getElementById('username').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                full_name: document.getElementById('full_name').value,
                phone: document.getElementById('phone').value
            })
        });
        
        if (!formValues) return;
        
        showLoading('Creating student...');
        
        const result = await apiRequest(API_CONFIG.ENDPOINTS.CREATE_STUDENT, 'POST', formValues);
        
        if (result.success) {
            showAlert('success', 'Success!', 'Student created successfully');
            setTimeout(() => loadStudents(), 2000);
        } else {
            showAlert('error', 'Error', result.message);
        }
    } catch (error) {
        showAlert('error', 'Error', 'Failed to create student');
    }
}

// Edit student
async function handleEditStudent(studentId) {
    try {
        showLoading('Loading student...');
        
        const result = await apiRequest(API_CONFIG.ENDPOINTS.GET_STUDENTS + `?student_id=${studentId}`, 'GET');
        
        closeAlert();
        
        if (result.success) {
            const student = result.data;
            
            const { value: formValues } = await Swal.fire({
                title: 'Edit Student',
                html: `
                    <input id="full_name" class="swal2-input" placeholder="Full Name" value="${student.full_name}">
                    <input id="email" class="swal2-input" type="email" placeholder="Email" value="${student.email}">
                    <input id="phone" class="swal2-input" placeholder="Phone" value="${student.phone || ''}">
                `,
                focusConfirm: false,
                showCancelButton: true,
                preConfirm: () => ({
                    full_name: document.getElementById('full_name').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value
                })
            });
            
            if (!formValues) return;
            
            showLoading('Updating student...');
            
            const updateResult = await apiRequest(API_CONFIG.ENDPOINTS.UPDATE_STUDENT, 'PUT', {
                student_id: studentId,
                ...formValues
            });
            
            if (updateResult.success) {
                showAlert('success', 'Success!', 'Student updated successfully');
                setTimeout(() => loadStudents(), 2000);
            } else {
                showAlert('error', 'Error', updateResult.message);
            }
        }
    } catch (error) {
        showAlert('error', 'Error', 'Failed to edit student');
    }
}

// Delete student
async function handleDeleteStudent(studentId) {
    try {
        const confirm = await Swal.fire({
            title: 'Delete Student?',
            text: 'This action cannot be undone!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, Delete'
        });
        
        if (!confirm.isConfirmed) return;
        
        showLoading('Deleting student...');
        
        const result = await apiRequest(API_CONFIG.ENDPOINTS.DELETE_STUDENT, 'DELETE', {
            student_id: studentId
        });
        
        if (result.success) {
            showAlert('success', 'Deleted!', 'Student deleted successfully');
            setTimeout(() => loadStudents(), 2000);
        } else {
            showAlert('error', 'Error', result.message);
        }
    } catch (error) {
        showAlert('error', 'Error', 'Failed to delete student');
    }
}

// ==================== MENTORS MANAGEMENT ====================
async function loadMentors() {
    try {
        showLoading('Loading mentors...');
        
        const result = await apiRequest(API_CONFIG.ENDPOINTS.GET_MENTORS, 'GET');
        
        closeAlert();
        
        if (result.success) {
            displayMentors(result.data);
        }
    } catch (error) {
        closeAlert();
        showAlert('error', 'Error', 'Failed to load mentors');
    }
}

function displayMentors(mentors) {
    const container = document.getElementById('mentorsContainer');
    if (!container) return;
    
    container.innerHTML = mentors.length > 0
        ? `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Specialization</th>
                        <th>Active Courses</th>
                        <th>Students</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${mentors.map(mentor => `
                        <tr>
                            <td>${mentor.mentor_id}</td>
                            <td>${mentor.full_name}</td>
                            <td>${mentor.email}</td>
                            <td>${mentor.specialization || 'N/A'}</td>
                            <td>${mentor.active_courses || 0}</td>
                            <td>${mentor.total_students || 0}</td>
                            <td>
                                <button class="btn-sm edit-mentor" data-id="${mentor.mentor_id}">Edit</button>
                                <button class="btn-sm delete-mentor" data-id="${mentor.mentor_id}">Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `
        : '<p class="no-data">No mentors found</p>';
    
    document.querySelectorAll('.edit-mentor').forEach(btn => {
        btn.addEventListener('click', () => handleEditMentor(btn.dataset.id));
    });
    
    document.querySelectorAll('.delete-mentor').forEach(btn => {
        btn.addEventListener('click', () => handleDeleteMentor(btn.dataset.id));
    });
}

// Create mentor
async function handleCreateMentor() {
    try {
        const { value: formValues } = await Swal.fire({
            title: 'Create Mentor',
            html: `
                <input id="username" class="swal2-input" placeholder="Username">
                <input id="email" class="swal2-input" type="email" placeholder="Email">
                <input id="password" class="swal2-input" type="password" placeholder="Password">
                <input id="full_name" class="swal2-input" placeholder="Full Name">
                <input id="specialization" class="swal2-input" placeholder="Specialization">
                <input id="phone" class="swal2-input" placeholder="Phone">
            `,
            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => ({
                username: document.getElementById('username').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                full_name: document.getElementById('full_name').value,
                specialization: document.getElementById('specialization').value,
                phone: document.getElementById('phone').value
            })
        });
        
        if (!formValues) return;
        
        showLoading('Creating mentor...');
        
        const result = await apiRequest(API_CONFIG.ENDPOINTS.CREATE_MENTOR, 'POST', formValues);
        
        if (result.success) {
            showAlert('success', 'Success!', 'Mentor created successfully');
            setTimeout(() => loadMentors(), 2000);
        } else {
            showAlert('error', 'Error', result.message);
        }
    } catch (error) {
        showAlert('error', 'Error', 'Failed to create mentor');
    }
}

// Edit mentor
async function handleEditMentor(mentorId) {
    try {
        showLoading('Loading mentor...');
        
        const result = await apiRequest(API_CONFIG.ENDPOINTS.GET_MENTORS + `?mentor_id=${mentorId}`, 'GET');
        
        closeAlert();
        
        if (result.success) {
            const mentor = result.data;
            
            const { value: formValues } = await Swal.fire({
                title: 'Edit Mentor',
                html: `
                    <input id="full_name" class="swal2-input" value="${mentor.full_name}">
                    <input id="email" class="swal2-input" type="email" value="${mentor.email}">
                    <input id="specialization" class="swal2-input" value="${mentor.specialization || ''}">
                    <input id="phone" class="swal2-input" value="${mentor.phone || ''}">
                `,
                focusConfirm: false,
                showCancelButton: true,
                preConfirm: () => ({
                    full_name: document.getElementById('full_name').value,
                    email: document.getElementById('email').value,
                    specialization: document.getElementById('specialization').value,
                    phone: document.getElementById('phone').value
                })
            });
            
            if (!formValues) return;
            
            showLoading('Updating mentor...');
            
            const updateResult = await apiRequest(API_CONFIG.ENDPOINTS.UPDATE_MENTOR, 'PUT', {
                mentor_id: mentorId,
                ...formValues
            });
            
            if (updateResult.success) {
                showAlert('success', 'Success!', 'Mentor updated successfully');
                setTimeout(() => loadMentors(), 2000);
            } else {
                showAlert('error', 'Error', updateResult.message);
            }
        }
    } catch (error) {
        showAlert('error', 'Error', 'Failed to edit mentor');
    }
}

// Delete mentor
async function handleDeleteMentor(mentorId) {
    try {
        const confirm = await Swal.fire({
            title: 'Delete Mentor?',
            text: 'This action cannot be undone!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, Delete'
        });
        
        if (!confirm.isConfirmed) return;
        
        showLoading('Deleting mentor...');
        
        const result = await apiRequest(API_CONFIG.ENDPOINTS.DELETE_MENTOR, 'DELETE', {
            mentor_id: mentorId
        });
        
        if (result.success) {
            showAlert('success', 'Deleted!', 'Mentor deleted successfully');
            setTimeout(() => loadMentors(), 2000);
        } else {
            showAlert('error', 'Error', result.message);
        }
    } catch (error) {
        showAlert('error', 'Error', 'Failed to delete mentor');
    }
}

// ==================== COURSES OVERVIEW ====================
async function loadAllCourses() {
    try {
        showLoading('Loading courses...');
        
        const result = await apiRequest(API_CONFIG.ENDPOINTS.GET_ALL_COURSES, 'GET');
        
        closeAlert();
        
        if (result.success) {
            displayAllCourses(result.data);
        }
    } catch (error) {
        closeAlert();
        showAlert('error', 'Error', 'Failed to load courses');
    }
}

function displayAllCourses(courses) {
    const container = document.getElementById('coursesContainer');
    if (!container) return;
    
    container.innerHTML = courses.length > 0
        ? `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Course ID</th>
                        <th>Title</th>
                        <th>Mentor</th>
                        <th>Enrolled</th>
                        <th>Status</th>
                        <th>Created</th>
                    </tr>
                </thead>
                <tbody>
                    ${courses.map(course => `
                        <tr>
                            <td>${course.course_id}</td>
                            <td>${course.title}</td>
                            <td>${course.mentor_name}</td>
                            <td>${course.enrolled_students || 0}</td>
                            <td><span class="status-badge ${course.status}">${course.status}</span></td>
                            <td>${formatDate(course.created_at)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `
        : '<p class="no-data">No courses found</p>';
}

// ==================== ANALYTICS ====================
async function loadAnalytics() {
    try {
        showLoading('Loading analytics...');
        
        const result = await apiRequest(API_CONFIG.ENDPOINTS.GET_ANALYTICS, 'GET');
        
        closeAlert();
        
        if (result.success) {
            displayAnalytics(result.data);
        }
    } catch (error) {
        closeAlert();
        showAlert('error', 'Error', 'Failed to load analytics');
    }
}

function displayAnalytics(data) {
    // Update various analytics sections
    if (document.getElementById('enrollmentTrend')) {
        document.getElementById('enrollmentTrend').textContent = data.enrollment_trend || 'N/A';
    }
    
    if (document.getElementById('completionRate')) {
        document.getElementById('completionRate').textContent = (data.completion_rate || 0) + '%';
    }
    
    if (document.getElementById('averageGrade')) {
        document.getElementById('averageGrade').textContent = (data.average_grade || 0) + '%';
    }
    
    if (document.getElementById('activeUsers')) {
        document.getElementById('activeUsers').textContent = data.active_users || 0;
    }
}

// ==================== REPORTS ====================
async function loadReports() {
    try {
        showLoading('Loading reports...');
        
        const result = await apiRequest(API_CONFIG.ENDPOINTS.GET_REPORTS, 'GET');
        
        closeAlert();
        
        if (result.success) {
            displayReports(result.data);
        }
    } catch (error) {
        closeAlert();
        showAlert('error', 'Error', 'Failed to load reports');
    }
}

function displayReports(reports) {
    const container = document.getElementById('reportsContainer');
    if (!container) return;
    
    container.innerHTML = reports.length > 0
        ? reports.map(report => `
            <div class="report-card">
                <h3>${report.title}</h3>
                <p>${report.description}</p>
                <div class="report-meta">
                    <span>Generated: ${formatDate(report.created_at)}</span>
                    <button class="btn-sm download-report" data-id="${report.report_id}">Download</button>
                </div>
            </div>
        `).join('')
        : '<p class="no-data">No reports available</p>';
}

// Generate new report
async function handleGenerateReport(reportType) {
    try {
        showLoading('Generating report...');
        
        const result = await apiRequest(API_CONFIG.ENDPOINTS.GENERATE_REPORT, 'POST', {
            report_type: reportType
        });
        
        if (result.success) {
            showAlert('success', 'Success!', 'Report generated successfully');
            setTimeout(() => loadReports(), 2000);
        } else {
            showAlert('error', 'Error', result.message);
        }
    } catch (error) {
        showAlert('error', 'Error', 'Failed to generate report');
    }
}

// ==================== SETTINGS ====================
function loadSettings() {
    // Load admin settings
    console.log('Loading settings...');
}

// ==================== UTILITY FUNCTIONS ====================
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function getActivityIcon(type) {
    const icons = {
        'user': 'user-line',
        'course': 'book-line',
        'enrollment': 'user-add-line',
        'assignment': 'task-line',
        'system': 'settings-line'
    };
    return icons[type] || 'notification-line';
}

// Logout handler
async function handleLogout() {
    try {
        const confirm = await Swal.fire({
            title: 'Logout?',
            text: 'Are you sure you want to logout?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Logout'
        });
        
        if (!confirm.isConfirmed) return;
        
        showLoading('Logging out...');
        
        await apiRequest(API_CONFIG.ENDPOINTS.LOGOUT, 'POST');
        
        sessionStorage.clear();
        localStorage.clear();
        
        showAlert('success', 'Logged Out', 'You have been logged out successfully');
        
        setTimeout(() => {
            window.location.href = '../auth/index.html';
        }, 1500);
    } catch (error) {
        showAlert('error', 'Error', 'Failed to logout');
    }
}

// Export functions for use in HTML
window.adminFunctions = {
    handleCreateStudent,
    handleCreateMentor,
    handleGenerateReport
};
