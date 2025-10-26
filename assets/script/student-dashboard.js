/**
 * Student Dashboard JavaScript
 * Handles all student operations with backend API integration
 */

// Check authentication on page load
document.addEventListener('DOMContentLoaded', async function() {
    await checkStudentAuth();
    await loadNotifications();
    initializeStudentHandlers();
});

// Check if user is authenticated as student
async function checkStudentAuth() {
    try {
        const result = await apiRequest(API_CONFIG.ENDPOINTS.CHECK_SESSION, 'GET');
        
        if (!result.success || result.data.role !== 'student') {
            showAlert('error', 'Access Denied', 'Please login as a student');
            setTimeout(() => {
                window.location.href = '../auth/index.html';
            }, 2000);
            return false;
        }
        
        // Store user data in sessionStorage
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
    const profileElements = document.querySelectorAll('.user-name, .student-name');
    profileElements.forEach(el => {
        if (el) el.textContent = userData.full_name || userData.username;
    });
    
    const emailElements = document.querySelectorAll('.user-email, .student-email');
    emailElements.forEach(el => {
        if (el) el.textContent = userData.email;
    });
    
    const avatarElements = document.querySelectorAll('.user-avatar, .student-avatar');
    avatarElements.forEach(el => {
        if (el && userData.avatar) el.src = userData.avatar;
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

// Display notifications in UI
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
            <div class="notification-item ${n.is_read ? '' : 'unread'}" data-id="${n.notification_id}">
                <div class="notification-icon">
                    <i class="ri-notification-line"></i>
                </div>
                <div class="notification-content">
                    <h4>${n.title}</h4>
                    <p>${n.message}</p>
                    <span class="notification-time">${formatDate(n.created_at)}</span>
                </div>
            </div>
        `).join('')
        : '<p class="no-data">No notifications</p>';
}

// Mark notification as read
async function markNotificationRead(notificationId) {
    try {
        await apiRequest(API_CONFIG.ENDPOINTS.MARK_NOTIFICATION_READ, 'PUT', {
            notification_id: notificationId
        });
        await loadNotifications();
    } catch (error) {
        console.error('Failed to mark notification as read:', error);
    }
}

// Initialize all student handlers
function initializeStudentHandlers() {
    // Dashboard handlers
    if (document.getElementById('studentDashboard')) {
        loadDashboardData();
    }
    
    // Courses handlers
    if (document.getElementById('coursesPage')) {
        loadAvailableCourses();
    }
    
    if (document.getElementById('myCoursesPage')) {
        loadMyCourses();
    }
    
    // Assignments handlers
    if (document.getElementById('assignmentsPage')) {
        loadMyAssignments();
    }
    
    // Grades handlers
    if (document.getElementById('gradesPage')) {
        loadMyGrades();
    }
    
    // Progress handlers
    if (document.getElementById('progressPage')) {
        loadMyProgress();
    }
    
    // Aptitude tests handlers
    if (document.getElementById('aptitudeTestsPage')) {
        loadAptitudeTests();
    }
    
    // Coding practice handlers
    if (document.getElementById('codingPracticePage')) {
        loadCodingProblems();
    }
    
    // Study materials handlers
    if (document.getElementById('studyMaterialsPage')) {
        loadStudyMaterials();
    }
    
    // Logout handler
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

// ==================== DASHBOARD ====================
async function loadDashboardData() {
    try {
        showLoading('Loading dashboard...');
        
        const result = await apiRequest(API_CONFIG.ENDPOINTS.STUDENT_DASHBOARD, 'GET');
        
        closeAlert();
        
        if (result.success) {
            updateDashboardStats(result.data.stats);
            updateRecentActivities(result.data.recent_activities);
            updateUpcomingDeadlines(result.data.upcoming_deadlines);
            if (result.data.activity_data) {
                updateActivityCalendar(result.data.activity_data);
            }
        }
    } catch (error) {
        closeAlert();
        console.error('Failed to load dashboard:', error);
    }
}

function updateDashboardStats(stats) {
    if (document.getElementById('totalCourses')) {
        document.getElementById('totalCourses').textContent = stats.enrolled_courses || 0;
    }
    if (document.getElementById('completedAssignments')) {
        document.getElementById('completedAssignments').textContent = stats.completed_assignments || 0;
    }
    if (document.getElementById('averageGrade')) {
        document.getElementById('averageGrade').textContent = stats.average_grade || '0%';
    }
    if (document.getElementById('certificatesEarned')) {
        document.getElementById('certificatesEarned').textContent = stats.certificates || 0;
    }
}

function updateRecentActivities(activities) {
    const container = document.getElementById('recentActivities');
    if (!container) return;
    
    container.innerHTML = activities.length > 0
        ? activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="ri-${getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-content">
                    <h4>${activity.title}</h4>
                    <p>${activity.description}</p>
                    <span class="activity-time">${formatDate(activity.created_at)}</span>
                </div>
            </div>
        `).join('')
        : '<p class="no-data">No recent activities</p>';
}

function updateUpcomingDeadlines(deadlines) {
    const container = document.getElementById('upcomingDeadlines');
    if (!container) return;
    
    container.innerHTML = deadlines.length > 0
        ? deadlines.map(deadline => `
            <div class="deadline-item">
                <div class="deadline-info">
                    <h4>${deadline.title}</h4>
                    <p>${deadline.course_name}</p>
                </div>
                <div class="deadline-date">
                    <i class="ri-calendar-line"></i>
                    <span>${formatDate(deadline.due_date)}</span>
                </div>
            </div>
        `).join('')
        : '<p class="no-data">No upcoming deadlines</p>';
}

function updateActivityCalendar(activityData) {
    // Implementation for GitHub-style activity calendar
    const container = document.getElementById('activityCalendar');
    if (!container) return;
    
    // This would integrate with your existing activity calendar code
    console.log('Activity data loaded:', activityData);
}

// ==================== COURSES ====================
async function loadAvailableCourses() {
    try {
        showLoading('Loading courses...');
        
        const result = await apiRequest(API_CONFIG.ENDPOINTS.GET_COURSES, 'GET');
        
        closeAlert();
        
        if (result.success) {
            displayCourses(result.data);
        }
    } catch (error) {
        closeAlert();
        showAlert('error', 'Error', 'Failed to load courses');
    }
}

function displayCourses(courses) {
    const container = document.getElementById('coursesContainer');
    if (!container) return;
    
    container.innerHTML = courses.length > 0
        ? courses.map(course => `
            <div class="course-card">
                <div class="course-image">
                    <img src="${course.thumbnail || '../assets/images/course-default.jpg'}" alt="${course.title}">
                </div>
                <div class="course-content">
                    <h3>${course.title}</h3>
                    <p>${course.description}</p>
                    <div class="course-meta">
                        <span><i class="ri-user-line"></i> ${course.mentor_name}</span>
                        <span><i class="ri-time-line"></i> ${course.duration}</span>
                    </div>
                    <button class="btn btn-primary enroll-btn" data-course-id="${course.course_id}">
                        Enroll Now
                    </button>
                </div>
            </div>
        `).join('')
        : '<p class="no-data">No courses available</p>';
    
    // Add enroll button handlers
    document.querySelectorAll('.enroll-btn').forEach(btn => {
        btn.addEventListener('click', () => handleEnrollCourse(btn.dataset.courseId));
    });
}

async function handleEnrollCourse(courseId) {
    try {
        const confirm = await Swal.fire({
            title: 'Enroll in Course?',
            text: 'Do you want to enroll in this course?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Enroll',
            cancelButtonText: 'Cancel'
        });
        
        if (!confirm.isConfirmed) return;
        
        showLoading('Enrolling...');
        
        const result = await apiRequest(API_CONFIG.ENDPOINTS.ENROLL_COURSE, 'POST', {
            course_id: courseId
        });
        
        if (result.success) {
            showAlert('success', 'Success!', 'Successfully enrolled in course');
            setTimeout(() => loadAvailableCourses(), 2000);
        } else {
            showAlert('error', 'Error', result.message);
        }
    } catch (error) {
        showAlert('error', 'Error', 'Failed to enroll in course');
    }
}

async function loadMyCourses() {
    try {
        showLoading('Loading your courses...');
        
        const result = await apiRequest(API_CONFIG.ENDPOINTS.MY_COURSES, 'GET');
        
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
    const container = document.getElementById('myCoursesContainer');
    if (!container) return;
    
    container.innerHTML = courses.length > 0
        ? courses.map(course => `
            <div class="course-card enrolled">
                <div class="course-image">
                    <img src="${course.thumbnail || '../assets/images/course-default.jpg'}" alt="${course.title}">
                    <div class="progress-overlay">
                        <div class="progress-circle" data-progress="${course.progress}">
                            <span>${course.progress}%</span>
                        </div>
                    </div>
                </div>
                <div class="course-content">
                    <h3>${course.title}</h3>
                    <p>${course.description}</p>
                    <div class="course-meta">
                        <span><i class="ri-user-line"></i> ${course.mentor_name}</span>
                        <span><i class="ri-book-line"></i> ${course.modules_count} modules</span>
                    </div>
                    <div class="course-actions">
                        <button class="btn btn-primary continue-btn" data-course-id="${course.course_id}">
                            Continue Learning
                        </button>
                    </div>
                </div>
            </div>
        `).join('')
        : '<p class="no-data">You are not enrolled in any courses yet</p>';
}

// ==================== ASSIGNMENTS ====================
async function loadMyAssignments() {
    try {
        showLoading('Loading assignments...');
        
        const result = await apiRequest(API_CONFIG.ENDPOINTS.GET_ASSIGNMENTS, 'GET');
        
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
            <div class="assignment-card ${assignment.status}">
                <div class="assignment-header">
                    <h3>${assignment.title}</h3>
                    <span class="status-badge ${assignment.status}">${assignment.status}</span>
                </div>
                <div class="assignment-body">
                    <p>${assignment.description}</p>
                    <div class="assignment-meta">
                        <span><i class="ri-book-line"></i> ${assignment.course_name}</span>
                        <span><i class="ri-calendar-line"></i> Due: ${formatDate(assignment.due_date)}</span>
                        ${assignment.grade ? `<span><i class="ri-star-line"></i> Grade: ${assignment.grade}%</span>` : ''}
                    </div>
                </div>
                <div class="assignment-footer">
                    ${assignment.status === 'pending' ? `
                        <button class="btn btn-primary submit-assignment-btn" data-assignment-id="${assignment.assignment_id}">
                            Submit Assignment
                        </button>
                    ` : assignment.status === 'submitted' ? `
                        <span class="submitted-text">Submitted on ${formatDate(assignment.submitted_at)}</span>
                    ` : ''}
                </div>
            </div>
        `).join('')
        : '<p class="no-data">No assignments available</p>';
    
    // Add submit button handlers
    document.querySelectorAll('.submit-assignment-btn').forEach(btn => {
        btn.addEventListener('click', () => handleSubmitAssignment(btn.dataset.assignmentId));
    });
}

async function handleSubmitAssignment(assignmentId) {
    try {
        const { value: formValues } = await Swal.fire({
            title: 'Submit Assignment',
            html: `
                <div class="form-group">
                    <label>Submission URL (GitHub, Drive, etc.)</label>
                    <input id="submission-url" class="swal2-input" placeholder="Enter URL">
                </div>
                <div class="form-group">
                    <label>Comments (Optional)</label>
                    <textarea id="submission-comments" class="swal2-textarea" placeholder="Any comments..."></textarea>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Submit',
            preConfirm: () => {
                return {
                    url: document.getElementById('submission-url').value,
                    comments: document.getElementById('submission-comments').value
                };
            }
        });
        
        if (!formValues) return;
        
        if (!formValues.url) {
            showAlert('error', 'Error', 'Please provide submission URL');
            return;
        }
        
        showLoading('Submitting assignment...');
        
        const result = await apiRequest(API_CONFIG.ENDPOINTS.SUBMIT_ASSIGNMENT, 'POST', {
            assignment_id: assignmentId,
            submission_url: formValues.url,
            comments: formValues.comments
        });
        
        if (result.success) {
            showAlert('success', 'Success!', 'Assignment submitted successfully');
            setTimeout(() => loadMyAssignments(), 2000);
        } else {
            showAlert('error', 'Error', result.message);
        }
    } catch (error) {
        showAlert('error', 'Error', 'Failed to submit assignment');
    }
}

// ==================== GRADES ====================
async function loadMyGrades() {
    try {
        showLoading('Loading grades...');
        
        const result = await apiRequest(API_CONFIG.ENDPOINTS.GET_GRADES, 'GET');
        
        closeAlert();
        
        if (result.success) {
            displayGrades(result.data);
        }
    } catch (error) {
        closeAlert();
        showAlert('error', 'Error', 'Failed to load grades');
    }
}

function displayGrades(grades) {
    const container = document.getElementById('gradesContainer');
    if (!container) return;
    
    container.innerHTML = grades.length > 0
        ? `
            <table class="grades-table">
                <thead>
                    <tr>
                        <th>Course</th>
                        <th>Assignment</th>
                        <th>Grade</th>
                        <th>Feedback</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${grades.map(grade => `
                        <tr>
                            <td>${grade.course_name}</td>
                            <td>${grade.assignment_title}</td>
                            <td><span class="grade-badge grade-${getGradeClass(grade.grade)}">${grade.grade}%</span></td>
                            <td>${grade.feedback || 'No feedback'}</td>
                            <td>${formatDate(grade.graded_at)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `
        : '<p class="no-data">No grades available</p>';
}

function getGradeClass(grade) {
    if (grade >= 90) return 'excellent';
    if (grade >= 75) return 'good';
    if (grade >= 60) return 'average';
    return 'poor';
}

// ==================== PROGRESS ====================
async function loadMyProgress() {
    try {
        showLoading('Loading progress...');
        
        const result = await apiRequest(API_CONFIG.ENDPOINTS.GET_PROGRESS, 'GET');
        
        closeAlert();
        
        if (result.success) {
            displayProgress(result.data);
        }
    } catch (error) {
        closeAlert();
        showAlert('error', 'Error', 'Failed to load progress');
    }
}

function displayProgress(progressData) {
    // Update overall progress
    if (document.getElementById('overallProgress')) {
        document.getElementById('overallProgress').textContent = progressData.overall_progress + '%';
    }
    
    // Update course progress
    const container = document.getElementById('courseProgressContainer');
    if (container && progressData.courses) {
        container.innerHTML = progressData.courses.map(course => `
            <div class="progress-item">
                <div class="progress-header">
                    <h4>${course.course_name}</h4>
                    <span>${course.progress}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${course.progress}%"></div>
                </div>
                <div class="progress-meta">
                    <span>${course.completed_modules}/${course.total_modules} modules completed</span>
                </div>
            </div>
        `).join('');
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
                <div class="test-header">
                    <h3>${test.title}</h3>
                    <span class="test-duration"><i class="ri-time-line"></i> ${test.duration} mins</span>
                </div>
                <div class="test-body">
                    <p>${test.description}</p>
                    <div class="test-meta">
                        <span><i class="ri-question-line"></i> ${test.total_questions} questions</span>
                        <span><i class="ri-star-line"></i> ${test.total_marks} marks</span>
                    </div>
                </div>
                <div class="test-footer">
                    ${test.attempted ? `
                        <span class="completed-text">Score: ${test.score}/${test.total_marks}</span>
                        <button class="btn btn-secondary view-results-btn" data-attempt-id="${test.attempt_id}">
                            View Results
                        </button>
                    ` : `
                        <button class="btn btn-primary start-test-btn" data-test-id="${test.test_id}">
                            Start Test
                        </button>
                    `}
                </div>
            </div>
        `).join('')
        : '<p class="no-data">No tests available</p>';
    
    // Add button handlers
    document.querySelectorAll('.start-test-btn').forEach(btn => {
        btn.addEventListener('click', () => handleStartTest(btn.dataset.testId));
    });
}

async function handleStartTest(testId) {
    try {
        const confirm = await Swal.fire({
            title: 'Start Test?',
            text: 'Make sure you have enough time. Timer will start once you begin.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Start Test',
            cancelButtonText: 'Cancel'
        });
        
        if (!confirm.isConfirmed) return;
        
        showLoading('Loading test...');
        
        const result = await apiRequest(API_CONFIG.ENDPOINTS.START_TEST, 'POST', {
            test_id: testId
        });
        
        closeAlert();
        
        if (result.success) {
            // Store test data and redirect to test page
            sessionStorage.setItem('currentTest', JSON.stringify(result.data));
            window.location.href = 'takeTest.html';
        } else {
            showAlert('error', 'Error', result.message);
        }
    } catch (error) {
        showAlert('error', 'Error', 'Failed to start test');
    }
}

// ==================== CODING PRACTICE ====================
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
                <div class="problem-header">
                    <h3>${problem.title}</h3>
                    <span class="difficulty-badge ${problem.difficulty}">${problem.difficulty}</span>
                </div>
                <div class="problem-body">
                    <p>${problem.description}</p>
                    <div class="problem-meta">
                        <span><i class="ri-code-line"></i> ${problem.language}</span>
                        <span><i class="ri-star-line"></i> ${problem.points} points</span>
                    </div>
                </div>
                <div class="problem-footer">
                    <button class="btn btn-primary solve-btn" data-problem-id="${problem.problem_id}">
                        Solve Problem
                    </button>
                </div>
            </div>
        `).join('')
        : '<p class="no-data">No coding problems available</p>';
    
    // Add solve button handlers
    document.querySelectorAll('.solve-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            sessionStorage.setItem('currentProblem', btn.dataset.problemId);
            window.location.href = 'codeEditor.html';
        });
    });
}

// ==================== STUDY MATERIALS ====================
async function loadStudyMaterials() {
    try {
        showLoading('Loading study materials...');
        
        const result = await apiRequest(API_CONFIG.ENDPOINTS.GET_STUDY_MATERIALS, 'GET');
        
        closeAlert();
        
        if (result.success) {
            displayStudyMaterials(result.data);
        }
    } catch (error) {
        closeAlert();
        showAlert('error', 'Error', 'Failed to load study materials');
    }
}

function displayStudyMaterials(materials) {
    const container = document.getElementById('materialsContainer');
    if (!container) return;
    
    container.innerHTML = materials.length > 0
        ? materials.map(material => `
            <div class="material-card">
                <div class="material-icon">
                    <i class="ri-${getMaterialIcon(material.type)}"></i>
                </div>
                <div class="material-content">
                    <h4>${material.title}</h4>
                    <p>${material.description}</p>
                    <div class="material-meta">
                        <span><i class="ri-book-line"></i> ${material.course_name}</span>
                        <span><i class="ri-download-line"></i> ${material.downloads || 0} downloads</span>
                    </div>
                </div>
                <div class="material-action">
                    <a href="${material.file_url}" class="btn btn-primary" download target="_blank">
                        <i class="ri-download-line"></i> Download
                    </a>
                </div>
            </div>
        `).join('')
        : '<p class="no-data">No study materials available</p>';
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
        'assignment': 'file-text-line',
        'course': 'book-line',
        'test': 'question-line',
        'grade': 'star-line',
        'enrollment': 'user-add-line'
    };
    return icons[type] || 'notification-line';
}

function getMaterialIcon(type) {
    const icons = {
        'pdf': 'file-pdf-line',
        'video': 'video-line',
        'document': 'file-text-line',
        'link': 'link'
    };
    return icons[type] || 'file-line';
}

// Logout handler
async function handleLogout() {
    try {
        const confirm = await Swal.fire({
            title: 'Logout?',
            text: 'Are you sure you want to logout?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Logout',
            cancelButtonText: 'Cancel'
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
