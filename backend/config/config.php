<?php
/**
 * General Configuration File
 * Sowberry Academy
 */

// Error reporting settings
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../logs/error.log');

// Timezone
date_default_timezone_set('Asia/Kolkata');

// Session settings
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_secure', 0); // Set to 1 if using HTTPS
session_start();

// Application settings
define('APP_NAME', 'Sowberry Academy');
define('APP_URL', 'http://localhost/Sowberry');
define('UPLOAD_PATH', __DIR__ . '/../../uploads/');
define('MAX_FILE_SIZE', 10485760); // 10MB

// Email settings (for OTP and notifications)
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USER', 'berries@sowberry.com');
define('SMTP_PASS', ''); // Add your SMTP password
define('FROM_EMAIL', 'berries@sowberry.com');
define('FROM_NAME', 'Sowberry Academy');

// OTP settings
define('OTP_EXPIRY_MINUTES', 10);
define('OTP_LENGTH', 6);

// Pagination settings
define('RECORDS_PER_PAGE', 20);

// CORS headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

/**
 * Autoload classes
 */
spl_autoload_register(function ($class) {
    $file = __DIR__ . '/../classes/' . $class . '.php';
    if (file_exists($file)) {
        require_once $file;
    }
});

/**
 * Helper function to send JSON response
 */
function sendResponse($success, $message, $data = null, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    exit();
}

/**
 * Helper function to validate email
 */
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

/**
 * Helper function to sanitize input
 */
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

/**
 * Helper function to generate OTP
 */
function generateOTP() {
    return str_pad(mt_rand(0, 999999), OTP_LENGTH, '0', STR_PAD_LEFT);
}

/**
 * Check if user is logged in
 */
function isLoggedIn() {
    return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
}

/**
 * Get current user ID
 */
function getCurrentUserId() {
    return $_SESSION['user_id'] ?? null;
}

/**
 * Get current user role
 */
function getCurrentUserRole() {
    return $_SESSION['user_role'] ?? null;
}

/**
 * Check if user has specific role
 */
function hasRole($role) {
    return getCurrentUserRole() === $role;
}

/**
 * Require authentication
 */
function requireAuth() {
    if (!isLoggedIn()) {
        sendResponse(false, 'Authentication required', null, 401);
    }
}

/**
 * Require specific role
 */
function requireRole($role) {
    requireAuth();
    if (!hasRole($role)) {
        sendResponse(false, 'Insufficient permissions', null, 403);
    }
}
?>
