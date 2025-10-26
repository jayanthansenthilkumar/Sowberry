<?php
/**
 * Common API
 * Handles common operations like notifications, contact form, etc.
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
    case 'contact':
        if ($method === 'POST') submitContactForm($db);
        break;
    
    case 'notifications':
        if ($method === 'GET') {
            requireAuth();
            getNotifications($db);
        }
        break;
    
    case 'mark-notification-read':
        if ($method === 'PUT') {
            requireAuth();
            markNotificationRead($db);
        }
        break;
    
    case 'user-profile':
        if ($method === 'GET') {
            requireAuth();
            getUserProfile($db);
        }
        break;
    
    case 'update-profile':
        if ($method === 'PUT') {
            requireAuth();
            updateProfile($db);
        }
        break;
    
    case 'change-password':
        if ($method === 'POST') {
            requireAuth();
            changePassword($db);
        }
        break;
    
    default:
        sendResponse(false, 'Invalid action', null, 400);
}

/**
 * Submit contact form
 */
function submitContactForm($db) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $name = sanitizeInput($data['name'] ?? '');
    $email = sanitizeInput($data['email'] ?? '');
    $phone = sanitizeInput($data['phone'] ?? '');
    $subject = sanitizeInput($data['subject'] ?? '');
    $message = sanitizeInput($data['message'] ?? '');
    
    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        sendResponse(false, 'All required fields must be filled', null, 400);
    }
    
    if (!validateEmail($email)) {
        sendResponse(false, 'Invalid email address', null, 400);
    }
    
    try {
        $query = "INSERT INTO contact_submissions (name, email, phone, subject, message) 
                  VALUES (:name, :email, :phone, :subject, :message)";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':phone', $phone);
        $stmt->bindParam(':subject', $subject);
        $stmt->bindParam(':message', $message);
        $stmt->execute();
        
        sendResponse(true, 'Thank you for contacting us! We will get back to you soon.', [
            'contact_id' => $db->lastInsertId()
        ], 201);
    } catch (PDOException $e) {
        error_log("Submit Contact Form Error: " . $e->getMessage());
        sendResponse(false, 'Error submitting contact form', null, 500);
    }
}

/**
 * Get user notifications
 */
function getNotifications($db) {
    $userId = getCurrentUserId();
    $limit = $_GET['limit'] ?? 20;
    
    try {
        $query = "SELECT * FROM notifications 
                  WHERE user_id = :user_id 
                  ORDER BY created_at DESC 
                  LIMIT :limit";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        $notifications = $stmt->fetchAll();
        
        // Get unread count
        $countQuery = "SELECT COUNT(*) as unread_count 
                      FROM notifications 
                      WHERE user_id = :user_id AND is_read = FALSE";
        $countStmt = $db->prepare($countQuery);
        $countStmt->bindParam(':user_id', $userId);
        $countStmt->execute();
        $countData = $countStmt->fetch();
        
        sendResponse(true, 'Notifications retrieved', [
            'notifications' => $notifications,
            'unread_count' => $countData['unread_count']
        ]);
    } catch (PDOException $e) {
        error_log("Get Notifications Error: " . $e->getMessage());
        sendResponse(false, 'Error retrieving notifications', null, 500);
    }
}

/**
 * Mark notification as read
 */
function markNotificationRead($db) {
    $userId = getCurrentUserId();
    $data = json_decode(file_get_contents("php://input"), true);
    $notificationId = $data['notification_id'] ?? 0;
    
    try {
        if ($notificationId > 0) {
            // Mark single notification as read
            $query = "UPDATE notifications 
                     SET is_read = TRUE 
                     WHERE notification_id = :notification_id AND user_id = :user_id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':notification_id', $notificationId);
            $stmt->bindParam(':user_id', $userId);
            $stmt->execute();
        } else {
            // Mark all as read
            $query = "UPDATE notifications SET is_read = TRUE WHERE user_id = :user_id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':user_id', $userId);
            $stmt->execute();
        }
        
        sendResponse(true, 'Notification(s) marked as read');
    } catch (PDOException $e) {
        error_log("Mark Notification Read Error: " . $e->getMessage());
        sendResponse(false, 'Error marking notification as read', null, 500);
    }
}

/**
 * Get user profile
 */
function getUserProfile($db) {
    $userId = getCurrentUserId();
    
    try {
        $query = "SELECT u.*, 
                         CASE 
                             WHEN u.user_role = 'student' THEN s.student_id
                             WHEN u.user_role = 'mentor' THEN m.mentor_id
                             WHEN u.user_role = 'admin' THEN a.admin_id
                         END as role_id
                  FROM users u
                  LEFT JOIN students s ON u.user_id = s.user_id
                  LEFT JOIN mentors m ON u.user_id = m.user_id
                  LEFT JOIN admins a ON u.user_id = a.user_id
                  WHERE u.user_id = :user_id";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->execute();
        $user = $stmt->fetch();
        
        if ($user) {
            // Remove password from response
            unset($user['password']);
            sendResponse(true, 'Profile retrieved', $user);
        } else {
            sendResponse(false, 'User not found', null, 404);
        }
    } catch (PDOException $e) {
        error_log("Get User Profile Error: " . $e->getMessage());
        sendResponse(false, 'Error retrieving profile', null, 500);
    }
}

/**
 * Update user profile
 */
function updateProfile($db) {
    $userId = getCurrentUserId();
    $data = json_decode(file_get_contents("php://input"), true);
    
    $fullName = sanitizeInput($data['full_name'] ?? '');
    $phone = sanitizeInput($data['phone'] ?? '');
    $profilePicture = $data['profile_picture'] ?? '';
    
    try {
        $query = "UPDATE users 
                  SET full_name = :full_name, 
                      phone = :phone, 
                      profile_picture = :profile_picture 
                  WHERE user_id = :user_id";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':full_name', $fullName);
        $stmt->bindParam(':phone', $phone);
        $stmt->bindParam(':profile_picture', $profilePicture);
        $stmt->bindParam(':user_id', $userId);
        $stmt->execute();
        
        // Update session
        $_SESSION['full_name'] = $fullName;
        $_SESSION['profile_picture'] = $profilePicture;
        
        sendResponse(true, 'Profile updated successfully');
    } catch (PDOException $e) {
        error_log("Update Profile Error: " . $e->getMessage());
        sendResponse(false, 'Error updating profile', null, 500);
    }
}

/**
 * Change password
 */
function changePassword($db) {
    $userId = getCurrentUserId();
    $data = json_decode(file_get_contents("php://input"), true);
    
    $currentPassword = $data['current_password'] ?? '';
    $newPassword = $data['new_password'] ?? '';
    $confirmPassword = $data['confirm_password'] ?? '';
    
    if (empty($currentPassword) || empty($newPassword) || empty($confirmPassword)) {
        sendResponse(false, 'All password fields are required', null, 400);
    }
    
    if ($newPassword !== $confirmPassword) {
        sendResponse(false, 'New passwords do not match', null, 400);
    }
    
    if (strlen($newPassword) < 6) {
        sendResponse(false, 'New password must be at least 6 characters', null, 400);
    }
    
    try {
        // Verify current password
        $checkQuery = "SELECT password FROM users WHERE user_id = :user_id";
        $checkStmt = $db->prepare($checkQuery);
        $checkStmt->bindParam(':user_id', $userId);
        $checkStmt->execute();
        $user = $checkStmt->fetch();
        
        if ($user['password'] !== $currentPassword) {
            sendResponse(false, 'Current password is incorrect', null, 401);
        }
        
        // Update password
        $updateQuery = "UPDATE users SET password = :password WHERE user_id = :user_id";
        $updateStmt = $db->prepare($updateQuery);
        $updateStmt->bindParam(':password', $newPassword);
        $updateStmt->bindParam(':user_id', $userId);
        $updateStmt->execute();
        
        sendResponse(true, 'Password changed successfully');
    } catch (PDOException $e) {
        error_log("Change Password Error: " . $e->getMessage());
        sendResponse(false, 'Error changing password', null, 500);
    }
}
?>
