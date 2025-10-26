<?php
/**
 * Assignment Management Handler
 * CRUD operations for assignments
 */

require_once 'config.php';

header('Content-Type: application/json');

$action = $_POST['action'] ?? $_GET['action'] ?? '';

switch ($action) {
    case 'get_all':
        getAllAssignments();
        break;
    
    case 'get_one':
        getAssignment();
        break;
    
    case 'create':
        createAssignment();
        break;
    
    case 'update':
        updateAssignment();
        break;
    
    case 'delete':
        deleteAssignment();
        break;
    
    case 'submit':
        submitAssignment();
        break;
    
    case 'get_submissions':
        getSubmissions();
        break;
    
    case 'grade':
        gradeSubmission();
        break;
    
    default:
        sendResponse(false, 'Invalid action');
}

/**
 * Get all assignments
 */
function getAllAssignments() {
    global $conn;
    
    $course_id = intval($_GET['course_id'] ?? 0);
    $student_id = intval($_GET['student_id'] ?? 0);
    $type = sanitize($_GET['type'] ?? '');
    
    $whereClause = "WHERE 1=1";
    
    if ($course_id) {
        $whereClause .= " AND a.course_id = $course_id";
    }
    
    if ($type) {
        $whereClause .= " AND a.assignment_type = '$type'";
    }
    
    $query = "SELECT 
                a.*,
                c.course_name,
                c.course_code,
                COUNT(DISTINCT asub.submission_id) as total_submissions,
                COUNT(DISTINCT CASE WHEN asub.status = 'graded' THEN asub.submission_id END) as graded_submissions
              FROM assignments a
              JOIN courses c ON a.course_id = c.course_id
              LEFT JOIN assignment_submissions asub ON a.assignment_id = asub.assignment_id
              $whereClause
              GROUP BY a.assignment_id
              ORDER BY a.due_date DESC";
    
    $result = mysqli_query($conn, $query);
    $assignments = [];
    
    while ($row = mysqli_fetch_assoc($result)) {
        // If student_id provided, get their submission status
        if ($student_id) {
            $subQuery = "SELECT submission_id, status, score, submitted_at 
                        FROM assignment_submissions 
                        WHERE assignment_id = {$row['assignment_id']} AND student_id = $student_id";
            $subResult = mysqli_query($conn, $subQuery);
            $row['my_submission'] = mysqli_fetch_assoc($subResult);
        }
        
        $assignments[] = $row;
    }
    
    sendResponse(true, 'Assignments retrieved successfully', ['assignments' => $assignments]);
}

/**
 * Get single assignment
 */
function getAssignment() {
    global $conn;
    
    $assignment_id = intval($_GET['id'] ?? 0);
    
    if (!$assignment_id) {
        sendResponse(false, 'Assignment ID required');
    }
    
    $query = "SELECT 
                a.*,
                c.course_name,
                c.course_code
              FROM assignments a
              JOIN courses c ON a.course_id = c.course_id
              WHERE a.assignment_id = $assignment_id";
    
    $result = mysqli_query($conn, $query);
    
    if ($assignment = mysqli_fetch_assoc($result)) {
        sendResponse(true, 'Assignment retrieved successfully', ['assignment' => $assignment]);
    } else {
        sendResponse(false, 'Assignment not found');
    }
}

/**
 * Create new assignment
 */
function createAssignment() {
    global $conn;
    
    requireLogin();
    hasPermission('mentor');
    
    $course_id = intval($_POST['course_id'] ?? 0);
    $assignment_title = sanitize($_POST['assignment_title'] ?? '');
    $description = sanitize($_POST['description'] ?? '');
    $assignment_type = sanitize($_POST['assignment_type'] ?? 'homework');
    $max_points = intval($_POST['max_points'] ?? 100);
    $passing_score = intval($_POST['passing_score'] ?? 60);
    $due_date = sanitize($_POST['due_date'] ?? '');
    $instructions = sanitize($_POST['instructions'] ?? '');
    $allow_late = isset($_POST['allow_late_submission']) ? 1 : 0;
    
    // Validation
    if (!$course_id || empty($assignment_title)) {
        sendResponse(false, 'Course ID and title are required');
    }
    
    // Handle file upload
    $attachment_url = '';
    if (isset($_FILES['attachment'])) {
        $upload = uploadFile($_FILES['attachment'], 'assignments');
        if ($upload['success']) {
            $attachment_url = $upload['path'];
        }
    }
    
    $query = "INSERT INTO assignments (
                course_id, assignment_title, description, assignment_type,
                max_points, passing_score, due_date, instructions,
                attachment_url, allow_late_submission
              ) VALUES (
                $course_id, '$assignment_title', '$description', '$assignment_type',
                $max_points, $passing_score, " . ($due_date ? "'$due_date'" : "NULL") . ",
                '$instructions', '$attachment_url', $allow_late
              )";
    
    if (mysqli_query($conn, $query)) {
        sendResponse(true, 'Assignment created successfully', [
            'assignment_id' => mysqli_insert_id($conn)
        ]);
    } else {
        sendResponse(false, 'Failed to create assignment: ' . mysqli_error($conn));
    }
}

/**
 * Update assignment
 */
function updateAssignment() {
    global $conn;
    
    requireLogin();
    hasPermission('mentor');
    
    $assignment_id = intval($_POST['assignment_id'] ?? 0);
    
    if (!$assignment_id) {
        sendResponse(false, 'Assignment ID required');
    }
    
    $updates = [];
    
    if (isset($_POST['assignment_title'])) {
        $updates[] = "assignment_title = '" . sanitize($_POST['assignment_title']) . "'";
    }
    if (isset($_POST['description'])) {
        $updates[] = "description = '" . sanitize($_POST['description']) . "'";
    }
    if (isset($_POST['max_points'])) {
        $updates[] = "max_points = " . intval($_POST['max_points']);
    }
    if (isset($_POST['due_date'])) {
        $updates[] = "due_date = '" . sanitize($_POST['due_date']) . "'";
    }
    
    if (empty($updates)) {
        sendResponse(false, 'No fields to update');
    }
    
    $query = "UPDATE assignments SET " . implode(', ', $updates) . " WHERE assignment_id = $assignment_id";
    
    if (mysqli_query($conn, $query)) {
        sendResponse(true, 'Assignment updated successfully');
    } else {
        sendResponse(false, 'Failed to update assignment');
    }
}

/**
 * Delete assignment
 */
function deleteAssignment() {
    global $conn;
    
    requireLogin();
    hasPermission('mentor');
    
    $assignment_id = intval($_POST['assignment_id'] ?? 0);
    
    if (!$assignment_id) {
        sendResponse(false, 'Assignment ID required');
    }
    
    $query = "DELETE FROM assignments WHERE assignment_id = $assignment_id";
    
    if (mysqli_query($conn, $query)) {
        sendResponse(true, 'Assignment deleted successfully');
    } else {
        sendResponse(false, 'Failed to delete assignment');
    }
}

/**
 * Submit assignment
 */
function submitAssignment() {
    global $conn;
    
    requireLogin();
    
    $assignment_id = intval($_POST['assignment_id'] ?? 0);
    $student_id = intval($_POST['student_id'] ?? $_SESSION['type_id'] ?? 0);
    $submission_text = sanitize($_POST['submission_text'] ?? '');
    
    if (!$assignment_id || !$student_id) {
        sendResponse(false, 'Assignment ID and Student ID required');
    }
    
    // Check if already submitted
    $checkQuery = "SELECT submission_id FROM assignment_submissions 
                   WHERE assignment_id = $assignment_id AND student_id = $student_id";
    
    if (mysqli_num_rows(mysqli_query($conn, $checkQuery)) > 0) {
        sendResponse(false, 'You have already submitted this assignment');
    }
    
    // Check due date
    $assignmentQuery = "SELECT due_date, allow_late_submission FROM assignments WHERE assignment_id = $assignment_id";
    $assignmentResult = mysqli_query($conn, $assignmentQuery);
    $assignment = mysqli_fetch_assoc($assignmentResult);
    
    $status = 'submitted';
    if ($assignment['due_date'] && strtotime($assignment['due_date']) < time()) {
        if ($assignment['allow_late_submission']) {
            $status = 'late';
        } else {
            sendResponse(false, 'Assignment deadline has passed');
        }
    }
    
    // Handle file upload
    $attachment_url = '';
    if (isset($_FILES['attachment'])) {
        $upload = uploadFile($_FILES['attachment'], 'submissions');
        if ($upload['success']) {
            $attachment_url = $upload['path'];
        }
    }
    
    $query = "INSERT INTO assignment_submissions (
                assignment_id, student_id, submission_text, attachment_url, status
              ) VALUES (
                $assignment_id, $student_id, '$submission_text', '$attachment_url', '$status'
              )";
    
    if (mysqli_query($conn, $query)) {
        sendResponse(true, 'Assignment submitted successfully', [
            'submission_id' => mysqli_insert_id($conn)
        ]);
    } else {
        sendResponse(false, 'Failed to submit assignment');
    }
}

/**
 * Get submissions for an assignment
 */
function getSubmissions() {
    global $conn;
    
    $assignment_id = intval($_GET['assignment_id'] ?? 0);
    
    if (!$assignment_id) {
        sendResponse(false, 'Assignment ID required');
    }
    
    $query = "SELECT 
                asub.*,
                s.student_code,
                u.full_name as student_name,
                u.email as student_email,
                m.full_name as grader_name
              FROM assignment_submissions asub
              JOIN students st ON asub.student_id = st.student_id
              JOIN users u ON st.user_id = u.user_id
              LEFT JOIN mentors men ON asub.graded_by = men.mentor_id
              LEFT JOIN users m ON men.user_id = m.user_id
              WHERE asub.assignment_id = $assignment_id
              ORDER BY asub.submitted_at DESC";
    
    $result = mysqli_query($conn, $query);
    $submissions = [];
    
    while ($row = mysqli_fetch_assoc($result)) {
        $submissions[] = $row;
    }
    
    sendResponse(true, 'Submissions retrieved successfully', ['submissions' => $submissions]);
}

/**
 * Grade submission
 */
function gradeSubmission() {
    global $conn;
    
    requireLogin();
    hasPermission('mentor');
    
    $submission_id = intval($_POST['submission_id'] ?? 0);
    $score = floatval($_POST['score'] ?? 0);
    $feedback = sanitize($_POST['feedback'] ?? '');
    $graded_by = intval($_SESSION['type_id'] ?? 0);
    
    if (!$submission_id) {
        sendResponse(false, 'Submission ID required');
    }
    
    $query = "UPDATE assignment_submissions SET 
              score = $score,
              feedback = '$feedback',
              graded_by = $graded_by,
              graded_at = CURRENT_TIMESTAMP,
              status = 'graded'
              WHERE submission_id = $submission_id";
    
    if (mysqli_query($conn, $query)) {
        sendResponse(true, 'Submission graded successfully');
    } else {
        sendResponse(false, 'Failed to grade submission');
    }
}

?>
