<?php
/**
 * Backend Configuration File
 * Sowberry Academy - Learning Management System
 */

// Include database connection
require_once '../db.php';

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Timezone
date_default_timezone_set('Asia/Kolkata');

// Site Settings
define('SITE_NAME', 'Sowberry Academy');
define('SITE_EMAIL', 'berries@sowberry.com');
define('SITE_PHONE', '+918825756388');

// File upload settings
define('MAX_FILE_SIZE', 10485760); // 10MB
define('UPLOAD_PATH', __DIR__ . '/../uploads/');
define('ALLOWED_EXTENSIONS', ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'zip']);

/**
 * Send JSON response
 */
function sendResponse($success, $message, $data = null) {
    $response = [
        'success' => $success,
        'message' => $message
    ];
    
    if ($data !== null) {
        $response['data'] = $data;
    }
    
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}

/**
 * Sanitize input
 */
function sanitize($data) {
    global $conn;
    return mysqli_real_escape_string($conn, trim($data));
}

/**
 * Validate email
 */
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

/**
 * Generate unique code
 */
function generateCode($prefix, $length = 6) {
    return $prefix . str_pad(mt_rand(1, pow(10, $length) - 1), $length, '0', STR_PAD_LEFT);
}

/**
 * Check if user is logged in
 */
function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

/**
 * Get user type
 */
function getUserType() {
    return $_SESSION['user_type'] ?? null;
}

/**
 * Require login
 */
function requireLogin() {
    if (!isLoggedIn()) {
        sendResponse(false, 'Please login to continue');
    }
}

/**
 * Check permission
 */
function hasPermission($requiredType) {
    $userType = getUserType();
    if ($userType !== $requiredType && $userType !== 'admin') {
        sendResponse(false, 'You do not have permission to perform this action');
    }
}

/**
 * Upload file
 */
function uploadFile($file, $targetDir = 'general') {
    if (!isset($file) || $file['error'] !== UPLOAD_ERR_OK) {
        return ['success' => false, 'message' => 'File upload error'];
    }
    
    $fileSize = $file['size'];
    $fileName = $file['name'];
    $fileTmp = $file['tmp_name'];
    $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
    
    // Validate file size
    if ($fileSize > MAX_FILE_SIZE) {
        return ['success' => false, 'message' => 'File size exceeds limit'];
    }
    
    // Validate file extension
    if (!in_array($fileExt, ALLOWED_EXTENSIONS)) {
        return ['success' => false, 'message' => 'File type not allowed'];
    }
    
    // Create upload directory if not exists
    $uploadDir = UPLOAD_PATH . $targetDir . '/';
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }
    
    // Generate unique filename
    $newFileName = uniqid() . '_' . time() . '.' . $fileExt;
    $destination = $uploadDir . $newFileName;
    
    if (move_uploaded_file($fileTmp, $destination)) {
        return [
            'success' => true,
            'filename' => $newFileName,
            'path' => 'uploads/' . $targetDir . '/' . $newFileName
        ];
    }
    
    return ['success' => false, 'message' => 'Failed to upload file'];
}

?>
