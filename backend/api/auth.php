<?php
/**
 * Authentication API
 * Handles login, registration, and password reset
 */

require_once '../config/config.php';
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

if ($db === null) {
    sendResponse(false, 'Database connection failed', null, 500);
}

$method = $_SERVER['REQUEST_METHOD'];
$request = $_GET['action'] ?? '';

switch ($request) {
    case 'login':
        if ($method === 'POST') {
            login($db);
        }
        break;
    
    case 'register':
        if ($method === 'POST') {
            register($db);
        }
        break;
    
    case 'logout':
        if ($method === 'POST') {
            logout();
        }
        break;
    
    case 'send-otp':
        if ($method === 'POST') {
            sendOTP($db);
        }
        break;
    
    case 'verify-otp':
        if ($method === 'POST') {
            verifyOTP($db);
        }
        break;
    
    case 'reset-password':
        if ($method === 'POST') {
            resetPassword($db);
        }
        break;
    
    case 'check-session':
        if ($method === 'GET') {
            checkSession();
        }
        break;
    
    default:
        sendResponse(false, 'Invalid action', null, 400);
}

/**
 * User login
 */
function login($db) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $email = sanitizeInput($data['email'] ?? '');
    $password = $data['password'] ?? '';
    
    if (empty($email) || empty($password)) {
        sendResponse(false, 'Email and password are required', null, 400);
    }
    
    if (!validateEmail($email)) {
        sendResponse(false, 'Invalid email format', null, 400);
    }
    
    try {
        $query = "SELECT u.*, 
                         a.admin_id, 
                         m.mentor_id, 
                         s.student_id 
                  FROM users u
                  LEFT JOIN admins a ON u.user_id = a.user_id
                  LEFT JOIN mentors m ON u.user_id = m.user_id
                  LEFT JOIN students s ON u.user_id = s.user_id
                  WHERE u.email = :email AND u.status = 'active'";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            $user = $stmt->fetch();
            
            // Simple password comparison (not hashed as per requirement)
            if ($password === $user['password']) {
                // Update last login
                $updateQuery = "UPDATE users SET last_login = NOW() WHERE user_id = :user_id";
                $updateStmt = $db->prepare($updateQuery);
                $updateStmt->bindParam(':user_id', $user['user_id']);
                $updateStmt->execute();
                
                // Set session variables
                $_SESSION['user_id'] = $user['user_id'];
                $_SESSION['email'] = $user['email'];
                $_SESSION['username'] = $user['username'];
                $_SESSION['full_name'] = $user['full_name'];
                $_SESSION['user_role'] = $user['user_role'];
                $_SESSION['profile_picture'] = $user['profile_picture'];
                
                // Set role-specific ID
                if ($user['user_role'] === 'admin') {
                    $_SESSION['admin_id'] = $user['admin_id'];
                } elseif ($user['user_role'] === 'mentor') {
                    $_SESSION['mentor_id'] = $user['mentor_id'];
                } elseif ($user['user_role'] === 'student') {
                    $_SESSION['student_id'] = $user['student_id'];
                }
                
                sendResponse(true, 'Login successful', [
                    'user' => [
                        'user_id' => $user['user_id'],
                        'email' => $user['email'],
                        'username' => $user['username'],
                        'full_name' => $user['full_name'],
                        'role' => $user['user_role'],
                        'profile_picture' => $user['profile_picture']
                    ],
                    'redirect' => getRedirectUrl($user['user_role'])
                ]);
            } else {
                sendResponse(false, 'Invalid email or password', null, 401);
            }
        } else {
            sendResponse(false, 'Invalid email or password', null, 401);
        }
    } catch (PDOException $e) {
        error_log("Login Error: " . $e->getMessage());
        sendResponse(false, 'An error occurred during login', null, 500);
    }
}

/**
 * User registration
 */
function register($db) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $email = sanitizeInput($data['email'] ?? '');
    $username = sanitizeInput($data['username'] ?? '');
    $password = $data['password'] ?? '';
    $fullName = sanitizeInput($data['fullName'] ?? '');
    $phone = sanitizeInput($data['phone'] ?? '');
    $countryCode = sanitizeInput($data['countryCode'] ?? '+91');
    
    // Validation
    if (empty($email) || empty($username) || empty($password) || empty($fullName)) {
        sendResponse(false, 'All fields are required', null, 400);
    }
    
    if (!validateEmail($email)) {
        sendResponse(false, 'Invalid email format', null, 400);
    }
    
    if (strlen($username) < 3) {
        sendResponse(false, 'Username must be at least 3 characters', null, 400);
    }
    
    if (strlen($password) < 6) {
        sendResponse(false, 'Password must be at least 6 characters', null, 400);
    }
    
    try {
        // Check if email already exists
        $checkQuery = "SELECT user_id FROM users WHERE email = :email OR username = :username";
        $checkStmt = $db->prepare($checkQuery);
        $checkStmt->bindParam(':email', $email);
        $checkStmt->bindParam(':username', $username);
        $checkStmt->execute();
        
        if ($checkStmt->rowCount() > 0) {
            sendResponse(false, 'Email or username already exists', null, 409);
        }
        
        // Start transaction
        $db->beginTransaction();
        
        // Insert user (default role is student)
        $insertUserQuery = "INSERT INTO users (email, username, password, full_name, phone, country_code, user_role, email_verified) 
                           VALUES (:email, :username, :password, :full_name, :phone, :country_code, 'student', FALSE)";
        
        $stmt = $db->prepare($insertUserQuery);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':password', $password); // Not hashed as per requirement
        $stmt->bindParam(':full_name', $fullName);
        $stmt->bindParam(':phone', $phone);
        $stmt->bindParam(':country_code', $countryCode);
        $stmt->execute();
        
        $userId = $db->lastInsertId();
        
        // Insert into students table
        $insertStudentQuery = "INSERT INTO students (user_id, enrollment_date) VALUES (:user_id, CURDATE())";
        $studentStmt = $db->prepare($insertStudentQuery);
        $studentStmt->bindParam(':user_id', $userId);
        $studentStmt->execute();
        
        $db->commit();
        
        sendResponse(true, 'Registration successful! Please login to continue.', [
            'user_id' => $userId,
            'email' => $email,
            'username' => $username
        ], 201);
        
    } catch (PDOException $e) {
        $db->rollBack();
        error_log("Registration Error: " . $e->getMessage());
        sendResponse(false, 'An error occurred during registration', null, 500);
    }
}

/**
 * User logout
 */
function logout() {
    session_unset();
    session_destroy();
    sendResponse(true, 'Logout successful');
}

/**
 * Send OTP for password reset
 */
function sendOTP($db) {
    $data = json_decode(file_get_contents("php://input"), true);
    $email = sanitizeInput($data['email'] ?? '');
    
    if (empty($email) || !validateEmail($email)) {
        sendResponse(false, 'Valid email is required', null, 400);
    }
    
    try {
        // Check if email exists
        $checkQuery = "SELECT user_id FROM users WHERE email = :email";
        $checkStmt = $db->prepare($checkQuery);
        $checkStmt->bindParam(':email', $email);
        $checkStmt->execute();
        
        if ($checkStmt->rowCount() === 0) {
            // Don't reveal if email exists or not for security
            sendResponse(true, 'If the email exists, you will receive an OTP shortly');
        }
        
        // Generate OTP
        $otp = generateOTP();
        $expiresAt = date('Y-m-d H:i:s', strtotime('+' . OTP_EXPIRY_MINUTES . ' minutes'));
        
        // Store OTP in database
        $insertQuery = "INSERT INTO password_reset_otps (email, otp_code, expires_at) 
                       VALUES (:email, :otp, :expires_at)";
        $stmt = $db->prepare($insertQuery);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':otp', $otp);
        $stmt->bindParam(':expires_at', $expiresAt);
        $stmt->execute();
        
        // TODO: Send OTP via email (implement email function)
        // For now, we'll return OTP in response (remove in production)
        error_log("OTP for $email: $otp");
        
        sendResponse(true, 'OTP sent to your email', ['otp' => $otp]); // Remove otp from response in production
        
    } catch (PDOException $e) {
        error_log("Send OTP Error: " . $e->getMessage());
        sendResponse(false, 'An error occurred while sending OTP', null, 500);
    }
}

/**
 * Verify OTP
 */
function verifyOTP($db) {
    $data = json_decode(file_get_contents("php://input"), true);
    $email = sanitizeInput($data['email'] ?? '');
    $otp = sanitizeInput($data['otp'] ?? '');
    
    if (empty($email) || empty($otp)) {
        sendResponse(false, 'Email and OTP are required', null, 400);
    }
    
    try {
        $query = "SELECT otp_id FROM password_reset_otps 
                  WHERE email = :email 
                  AND otp_code = :otp 
                  AND is_used = FALSE 
                  AND expires_at > NOW()
                  ORDER BY created_at DESC 
                  LIMIT 1";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':otp', $otp);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            $otpData = $stmt->fetch();
            
            // Mark OTP as used
            $updateQuery = "UPDATE password_reset_otps SET is_used = TRUE WHERE otp_id = :otp_id";
            $updateStmt = $db->prepare($updateQuery);
            $updateStmt->bindParam(':otp_id', $otpData['otp_id']);
            $updateStmt->execute();
            
            sendResponse(true, 'OTP verified successfully');
        } else {
            sendResponse(false, 'Invalid or expired OTP', null, 400);
        }
    } catch (PDOException $e) {
        error_log("Verify OTP Error: " . $e->getMessage());
        sendResponse(false, 'An error occurred while verifying OTP', null, 500);
    }
}

/**
 * Reset password
 */
function resetPassword($db) {
    $data = json_decode(file_get_contents("php://input"), true);
    $email = sanitizeInput($data['email'] ?? '');
    $newPassword = $data['password'] ?? '';
    
    if (empty($email) || empty($newPassword)) {
        sendResponse(false, 'Email and new password are required', null, 400);
    }
    
    if (strlen($newPassword) < 6) {
        sendResponse(false, 'Password must be at least 6 characters', null, 400);
    }
    
    try {
        // Update password
        $query = "UPDATE users SET password = :password WHERE email = :email";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':password', $newPassword); // Not hashed as per requirement
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            sendResponse(true, 'Password reset successful! Please login with your new password.');
        } else {
            sendResponse(false, 'Email not found', null, 404);
        }
    } catch (PDOException $e) {
        error_log("Reset Password Error: " . $e->getMessage());
        sendResponse(false, 'An error occurred while resetting password', null, 500);
    }
}

/**
 * Check session status
 */
function checkSession() {
    if (isLoggedIn()) {
        sendResponse(true, 'Session active', [
            'user_id' => $_SESSION['user_id'],
            'email' => $_SESSION['email'],
            'username' => $_SESSION['username'],
            'full_name' => $_SESSION['full_name'],
            'role' => $_SESSION['user_role']
        ]);
    } else {
        sendResponse(false, 'No active session', null, 401);
    }
}

/**
 * Get redirect URL based on user role
 */
function getRedirectUrl($role) {
    $redirectUrls = [
        'admin' => '/admin/admin.html',
        'mentor' => '/mentor/mentorDashboard.html',
        'student' => '/students/studentsDashboard.html'
    ];
    
    return $redirectUrls[$role] ?? '/';
}
?>
