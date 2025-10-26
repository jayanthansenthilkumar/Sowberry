/**
 * Backend API Handler
 * Handles all Ajax requests with SweetAlert2 integration
 * Requires: jQuery, SweetAlert2
 */

// Base API URL
const API_BASE = 'backend/';

// SweetAlert2 Toast Configuration
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
});

/**
 * Show success message
 */
function showSuccess(message) {
    Toast.fire({
        icon: 'success',
        title: message
    });
}

/**
 * Show error message
 */
function showError(message) {
    Toast.fire({
        icon: 'error',
        title: message
    });
}

/**
 * Show loading indicator
 */
function showLoading(message = 'Processing...') {
    Swal.fire({
        title: message,
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
}

/**
 * Hide loading indicator
 */
function hideLoading() {
    Swal.close();
}

/**
 * Confirm action
 */
function confirmAction(title, text, confirmText = 'Yes, do it!') {
    return Swal.fire({
        title: title,
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#7c3aed',
        cancelButtonColor: '#ef4444',
        confirmButtonText: confirmText,
        cancelButtonText: 'Cancel'
    });
}

/**
 * Generic Ajax request handler
 */
function makeRequest(endpoint, data = {}, method = 'POST', showLoader = true) {
    if (showLoader) {
        showLoading();
    }
    
    return new Promise((resolve, reject) => {
        $.ajax({
            url: API_BASE + endpoint,
            type: method,
            data: data,
            dataType: 'json',
            success: function(response) {
                hideLoading();
                resolve(response);
            },
            error: function(xhr, status, error) {
                hideLoading();
                console.error('API Error:', error);
                reject({
                    success: false,
                    message: 'Network error. Please try again.'
                });
            }
        });
    });
}

/**
 * Make request with file upload
 */
function makeRequestWithFile(endpoint, formData, showLoader = true) {
    if (showLoader) {
        showLoading();
    }
    
    return new Promise((resolve, reject) => {
        $.ajax({
            url: API_BASE + endpoint,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            dataType: 'json',
            success: function(response) {
                hideLoading();
                resolve(response);
            },
            error: function(xhr, status, error) {
                hideLoading();
                console.error('API Error:', error);
                reject({
                    success: false,
                    message: 'Network error. Please try again.'
                });
            }
        });
    });
}

// ============================================
// AUTHENTICATION API
// ============================================

const AuthAPI = {
    /**
     * Login user
     */
    login: function(email, password) {
        return makeRequest('auth.php', {
            action: 'login',
            email: email,
            password: password
        });
    },
    
    /**
     * Register new user
     */
    register: function(formData) {
        return makeRequest('auth.php', {
            action: 'register',
            ...formData
        });
    },
    
    /**
     * Logout user
     */
    logout: function() {
        return makeRequest('auth.php', {
            action: 'logout'
        });
    },
    
    /**
     * Forgot password
     */
    forgotPassword: function(email) {
        return makeRequest('auth.php', {
            action: 'forgot_password',
            email: email
        });
    },
    
    /**
     * Reset password
     */
    resetPassword: function(token, otp, newPassword, confirmPassword) {
        return makeRequest('auth.php', {
            action: 'reset_password',
            token: token,
            otp: otp,
            new_password: newPassword,
            confirm_password: confirmPassword
        });
    },
    
    /**
     * Check session
     */
    checkSession: function() {
        return makeRequest('auth.php?action=check_session', {}, 'GET', false);
    }
};

// ============================================
// STUDENT API
// ============================================

const StudentAPI = {
    /**
     * Get all students
     */
    getAll: function(params = {}) {
        const queryString = $.param(params);
        return makeRequest(`students.php?action=get_all&${queryString}`, {}, 'GET');
    },
    
    /**
     * Get single student
     */
    getOne: function(id) {
        return makeRequest(`students.php?action=get_one&id=${id}`, {}, 'GET');
    },
    
    /**
     * Create student
     */
    create: function(formData) {
        return makeRequest('students.php', {
            action: 'create',
            ...formData
        });
    },
    
    /**
     * Update student
     */
    update: function(studentId, formData) {
        return makeRequest('students.php', {
            action: 'update',
            student_id: studentId,
            ...formData
        });
    },
    
    /**
     * Delete student
     */
    delete: function(studentId) {
        return makeRequest('students.php', {
            action: 'delete',
            student_id: studentId
        });
    },
    
    /**
     * Get student progress
     */
    getProgress: function(studentId) {
        return makeRequest(`students.php?action=get_progress&id=${studentId}`, {}, 'GET');
    },
    
    /**
     * Update student status
     */
    updateStatus: function(studentId, status) {
        return makeRequest('students.php', {
            action: 'update_status',
            student_id: studentId,
            status: status
        });
    }
};

// ============================================
// COURSE API
// ============================================

const CourseAPI = {
    /**
     * Get all courses
     */
    getAll: function(params = {}) {
        const queryString = $.param(params);
        return makeRequest(`courses.php?action=get_all&${queryString}`, {}, 'GET');
    },
    
    /**
     * Get single course
     */
    getOne: function(id) {
        return makeRequest(`courses.php?action=get_one&id=${id}`, {}, 'GET');
    },
    
    /**
     * Create course
     */
    create: function(formData) {
        return makeRequestWithFile('courses.php', formData);
    },
    
    /**
     * Update course
     */
    update: function(courseId, formData) {
        formData.append('action', 'update');
        formData.append('course_id', courseId);
        return makeRequestWithFile('courses.php', formData);
    },
    
    /**
     * Delete course
     */
    delete: function(courseId) {
        return makeRequest('courses.php', {
            action: 'delete',
            course_id: courseId
        });
    },
    
    /**
     * Enroll student
     */
    enroll: function(studentId, courseId) {
        return makeRequest('courses.php', {
            action: 'enroll',
            student_id: studentId,
            course_id: courseId
        });
    },
    
    /**
     * Get course enrollments
     */
    getEnrollments: function(courseId) {
        return makeRequest(`courses.php?action=get_enrollments&course_id=${courseId}`, {}, 'GET');
    },
    
    /**
     * Update course status
     */
    updateStatus: function(courseId, status) {
        return makeRequest('courses.php', {
            action: 'update_status',
            course_id: courseId,
            status: status
        });
    }
};

// ============================================
// ASSIGNMENT API
// ============================================

const AssignmentAPI = {
    /**
     * Get all assignments
     */
    getAll: function(params = {}) {
        const queryString = $.param(params);
        return makeRequest(`assignments.php?action=get_all&${queryString}`, {}, 'GET');
    },
    
    /**
     * Get single assignment
     */
    getOne: function(id) {
        return makeRequest(`assignments.php?action=get_one&id=${id}`, {}, 'GET');
    },
    
    /**
     * Create assignment
     */
    create: function(formData) {
        return makeRequestWithFile('assignments.php', formData);
    },
    
    /**
     * Update assignment
     */
    update: function(assignmentId, formData) {
        formData.append('action', 'update');
        formData.append('assignment_id', assignmentId);
        return makeRequestWithFile('assignments.php', formData);
    },
    
    /**
     * Delete assignment
     */
    delete: function(assignmentId) {
        return makeRequest('assignments.php', {
            action: 'delete',
            assignment_id: assignmentId
        });
    },
    
    /**
     * Submit assignment
     */
    submit: function(formData) {
        return makeRequestWithFile('assignments.php', formData);
    },
    
    /**
     * Get submissions
     */
    getSubmissions: function(assignmentId) {
        return makeRequest(`assignments.php?action=get_submissions&assignment_id=${assignmentId}`, {}, 'GET');
    },
    
    /**
     * Grade submission
     */
    grade: function(submissionId, score, feedback) {
        return makeRequest('assignments.php', {
            action: 'grade',
            submission_id: submissionId,
            score: score,
            feedback: feedback
        });
    }
};

// ============================================
// FORM HANDLING UTILITIES
// ============================================

/**
 * Serialize form to object
 */
function formToObject(form) {
    const formData = {};
    $(form).serializeArray().forEach(item => {
        formData[item.name] = item.value;
    });
    return formData;
}

/**
 * Serialize form to FormData (for file uploads)
 */
function formToFormData(form) {
    const formData = new FormData(form);
    return formData;
}

/**
 * Reset form
 */
function resetForm(form) {
    $(form)[0].reset();
}

/**
 * Populate form with data
 */
function populateForm(form, data) {
    Object.keys(data).forEach(key => {
        const input = $(form).find(`[name="${key}"]`);
        if (input.length) {
            input.val(data[key]);
        }
    });
}

// ============================================
// COMMON EVENT HANDLERS
// ============================================

$(document).ready(function() {
    
    // Handle login form
    $('#loginForm').on('submit', function(e) {
        e.preventDefault();
        
        const email = $('#email').val();
        const password = $('#password').val();
        
        AuthAPI.login(email, password).then(response => {
            if (response.success) {
                showSuccess(response.message);
                setTimeout(() => {
                    window.location.href = response.data.redirect;
                }, 1000);
            } else {
                showError(response.message);
            }
        });
    });
    
    // Handle registration form
    $('#registerForm').on('submit', function(e) {
        e.preventDefault();
        
        const formData = formToObject(this);
        
        AuthAPI.register(formData).then(response => {
            if (response.success) {
                showSuccess(response.message);
                resetForm(this);
                setTimeout(() => {
                    window.location.href = response.data.redirect;
                }, 1500);
            } else {
                showError(response.message);
            }
        });
    });
    
    // Handle logout
    $('.logout, #logoutBtn').on('click', function(e) {
        e.preventDefault();
        
        confirmAction(
            'Logout?',
            'Are you sure you want to logout?',
            'Yes, logout'
        ).then((result) => {
            if (result.isConfirmed) {
                AuthAPI.logout().then(response => {
                    if (response.success) {
                        showSuccess(response.message);
                        setTimeout(() => {
                            window.location.href = response.data.redirect;
                        }, 1000);
                    }
                });
            }
        });
    });
    
    // Handle forgot password
    $('#forgotPasswordForm').on('submit', function(e) {
        e.preventDefault();
        
        const email = $('#reset_email').val();
        
        AuthAPI.forgotPassword(email).then(response => {
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'OTP Sent!',
                    html: `<p>${response.message}</p>
                           <p><strong>Your OTP: ${response.data.otp}</strong></p>
                           <small>(In production, this will be sent via email)</small>`,
                    confirmButtonColor: '#7c3aed'
                });
            } else {
                showError(response.message);
            }
        });
    });
    
});

// Export for use in other files
window.API = {
    Auth: AuthAPI,
    Student: StudentAPI,
    Course: CourseAPI,
    Assignment: AssignmentAPI
};

window.Utils = {
    showSuccess,
    showError,
    showLoading,
    hideLoading,
    confirmAction,
    formToObject,
    formToFormData,
    resetForm,
    populateForm
};
