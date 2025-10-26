<?php
/**
 * Mentor Management Handler
 * CRUD operations for mentors
 */

require_once 'config.php';

header('Content-Type: application/json');

$action = $_POST['action'] ?? $_GET['action'] ?? '';

switch ($action) {
    case 'get_all':
        getAllMentors();
        break;
    
    case 'get_one':
        getMentor();
        break;
    
    case 'create':
        createMentor();
        break;
    
    case 'update':
        updateMentor();
        break;
    
    case 'delete':
        deleteMentor();
        break;
    
    case 'get_stats':
        getMentorStats();
        break;
    
    default:
        sendResponse(false, 'Invalid action');
}

/**
 * Get all mentors
 */
function getAllMentors() {
    global $conn;
    
    $search = sanitize($_GET['search'] ?? '');
    $limit = intval($_GET['limit'] ?? 50);
    $offset = intval($_GET['offset'] ?? 0);
    
    $whereClause = "WHERE 1=1";
    
    if ($search) {
        $whereClause .= " AND (u.full_name LIKE '%$search%' OR m.mentor_code LIKE '%$search%')";
    }
    
    $query = "SELECT 
                m.*,
                u.full_name,
                u.email,
                u.phone,
                u.profile_image,
                u.status,
                COUNT(DISTINCT c.course_id) as active_courses,
                COUNT(DISTINCT ce.student_id) as total_students
              FROM mentors m
              JOIN users u ON m.user_id = u.user_id
              LEFT JOIN courses c ON m.mentor_id = c.mentor_id AND c.course_status = 'published'
              LEFT JOIN course_enrollments ce ON c.course_id = ce.course_id
              $whereClause
              GROUP BY m.mentor_id
              ORDER BY m.mentor_id DESC
              LIMIT $limit OFFSET $offset";
    
    $result = mysqli_query($conn, $query);
    $mentors = [];
    
    while ($row = mysqli_fetch_assoc($result)) {
        $mentors[] = $row;
    }
    
    sendResponse(true, 'Mentors retrieved successfully', ['mentors' => $mentors]);
}

/**
 * Get single mentor
 */
function getMentor() {
    global $conn;
    
    $mentor_id = intval($_GET['id'] ?? 0);
    
    if (!$mentor_id) {
        sendResponse(false, 'Mentor ID required');
    }
    
    $query = "SELECT m.*, u.*, up.*
              FROM mentors m
              JOIN users u ON m.user_id = u.user_id
              LEFT JOIN user_profiles up ON u.user_id = up.user_id
              WHERE m.mentor_id = $mentor_id";
    
    $result = mysqli_query($conn, $query);
    
    if ($mentor = mysqli_fetch_assoc($result)) {
        sendResponse(true, 'Mentor retrieved successfully', ['mentor' => $mentor]);
    } else {
        sendResponse(false, 'Mentor not found');
    }
}

/**
 * Create new mentor
 */
function createMentor() {
    global $conn;
    
    requireLogin();
    hasPermission('admin');
    
    $full_name = sanitize($_POST['full_name'] ?? '');
    $email = sanitize($_POST['email'] ?? '');
    $phone = sanitize($_POST['phone'] ?? '');
    $specialization = sanitize($_POST['specialization'] ?? '');
    $years_of_experience = intval($_POST['years_of_experience'] ?? 0);
    $education_qualification = sanitize($_POST['education_qualification'] ?? '');
    $password = sanitize($_POST['password'] ?? 'mentor123');
    
    if (empty($full_name) || empty($email)) {
        sendResponse(false, 'Name and email are required');
    }
    
    if (!isValidEmail($email)) {
        sendResponse(false, 'Invalid email format');
    }
    
    // Check if email exists
    $checkQuery = "SELECT user_id FROM users WHERE email = '$email'";
    if (mysqli_num_rows(mysqli_query($conn, $checkQuery)) > 0) {
        sendResponse(false, 'Email already exists');
    }
    
    mysqli_begin_transaction($conn);
    
    try {
        $username = explode('@', $email)[0] . rand(100, 999);
        
        // Insert user
        $insertUser = "INSERT INTO users (email, username, password, full_name, phone, user_type, status) 
                      VALUES ('$email', '$username', '$password', '$full_name', '$phone', 'mentor', 'active')";
        mysqli_query($conn, $insertUser);
        $user_id = mysqli_insert_id($conn);
        
        // Create profile
        mysqli_query($conn, "INSERT INTO user_profiles (user_id) VALUES ($user_id)");
        
        // Create mentor record
        $mentor_code = generateCode('MEN');
        $insertMentor = "INSERT INTO mentors (
                          user_id, mentor_code, specialization, years_of_experience, 
                          education_qualification, hire_date
                        ) VALUES (
                          $user_id, '$mentor_code', '$specialization', $years_of_experience, 
                          '$education_qualification', CURDATE()
                        )";
        mysqli_query($conn, $insertMentor);
        $mentor_id = mysqli_insert_id($conn);
        
        mysqli_commit($conn);
        
        sendResponse(true, 'Mentor created successfully', [
            'mentor_id' => $mentor_id,
            'mentor_code' => $mentor_code
        ]);
        
    } catch (Exception $e) {
        mysqli_rollback($conn);
        sendResponse(false, 'Failed to create mentor: ' . $e->getMessage());
    }
}

/**
 * Update mentor
 */
function updateMentor() {
    global $conn;
    
    requireLogin();
    hasPermission('admin');
    
    $mentor_id = intval($_POST['mentor_id'] ?? 0);
    
    if (!$mentor_id) {
        sendResponse(false, 'Mentor ID required');
    }
    
    // Get user_id
    $getUserQuery = "SELECT user_id FROM mentors WHERE mentor_id = $mentor_id";
    $userResult = mysqli_query($conn, $getUserQuery);
    $userData = mysqli_fetch_assoc($userResult);
    
    if (!$userData) {
        sendResponse(false, 'Mentor not found');
    }
    
    $user_id = $userData['user_id'];
    
    mysqli_begin_transaction($conn);
    
    try {
        // Update user
        $userUpdates = [];
        if (isset($_POST['full_name'])) {
            $userUpdates[] = "full_name = '" . sanitize($_POST['full_name']) . "'";
        }
        if (isset($_POST['email'])) {
            $userUpdates[] = "email = '" . sanitize($_POST['email']) . "'";
        }
        if (isset($_POST['phone'])) {
            $userUpdates[] = "phone = '" . sanitize($_POST['phone']) . "'";
        }
        
        if (!empty($userUpdates)) {
            $updateUser = "UPDATE users SET " . implode(', ', $userUpdates) . " WHERE user_id = $user_id";
            mysqli_query($conn, $updateUser);
        }
        
        // Update mentor
        $mentorUpdates = [];
        if (isset($_POST['specialization'])) {
            $mentorUpdates[] = "specialization = '" . sanitize($_POST['specialization']) . "'";
        }
        if (isset($_POST['years_of_experience'])) {
            $mentorUpdates[] = "years_of_experience = " . intval($_POST['years_of_experience']);
        }
        if (isset($_POST['education_qualification'])) {
            $mentorUpdates[] = "education_qualification = '" . sanitize($_POST['education_qualification']) . "'";
        }
        
        if (!empty($mentorUpdates)) {
            $updateMentor = "UPDATE mentors SET " . implode(', ', $mentorUpdates) . " WHERE mentor_id = $mentor_id";
            mysqli_query($conn, $updateMentor);
        }
        
        mysqli_commit($conn);
        sendResponse(true, 'Mentor updated successfully');
        
    } catch (Exception $e) {
        mysqli_rollback($conn);
        sendResponse(false, 'Failed to update mentor: ' . $e->getMessage());
    }
}

/**
 * Delete mentor
 */
function deleteMentor() {
    global $conn;
    
    requireLogin();
    hasPermission('admin');
    
    $mentor_id = intval($_POST['mentor_id'] ?? 0);
    
    if (!$mentor_id) {
        sendResponse(false, 'Mentor ID required');
    }
    
    // Get user_id
    $getUserQuery = "SELECT user_id FROM mentors WHERE mentor_id = $mentor_id";
    $result = mysqli_query($conn, $getUserQuery);
    $mentor = mysqli_fetch_assoc($result);
    
    if (!$mentor) {
        sendResponse(false, 'Mentor not found');
    }
    
    // Check if mentor has courses
    $checkQuery = "SELECT COUNT(*) as count FROM courses WHERE mentor_id = $mentor_id";
    $checkResult = mysqli_query($conn, $checkQuery);
    $count = mysqli_fetch_assoc($checkResult)['count'];
    
    if ($count > 0) {
        sendResponse(false, 'Cannot delete mentor with assigned courses');
    }
    
    // Delete user (will cascade to mentors table)
    $deleteQuery = "DELETE FROM users WHERE user_id = {$mentor['user_id']}";
    
    if (mysqli_query($conn, $deleteQuery)) {
        sendResponse(true, 'Mentor deleted successfully');
    } else {
        sendResponse(false, 'Failed to delete mentor');
    }
}

/**
 * Get mentor statistics
 */
function getMentorStats() {
    global $conn;
    
    $mentor_id = intval($_GET['id'] ?? 0);
    
    if (!$mentor_id) {
        sendResponse(false, 'Mentor ID required');
    }
    
    $stats = [];
    
    // Get course stats
    $courseQuery = "SELECT 
                      COUNT(*) as total_courses,
                      AVG(rating) as avg_rating,
                      SUM(total_enrollments) as total_enrollments
                    FROM courses
                    WHERE mentor_id = $mentor_id";
    $courseResult = mysqli_query($conn, $courseQuery);
    $stats['courses'] = mysqli_fetch_assoc($courseResult);
    
    // Get student stats
    $studentQuery = "SELECT COUNT(DISTINCT ce.student_id) as total_students
                     FROM course_enrollments ce
                     JOIN courses c ON ce.course_id = c.course_id
                     WHERE c.mentor_id = $mentor_id";
    $studentResult = mysqli_query($conn, $studentQuery);
    $stats['students'] = mysqli_fetch_assoc($studentResult);
    
    sendResponse(true, 'Statistics retrieved successfully', ['stats' => $stats]);
}

?>
