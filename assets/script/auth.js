/**
 * Authentication Page JavaScript
 * Handles login, registration, and password reset with AJAX
 */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    initializeAuthHandlers();
});

/**
 * Initialize all authentication handlers
 */
function initializeAuthHandlers() {
    // Login Form Submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Registration Form Submission
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegistration);
    }

    // Forgot Password - Send OTP
    const forgotForm = document.getElementById('forgotForm');
    if (forgotForm) {
        forgotForm.addEventListener('submit', handleSendOTP);
    }

    // OTP Verification Form
    const otpForm = document.getElementById('otpForm');
    if (otpForm) {
        otpForm.addEventListener('submit', handleVerifyOTP);
    }

    // Reset Password Form
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', handleResetPassword);
    }
}

/**
 * Handle Login
 */
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
        showAlert('error', 'Error', 'Please fill in all fields');
        return;
    }
    
    showLoading('Signing in...');
    
    try {
        const result = await apiRequest(API_CONFIG.ENDPOINTS.LOGIN, 'POST', {
            email: email,
            password: password
        });
        
        closeAlert();
        
        if (result.success) {
            Swal.fire({
                icon: 'success',
                title: 'Welcome!',
                text: result.message,
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                window.location.href = result.data.redirect;
            });
        } else {
            showAlert('error', 'Login Failed', result.message);
        }
    } catch (error) {
        closeAlert();
        showAlert('error', 'Error', 'An error occurred during login');
    }
}

/**
 * Handle Registration
 */
async function handleRegistration(e) {
    e.preventDefault();
    
    const email = document.getElementById('regEmail').value.trim();
    const username = document.getElementById('username').value.trim();
    const fullName = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.replace(/\D/g, '');
    const countryCode = document.getElementById('countryCode').value;
    const termsAccepted = document.querySelector('input[name="terms"]').checked;
    
    if (!termsAccepted) {
        showAlert('error', 'Error', 'Please accept the Terms & Conditions');
        return;
    }
    
    const formData = {
        email: email,
        username: username,
        password: 'student123', // Default password
        fullName: fullName,
        phone: phone,
        countryCode: countryCode
    };
    
    showLoading('Creating your account...');
    
    try {
        const result = await apiRequest(API_CONFIG.ENDPOINTS.REGISTER, 'POST', formData);
        
        closeAlert();
        
        if (result.success) {
            Swal.fire({
                icon: 'success',
                title: 'Registration Successful!',
                html: `${result.message}<br><br><strong>Default Password:</strong> student123<br><small>Please change your password after logging in</small>`,
                confirmButtonColor: '#6366f1'
            }).then(() => {
                toggleForms('login');
                document.getElementById('email').value = formData.email;
            });
        } else {
            showAlert('error', 'Registration Failed', result.message);
        }
    } catch (error) {
        closeAlert();
        showAlert('error', 'Error', 'An error occurred during registration');
    }
}

/**
 * Handle Send OTP
 */
async function handleSendOTP(e) {
    e.preventDefault();
    
    const email = document.getElementById('resetEmail').value.trim();
    
    if (!email) {
        showAlert('error', 'Error', 'Please enter your email address');
        return;
    }
    
    showLoading('Sending OTP...');
    
    try {
        const result = await apiRequest(API_CONFIG.ENDPOINTS.SEND_OTP, 'POST', { email });
        
        closeAlert();
        
        if (result.success) {
            sessionStorage.setItem('resetEmail', email);
            
            // For development - show OTP
            if (result.data && result.data.otp) {
                Swal.fire({
                    icon: 'success',
                    title: 'OTP Sent!',
                    html: `${result.message}<br><br><strong>Development Mode - Your OTP:</strong> ${result.data.otp}`,
                    confirmButtonColor: '#6366f1'
                }).then(() => {
                    switchForgotStep(2);
                });
            } else {
                showAlert('success', 'OTP Sent!', result.message);
                switchForgotStep(2);
            }
        } else {
            showAlert('error', 'Error', result.message);
        }
    } catch (error) {
        closeAlert();
        showAlert('error', 'Error', 'An error occurred while sending OTP');
    }
}

/**
 * Handle Verify OTP
 */
async function handleVerifyOTP(e) {
    e.preventDefault();
    
    const otp = document.getElementById('otp').value;
    const email = sessionStorage.getItem('resetEmail');
    
    if (!otp || otp.length !== 6) {
        showAlert('error', 'Error', 'Please enter a valid 6-digit OTP');
        return;
    }
    
    showLoading('Verifying OTP...');
    
    try {
        const result = await apiRequest(API_CONFIG.ENDPOINTS.VERIFY_OTP, 'POST', { email, otp });
        
        closeAlert();
        
        if (result.success) {
            showAlert('success', 'Verified!', result.message);
            setTimeout(() => switchForgotStep(3), 1000);
        } else {
            showAlert('error', 'Verification Failed', result.message);
        }
    } catch (error) {
        closeAlert();
        showAlert('error', 'Error', 'An error occurred during verification');
    }
}

/**
 * Handle Reset Password
 */
async function handleResetPassword(e) {
    e.preventDefault();
    
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const email = sessionStorage.getItem('resetEmail');
    
    if (!newPassword || !confirmPassword) {
        showAlert('error', 'Error', 'Please fill in all fields');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showAlert('error', 'Error', 'Passwords do not match');
        return;
    }
    
    if (newPassword.length < 6) {
        showAlert('error', 'Error', 'Password must be at least 6 characters');
        return;
    }
    
    showLoading('Resetting password...');
    
    try {
        const result = await apiRequest(API_CONFIG.ENDPOINTS.RESET_PASSWORD, 'POST', {
            email,
            password: newPassword
        });
        
        closeAlert();
        
        if (result.success) {
            sessionStorage.removeItem('resetEmail');
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: result.message,
                confirmButtonColor: '#6366f1'
            }).then(() => {
                toggleToLogin();
            });
        } else {
            showAlert('error', 'Error', result.message);
        }
    } catch (error) {
        closeAlert();
        showAlert('error', 'Error', 'An error occurred while resetting password');
    }
}

/**
 * Switch forgot password steps
 */
function switchForgotStep(step) {
    document.querySelectorAll('.forgot-step').forEach(el => el.classList.remove('active'));
    document.querySelector(`.step-${step}`).classList.add('active');
}

/**
 * Toggle to login form
 */
function toggleToLogin() {
    if (typeof toggleForms === 'function') {
        toggleForms('login');
    }
}
