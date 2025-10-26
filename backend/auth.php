<?php
/**
 * Authentication Handler
 * Handles login, registration, logout, and password management
 */

require_once 'config.php';

header('Content-Type: application/json');

$action = $_POST['action'] ?? $_GET['action'] ?? '';

switch ($action) {
    case 'login':
        handleLogin();
        break;
    
    case 'register':
        handleRegister();
        break;
    
    case 'logout':
        handleLogout();
        break;
    
    case 'forgot_password':
        handleForgotPassword();
        break;
    
    case 'reset_password':
        handleResetPassword();
        break;
    
    case 'check_session':
        checkSession();
        break;
    
    default:
        sendResponse(false, 'Invalid action');
}

/**
 * Handle user login
 */
function handleLogin() {
    global $conn;
    
    $email = sanitize($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    
    // Validation
    if (empty($email) || empty($password)) {
        sendResponse(false, 'Please fill in all fields');
    }
    
    if (!isValidEmail($email)) {
        sendResponse(false, 'Invalid email format');
    }
    
    // Check user exists
    $query = "SELECT u.*, 
              CASE 
                WHEN u.user_type = 'student' THEN s.student_id
                WHEN u.user_type = 'mentor' THEN m.mentor_id
                WHEN u.user_type = 'admin' THEN a.admin_id
              END as type_id
              FROM users u
              LEFT JOIN students s ON u.user_id = s.user_id
              LEFT JOIN mentors m ON u.user_id = m.user_id
              LEFT JOIN admins a ON u.user_id = a.user_id
              WHERE u.email = '$email'";
    
    $result = mysqli_query($conn, $query);
    
    if ($user = mysqli_fetch_assoc($result)) {
        // Verify password
        if ($password === $user['password']) {
            // Check account status
            if ($user['status'] !== 'active') {
                sendResponse(false, 'Your account has been ' . $user['status']);
            }
            
            // Set session variables
            $_SESSION['user_id'] = $user['user_id'];
            $_SESSION['type_id'] = $user['type_id'];
            $_SESSION['email'] = $user['email'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['full_name'] = $user['full_name'];
            $_SESSION['user_type'] = $user['user_type'];
            $_SESSION['profile_image'] = $user['profile_image'];
            
            // Update last login
            mysqli_query($conn, "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = {$user['user_id']}");
            
            // Log activity for students
            if ($user['user_type'] === 'student' && $user['type_id']) {
                mysqli_query($conn, "INSERT INTO student_activities (student_id, activity_date, activity_type) 
                                   VALUES ({$user['type_id']}, CURDATE(), 'login')");
            }
            
            // Determine redirect page
            $redirects = [
                'admin' => 'admin.php',
                'mentor' => 'mentorDashboard.php',
                'student' => 'studentsDashboard.php'
            ];
            
            sendResponse(true, 'Login successful!', [
                'redirect' => $redirects[$user['user_type']],
                'user' => [
                    'name' => $user['full_name'],
                    'email' => $user['email'],
                    'type' => $user['user_type'],
                    'image' => $user['profile_image']
                ]
            ]);
        } else {
            sendResponse(false, 'Invalid password');
        }
    } else {
        sendResponse(false, 'No account found with this email');
    }
}

/**
 * Handle user registration
 */
function handleRegister() {
    global $conn;
    
    $full_name = sanitize($_POST['full_name'] ?? '');
    $email = sanitize($_POST['email'] ?? '');
    $username = sanitize($_POST['username'] ?? '');
    $password = sanitize($_POST['password'] ?? '');
    $confirm_password = $_POST['confirm_password'] ?? '';
    $phone = sanitize($_POST['phone'] ?? '');
    $user_type = sanitize($_POST['user_type'] ?? 'student');
    
    // Validation
    if (empty($full_name) || empty($email) || empty($username) || empty($password)) {
        sendResponse(false, 'Please fill in all required fields');
    }
    
    if (!isValidEmail($email)) {
        sendResponse(false, 'Invalid email format');
    }
    
    if (strlen($password) < 6) {
        sendResponse(false, 'Password must be at least 6 characters');
    }
    
    if ($password !== $confirm_password) {
        sendResponse(false, 'Passwords do not match');
    }
    
    // Check if email exists
    $checkQuery = "SELECT user_id FROM users WHERE email = '$email' OR username = '$username'";
    $checkResult = mysqli_query($conn, $checkQuery);
    
    if (mysqli_num_rows($checkResult) > 0) {
        sendResponse(false, 'Email or username already exists');
    }
    
    // Start transaction
    mysqli_begin_transaction($conn);
    
    try {
        // Insert user
        $insertQuery = "INSERT INTO users (email, username, password, full_name, phone, user_type, status) 
                       VALUES ('$email', '$username', '$password', '$full_name', '$phone', '$user_type', 'active')";
        mysqli_query($conn, $insertQuery);
        $user_id = mysqli_insert_id($conn);
        
        // Create user profile
        mysqli_query($conn, "INSERT INTO user_profiles (user_id) VALUES ($user_id)");
        
        // Create type-specific record
        if ($user_type === 'student') {
            $code = generateCode('STU');
            mysqli_query($conn, "INSERT INTO students (user_id, student_code, enrollment_date) 
                               VALUES ($user_id, '$code', CURDATE())");
        } elseif ($user_type === 'mentor') {
            $code = generateCode('MEN');
            mysqli_query($conn, "INSERT INTO mentors (user_id, mentor_code, hire_date) 
                               VALUES ($user_id, '$code', CURDATE())");
        }
        
        mysqli_commit($conn);
        sendResponse(true, 'Registration successful! Please login.', ['redirect' => 'login.php']);
        
    } catch (Exception $e) {
        mysqli_rollback($conn);
        sendResponse(false, 'Registration failed: ' . $e->getMessage());
    }
}

/**
 * Handle logout
 */
function handleLogout() {
    session_destroy();
    sendResponse(true, 'Logged out successfully', ['redirect' => 'login.php']);
}

/**
 * Handle forgot password
 */
function handleForgotPassword() {
    global $conn;
    
    $email = sanitize($_POST['email'] ?? '');
    
    if (empty($email) || !isValidEmail($email)) {
        sendResponse(false, 'Please enter a valid email');
    }
    
    // Check if user exists
    $query = "SELECT user_id, full_name FROM users WHERE email = '$email'";
    $result = mysqli_query($conn, $query);
    
    if ($user = mysqli_fetch_assoc($result)) {
        // Generate reset token
        $token = bin2hex(random_bytes(32));
        $otp = sprintf("%06d", mt_rand(1, 999999));
        $expires = date('Y-m-d H:i:s', strtotime('+1 hour'));
        
        // Save token
        mysqli_query($conn, "INSERT INTO password_resets (user_id, token, otp, expires_at) 
                           VALUES ({$user['user_id']}, '$token', '$otp', '$expires')");
        
        // In production, send email with OTP
        sendResponse(true, 'Password reset OTP sent to your email', [
            'otp' => $otp, // Remove in production
            'token' => $token
        ]);
    } else {
        sendResponse(false, 'No account found with this email');
    }
}

/**
 * Handle password reset
 */
function handleResetPassword() {
    global $conn;
    
    $token = sanitize($_POST['token'] ?? '');
    $otp = sanitize($_POST['otp'] ?? '');
    $new_password = sanitize($_POST['new_password'] ?? '');
    $confirm_password = $_POST['confirm_password'] ?? '';
    
    if (empty($token) || empty($otp) || empty($new_password)) {
        sendResponse(false, 'Please fill in all fields');
    }
    
    if ($new_password !== $confirm_password) {
        sendResponse(false, 'Passwords do not match');
    }
    
    if (strlen($new_password) < 6) {
        sendResponse(false, 'Password must be at least 6 characters');
    }
    
    // Verify token and OTP
    $query = "SELECT user_id FROM password_resets 
             WHERE token = '$token' AND otp = '$otp' AND expires_at > NOW() AND used = 0";
    $result = mysqli_query($conn, $query);
    
    if ($reset = mysqli_fetch_assoc($result)) {
        // Update password
        mysqli_query($conn, "UPDATE users SET password = '$new_password' WHERE user_id = {$reset['user_id']}");
        
        // Mark token as used
        mysqli_query($conn, "UPDATE password_resets SET used = 1 WHERE token = '$token'");
        
        sendResponse(true, 'Password reset successful! Please login.', ['redirect' => 'login.php']);
    } else {
        sendResponse(false, 'Invalid or expired reset link');
    }
}

/**
 * Check session status
 */
function checkSession() {
    if (isLoggedIn()) {
        sendResponse(true, 'Session active', [
            'user' => [
                'id' => $_SESSION['user_id'],
                'name' => $_SESSION['full_name'],
                'email' => $_SESSION['email'],
                'type' => $_SESSION['user_type']
            ]
        ]);
    } else {
        sendResponse(false, 'No active session');
    }
}

?>
