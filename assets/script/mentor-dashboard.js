/**
 * Mentor Dashboard JavaScript
 * Handles all mentor operations with backend API integration
 */

// Check authentication on page load
document.addEventListener('DOMContentLoaded', async function() {
    await checkMentorAuth();
    await loadNotifications();
    initializeMentorHandlers();
});

// Check if user is authenticated as mentor
async function checkMentorAuth() {
    try {
        const result = await apiRequest(API_CONFIG.ENDPOINTS.CHECK_SESSION, 'GET');
        
        if (!result.success || result.data.role !== 'mentor') {
            showAlert('error', 'Access Denied', 'Please login as a mentor');
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
    const profileElements = document.querySelectorAll('.user-name, .mentor-name');
    profileElements.forEach(el => {
        if (el) el.textContent = userData.full_name || userData.username;
    });
    
    const emailElements = document.querySelectorAll('.user-email, .mentor-email');
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

// Initialize all mentor handlers
function initializeMentorHandlers() {
    // Dashboard
    if (document.getElementById('mentorDashboard')) {
        loadMentorDashboard();
    }
    
    // Courses management
    if (document.getElementById('coursesManagement')) {
        loadMyCourses();
    }
    
    // Assignments management
    if (document.getElementById('assignmentsManagement')) {
        loadAssignments();
    }
    
    // Students progress
    if (document.getElementById('studentsProgress')) {
        loadStudentsProgress();
    }
    
    // Events management
    if (document.getElementById('eventsManagement')) {
        loadEvents();
    }
    
    // Aptitude tests
    if (document.getElementById('aptitudeManagement')) {
        loadAptitudeTests();
    }
    
    // Coding problems
    if (document.getElementById('problemsManagement')) {
        loadCodingProblems();
    }
    
    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

// ==================== DASHBOARD ====================
async function loadMentorDashboard() {
    try {
        showLoading('Loading dashboard...');
        
        const result = await apiRequest(API_CONFIG.ENDPOINTS.MENTOR_DASHBOARD, 'GET');
        
        closeAlert();
        
        if (result.success) {
            updateDashboardStats(result.data.stats);
            updateRecentActivities(result.data.recent_activities);
            updateUpcomingTasks(result.data.upcoming_tasks);
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
    if (document.getElementById('activeCourses')) {
        document.getElementById('activeCourses').textContent = stats.active_courses || 0;
    }
    if (document.getElementById('pendingGrading')) {
        document.getElementById('pendingGrading').textContent = stats.pending_grading || 0;
    }
    if (document.getElementById('averagePerformance')) {
        document.getElementById('averagePerformance').textContent = (stats.average_performance || 0) + '%';
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

function updateUpcomingTasks(tasks) {
    const container = document.getElementById('upcomingTasks');
    if (!container) return;
    
    container.innerHTML = tasks.length > 0
        ? tasks.map(task => `
            <div class="task-item">
                <h4>${task.title}</h4>
                <p>${task.description}</p>
                <span>${formatDate(task.due_date)}</span>
            </div>
        `).join('')
        : '<p class="no-data">No upcoming tasks</p>';
}

// ==================== COURSES MANAGEMENT ====================
async function loadMyCourses() {
    try {
        showLoading('Loading courses...');
        
        const result = await apiRequest(API_CONFIG.ENDPOINTS.MENTOR_COURSES, 'GET');
        
        closeAlert();
        
        if (result.success) {
            displayMyCourses(result.data);
        }
    } catch (error) {
        closeAlert();
        showAlert('error', 'Error', 'Failed to load courses');
    }
}

function displayMyCourses(courses) {
    const container = document.getElementById('coursesContainer');
    if (!container) return;
    
    container.innerHTML = courses.length > 0
        ? courses.map(course => `
            <div class="course-card">
                <div class="course-header">
                    <h3>${course.title}</h3>
                    <span class="status ${course.status}">${course.status}</span>
                </div>
                <div class="course-body">
                    <p>${course.description}</p>
                    <div class="course-stats">
                        <span><i class="ri-user-line"></i> ${course.enrolled_students} students</span>
                        <span><i class="ri-book-line"></i> ${course.modules_count} modules</span>
                    </div>
                </div>
                <div class="course-actions">
                    <button class="btn btn-primary edit-course" data-id="${course.course_id}">Edit</button>
                    <button class="btn btn-secondary view-students" data-id="${course.course_id}">Students</button>
                    <button class="btn btn-danger delete-course" data-id="${course.course_id}">Delete</button>
                </div>
            </div>
        `).join('')
        : '<p class="no-data">No courses created yet</p>';
    
    // Add event listeners
    document.querySelectorAll('.edit-course').forEach(btn => {
        btn.addEventListener('click', () => handleEditCourse(btn.dataset.id));
    });
    
    document.querySelectorAll('.delete-course').forEach(btn => {
        btn.addEventListener('click', () => handleDeleteCourse(btn.dataset.id));
    });
}

// Create new course
async function handleCreateCourse(formData) {
    try {
        showLoading('Creating course...');
        
        const result = await apiRequest(API_CONFIG.ENDPOINTS.CREATE_COURSE, 'POST', formData);
        
        if (result.success) {
            showAlert('success', 'Success!', 'Course created successfully');
            setTimeout(() => loadMyCourses(), 2000);
        } else {
            showAlert('error', 'Error', result.message);
        }
    } catch (error) {
        showAlert('error', 'Error', 'Failed to create course');
    }
}

// Edit course
async function handleEditCourse(courseId) {
    try {
        showLoading('Loading course...');
        
        const result = await apiRequest(API_CONFIG.ENDPOINTS.MENTOR_COURSES + `?course_id=${courseId}`, 'GET');
        
        closeAlert();
        
        if (result.success) {
            const course = result.data;
            
            const { value: formValues } = await Swal.fire({
                title: 'Edit Course',
                html: `
                    <input id="course-title" class="swal2-input" placeholder="Course Title" value="${course.title}">
                    <textarea id="course-description" class="swal2-textarea" placeholder="Description">${course.description}</textarea>
                    <input id="course-duration" class="swal2-input" placeholder="Duration" value="${course.duration}">
                `,
                focusConfirm: false,
                showCancelButton: true,
                preConfirm: () => ({
                    title: document.getElementById('course-title').value,
                    description: document.getElementById('course-description').value,
                    duration: document.getElementById('course-duration').value
                })
            });
            
            if (formValues) {
                showLoading('Updating course...');
                
                const updateResult = await apiRequest(API_CONFIG.ENDPOINTS.UPDATE_COURSE, 'PUT', {
                    course_id: courseId,
                    ...formValues
                });
                
                if (updateResult.success) {
                    showAlert('success', 'Success!', 'Course updated successfully');
                    setTimeout(() => loadMyCourses(), 2000);
                } else {
                    showAlert('error', 'Error', updateResult.message);
                }
            }
        }
    } catch (error) {
        showAlert('error', 'Error', 'Failed to edit course');
    }
}

// Delete course
async function handleDeleteCourse(courseId) {
    try {
        const confirm = await Swal.fire({
            title: 'Delete Course?',
            text: 'This action cannot be undone!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, Delete'
        });
        
        if (!confirm.isConfirmed) return;
        
        showLoading('Deleting course...');
        
        const result = await apiRequest(API_CONFIG.ENDPOINTS.DELETE_COURSE, 'DELETE', {
            course_id: courseId
        });
        
        if (result.success) {
            showAlert('success', 'Deleted!', 'Course deleted successfully');
            setTimeout(() => loadMyCourses(), 2000);
        } else {
            showAlert('error', 'Error', result.message);
        }
    } catch (error) {
        showAlert('error', 'Error', 'Failed to delete course');
    }
}

// ==================== ASSIGNMENTS ====================
async function loadAssignments() {
    try {
        showLoading('Loading assignments...');
        
        const result = await apiRequest(API_CONFIG.ENDPOINTS.MENTOR_ASSIGNMENTS, 'GET');
        
        closeAlert();
        
        if (result.success) {
            displayAssignments(result.data);
        }
    } catch (error) {
        closeAlert();
        showAlert('error', 'Error', 'Failed to load assignments');
    }
}

function displayAssignments(assignments) {
    const container = document.getElementById('assignmentsContainer');
    if (!container) return;
    
    container.innerHTML = assignments.length > 0
        ? assignments.map(assignment => `
            <div class="assignment-card">
                <h3>${assignment.title}</h3>
                <p>${assignment.description}</p>
                <div class="assignment-meta">
                    <span><i class="ri-book-line"></i> ${assignment.course_name}</span>
                    <span><i class="ri-calendar-line"></i> Due: ${formatDate(assignment.due_date)}</span>
                    <span><i class="ri-file-line"></i> ${assignment.submissions_count} submissions</span>
                </div>
                <button class="btn btn-primary view-submissions" data-id="${assignment.assignment_id}">
                    View Submissions
                </button>
            </div>
        `).join('')
        : '<p class="no-data">No assignments created yet</p>';
    
    document.querySelectorAll('.view-submissions').forEach(btn => {
        btn.addEventListener('click', () => handleViewSubmissions(btn.dataset.id));
    });
}

// Create assignment
async function handleCreateAssignment(formData) {
    try {
        showLoading('Creating assignment...');
        
        const result = await apiRequest(API_CONFIG.ENDPOINTS.CREATE_ASSIGNMENT, 'POST', formData);
        
        if (result.success) {
            showAlert('success', 'Success!', 'Assignment created successfully');
            setTimeout(() => loadAssignments(), 2000);
        } else {
            showAlert('error', 'Error', result.message);
        }
    } catch (error) {
        showAlert('error', 'Error', 'Failed to create assignment');
    }
}

// View submissions
async function handleViewSubmissions(assignmentId) {
    try {
        showLoading('Loading submissions...');
        
        const result = await apiRequest(API_CONFIG.ENDPOINTS.GET_SUBMISSIONS + `?assignment_id=${assignmentId}`, 'GET');
        
        closeAlert();
        
        if (result.success) {
            displaySubmissions(result.data);
        }
    } catch (error) {
        showAlert('error', 'Error', 'Failed to load submissions');
    }
}

function displaySubmissions(submissions) {
    if (submissions.length === 0) {
        showAlert('info', 'No Submissions', 'No submissions yet for this assignment');
        return;
    }
    
    const html = `
        <table class="submissions-table">
            <thead>
                <tr>
                    <th>Student</th>
                    <th>Submitted</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                ${submissions.map(sub => `
                    <tr>
                        <td>${sub.student_name}</td>
                        <td>${formatDate(sub.submitted_at)}</td>
                        <td>${sub.grade ? 'Graded (' + sub.grade + '%)' : 'Pending'}</td>
                        <td>
                            <button class="btn-sm grade-btn" data-id="${sub.submission_id}">
                                ${sub.grade ? 'Update Grade' : 'Grade'}
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    Swal.fire({
        title: 'Submissions',
        html: html,
        width: 800,
        showCloseButton: true,
        showConfirmButton: false
    });
    
    setTimeout(() => {
        document.querySelectorAll('.grade-btn').forEach(btn => {
            btn.addEventListener('click', () => handleGradeSubmission(btn.dataset.id));
        });
    }, 100);
}

// Grade submission
async function handleGradeSubmission(submissionId) {
    try {
        const { value: formValues } = await Swal.fire({
            title: 'Grade Submission',
            html: `
                <input id="grade" class="swal2-input" type="number" min="0" max="100" placeholder="Grade (0-100)">
                <textarea id="feedback" class="swal2-textarea" placeholder="Feedback (optional)"></textarea>
            `,
            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => ({
                grade: document.getElementById('grade').value,
                feedback: document.getElementById('feedback').value
            })
        });
        
        if (!formValues || !formValues.grade) return;
        
        showLoading('Submitting grade...');
        
        const result = await apiRequest(API_CONFIG.ENDPOINTS.GRADE_ASSIGNMENT, 'POST', {
            submission_id: submissionId,
            grade: formValues.grade,
            feedback: formValues.feedback
        });
        
        if (result.success) {
            showAlert('success', 'Success!', 'Grade submitted successfully');
        } else {
            showAlert('error', 'Error', result.message);
        }
    } catch (error) {
        showAlert('error', 'Error', 'Failed to submit grade');
    }
}

// ==================== STUDENTS PROGRESS ====================
async function loadStudentsProgress() {
    try {
        showLoading('Loading students...');
        
        const result = await apiRequest(API_CONFIG.ENDPOINTS.MENTOR_STUDENTS, 'GET');
        
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
            <table class="students-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Courses</th>
                        <th>Progress</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${students.map(student => `
                        <tr>
                            <td>${student.full_name}</td>
                            <td>${student.email}</td>
                            <td>${student.enrolled_courses || 0}</td>
                            <td>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${student.average_progress || 0}%"></div>
                                </div>
                                <span>${student.average_progress || 0}%</span>
                            </td>
                            <td>
                                <button class="btn-sm view-progress" data-id="${student.student_id}">
                                    View Details
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `
        : '<p class="no-data">No students enrolled</p>';
    
    document.querySelectorAll('.view-progress').forEach(btn => {
        btn.addEventListener('click', () => handleViewStudentProgress(btn.dataset.id));
    });
}

async function handleViewStudentProgress(studentId) {
    try {
        showLoading('Loading student progress...');
        
        const result = await apiRequest(API_CONFIG.ENDPOINTS.STUDENT_PROGRESS + `?student_id=${studentId}`, 'GET');
        
        closeAlert();
        
        if (result.success) {
            const data = result.data;
            
            Swal.fire({
                title: `${data.student_name}'s Progress`,
                html: `
                    <div class="progress-details">
                        <h4>Course Progress</h4>
                        ${data.courses.map(course => `
                            <div class="course-progress">
                                <span>${course.course_name}</span>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${course.progress}%"></div>
                                </div>
                                <span>${course.progress}%</span>
                            </div>
                        `).join('')}
                    </div>
                `,
                width: 700
            });
        }
    } catch (error) {
        showAlert('error', 'Error', 'Failed to load student progress');
    }
}

// ==================== EVENTS ====================
async function loadEvents() {
    try {
        showLoading('Loading events...');
        
        const result = await apiRequest(API_CONFIG.ENDPOINTS.MENTOR_EVENTS || API_CONFIG.ENDPOINTS.GET_EVENTS, 'GET');
        
        closeAlert();
        
        if (result.success) {
            displayEvents(result.data);
        }
    } catch (error) {
        closeAlert();
        showAlert('error', 'Error', 'Failed to load events');
    }
}

function displayEvents(events) {
    const container = document.getElementById('eventsContainer');
    if (!container) return;
    
    container.innerHTML = events.length > 0
        ? events.map(event => `
            <div class="event-card">
                <h3>${event.title}</h3>
                <p>${event.description}</p>
                <div class="event-meta">
                    <span><i class="ri-calendar-line"></i> ${formatDate(event.event_date)}</span>
                    <span><i class="ri-user-line"></i> ${event.registrations || 0} registered</span>
                </div>
            </div>
        `).join('')
        : '<p class="no-data">No events created</p>';
}

// Create event
async function handleCreateEvent(formData) {
    try {
        showLoading('Creating event...');
        
        const result = await apiRequest(API_CONFIG.ENDPOINTS.CREATE_EVENT, 'POST', formData);
        
        if (result.success) {
            showAlert('success', 'Success!', 'Event created successfully');
            setTimeout(() => loadEvents(), 2000);
        } else {
            showAlert('error', 'Error', result.message);
        }
    } catch (error) {
        showAlert('error', 'Error', 'Failed to create event');
    }
}

// ==================== APTITUDE TESTS ====================
async function loadAptitudeTests() {
    try {
        showLoading('Loading tests...');
        
        const result = await apiRequest(API_CONFIG.ENDPOINTS.GET_APTITUDE_TESTS, 'GET');
        
        closeAlert();
        
        if (result.success) {
            displayAptitudeTests(result.data);
        }
    } catch (error) {
        closeAlert();
        showAlert('error', 'Error', 'Failed to load tests');
    }
}

function displayAptitudeTests(tests) {
    const container = document.getElementById('testsContainer');
    if (!container) return;
    
    container.innerHTML = tests.length > 0
        ? tests.map(test => `
            <div class="test-card">
                <h3>${test.title}</h3>
                <p>${test.description}</p>
                <div class="test-meta">
                    <span><i class="ri-question-line"></i> ${test.total_questions} questions</span>
                    <span><i class="ri-time-line"></i> ${test.duration} mins</span>
                    <span><i class="ri-user-line"></i> ${test.attempts || 0} attempts</span>
                </div>
            </div>
        `).join('')
        : '<p class="no-data">No tests created</p>';
}

// ==================== CODING PROBLEMS ====================
async function loadCodingProblems() {
    try {
        showLoading('Loading problems...');
        
        const result = await apiRequest(API_CONFIG.ENDPOINTS.GET_CODING_PROBLEMS, 'GET');
        
        closeAlert();
        
        if (result.success) {
            displayCodingProblems(result.data);
        }
    } catch (error) {
        closeAlert();
        showAlert('error', 'Error', 'Failed to load problems');
    }
}

function displayCodingProblems(problems) {
    const container = document.getElementById('problemsContainer');
    if (!container) return;
    
    container.innerHTML = problems.length > 0
        ? problems.map(problem => `
            <div class="problem-card">
                <h3>${problem.title}</h3>
                <span class="difficulty ${problem.difficulty}">${problem.difficulty}</span>
                <p>${problem.description}</p>
                <div class="problem-meta">
                    <span><i class="ri-code-line"></i> ${problem.language}</span>
                    <span><i class="ri-user-line"></i> ${problem.submissions || 0} submissions</span>
                </div>
            </div>
        `).join('')
        : '<p class="no-data">No problems created</p>';
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
        'submission': 'file-text-line',
        'enrollment': 'user-add-line',
        'course': 'book-line',
        'assignment': 'task-line',
        'grade': 'star-line'
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

// Export functions for form handlers
window.mentorFunctions = {
    handleCreateCourse,
    handleCreateAssignment,
    handleCreateEvent
};
