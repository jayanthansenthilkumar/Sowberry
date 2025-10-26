<?php
/**
 * Admin API
 * Handles all admin-related operations
 */

require_once '../config/config.php';
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

if ($db === null) {
    sendResponse(false, 'Database connection failed', null, 500);
}

requireAuth();
requireRole('admin');

$method = $_SERVER['REQUEST_METHOD'];
$request = $_GET['action'] ?? '';

switch ($request) {
    case 'dashboard':
        if ($method === 'GET') getDashboard($db);
        break;
    
    case 'all-users':
        if ($method === 'GET') getAllUsers($db);
        break;
    
    case 'students':
        if ($method === 'GET') getStudents($db);
        break;
    
    case 'create-student':
        if ($method === 'POST') createStudent($db);
        break;
    
    case 'update-student':
        if ($method === 'PUT') updateStudent($db);
        break;
    
    case 'delete-student':
        if ($method === 'DELETE') deleteStudent($db);
        break;
    
    case 'mentors':
        if ($method === 'GET') getMentors($db);
        break;
    
    case 'create-mentor':
        if ($method === 'POST') createMentor($db);
        break;
    
    case 'update-mentor':
        if ($method === 'PUT') updateMentor($db);
        break;
    
    case 'delete-mentor':
        if ($method === 'DELETE') deleteMentor($db);
        break;
    
    case 'all-courses':
        if ($method === 'GET') getAllCourses($db);
        break;
    
    case 'delete-course':
        if ($method === 'DELETE') deleteCourse($db);
        break;
    
    case 'analytics':
        if ($method === 'GET') getAnalytics($db);
        break;
    
    case 'generate-report':
        if ($method === 'POST') generateReport($db);
        break;
    
    case 'reports':
        if ($method === 'GET') getReports($db);
        break;
    
    case 'update-user-status':
        if ($method === 'PUT') updateUserStatus($db);
        break;
    
    case 'contact-submissions':
        if ($method === 'GET') getContactSubmissions($db);
        break;
    
    case 'respond-contact':
        if ($method === 'POST') respondToContact($db);
        break;
    
    default:
        sendResponse(false, 'Invalid action', null, 400);
}

/**
 * Get admin dashboard data
 */
function getDashboard($db) {
    try {
        // Total users
        $usersQuery = "SELECT user_role, COUNT(*) as count FROM users WHERE status = 'active' GROUP BY user_role";
        $usersStmt = $db->prepare($usersQuery);
        $usersStmt->execute();
        $userStats = $usersStmt->fetchAll();
        
        // Total courses
        $coursesQuery = "SELECT COUNT(*) as total, status FROM courses GROUP BY status";
        $coursesStmt = $db->prepare($coursesQuery);
        $coursesStmt->execute();
        $courseStats = $coursesStmt->fetchAll();
        
        // Enrollment trends
        $enrollmentQuery = "SELECT DATE_FORMAT(enrollment_date, '%Y-%m') as month, COUNT(*) as count 
                           FROM enrollments 
                           WHERE enrollment_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
                           GROUP BY month ORDER BY month ASC";
        $enrollmentStmt = $db->prepare($enrollmentQuery);
        $enrollmentStmt->execute();
        $enrollmentTrends = $enrollmentStmt->fetchAll();
        
        // Recent activities
        $activitiesQuery = "SELECT 'user' as type, full_name as name, created_at as timestamp 
                           FROM users 
                           ORDER BY created_at DESC LIMIT 10";
        $activitiesStmt = $db->prepare($activitiesQuery);
        $activitiesStmt->execute();
        $activities = $activitiesStmt->fetchAll();
        
        sendResponse(true, 'Dashboard data retrieved', [
            'user_stats' => $userStats,
            'course_stats' => $courseStats,
            'enrollment_trends' => $enrollmentTrends,
            'recent_activities' => $activities
        ]);
    } catch (PDOException $e) {
        error_log("Admin Dashboard Error: " . $e->getMessage());
        sendResponse(false, 'Error retrieving dashboard data', null, 500);
    }
}

/**
 * Get all users
 */
function getAllUsers($db) {
    try {
        $query = "SELECT user_id, email, username, full_name, phone, user_role, status, last_login, created_at 
                  FROM users 
                  ORDER BY created_at DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $users = $stmt->fetchAll();
        
        sendResponse(true, 'Users retrieved', $users);
    } catch (PDOException $e) {
        error_log("Get All Users Error: " . $e->getMessage());
        sendResponse(false, 'Error retrieving users', null, 500);
    }
}

/**
 * Get all students
 */
function getStudents($db) {
    try {
        $query = "SELECT s.*, u.email, u.username, u.full_name, u.phone, u.status, u.created_at 
                  FROM students s
                  JOIN users u ON s.user_id = u.user_id
                  ORDER BY u.created_at DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $students = $stmt->fetchAll();
        
        sendResponse(true, 'Students retrieved', $students);
    } catch (PDOException $e) {
        error_log("Get Students Error: " . $e->getMessage());
        sendResponse(false, 'Error retrieving students', null, 500);
    }
}

/**
 * Create student
 */
function createStudent($db) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $email = sanitizeInput($data['email'] ?? '');
    $username = sanitizeInput($data['username'] ?? '');
    $password = $data['password'] ?? '';
    $fullName = sanitizeInput($data['full_name'] ?? '');
    $phone = sanitizeInput($data['phone'] ?? '');
    
    if (empty($email) || empty($username) || empty($password) || empty($fullName)) {
        sendResponse(false, 'All fields are required', null, 400);
    }
    
    try {
        $db->beginTransaction();
        
        // Insert user
        $userQuery = "INSERT INTO users (email, username, password, full_name, phone, user_role, status, email_verified) 
                     VALUES (:email, :username, :password, :full_name, :phone, 'student', 'active', TRUE)";
        $userStmt = $db->prepare($userQuery);
        $userStmt->bindParam(':email', $email);
        $userStmt->bindParam(':username', $username);
        $userStmt->bindParam(':password', $password);
        $userStmt->bindParam(':full_name', $fullName);
        $userStmt->bindParam(':phone', $phone);
        $userStmt->execute();
        
        $userId = $db->lastInsertId();
        
        // Insert student
        $studentQuery = "INSERT INTO students (user_id, enrollment_date) VALUES (:user_id, CURDATE())";
        $studentStmt = $db->prepare($studentQuery);
        $studentStmt->bindParam(':user_id', $userId);
        $studentStmt->execute();
        
        $db->commit();
        
        sendResponse(true, 'Student created successfully', ['user_id' => $userId], 201);
    } catch (PDOException $e) {
        $db->rollBack();
        error_log("Create Student Error: " . $e->getMessage());
        if ($e->getCode() == 23000) {
            sendResponse(false, 'Email or username already exists', null, 409);
        }
        sendResponse(false, 'Error creating student', null, 500);
    }
}

/**
 * Update student
 */
function updateStudent($db) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $userId = $data['user_id'] ?? 0;
    $fullName = sanitizeInput($data['full_name'] ?? '');
    $phone = sanitizeInput($data['phone'] ?? '');
    
    if (empty($userId)) {
        sendResponse(false, 'User ID is required', null, 400);
    }
    
    try {
        $query = "UPDATE users SET full_name = :full_name, phone = :phone WHERE user_id = :user_id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':full_name', $fullName);
        $stmt->bindParam(':phone', $phone);
        $stmt->bindParam(':user_id', $userId);
        $stmt->execute();
        
        sendResponse(true, 'Student updated successfully');
    } catch (PDOException $e) {
        error_log("Update Student Error: " . $e->getMessage());
        sendResponse(false, 'Error updating student', null, 500);
    }
}

/**
 * Delete student
 */
function deleteStudent($db) {
    $userId = $_GET['user_id'] ?? 0;
    
    if (empty($userId)) {
        sendResponse(false, 'User ID is required', null, 400);
    }
    
    try {
        $query = "DELETE FROM users WHERE user_id = :user_id AND user_role = 'student'";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            sendResponse(true, 'Student deleted successfully');
        } else {
            sendResponse(false, 'Student not found', null, 404);
        }
    } catch (PDOException $e) {
        error_log("Delete Student Error: " . $e->getMessage());
        sendResponse(false, 'Error deleting student', null, 500);
    }
}

/**
 * Get all mentors
 */
function getMentors($db) {
    try {
        $query = "SELECT m.*, u.email, u.username, u.full_name, u.phone, u.status, u.created_at 
                  FROM mentors m
                  JOIN users u ON m.user_id = u.user_id
                  ORDER BY m.rating DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $mentors = $stmt->fetchAll();
        
        sendResponse(true, 'Mentors retrieved', $mentors);
    } catch (PDOException $e) {
        error_log("Get Mentors Error: " . $e->getMessage());
        sendResponse(false, 'Error retrieving mentors', null, 500);
    }
}

/**
 * Create mentor
 */
function createMentor($db) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $email = sanitizeInput($data['email'] ?? '');
    $username = sanitizeInput($data['username'] ?? '');
    $password = $data['password'] ?? '';
    $fullName = sanitizeInput($data['full_name'] ?? '');
    $phone = sanitizeInput($data['phone'] ?? '');
    $specialization = sanitizeInput($data['specialization'] ?? '');
    $experience = $data['experience_years'] ?? 0;
    
    if (empty($email) || empty($username) || empty($password) || empty($fullName)) {
        sendResponse(false, 'All fields are required', null, 400);
    }
    
    try {
        $db->beginTransaction();
        
        // Insert user
        $userQuery = "INSERT INTO users (email, username, password, full_name, phone, user_role, status, email_verified) 
                     VALUES (:email, :username, :password, :full_name, :phone, 'mentor', 'active', TRUE)";
        $userStmt = $db->prepare($userQuery);
        $userStmt->bindParam(':email', $email);
        $userStmt->bindParam(':username', $username);
        $userStmt->bindParam(':password', $password);
        $userStmt->bindParam(':full_name', $fullName);
        $userStmt->bindParam(':phone', $phone);
        $userStmt->execute();
        
        $userId = $db->lastInsertId();
        
        // Insert mentor
        $mentorQuery = "INSERT INTO mentors (user_id, specialization, experience_years) 
                       VALUES (:user_id, :specialization, :experience_years)";
        $mentorStmt = $db->prepare($mentorQuery);
        $mentorStmt->bindParam(':user_id', $userId);
        $mentorStmt->bindParam(':specialization', $specialization);
        $mentorStmt->bindParam(':experience_years', $experience);
        $mentorStmt->execute();
        
        $db->commit();
        
        sendResponse(true, 'Mentor created successfully', ['user_id' => $userId], 201);
    } catch (PDOException $e) {
        $db->rollBack();
        error_log("Create Mentor Error: " . $e->getMessage());
        if ($e->getCode() == 23000) {
            sendResponse(false, 'Email or username already exists', null, 409);
        }
        sendResponse(false, 'Error creating mentor', null, 500);
    }
}

/**
 * Update mentor
 */
function updateMentor($db) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $userId = $data['user_id'] ?? 0;
    $fullName = sanitizeInput($data['full_name'] ?? '');
    $specialization = sanitizeInput($data['specialization'] ?? '');
    
    if (empty($userId)) {
        sendResponse(false, 'User ID is required', null, 400);
    }
    
    try {
        $db->beginTransaction();
        
        $userQuery = "UPDATE users SET full_name = :full_name WHERE user_id = :user_id";
        $userStmt = $db->prepare($userQuery);
        $userStmt->bindParam(':full_name', $fullName);
        $userStmt->bindParam(':user_id', $userId);
        $userStmt->execute();
        
        $mentorQuery = "UPDATE mentors SET specialization = :specialization WHERE user_id = :user_id";
        $mentorStmt = $db->prepare($mentorQuery);
        $mentorStmt->bindParam(':specialization', $specialization);
        $mentorStmt->bindParam(':user_id', $userId);
        $mentorStmt->execute();
        
        $db->commit();
        
        sendResponse(true, 'Mentor updated successfully');
    } catch (PDOException $e) {
        $db->rollBack();
        error_log("Update Mentor Error: " . $e->getMessage());
        sendResponse(false, 'Error updating mentor', null, 500);
    }
}

/**
 * Delete mentor
 */
function deleteMentor($db) {
    $userId = $_GET['user_id'] ?? 0;
    
    if (empty($userId)) {
        sendResponse(false, 'User ID is required', null, 400);
    }
    
    try {
        $query = "DELETE FROM users WHERE user_id = :user_id AND user_role = 'mentor'";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            sendResponse(true, 'Mentor deleted successfully');
        } else {
            sendResponse(false, 'Mentor not found', null, 404);
        }
    } catch (PDOException $e) {
        error_log("Delete Mentor Error: " . $e->getMessage());
        sendResponse(false, 'Error deleting mentor', null, 500);
    }
}

/**
 * Get all courses
 */
function getAllCourses($db) {
    try {
        $query = "SELECT c.*, u.full_name as mentor_name 
                  FROM courses c
                  LEFT JOIN mentors m ON c.mentor_id = m.mentor_id
                  LEFT JOIN users u ON m.user_id = u.user_id
                  ORDER BY c.created_at DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $courses = $stmt->fetchAll();
        
        sendResponse(true, 'Courses retrieved', $courses);
    } catch (PDOException $e) {
        error_log("Get All Courses Error: " . $e->getMessage());
        sendResponse(false, 'Error retrieving courses', null, 500);
    }
}

/**
 * Delete course
 */
function deleteCourse($db) {
    $courseId = $_GET['course_id'] ?? 0;
    
    if (empty($courseId)) {
        sendResponse(false, 'Course ID is required', null, 400);
    }
    
    try {
        $query = "DELETE FROM courses WHERE course_id = :course_id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':course_id', $courseId);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            sendResponse(true, 'Course deleted successfully');
        } else {
            sendResponse(false, 'Course not found', null, 404);
        }
    } catch (PDOException $e) {
        error_log("Delete Course Error: " . $e->getMessage());
        sendResponse(false, 'Error deleting course', null, 500);
    }
}

/**
 * Get analytics data
 */
function getAnalytics($db) {
    try {
        // Student enrollment trends
        $enrollmentQuery = "SELECT DATE_FORMAT(enrollment_date, '%Y-%m') as month, COUNT(*) as count 
                           FROM enrollments 
                           WHERE enrollment_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
                           GROUP BY month ORDER BY month ASC";
        $enrollmentStmt = $db->prepare($enrollmentQuery);
        $enrollmentStmt->execute();
        $enrollmentData = $enrollmentStmt->fetchAll();
        
        // Course completion rates
        $completionQuery = "SELECT c.course_name, 
                                  COUNT(CASE WHEN e.completion_status = 'completed' THEN 1 END) * 100.0 / COUNT(*) as completion_rate
                           FROM courses c
                           LEFT JOIN enrollments e ON c.course_id = e.course_id
                           GROUP BY c.course_id, c.course_name
                           ORDER BY completion_rate DESC
                           LIMIT 10";
        $completionStmt = $db->prepare($completionQuery);
        $completionStmt->execute();
        $completionData = $completionStmt->fetchAll();
        
        // Top performing students
        $studentsQuery = "SELECT u.full_name, s.total_study_hours, s.total_certificates 
                         FROM students s
                         JOIN users u ON s.user_id = u.user_id
                         ORDER BY s.total_study_hours DESC
                         LIMIT 10";
        $studentsStmt = $db->prepare($studentsQuery);
        $studentsStmt->execute();
        $topStudents = $studentsStmt->fetchAll();
        
        sendResponse(true, 'Analytics data retrieved', [
            'enrollment_trends' => $enrollmentData,
            'completion_rates' => $completionData,
            'top_students' => $topStudents
        ]);
    } catch (PDOException $e) {
        error_log("Get Analytics Error: " . $e->getMessage());
        sendResponse(false, 'Error retrieving analytics', null, 500);
    }
}

/**
 * Generate system report
 */
function generateReport($db) {
    $adminId = $_SESSION['admin_id'];
    $data = json_decode(file_get_contents("php://input"), true);
    
    $reportType = $data['report_type'] ?? '';
    $reportTitle = sanitizeInput($data['report_title'] ?? '');
    
    if (empty($reportType) || empty($reportTitle)) {
        sendResponse(false, 'Report type and title are required', null, 400);
    }
    
    try {
        // Generate report data based on type
        $reportData = [];
        
        switch ($reportType) {
            case 'enrollment':
                $query = "SELECT * FROM enrollments ORDER BY enrollment_date DESC LIMIT 100";
                break;
            case 'performance':
                $query = "SELECT * FROM grades ORDER BY graded_date DESC LIMIT 100";
                break;
            case 'activity':
                $query = "SELECT * FROM student_activity ORDER BY activity_date DESC LIMIT 100";
                break;
            default:
                $query = "SELECT * FROM users LIMIT 100";
        }
        
        $stmt = $db->prepare($query);
        $stmt->execute();
        $reportData = $stmt->fetchAll();
        
        // Save report
        $insertQuery = "INSERT INTO system_reports (report_type, report_title, report_data, generated_by) 
                       VALUES (:report_type, :report_title, :report_data, :generated_by)";
        $insertStmt = $db->prepare($insertQuery);
        $insertStmt->bindParam(':report_type', $reportType);
        $insertStmt->bindParam(':report_title', $reportTitle);
        $reportDataJson = json_encode($reportData);
        $insertStmt->bindParam(':report_data', $reportDataJson);
        $insertStmt->bindParam(':generated_by', $adminId);
        $insertStmt->execute();
        
        sendResponse(true, 'Report generated successfully', [
            'report_id' => $db->lastInsertId(),
            'data' => $reportData
        ], 201);
    } catch (PDOException $e) {
        error_log("Generate Report Error: " . $e->getMessage());
        sendResponse(false, 'Error generating report', null, 500);
    }
}

/**
 * Get saved reports
 */
function getReports($db) {
    try {
        $query = "SELECT r.*, u.full_name as generated_by_name 
                  FROM system_reports r
                  LEFT JOIN admins a ON r.generated_by = a.admin_id
                  LEFT JOIN users u ON a.user_id = u.user_id
                  ORDER BY r.generated_at DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $reports = $stmt->fetchAll();
        
        sendResponse(true, 'Reports retrieved', $reports);
    } catch (PDOException $e) {
        error_log("Get Reports Error: " . $e->getMessage());
        sendResponse(false, 'Error retrieving reports', null, 500);
    }
}

/**
 * Update user status
 */
function updateUserStatus($db) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $userId = $data['user_id'] ?? 0;
    $status = $data['status'] ?? 'active';
    
    if (empty($userId)) {
        sendResponse(false, 'User ID is required', null, 400);
    }
    
    try {
        $query = "UPDATE users SET status = :status WHERE user_id = :user_id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':user_id', $userId);
        $stmt->execute();
        
        sendResponse(true, 'User status updated successfully');
    } catch (PDOException $e) {
        error_log("Update User Status Error: " . $e->getMessage());
        sendResponse(false, 'Error updating user status', null, 500);
    }
}

/**
 * Get contact form submissions
 */
function getContactSubmissions($db) {
    try {
        $query = "SELECT * FROM contact_submissions ORDER BY submitted_at DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $submissions = $stmt->fetchAll();
        
        sendResponse(true, 'Contact submissions retrieved', $submissions);
    } catch (PDOException $e) {
        error_log("Get Contact Submissions Error: " . $e->getMessage());
        sendResponse(false, 'Error retrieving contact submissions', null, 500);
    }
}

/**
 * Respond to contact submission
 */
function respondToContact($db) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $contactId = $data['contact_id'] ?? 0;
    $responseText = sanitizeInput($data['response_text'] ?? '');
    
    if (empty($contactId) || empty($responseText)) {
        sendResponse(false, 'Contact ID and response text are required', null, 400);
    }
    
    try {
        $query = "UPDATE contact_submissions 
                  SET status = 'resolved', response_text = :response_text, responded_at = NOW() 
                  WHERE contact_id = :contact_id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':response_text', $responseText);
        $stmt->bindParam(':contact_id', $contactId);
        $stmt->execute();
        
        sendResponse(true, 'Response sent successfully');
    } catch (PDOException $e) {
        error_log("Respond to Contact Error: " . $e->getMessage());
        sendResponse(false, 'Error sending response', null, 500);
    }
}
?>
