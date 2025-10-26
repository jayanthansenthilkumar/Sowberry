<?php
/**
 * Student Management Handler
 * CRUD operations for students
 */

require_once 'config.php';

header('Content-Type: application/json');

$action = $_POST['action'] ?? $_GET['action'] ?? '';

switch ($action) {
    case 'get_all':
        getAllStudents();
        break;
    
    case 'get_one':
        getStudent();
        break;
    
    case 'create':
        createStudent();
        break;
    
    case 'update':
        updateStudent();
        break;
    
    case 'delete':
        deleteStudent();
        break;
    
    case 'get_progress':
        getStudentProgress();
        break;
    
    case 'update_status':
        updateStudentStatus();
        break;
    
    default:
        sendResponse(false, 'Invalid action');
}

/**
 * Get all students
 */
function getAllStudents() {
    global $conn;
    
    $search = sanitize($_GET['search'] ?? '');
    $status = sanitize($_GET['status'] ?? '');
    $limit = intval($_GET['limit'] ?? 50);
    $offset = intval($_GET['offset'] ?? 0);
    
    $whereClause = "WHERE 1=1";
    
    if ($search) {
        $whereClause .= " AND (u.full_name LIKE '%$search%' OR u.email LIKE '%$search%' OR s.student_code LIKE '%$search%')";
    }
    
    if ($status) {
        $whereClause .= " AND u.status = '$status'";
    }
    
    $query = "SELECT 
                s.student_id,
                s.student_code,
                u.user_id,
                u.full_name,
                u.email,
                u.phone,
                u.profile_image,
                u.status,
                s.enrollment_date,
                s.academic_level,
                s.gpa,
                s.total_credits,
                s.learning_hours,
                s.current_streak,
                COUNT(DISTINCT ce.course_id) as enrolled_courses,
                COUNT(DISTINCT CASE WHEN ce.status = 'completed' THEN ce.course_id END) as completed_courses,
                AVG(ce.progress_percentage) as avg_progress
              FROM students s
              JOIN users u ON s.user_id = u.user_id
              LEFT JOIN course_enrollments ce ON s.student_id = ce.student_id
              $whereClause
              GROUP BY s.student_id
              ORDER BY s.student_id DESC
              LIMIT $limit OFFSET $offset";
    
    $result = mysqli_query($conn, $query);
    $students = [];
    
    while ($row = mysqli_fetch_assoc($result)) {
        $students[] = $row;
    }
    
    // Get total count
    $countQuery = "SELECT COUNT(DISTINCT s.student_id) as total 
                   FROM students s 
                   JOIN users u ON s.user_id = u.user_id 
                   $whereClause";
    $countResult = mysqli_query($conn, $countQuery);
    $total = mysqli_fetch_assoc($countResult)['total'];
    
    sendResponse(true, 'Students retrieved successfully', [
        'students' => $students,
        'total' => $total,
        'limit' => $limit,
        'offset' => $offset
    ]);
}

/**
 * Get single student
 */
function getStudent() {
    global $conn;
    
    $student_id = intval($_GET['id'] ?? 0);
    
    if (!$student_id) {
        sendResponse(false, 'Student ID required');
    }
    
    $query = "SELECT 
                s.*,
                u.*,
                up.*
              FROM students s
              JOIN users u ON s.user_id = u.user_id
              LEFT JOIN user_profiles up ON u.user_id = up.user_id
              WHERE s.student_id = $student_id";
    
    $result = mysqli_query($conn, $query);
    
    if ($student = mysqli_fetch_assoc($result)) {
        sendResponse(true, 'Student retrieved successfully', ['student' => $student]);
    } else {
        sendResponse(false, 'Student not found');
    }
}

/**
 * Create new student
 */
function createStudent() {
    global $conn;
    
    requireLogin();
    hasPermission('admin');
    
    $full_name = sanitize($_POST['full_name'] ?? '');
    $email = sanitize($_POST['email'] ?? '');
    $phone = sanitize($_POST['phone'] ?? '');
    $password = sanitize($_POST['password'] ?? 'student123');
    $academic_level = sanitize($_POST['academic_level'] ?? 'beginner');
    
    // Validation
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
        // Generate username from email
        $username = explode('@', $email)[0] . rand(100, 999);
        
        // Insert user
        $insertUser = "INSERT INTO users (email, username, password, full_name, phone, user_type, status) 
                      VALUES ('$email', '$username', '$password', '$full_name', '$phone', 'student', 'active')";
        mysqli_query($conn, $insertUser);
        $user_id = mysqli_insert_id($conn);
        
        // Create profile
        mysqli_query($conn, "INSERT INTO user_profiles (user_id) VALUES ($user_id)");
        
        // Create student record
        $student_code = generateCode('STU');
        $insertStudent = "INSERT INTO students (user_id, student_code, enrollment_date, academic_level) 
                         VALUES ($user_id, '$student_code', CURDATE(), '$academic_level')";
        mysqli_query($conn, $insertStudent);
        $student_id = mysqli_insert_id($conn);
        
        mysqli_commit($conn);
        
        sendResponse(true, 'Student created successfully', [
            'student_id' => $student_id,
            'student_code' => $student_code
        ]);
        
    } catch (Exception $e) {
        mysqli_rollback($conn);
        sendResponse(false, 'Failed to create student: ' . $e->getMessage());
    }
}

/**
 * Update student
 */
function updateStudent() {
    global $conn;
    
    requireLogin();
    hasPermission('admin');
    
    $student_id = intval($_POST['student_id'] ?? 0);
    $full_name = sanitize($_POST['full_name'] ?? '');
    $email = sanitize($_POST['email'] ?? '');
    $phone = sanitize($_POST['phone'] ?? '');
    $academic_level = sanitize($_POST['academic_level'] ?? '');
    
    if (!$student_id) {
        sendResponse(false, 'Student ID required');
    }
    
    // Get user_id
    $getUserQuery = "SELECT user_id FROM students WHERE student_id = $student_id";
    $userResult = mysqli_query($conn, $getUserQuery);
    $userData = mysqli_fetch_assoc($userResult);
    
    if (!$userData) {
        sendResponse(false, 'Student not found');
    }
    
    $user_id = $userData['user_id'];
    
    mysqli_begin_transaction($conn);
    
    try {
        // Update user
        if ($full_name || $email || $phone) {
            $updates = [];
            if ($full_name) $updates[] = "full_name = '$full_name'";
            if ($email) $updates[] = "email = '$email'";
            if ($phone) $updates[] = "phone = '$phone'";
            
            $updateUser = "UPDATE users SET " . implode(', ', $updates) . " WHERE user_id = $user_id";
            mysqli_query($conn, $updateUser);
        }
        
        // Update student
        if ($academic_level) {
            mysqli_query($conn, "UPDATE students SET academic_level = '$academic_level' WHERE student_id = $student_id");
        }
        
        mysqli_commit($conn);
        sendResponse(true, 'Student updated successfully');
        
    } catch (Exception $e) {
        mysqli_rollback($conn);
        sendResponse(false, 'Failed to update student: ' . $e->getMessage());
    }
}

/**
 * Delete student
 */
function deleteStudent() {
    global $conn;
    
    requireLogin();
    hasPermission('admin');
    
    $student_id = intval($_POST['student_id'] ?? 0);
    
    if (!$student_id) {
        sendResponse(false, 'Student ID required');
    }
    
    // Get user_id
    $getUserQuery = "SELECT user_id FROM students WHERE student_id = $student_id";
    $result = mysqli_query($conn, $getUserQuery);
    $student = mysqli_fetch_assoc($result);
    
    if (!$student) {
        sendResponse(false, 'Student not found');
    }
    
    // Delete user (will cascade to students table)
    $deleteQuery = "DELETE FROM users WHERE user_id = {$student['user_id']}";
    
    if (mysqli_query($conn, $deleteQuery)) {
        sendResponse(true, 'Student deleted successfully');
    } else {
        sendResponse(false, 'Failed to delete student');
    }
}

/**
 * Get student progress
 */
function getStudentProgress() {
    global $conn;
    
    $student_id = intval($_GET['id'] ?? 0);
    
    if (!$student_id) {
        sendResponse(false, 'Student ID required');
    }
    
    $query = "SELECT 
                ce.course_id,
                c.course_name,
                c.course_code,
                ce.enrollment_date,
                ce.progress_percentage,
                ce.status,
                ce.final_grade,
                COUNT(DISTINCT lp.lesson_id) as total_lessons,
                COUNT(DISTINCT CASE WHEN lp.status = 'completed' THEN lp.lesson_id END) as completed_lessons
              FROM course_enrollments ce
              JOIN courses c ON ce.course_id = c.course_id
              LEFT JOIN lesson_progress lp ON ce.enrollment_id = lp.enrollment_id
              WHERE ce.student_id = $student_id
              GROUP BY ce.enrollment_id
              ORDER BY ce.enrollment_date DESC";
    
    $result = mysqli_query($conn, $query);
    $courses = [];
    
    while ($row = mysqli_fetch_assoc($result)) {
        $courses[] = $row;
    }
    
    sendResponse(true, 'Progress retrieved successfully', ['courses' => $courses]);
}

/**
 * Update student status
 */
function updateStudentStatus() {
    global $conn;
    
    requireLogin();
    hasPermission('admin');
    
    $student_id = intval($_POST['student_id'] ?? 0);
    $status = sanitize($_POST['status'] ?? '');
    
    if (!$student_id || !in_array($status, ['active', 'inactive', 'suspended'])) {
        sendResponse(false, 'Invalid parameters');
    }
    
    // Get user_id
    $getUserQuery = "SELECT user_id FROM students WHERE student_id = $student_id";
    $result = mysqli_query($conn, $getUserQuery);
    $student = mysqli_fetch_assoc($result);
    
    if (!$student) {
        sendResponse(false, 'Student not found');
    }
    
    $updateQuery = "UPDATE users SET status = '$status' WHERE user_id = {$student['user_id']}";
    
    if (mysqli_query($conn, $updateQuery)) {
        sendResponse(true, 'Student status updated successfully');
    } else {
        sendResponse(false, 'Failed to update status');
    }
}

?>
