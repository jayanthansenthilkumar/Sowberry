<?php
/**
 * Course Management Handler
 * CRUD operations for courses
 */

require_once 'config.php';

header('Content-Type: application/json');

$action = $_POST['action'] ?? $_GET['action'] ?? '';

switch ($action) {
    case 'get_all':
        getAllCourses();
        break;
    
    case 'get_one':
        getCourse();
        break;
    
    case 'create':
        createCourse();
        break;
    
    case 'update':
        updateCourse();
        break;
    
    case 'delete':
        deleteCourse();
        break;
    
    case 'enroll':
        enrollStudent();
        break;
    
    case 'get_enrollments':
        getCourseEnrollments();
        break;
    
    case 'update_status':
        updateCourseStatus();
        break;
    
    default:
        sendResponse(false, 'Invalid action');
}

/**
 * Get all courses
 */
function getAllCourses() {
    global $conn;
    
    $search = sanitize($_GET['search'] ?? '');
    $category = intval($_GET['category'] ?? 0);
    $status = sanitize($_GET['status'] ?? '');
    $difficulty = sanitize($_GET['difficulty'] ?? '');
    $limit = intval($_GET['limit'] ?? 50);
    $offset = intval($_GET['offset'] ?? 0);
    
    $whereClause = "WHERE 1=1";
    
    if ($search) {
        $whereClause .= " AND (c.course_name LIKE '%$search%' OR c.course_code LIKE '%$search%')";
    }
    
    if ($category) {
        $whereClause .= " AND c.category_id = $category";
    }
    
    if ($status) {
        $whereClause .= " AND c.course_status = '$status'";
    }
    
    if ($difficulty) {
        $whereClause .= " AND c.difficulty_level = '$difficulty'";
    }
    
    $query = "SELECT 
                c.*,
                cat.category_name,
                u.full_name as mentor_name,
                m.mentor_code,
                COUNT(DISTINCT ce.student_id) as total_students
              FROM courses c
              LEFT JOIN categories cat ON c.category_id = cat.category_id
              LEFT JOIN mentors m ON c.mentor_id = m.mentor_id
              LEFT JOIN users u ON m.user_id = u.user_id
              LEFT JOIN course_enrollments ce ON c.course_id = ce.course_id
              $whereClause
              GROUP BY c.course_id
              ORDER BY c.created_at DESC
              LIMIT $limit OFFSET $offset";
    
    $result = mysqli_query($conn, $query);
    $courses = [];
    
    while ($row = mysqli_fetch_assoc($result)) {
        $courses[] = $row;
    }
    
    // Get total count
    $countQuery = "SELECT COUNT(*) as total FROM courses c $whereClause";
    $countResult = mysqli_query($conn, $countQuery);
    $total = mysqli_fetch_assoc($countResult)['total'];
    
    sendResponse(true, 'Courses retrieved successfully', [
        'courses' => $courses,
        'total' => $total
    ]);
}

/**
 * Get single course
 */
function getCourse() {
    global $conn;
    
    $course_id = intval($_GET['id'] ?? 0);
    
    if (!$course_id) {
        sendResponse(false, 'Course ID required');
    }
    
    $query = "SELECT 
                c.*,
                cat.category_name,
                u.full_name as mentor_name,
                u.email as mentor_email,
                m.mentor_code
              FROM courses c
              LEFT JOIN categories cat ON c.category_id = cat.category_id
              LEFT JOIN mentors m ON c.mentor_id = m.mentor_id
              LEFT JOIN users u ON m.user_id = u.user_id
              WHERE c.course_id = $course_id";
    
    $result = mysqli_query($conn, $query);
    
    if ($course = mysqli_fetch_assoc($result)) {
        // Get modules
        $modulesQuery = "SELECT * FROM course_modules WHERE course_id = $course_id ORDER BY module_number";
        $modulesResult = mysqli_query($conn, $modulesQuery);
        $modules = [];
        
        while ($module = mysqli_fetch_assoc($modulesResult)) {
            // Get lessons for each module
            $lessonsQuery = "SELECT * FROM course_lessons WHERE module_id = {$module['module_id']} ORDER BY order_index";
            $lessonsResult = mysqli_query($conn, $lessonsQuery);
            $lessons = [];
            
            while ($lesson = mysqli_fetch_assoc($lessonsResult)) {
                $lessons[] = $lesson;
            }
            
            $module['lessons'] = $lessons;
            $modules[] = $module;
        }
        
        $course['modules'] = $modules;
        
        sendResponse(true, 'Course retrieved successfully', ['course' => $course]);
    } else {
        sendResponse(false, 'Course not found');
    }
}

/**
 * Create new course
 */
function createCourse() {
    global $conn;
    
    requireLogin();
    hasPermission('admin');
    
    $course_name = sanitize($_POST['course_name'] ?? '');
    $description = sanitize($_POST['description'] ?? '');
    $category_id = intval($_POST['category_id'] ?? 0);
    $mentor_id = intval($_POST['mentor_id'] ?? 0);
    $difficulty_level = sanitize($_POST['difficulty_level'] ?? 'beginner');
    $duration_hours = intval($_POST['duration_hours'] ?? 0);
    $duration_weeks = intval($_POST['duration_weeks'] ?? 0);
    $credits = intval($_POST['credits'] ?? 0);
    $price = floatval($_POST['price'] ?? 0);
    $prerequisites = sanitize($_POST['prerequisites'] ?? '');
    $learning_outcomes = sanitize($_POST['learning_outcomes'] ?? '');
    
    // Validation
    if (empty($course_name)) {
        sendResponse(false, 'Course name is required');
    }
    
    // Generate course code
    $course_code = generateCode('CRS');
    
    // Handle file uploads
    $thumbnail_url = '';
    if (isset($_FILES['thumbnail'])) {
        $upload = uploadFile($_FILES['thumbnail'], 'courses');
        if ($upload['success']) {
            $thumbnail_url = $upload['path'];
        }
    }
    
    $query = "INSERT INTO courses (
                course_code, course_name, description, category_id, mentor_id,
                difficulty_level, duration_hours, duration_weeks, credits, price,
                thumbnail_url, prerequisites, learning_outcomes, course_status
              ) VALUES (
                '$course_code', '$course_name', '$description', $category_id, 
                " . ($mentor_id ?: 'NULL') . ",
                '$difficulty_level', $duration_hours, $duration_weeks, $credits, $price,
                '$thumbnail_url', '$prerequisites', '$learning_outcomes', 'draft'
              )";
    
    if (mysqli_query($conn, $query)) {
        $course_id = mysqli_insert_id($conn);
        sendResponse(true, 'Course created successfully', [
            'course_id' => $course_id,
            'course_code' => $course_code
        ]);
    } else {
        sendResponse(false, 'Failed to create course: ' . mysqli_error($conn));
    }
}

/**
 * Update course
 */
function updateCourse() {
    global $conn;
    
    requireLogin();
    hasPermission('admin');
    
    $course_id = intval($_POST['course_id'] ?? 0);
    
    if (!$course_id) {
        sendResponse(false, 'Course ID required');
    }
    
    $updates = [];
    
    if (isset($_POST['course_name'])) {
        $updates[] = "course_name = '" . sanitize($_POST['course_name']) . "'";
    }
    if (isset($_POST['description'])) {
        $updates[] = "description = '" . sanitize($_POST['description']) . "'";
    }
    if (isset($_POST['category_id'])) {
        $updates[] = "category_id = " . intval($_POST['category_id']);
    }
    if (isset($_POST['difficulty_level'])) {
        $updates[] = "difficulty_level = '" . sanitize($_POST['difficulty_level']) . "'";
    }
    if (isset($_POST['duration_hours'])) {
        $updates[] = "duration_hours = " . intval($_POST['duration_hours']);
    }
    if (isset($_POST['price'])) {
        $updates[] = "price = " . floatval($_POST['price']);
    }
    
    if (empty($updates)) {
        sendResponse(false, 'No fields to update');
    }
    
    $query = "UPDATE courses SET " . implode(', ', $updates) . " WHERE course_id = $course_id";
    
    if (mysqli_query($conn, $query)) {
        sendResponse(true, 'Course updated successfully');
    } else {
        sendResponse(false, 'Failed to update course');
    }
}

/**
 * Delete course
 */
function deleteCourse() {
    global $conn;
    
    requireLogin();
    hasPermission('admin');
    
    $course_id = intval($_POST['course_id'] ?? 0);
    
    if (!$course_id) {
        sendResponse(false, 'Course ID required');
    }
    
    // Check if course has enrollments
    $checkQuery = "SELECT COUNT(*) as count FROM course_enrollments WHERE course_id = $course_id";
    $result = mysqli_query($conn, $checkQuery);
    $count = mysqli_fetch_assoc($result)['count'];
    
    if ($count > 0) {
        sendResponse(false, 'Cannot delete course with active enrollments. Archive it instead.');
    }
    
    $query = "DELETE FROM courses WHERE course_id = $course_id";
    
    if (mysqli_query($conn, $query)) {
        sendResponse(true, 'Course deleted successfully');
    } else {
        sendResponse(false, 'Failed to delete course');
    }
}

/**
 * Enroll student in course
 */
function enrollStudent() {
    global $conn;
    
    $student_id = intval($_POST['student_id'] ?? 0);
    $course_id = intval($_POST['course_id'] ?? 0);
    
    if (!$student_id || !$course_id) {
        sendResponse(false, 'Student ID and Course ID required');
    }
    
    // Check if already enrolled
    $checkQuery = "SELECT enrollment_id FROM course_enrollments 
                   WHERE student_id = $student_id AND course_id = $course_id";
    
    if (mysqli_num_rows(mysqli_query($conn, $checkQuery)) > 0) {
        sendResponse(false, 'Student already enrolled in this course');
    }
    
    $query = "INSERT INTO course_enrollments (student_id, course_id, status) 
              VALUES ($student_id, $course_id, 'enrolled')";
    
    if (mysqli_query($conn, $query)) {
        // Update course enrollment count
        mysqli_query($conn, "UPDATE courses SET total_enrollments = total_enrollments + 1 WHERE course_id = $course_id");
        
        sendResponse(true, 'Student enrolled successfully', [
            'enrollment_id' => mysqli_insert_id($conn)
        ]);
    } else {
        sendResponse(false, 'Failed to enroll student');
    }
}

/**
 * Get course enrollments
 */
function getCourseEnrollments() {
    global $conn;
    
    $course_id = intval($_GET['course_id'] ?? 0);
    
    if (!$course_id) {
        sendResponse(false, 'Course ID required');
    }
    
    $query = "SELECT 
                ce.*,
                s.student_code,
                u.full_name,
                u.email
              FROM course_enrollments ce
              JOIN students s ON ce.student_id = s.student_id
              JOIN users u ON s.user_id = u.user_id
              WHERE ce.course_id = $course_id
              ORDER BY ce.enrollment_date DESC";
    
    $result = mysqli_query($conn, $query);
    $enrollments = [];
    
    while ($row = mysqli_fetch_assoc($result)) {
        $enrollments[] = $row;
    }
    
    sendResponse(true, 'Enrollments retrieved successfully', ['enrollments' => $enrollments]);
}

/**
 * Update course status
 */
function updateCourseStatus() {
    global $conn;
    
    requireLogin();
    hasPermission('admin');
    
    $course_id = intval($_POST['course_id'] ?? 0);
    $status = sanitize($_POST['status'] ?? '');
    
    if (!$course_id || !in_array($status, ['draft', 'published', 'archived'])) {
        sendResponse(false, 'Invalid parameters');
    }
    
    $updates = "course_status = '$status'";
    
    if ($status === 'published') {
        $updates .= ", published_at = CURRENT_TIMESTAMP";
    }
    
    $query = "UPDATE courses SET $updates WHERE course_id = $course_id";
    
    if (mysqli_query($conn, $query)) {
        sendResponse(true, 'Course status updated successfully');
    } else {
        sendResponse(false, 'Failed to update status');
    }
}

?>
