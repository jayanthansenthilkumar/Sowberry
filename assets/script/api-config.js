/**
 * API Configuration
 * Base URLs and endpoints for backend API
 */

const API_CONFIG = {
    BASE_URL: window.location.origin + '/Sowberry/backend/api',
    ENDPOINTS: {
        // Auth endpoints
        LOGIN: '/auth.php?action=login',
        REGISTER: '/auth.php?action=register',
        LOGOUT: '/auth.php?action=logout',
        SEND_OTP: '/auth.php?action=send-otp',
        VERIFY_OTP: '/auth.php?action=verify-otp',
        RESET_PASSWORD: '/auth.php?action=reset-password',
        CHECK_SESSION: '/auth.php?action=check-session',
        
        // Common endpoints
        CONTACT: '/common.php?action=contact',
        NOTIFICATIONS: '/common.php?action=notifications',
        MARK_NOTIFICATION_READ: '/common.php?action=mark-notification-read',
        USER_PROFILE: '/common.php?action=user-profile',
        UPDATE_PROFILE: '/common.php?action=update-profile',
        CHANGE_PASSWORD: '/common.php?action=change-password',
        
        // Student endpoints
        STUDENT_DASHBOARD: '/student.php?action=dashboard',
        COURSES: '/student.php?action=courses',
        ENROLL: '/student.php?action=enroll',
        MY_COURSES: '/student.php?action=my-courses',
        COURSE_DETAILS: '/student.php?action=course-details',
        ASSIGNMENTS: '/student.php?action=assignments',
        SUBMIT_ASSIGNMENT: '/student.php?action=submit-assignment',
        GRADES: '/student.php?action=grades',
        PROGRESS: '/student.php?action=progress',
        STUDY_ACTIVITY: '/student.php?action=study-activity',
        UPDATE_ACTIVITY: '/student.php?action=update-activity',
        APTITUDE_TESTS: '/student.php?action=aptitude-tests',
        START_TEST: '/student.php?action=start-test',
        SUBMIT_TEST: '/student.php?action=submit-test',
        CODING_PROBLEMS: '/student.php?action=coding-problems',
        SUBMIT_CODE: '/student.php?action=submit-code',
        STUDY_MATERIALS: '/student.php?action=study-materials',
        EVENTS: '/student.php?action=events',
        REGISTER_EVENT: '/student.php?action=register-event',
        
        // Mentor endpoints
        MENTOR_DASHBOARD: '/mentor.php?action=dashboard',
        MENTOR_COURSES: '/mentor.php?action=my-courses',
        CREATE_COURSE: '/mentor.php?action=create-course',
        UPDATE_COURSE: '/mentor.php?action=update-course',
        DELETE_COURSE: '/mentor.php?action=delete-course',
        STUDENTS: '/mentor.php?action=students',
        STUDENT_PROGRESS: '/mentor.php?action=student-progress',
        MENTOR_ASSIGNMENTS: '/mentor.php?action=assignments',
        CREATE_ASSIGNMENT: '/mentor.php?action=create-assignment',
        SUBMISSIONS: '/mentor.php?action=submissions',
        GRADE_ASSIGNMENT: '/mentor.php?action=grade-assignment',
        CREATE_EVENT: '/mentor.php?action=create-event',
        MENTOR_EVENTS: '/mentor.php?action=my-events',
        CREATE_APTITUDE_TEST: '/mentor.php?action=create-aptitude-test',
        CREATE_CODING_PROBLEM: '/mentor.php?action=create-coding-problem',
        UPLOAD_MATERIAL: '/mentor.php?action=upload-material',
        
        // Admin endpoints
        ADMIN_DASHBOARD: '/admin.php?action=dashboard',
        ALL_USERS: '/admin.php?action=all-users',
        ADMIN_STUDENTS: '/admin.php?action=students',
        CREATE_STUDENT: '/admin.php?action=create-student',
        UPDATE_STUDENT: '/admin.php?action=update-student',
        DELETE_STUDENT: '/admin.php?action=delete-student',
        MENTORS: '/admin.php?action=mentors',
        CREATE_MENTOR: '/admin.php?action=create-mentor',
        UPDATE_MENTOR: '/admin.php?action=update-mentor',
        DELETE_MENTOR: '/admin.php?action=delete-mentor',
        ALL_COURSES: '/admin.php?action=all-courses',
        ADMIN_DELETE_COURSE: '/admin.php?action=delete-course',
        ANALYTICS: '/admin.php?action=analytics',
        GENERATE_REPORT: '/admin.php?action=generate-report',
        REPORTS: '/admin.php?action=reports',
        UPDATE_USER_STATUS: '/admin.php?action=update-user-status',
        CONTACT_SUBMISSIONS: '/admin.php?action=contact-submissions',
        RESPOND_CONTACT: '/admin.php?action=respond-contact'
    }
};

/**
 * Make API request
 * @param {string} endpoint - API endpoint
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {object} data - Request data
 * @returns {Promise}
 */
async function apiRequest(endpoint, method = 'GET', data = null) {
    const url = API_CONFIG.BASE_URL + endpoint;
    
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include' // Include cookies for session
    };
    
    if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        
        return result;
    } catch (error) {
        console.error('API Request Error:', error);
        return {
            success: false,
            message: 'Network error occurred. Please try again.',
            data: null
        };
    }
}

/**
 * Show SweetAlert message
 * @param {string} type - 'success', 'error', 'warning', 'info'
 * @param {string} title - Alert title
 * @param {string} text - Alert text
 */
function showAlert(type, title, text = '') {
    Swal.fire({
        icon: type,
        title: title,
        text: text,
        confirmButtonColor: '#6366f1',
        confirmButtonText: 'OK'
    });
}

/**
 * Show loading alert
 */
function showLoading(title = 'Processing...') {
    Swal.fire({
        title: title,
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
}

/**
 * Close SweetAlert
 */
function closeAlert() {
    Swal.close();
}
