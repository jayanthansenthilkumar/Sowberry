<?php
/**
 * Mentor API
 * Handles all mentor-related operations
 */

require_once '../config/config.php';
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

if ($db === null) {
    sendResponse(false, 'Database connection failed', null, 500);
}

requireAuth();
requireRole('mentor');

$method = $_SERVER['REQUEST_METHOD'];
$request = $_GET['action'] ?? '';

switch ($request) {
    case 'dashboard':
        if ($method === 'GET') getDashboard($db);
        break;
    
    case 'my-courses':
        if ($method === 'GET') getMyCourses($db);
        break;
    
    case 'create-course':
        if ($method === 'POST') createCourse($db);
        break;
    
    case 'update-course':
        if ($method === 'PUT') updateCourse($db);
        break;
    
    case 'delete-course':
        if ($method === 'DELETE') deleteCourse($db);
        break;
    
    case 'students':
        if ($method === 'GET') getStudents($db);
        break;
    
    case 'student-progress':
        if ($method === 'GET') getStudentProgress($db);
        break;
    
    case 'assignments':
        if ($method === 'GET') getAssignments($db);
        break;
    
    case 'create-assignment':
        if ($method === 'POST') createAssignment($db);
        break;
    
    case 'submissions':
        if ($method === 'GET') getSubmissions($db);
        break;
    
    case 'grade-assignment':
        if ($method === 'POST') gradeAssignment($db);
        break;
    
    case 'create-event':
        if ($method === 'POST') createEvent($db);
        break;
    
    case 'my-events':
        if ($method === 'GET') getMyEvents($db);
        break;
    
    case 'create-aptitude-test':
        if ($method === 'POST') createAptitudeTest($db);
        break;
    
    case 'create-coding-problem':
        if ($method === 'POST') createCodingProblem($db);
        break;
    
    case 'upload-material':
        if ($method === 'POST') uploadMaterial($db);
        break;
    
    default:
        sendResponse(false, 'Invalid action', null, 400);
}

/**
 * Get mentor dashboard data
 */
function getDashboard($db) {
    $mentorId = $_SESSION['mentor_id'];
    
    try {
        // Get mentor stats
        $mentorQuery = "SELECT m.*, u.full_name, u.email 
                       FROM mentors m
                       JOIN users u ON m.user_id = u.user_id
                       WHERE m.mentor_id = :mentor_id";
        $mentorStmt = $db->prepare($mentorQuery);
        $mentorStmt->bindParam(':mentor_id', $mentorId);
        $mentorStmt->execute();
        $mentor = $mentorStmt->fetch();
        
        // Get total courses
        $coursesQuery = "SELECT COUNT(*) as total FROM courses WHERE mentor_id = :mentor_id";
        $coursesStmt = $db->prepare($coursesQuery);
        $coursesStmt->bindParam(':mentor_id', $mentorId);
        $coursesStmt->execute();
        $coursesData = $coursesStmt->fetch();
        
        // Get total students
        $studentsQuery = "SELECT COUNT(DISTINCT e.student_id) as total 
                         FROM enrollments e
                         JOIN courses c ON e.course_id = c.course_id
                         WHERE c.mentor_id = :mentor_id";
        $studentsStmt = $db->prepare($studentsQuery);
        $studentsStmt->bindParam(':mentor_id', $mentorId);
        $studentsStmt->execute();
        $studentsData = $studentsStmt->fetch();
        
        // Get pending submissions
        $submissionsQuery = "SELECT COUNT(*) as pending 
                            FROM assignment_submissions asub
                            JOIN assignments a ON asub.assignment_id = a.assignment_id
                            WHERE a.mentor_id = :mentor_id AND asub.status = 'submitted'";
        $submissionsStmt = $db->prepare($submissionsQuery);
        $submissionsStmt->bindParam(':mentor_id', $mentorId);
        $submissionsStmt->execute();
        $submissionsData = $submissionsStmt->fetch();
        
        sendResponse(true, 'Dashboard data retrieved', [
            'mentor' => $mentor,
            'total_courses' => $coursesData['total'],
            'total_students' => $studentsData['total'],
            'pending_submissions' => $submissionsData['pending']
        ]);
    } catch (PDOException $e) {
        error_log("Mentor Dashboard Error: " . $e->getMessage());
        sendResponse(false, 'Error retrieving dashboard data', null, 500);
    }
}

/**
 * Get mentor's courses
 */
function getMyCourses($db) {
    $mentorId = $_SESSION['mentor_id'];
    
    try {
        $query = "SELECT * FROM courses WHERE mentor_id = :mentor_id ORDER BY created_at DESC";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':mentor_id', $mentorId);
        $stmt->execute();
        $courses = $stmt->fetchAll();
        
        sendResponse(true, 'Courses retrieved', $courses);
    } catch (PDOException $e) {
        error_log("Get My Courses Error: " . $e->getMessage());
        sendResponse(false, 'Error retrieving courses', null, 500);
    }
}

/**
 * Create new course
 */
function createCourse($db) {
    $mentorId = $_SESSION['mentor_id'];
    $data = json_decode(file_get_contents("php://input"), true);
    
    $courseName = sanitizeInput($data['course_name'] ?? '');
    $courseCode = sanitizeInput($data['course_code'] ?? '');
    $description = sanitizeInput($data['description'] ?? '');
    $category = sanitizeInput($data['category'] ?? '');
    $difficultyLevel = $data['difficulty_level'] ?? 'beginner';
    $durationWeeks = $data['duration_weeks'] ?? 8;
    
    if (empty($courseName) || empty($courseCode)) {
        sendResponse(false, 'Course name and code are required', null, 400);
    }
    
    try {
        $query = "INSERT INTO courses 
                  (course_name, course_code, description, category, difficulty_level, duration_weeks, mentor_id, status) 
                  VALUES (:course_name, :course_code, :description, :category, :difficulty_level, :duration_weeks, :mentor_id, 'active')";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':course_name', $courseName);
        $stmt->bindParam(':course_code', $courseCode);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':category', $category);
        $stmt->bindParam(':difficulty_level', $difficultyLevel);
        $stmt->bindParam(':duration_weeks', $durationWeeks);
        $stmt->bindParam(':mentor_id', $mentorId);
        $stmt->execute();
        
        // Update mentor's total courses
        $updateQuery = "UPDATE mentors SET total_courses = total_courses + 1 WHERE mentor_id = :mentor_id";
        $updateStmt = $db->prepare($updateQuery);
        $updateStmt->bindParam(':mentor_id', $mentorId);
        $updateStmt->execute();
        
        sendResponse(true, 'Course created successfully', ['course_id' => $db->lastInsertId()], 201);
    } catch (PDOException $e) {
        error_log("Create Course Error: " . $e->getMessage());
        if ($e->getCode() == 23000) {
            sendResponse(false, 'Course code already exists', null, 409);
        }
        sendResponse(false, 'Error creating course', null, 500);
    }
}

/**
 * Update course
 */
function updateCourse($db) {
    $mentorId = $_SESSION['mentor_id'];
    $data = json_decode(file_get_contents("php://input"), true);
    
    $courseId = $data['course_id'] ?? 0;
    $courseName = sanitizeInput($data['course_name'] ?? '');
    $description = sanitizeInput($data['description'] ?? '');
    $status = $data['status'] ?? 'active';
    
    if (empty($courseId)) {
        sendResponse(false, 'Course ID is required', null, 400);
    }
    
    try {
        $query = "UPDATE courses 
                  SET course_name = :course_name, description = :description, status = :status 
                  WHERE course_id = :course_id AND mentor_id = :mentor_id";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':course_name', $courseName);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':course_id', $courseId);
        $stmt->bindParam(':mentor_id', $mentorId);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            sendResponse(true, 'Course updated successfully');
        } else {
            sendResponse(false, 'Course not found or no changes made', null, 404);
        }
    } catch (PDOException $e) {
        error_log("Update Course Error: " . $e->getMessage());
        sendResponse(false, 'Error updating course', null, 500);
    }
}

/**
 * Delete course
 */
function deleteCourse($db) {
    $mentorId = $_SESSION['mentor_id'];
    $courseId = $_GET['course_id'] ?? 0;
    
    if (empty($courseId)) {
        sendResponse(false, 'Course ID is required', null, 400);
    }
    
    try {
        $query = "DELETE FROM courses WHERE course_id = :course_id AND mentor_id = :mentor_id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':course_id', $courseId);
        $stmt->bindParam(':mentor_id', $mentorId);
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
 * Get students enrolled in mentor's courses
 */
function getStudents($db) {
    $mentorId = $_SESSION['mentor_id'];
    $courseId = $_GET['course_id'] ?? '';
    
    try {
        $query = "SELECT DISTINCT s.student_id, u.full_name, u.email, u.phone, 
                         s.current_streak, s.total_study_hours, e.course_id, c.course_name, e.progress_percentage
                  FROM students s
                  JOIN users u ON s.user_id = u.user_id
                  JOIN enrollments e ON s.student_id = e.student_id
                  JOIN courses c ON e.course_id = c.course_id
                  WHERE c.mentor_id = :mentor_id";
        
        $params = [':mentor_id' => $mentorId];
        
        if (!empty($courseId)) {
            $query .= " AND e.course_id = :course_id";
            $params[':course_id'] = $courseId;
        }
        
        $query .= " ORDER BY u.full_name ASC";
        
        $stmt = $db->prepare($query);
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        $stmt->execute();
        $students = $stmt->fetchAll();
        
        sendResponse(true, 'Students retrieved', $students);
    } catch (PDOException $e) {
        error_log("Get Students Error: " . $e->getMessage());
        sendResponse(false, 'Error retrieving students', null, 500);
    }
}

/**
 * Get student progress details
 */
function getStudentProgress($db) {
    $studentId = $_GET['student_id'] ?? 0;
    
    if (empty($studentId)) {
        sendResponse(false, 'Student ID is required', null, 400);
    }
    
    try {
        // Get enrollments
        $enrollmentsQuery = "SELECT e.*, c.course_name FROM enrollments e
                            JOIN courses c ON e.course_id = c.course_id
                            WHERE e.student_id = :student_id";
        $enrollmentsStmt = $db->prepare($enrollmentsQuery);
        $enrollmentsStmt->bindParam(':student_id', $studentId);
        $enrollmentsStmt->execute();
        $enrollments = $enrollmentsStmt->fetchAll();
        
        // Get grades
        $gradesQuery = "SELECT g.*, c.course_name FROM grades g
                       JOIN courses c ON g.course_id = c.course_id
                       WHERE g.student_id = :student_id";
        $gradesStmt = $db->prepare($gradesQuery);
        $gradesStmt->bindParam(':student_id', $studentId);
        $gradesStmt->execute();
        $grades = $gradesStmt->fetchAll();
        
        sendResponse(true, 'Student progress retrieved', [
            'enrollments' => $enrollments,
            'grades' => $grades
        ]);
    } catch (PDOException $e) {
        error_log("Get Student Progress Error: " . $e->getMessage());
        sendResponse(false, 'Error retrieving student progress', null, 500);
    }
}

/**
 * Get assignments
 */
function getAssignments($db) {
    $mentorId = $_SESSION['mentor_id'];
    
    try {
        $query = "SELECT a.*, c.course_name FROM assignments a
                  JOIN courses c ON a.course_id = c.course_id
                  WHERE a.mentor_id = :mentor_id
                  ORDER BY a.due_date DESC";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':mentor_id', $mentorId);
        $stmt->execute();
        $assignments = $stmt->fetchAll();
        
        sendResponse(true, 'Assignments retrieved', $assignments);
    } catch (PDOException $e) {
        error_log("Get Assignments Error: " . $e->getMessage());
        sendResponse(false, 'Error retrieving assignments', null, 500);
    }
}

/**
 * Create assignment
 */
function createAssignment($db) {
    $mentorId = $_SESSION['mentor_id'];
    $data = json_decode(file_get_contents("php://input"), true);
    
    $courseId = $data['course_id'] ?? 0;
    $title = sanitizeInput($data['assignment_title'] ?? '');
    $description = sanitizeInput($data['description'] ?? '');
    $dueDate = $data['due_date'] ?? '';
    $maxMarks = $data['max_marks'] ?? 100;
    $type = $data['assignment_type'] ?? 'theory';
    
    if (empty($courseId) || empty($title)) {
        sendResponse(false, 'Course ID and title are required', null, 400);
    }
    
    try {
        $query = "INSERT INTO assignments 
                  (course_id, mentor_id, assignment_title, description, due_date, max_marks, assignment_type) 
                  VALUES (:course_id, :mentor_id, :title, :description, :due_date, :max_marks, :type)";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':course_id', $courseId);
        $stmt->bindParam(':mentor_id', $mentorId);
        $stmt->bindParam(':title', $title);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':due_date', $dueDate);
        $stmt->bindParam(':max_marks', $maxMarks);
        $stmt->bindParam(':type', $type);
        $stmt->execute();
        
        sendResponse(true, 'Assignment created successfully', ['assignment_id' => $db->lastInsertId()], 201);
    } catch (PDOException $e) {
        error_log("Create Assignment Error: " . $e->getMessage());
        sendResponse(false, 'Error creating assignment', null, 500);
    }
}

/**
 * Get assignment submissions
 */
function getSubmissions($db) {
    $assignmentId = $_GET['assignment_id'] ?? 0;
    
    if (empty($assignmentId)) {
        sendResponse(false, 'Assignment ID is required', null, 400);
    }
    
    try {
        $query = "SELECT asub.*, u.full_name as student_name, u.email 
                  FROM assignment_submissions asub
                  JOIN students s ON asub.student_id = s.student_id
                  JOIN users u ON s.user_id = u.user_id
                  WHERE asub.assignment_id = :assignment_id
                  ORDER BY asub.submission_date DESC";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':assignment_id', $assignmentId);
        $stmt->execute();
        $submissions = $stmt->fetchAll();
        
        sendResponse(true, 'Submissions retrieved', $submissions);
    } catch (PDOException $e) {
        error_log("Get Submissions Error: " . $e->getMessage());
        sendResponse(false, 'Error retrieving submissions', null, 500);
    }
}

/**
 * Grade assignment submission
 */
function gradeAssignment($db) {
    $mentorId = $_SESSION['mentor_id'];
    $data = json_decode(file_get_contents("php://input"), true);
    
    $submissionId = $data['submission_id'] ?? 0;
    $marksObtained = $data['marks_obtained'] ?? 0;
    $feedback = sanitizeInput($data['feedback'] ?? '');
    
    if (empty($submissionId)) {
        sendResponse(false, 'Submission ID is required', null, 400);
    }
    
    try {
        $db->beginTransaction();
        
        // Update submission
        $updateQuery = "UPDATE assignment_submissions 
                       SET marks_obtained = :marks, feedback = :feedback, 
                           graded_by = :mentor_id, graded_date = NOW(), status = 'graded'
                       WHERE submission_id = :submission_id";
        
        $stmt = $db->prepare($updateQuery);
        $stmt->bindParam(':marks', $marksObtained);
        $stmt->bindParam(':feedback', $feedback);
        $stmt->bindParam(':mentor_id', $mentorId);
        $stmt->bindParam(':submission_id', $submissionId);
        $stmt->execute();
        
        // Get submission details for grade entry
        $getQuery = "SELECT asub.student_id, a.assignment_id, a.course_id, a.max_marks
                    FROM assignment_submissions asub
                    JOIN assignments a ON asub.assignment_id = a.assignment_id
                    WHERE asub.submission_id = :submission_id";
        $getStmt = $db->prepare($getQuery);
        $getStmt->bindParam(':submission_id', $submissionId);
        $getStmt->execute();
        $submissionData = $getStmt->fetch();
        
        // Insert into grades table
        $percentage = ($marksObtained / $submissionData['max_marks']) * 100;
        $grade = calculateGrade($percentage);
        
        $gradeQuery = "INSERT INTO grades 
                      (student_id, course_id, assignment_id, marks_obtained, max_marks, percentage, grade, graded_date)
                      VALUES (:student_id, :course_id, :assignment_id, :marks_obtained, :max_marks, :percentage, :grade, CURDATE())";
        
        $gradeStmt = $db->prepare($gradeQuery);
        $gradeStmt->bindParam(':student_id', $submissionData['student_id']);
        $gradeStmt->bindParam(':course_id', $submissionData['course_id']);
        $gradeStmt->bindParam(':assignment_id', $submissionData['assignment_id']);
        $gradeStmt->bindParam(':marks_obtained', $marksObtained);
        $gradeStmt->bindParam(':max_marks', $submissionData['max_marks']);
        $gradeStmt->bindParam(':percentage', $percentage);
        $gradeStmt->bindParam(':grade', $grade);
        $gradeStmt->execute();
        
        $db->commit();
        
        sendResponse(true, 'Assignment graded successfully');
    } catch (PDOException $e) {
        $db->rollBack();
        error_log("Grade Assignment Error: " . $e->getMessage());
        sendResponse(false, 'Error grading assignment', null, 500);
    }
}

/**
 * Create event
 */
function createEvent($db) {
    $mentorId = $_SESSION['mentor_id'];
    $data = json_decode(file_get_contents("php://input"), true);
    
    $eventName = sanitizeInput($data['event_name'] ?? '');
    $description = sanitizeInput($data['description'] ?? '');
    $eventDate = $data['event_date'] ?? '';
    $eventType = $data['event_type'] ?? 'webinar';
    $location = sanitizeInput($data['location'] ?? '');
    $maxParticipants = $data['max_participants'] ?? 100;
    
    if (empty($eventName) || empty($eventDate)) {
        sendResponse(false, 'Event name and date are required', null, 400);
    }
    
    try {
        $query = "INSERT INTO events 
                  (event_name, description, event_date, event_type, organizer_id, location, max_participants) 
                  VALUES (:event_name, :description, :event_date, :event_type, :organizer_id, :location, :max_participants)";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':event_name', $eventName);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':event_date', $eventDate);
        $stmt->bindParam(':event_type', $eventType);
        $stmt->bindParam(':organizer_id', $mentorId);
        $stmt->bindParam(':location', $location);
        $stmt->bindParam(':max_participants', $maxParticipants);
        $stmt->execute();
        
        sendResponse(true, 'Event created successfully', ['event_id' => $db->lastInsertId()], 201);
    } catch (PDOException $e) {
        error_log("Create Event Error: " . $e->getMessage());
        sendResponse(false, 'Error creating event', null, 500);
    }
}

/**
 * Get mentor's events
 */
function getMyEvents($db) {
    $mentorId = $_SESSION['mentor_id'];
    
    try {
        $query = "SELECT * FROM events WHERE organizer_id = :mentor_id ORDER BY event_date DESC";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':mentor_id', $mentorId);
        $stmt->execute();
        $events = $stmt->fetchAll();
        
        sendResponse(true, 'Events retrieved', $events);
    } catch (PDOException $e) {
        error_log("Get My Events Error: " . $e->getMessage());
        sendResponse(false, 'Error retrieving events', null, 500);
    }
}

/**
 * Create aptitude test
 */
function createAptitudeTest($db) {
    $mentorId = $_SESSION['mentor_id'];
    $data = json_decode(file_get_contents("php://input"), true);
    
    $testName = sanitizeInput($data['test_name'] ?? '');
    $description = sanitizeInput($data['description'] ?? '');
    $durationMinutes = $data['duration_minutes'] ?? 30;
    $passingMarks = $data['passing_marks'] ?? 50;
    $testType = $data['test_type'] ?? 'mixed';
    $questions = $data['questions'] ?? [];
    
    if (empty($testName) || empty($questions)) {
        sendResponse(false, 'Test name and questions are required', null, 400);
    }
    
    try {
        $db->beginTransaction();
        
        // Create test
        $testQuery = "INSERT INTO aptitude_tests 
                     (test_name, description, duration_minutes, total_questions, passing_marks, test_type, created_by) 
                     VALUES (:test_name, :description, :duration_minutes, :total_questions, :passing_marks, :test_type, :created_by)";
        
        $testStmt = $db->prepare($testQuery);
        $testStmt->bindParam(':test_name', $testName);
        $testStmt->bindParam(':description', $description);
        $testStmt->bindParam(':duration_minutes', $durationMinutes);
        $totalQuestions = count($questions);
        $testStmt->bindParam(':total_questions', $totalQuestions);
        $testStmt->bindParam(':passing_marks', $passingMarks);
        $testStmt->bindParam(':test_type', $testType);
        $testStmt->bindParam(':created_by', $mentorId);
        $testStmt->execute();
        
        $testId = $db->lastInsertId();
        
        // Add questions
        $questionQuery = "INSERT INTO aptitude_questions 
                         (test_id, question_text, option_a, option_b, option_c, option_d, correct_answer, marks) 
                         VALUES (:test_id, :question_text, :option_a, :option_b, :option_c, :option_d, :correct_answer, :marks)";
        
        $questionStmt = $db->prepare($questionQuery);
        
        foreach ($questions as $question) {
            $questionStmt->bindParam(':test_id', $testId);
            $questionStmt->bindParam(':question_text', $question['question_text']);
            $questionStmt->bindParam(':option_a', $question['option_a']);
            $questionStmt->bindParam(':option_b', $question['option_b']);
            $questionStmt->bindParam(':option_c', $question['option_c']);
            $questionStmt->bindParam(':option_d', $question['option_d']);
            $questionStmt->bindParam(':correct_answer', $question['correct_answer']);
            $marks = $question['marks'] ?? 1;
            $questionStmt->bindParam(':marks', $marks);
            $questionStmt->execute();
        }
        
        $db->commit();
        
        sendResponse(true, 'Aptitude test created successfully', ['test_id' => $testId], 201);
    } catch (PDOException $e) {
        $db->rollBack();
        error_log("Create Aptitude Test Error: " . $e->getMessage());
        sendResponse(false, 'Error creating aptitude test', null, 500);
    }
}

/**
 * Create coding problem
 */
function createCodingProblem($db) {
    $mentorId = $_SESSION['mentor_id'];
    $data = json_decode(file_get_contents("php://input"), true);
    
    $problemTitle = sanitizeInput($data['problem_title'] ?? '');
    $description = sanitizeInput($data['description'] ?? '');
    $difficultyLevel = $data['difficulty_level'] ?? 'easy';
    $category = sanitizeInput($data['problem_category'] ?? '');
    $testCases = $data['test_cases'] ?? [];
    
    if (empty($problemTitle) || empty($description)) {
        sendResponse(false, 'Problem title and description are required', null, 400);
    }
    
    try {
        $query = "INSERT INTO coding_problems 
                  (problem_title, description, difficulty_level, problem_category, test_cases, created_by) 
                  VALUES (:problem_title, :description, :difficulty_level, :problem_category, :test_cases, :created_by)";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':problem_title', $problemTitle);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':difficulty_level', $difficultyLevel);
        $stmt->bindParam(':problem_category', $category);
        $testCasesJson = json_encode($testCases);
        $stmt->bindParam(':test_cases', $testCasesJson);
        $stmt->bindParam(':created_by', $mentorId);
        $stmt->execute();
        
        sendResponse(true, 'Coding problem created successfully', ['problem_id' => $db->lastInsertId()], 201);
    } catch (PDOException $e) {
        error_log("Create Coding Problem Error: " . $e->getMessage());
        sendResponse(false, 'Error creating coding problem', null, 500);
    }
}

/**
 * Upload study material
 */
function uploadMaterial($db) {
    $userId = $_SESSION['user_id'];
    $data = json_decode(file_get_contents("php://input"), true);
    
    $courseId = $data['course_id'] ?? 0;
    $moduleId = $data['module_id'] ?? null;
    $materialName = sanitizeInput($data['material_name'] ?? '');
    $materialType = $data['material_type'] ?? 'pdf';
    $fileUrl = $data['file_url'] ?? '';
    $description = sanitizeInput($data['description'] ?? '');
    
    if (empty($courseId) || empty($materialName)) {
        sendResponse(false, 'Course ID and material name are required', null, 400);
    }
    
    try {
        $query = "INSERT INTO study_materials 
                  (course_id, module_id, material_name, material_type, file_url, description, uploaded_by) 
                  VALUES (:course_id, :module_id, :material_name, :material_type, :file_url, :description, :uploaded_by)";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':course_id', $courseId);
        $stmt->bindParam(':module_id', $moduleId);
        $stmt->bindParam(':material_name', $materialName);
        $stmt->bindParam(':material_type', $materialType);
        $stmt->bindParam(':file_url', $fileUrl);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':uploaded_by', $userId);
        $stmt->execute();
        
        sendResponse(true, 'Study material uploaded successfully', ['material_id' => $db->lastInsertId()], 201);
    } catch (PDOException $e) {
        error_log("Upload Material Error: " . $e->getMessage());
        sendResponse(false, 'Error uploading study material', null, 500);
    }
}

/**
 * Helper function to calculate grade
 */
function calculateGrade($percentage) {
    if ($percentage >= 90) return 'A+';
    if ($percentage >= 80) return 'A';
    if ($percentage >= 70) return 'B+';
    if ($percentage >= 60) return 'B';
    if ($percentage >= 50) return 'C';
    if ($percentage >= 40) return 'D';
    return 'F';
}
?>
