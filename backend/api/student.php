<?php
/**
 * Student API
 * Handles all student-related operations
 */

require_once '../config/config.php';
require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

if ($db === null) {
    sendResponse(false, 'Database connection failed', null, 500);
}

requireAuth();

$method = $_SERVER['REQUEST_METHOD'];
$request = $_GET['action'] ?? '';

switch ($request) {
    case 'dashboard':
        if ($method === 'GET') getDashboardData($db);
        break;
    
    case 'courses':
        if ($method === 'GET') getCourses($db);
        break;
    
    case 'enroll':
        if ($method === 'POST') enrollCourse($db);
        break;
    
    case 'my-courses':
        if ($method === 'GET') getMyCourses($db);
        break;
    
    case 'course-details':
        if ($method === 'GET') getCourseDetails($db);
        break;
    
    case 'assignments':
        if ($method === 'GET') getAssignments($db);
        break;
    
    case 'submit-assignment':
        if ($method === 'POST') submitAssignment($db);
        break;
    
    case 'grades':
        if ($method === 'GET') getGrades($db);
        break;
    
    case 'progress':
        if ($method === 'GET') getProgress($db);
        break;
    
    case 'study-activity':
        if ($method === 'GET') getStudyActivity($db);
        break;
    
    case 'update-activity':
        if ($method === 'POST') updateActivity($db);
        break;
    
    case 'aptitude-tests':
        if ($method === 'GET') getAptitudeTests($db);
        break;
    
    case 'start-test':
        if ($method === 'POST') startTest($db);
        break;
    
    case 'submit-test':
        if ($method === 'POST') submitTest($db);
        break;
    
    case 'coding-problems':
        if ($method === 'GET') getCodingProblems($db);
        break;
    
    case 'submit-code':
        if ($method === 'POST') submitCode($db);
        break;
    
    case 'study-materials':
        if ($method === 'GET') getStudyMaterials($db);
        break;
    
    case 'events':
        if ($method === 'GET') getEvents($db);
        break;
    
    case 'register-event':
        if ($method === 'POST') registerEvent($db);
        break;
    
    default:
        sendResponse(false, 'Invalid action', null, 400);
}

/**
 * Get dashboard data
 */
function getDashboardData($db) {
    $studentId = $_SESSION['student_id'];
    
    try {
        // Get student stats
        $query = "SELECT s.*, u.full_name, u.email, u.profile_picture 
                  FROM students s
                  JOIN users u ON s.user_id = u.user_id
                  WHERE s.student_id = :student_id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':student_id', $studentId);
        $stmt->execute();
        $student = $stmt->fetch();
        
        // Get enrolled courses count
        $coursesQuery = "SELECT COUNT(*) as total FROM enrollments WHERE student_id = :student_id";
        $coursesStmt = $db->prepare($coursesQuery);
        $coursesStmt->bindParam(':student_id', $studentId);
        $coursesStmt->execute();
        $coursesData = $coursesStmt->fetch();
        
        // Get pending assignments
        $assignmentsQuery = "SELECT COUNT(*) as pending 
                            FROM assignment_submissions asub
                            JOIN assignments a ON asub.assignment_id = a.assignment_id
                            WHERE asub.student_id = :student_id 
                            AND asub.status = 'pending'";
        $assignmentsStmt = $db->prepare($assignmentsQuery);
        $assignmentsStmt->bindParam(':student_id', $studentId);
        $assignmentsStmt->execute();
        $assignmentsData = $assignmentsStmt->fetch();
        
        // Get average progress
        $progressQuery = "SELECT AVG(progress_percentage) as avg_progress 
                         FROM enrollments 
                         WHERE student_id = :student_id";
        $progressStmt = $db->prepare($progressQuery);
        $progressStmt->bindParam(':student_id', $studentId);
        $progressStmt->execute();
        $progressData = $progressStmt->fetch();
        
        sendResponse(true, 'Dashboard data retrieved', [
            'student' => $student,
            'enrolled_courses' => $coursesData['total'],
            'pending_assignments' => $assignmentsData['pending'],
            'average_progress' => round($progressData['avg_progress'] ?? 0, 2)
        ]);
        
    } catch (PDOException $e) {
        error_log("Dashboard Error: " . $e->getMessage());
        sendResponse(false, 'Error retrieving dashboard data', null, 500);
    }
}

/**
 * Get all available courses
 */
function getCourses($db) {
    try {
        $query = "SELECT c.*, m.specialization, u.full_name as mentor_name 
                  FROM courses c
                  LEFT JOIN mentors m ON c.mentor_id = m.mentor_id
                  LEFT JOIN users u ON m.user_id = u.user_id
                  WHERE c.status = 'active'
                  ORDER BY c.created_at DESC";
        
        $stmt = $db->prepare($query);
        $stmt->execute();
        $courses = $stmt->fetchAll();
        
        sendResponse(true, 'Courses retrieved', $courses);
    } catch (PDOException $e) {
        error_log("Get Courses Error: " . $e->getMessage());
        sendResponse(false, 'Error retrieving courses', null, 500);
    }
}

/**
 * Enroll in a course
 */
function enrollCourse($db) {
    $studentId = $_SESSION['student_id'];
    $data = json_decode(file_get_contents("php://input"), true);
    $courseId = $data['course_id'] ?? 0;
    
    if (empty($courseId)) {
        sendResponse(false, 'Course ID is required', null, 400);
    }
    
    try {
        // Check if already enrolled
        $checkQuery = "SELECT enrollment_id FROM enrollments 
                      WHERE student_id = :student_id AND course_id = :course_id";
        $checkStmt = $db->prepare($checkQuery);
        $checkStmt->bindParam(':student_id', $studentId);
        $checkStmt->bindParam(':course_id', $courseId);
        $checkStmt->execute();
        
        if ($checkStmt->rowCount() > 0) {
            sendResponse(false, 'Already enrolled in this course', null, 409);
        }
        
        // Enroll student
        $insertQuery = "INSERT INTO enrollments (student_id, course_id, enrollment_date, completion_status) 
                       VALUES (:student_id, :course_id, CURDATE(), 'enrolled')";
        $stmt = $db->prepare($insertQuery);
        $stmt->bindParam(':student_id', $studentId);
        $stmt->bindParam(':course_id', $courseId);
        $stmt->execute();
        
        // Update course total students
        $updateQuery = "UPDATE courses SET total_students = total_students + 1 WHERE course_id = :course_id";
        $updateStmt = $db->prepare($updateQuery);
        $updateStmt->bindParam(':course_id', $courseId);
        $updateStmt->execute();
        
        sendResponse(true, 'Successfully enrolled in course', ['enrollment_id' => $db->lastInsertId()]);
    } catch (PDOException $e) {
        error_log("Enroll Course Error: " . $e->getMessage());
        sendResponse(false, 'Error enrolling in course', null, 500);
    }
}

/**
 * Get student's enrolled courses
 */
function getMyCourses($db) {
    $studentId = $_SESSION['student_id'];
    
    try {
        $query = "SELECT e.*, c.*, u.full_name as mentor_name
                  FROM enrollments e
                  JOIN courses c ON e.course_id = c.course_id
                  LEFT JOIN mentors m ON c.mentor_id = m.mentor_id
                  LEFT JOIN users u ON m.user_id = u.user_id
                  WHERE e.student_id = :student_id
                  ORDER BY e.enrollment_date DESC";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':student_id', $studentId);
        $stmt->execute();
        $courses = $stmt->fetchAll();
        
        sendResponse(true, 'My courses retrieved', $courses);
    } catch (PDOException $e) {
        error_log("Get My Courses Error: " . $e->getMessage());
        sendResponse(false, 'Error retrieving your courses', null, 500);
    }
}

/**
 * Get course details with modules
 */
function getCourseDetails($db) {
    $courseId = $_GET['course_id'] ?? 0;
    
    if (empty($courseId)) {
        sendResponse(false, 'Course ID is required', null, 400);
    }
    
    try {
        // Get course info
        $courseQuery = "SELECT c.*, u.full_name as mentor_name, m.specialization
                       FROM courses c
                       LEFT JOIN mentors m ON c.mentor_id = m.mentor_id
                       LEFT JOIN users u ON m.user_id = u.user_id
                       WHERE c.course_id = :course_id";
        $courseStmt = $db->prepare($courseQuery);
        $courseStmt->bindParam(':course_id', $courseId);
        $courseStmt->execute();
        $course = $courseStmt->fetch();
        
        // Get modules
        $modulesQuery = "SELECT * FROM course_modules 
                        WHERE course_id = :course_id 
                        ORDER BY module_order";
        $modulesStmt = $db->prepare($modulesQuery);
        $modulesStmt->bindParam(':course_id', $courseId);
        $modulesStmt->execute();
        $modules = $modulesStmt->fetchAll();
        
        $course['modules'] = $modules;
        
        sendResponse(true, 'Course details retrieved', $course);
    } catch (PDOException $e) {
        error_log("Get Course Details Error: " . $e->getMessage());
        sendResponse(false, 'Error retrieving course details', null, 500);
    }
}

/**
 * Get student assignments
 */
function getAssignments($db) {
    $studentId = $_SESSION['student_id'];
    
    try {
        $query = "SELECT a.*, c.course_name, asub.submission_id, asub.status as submission_status,
                         asub.marks_obtained, asub.feedback, asub.submission_date
                  FROM assignments a
                  JOIN courses c ON a.course_id = c.course_id
                  JOIN enrollments e ON c.course_id = e.course_id
                  LEFT JOIN assignment_submissions asub ON a.assignment_id = asub.assignment_id 
                       AND asub.student_id = :student_id
                  WHERE e.student_id = :student_id AND a.status = 'active'
                  ORDER BY a.due_date ASC";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':student_id', $studentId);
        $stmt->execute();
        $assignments = $stmt->fetchAll();
        
        sendResponse(true, 'Assignments retrieved', $assignments);
    } catch (PDOException $e) {
        error_log("Get Assignments Error: " . $e->getMessage());
        sendResponse(false, 'Error retrieving assignments', null, 500);
    }
}

/**
 * Submit assignment
 */
function submitAssignment($db) {
    $studentId = $_SESSION['student_id'];
    $data = json_decode(file_get_contents("php://input"), true);
    
    $assignmentId = $data['assignment_id'] ?? 0;
    $submissionText = $data['submission_text'] ?? '';
    $fileUrl = $data['file_url'] ?? '';
    
    if (empty($assignmentId)) {
        sendResponse(false, 'Assignment ID is required', null, 400);
    }
    
    try {
        // Check if already submitted
        $checkQuery = "SELECT submission_id FROM assignment_submissions 
                      WHERE assignment_id = :assignment_id AND student_id = :student_id";
        $checkStmt = $db->prepare($checkQuery);
        $checkStmt->bindParam(':assignment_id', $assignmentId);
        $checkStmt->bindParam(':student_id', $studentId);
        $checkStmt->execute();
        
        if ($checkStmt->rowCount() > 0) {
            // Update existing submission
            $updateQuery = "UPDATE assignment_submissions 
                           SET submission_text = :submission_text, 
                               file_url = :file_url, 
                               submission_date = NOW(), 
                               status = 'submitted'
                           WHERE assignment_id = :assignment_id AND student_id = :student_id";
            $stmt = $db->prepare($updateQuery);
            $stmt->bindParam(':submission_text', $submissionText);
            $stmt->bindParam(':file_url', $fileUrl);
            $stmt->bindParam(':assignment_id', $assignmentId);
            $stmt->bindParam(':student_id', $studentId);
            $stmt->execute();
            
            sendResponse(true, 'Assignment resubmitted successfully');
        } else {
            // New submission
            $insertQuery = "INSERT INTO assignment_submissions 
                           (assignment_id, student_id, submission_text, file_url, status) 
                           VALUES (:assignment_id, :student_id, :submission_text, :file_url, 'submitted')";
            $stmt = $db->prepare($insertQuery);
            $stmt->bindParam(':assignment_id', $assignmentId);
            $stmt->bindParam(':student_id', $studentId);
            $stmt->bindParam(':submission_text', $submissionText);
            $stmt->bindParam(':file_url', $fileUrl);
            $stmt->execute();
            
            sendResponse(true, 'Assignment submitted successfully', ['submission_id' => $db->lastInsertId()]);
        }
    } catch (PDOException $e) {
        error_log("Submit Assignment Error: " . $e->getMessage());
        sendResponse(false, 'Error submitting assignment', null, 500);
    }
}

/**
 * Get student grades
 */
function getGrades($db) {
    $studentId = $_SESSION['student_id'];
    
    try {
        $query = "SELECT g.*, c.course_name, a.assignment_title, t.test_name
                  FROM grades g
                  JOIN courses c ON g.course_id = c.course_id
                  LEFT JOIN assignments a ON g.assignment_id = a.assignment_id
                  LEFT JOIN aptitude_tests t ON g.test_id = t.test_id
                  WHERE g.student_id = :student_id
                  ORDER BY g.graded_date DESC";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':student_id', $studentId);
        $stmt->execute();
        $grades = $stmt->fetchAll();
        
        sendResponse(true, 'Grades retrieved', $grades);
    } catch (PDOException $e) {
        error_log("Get Grades Error: " . $e->getMessage());
        sendResponse(false, 'Error retrieving grades', null, 500);
    }
}

/**
 * Get student progress
 */
function getProgress($db) {
    $studentId = $_SESSION['student_id'];
    
    try {
        $query = "SELECT e.*, c.course_name, c.duration_weeks
                  FROM enrollments e
                  JOIN courses c ON e.course_id = c.course_id
                  WHERE e.student_id = :student_id
                  ORDER BY e.progress_percentage DESC";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':student_id', $studentId);
        $stmt->execute();
        $progress = $stmt->fetchAll();
        
        sendResponse(true, 'Progress retrieved', $progress);
    } catch (PDOException $e) {
        error_log("Get Progress Error: " . $e->getMessage());
        sendResponse(false, 'Error retrieving progress', null, 500);
    }
}

/**
 * Get study activity data
 */
function getStudyActivity($db) {
    $studentId = $_SESSION['student_id'];
    $days = $_GET['days'] ?? 365;
    
    try {
        $query = "SELECT * FROM student_activity 
                  WHERE student_id = :student_id 
                  AND activity_date >= DATE_SUB(CURDATE(), INTERVAL :days DAY)
                  ORDER BY activity_date DESC";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':student_id', $studentId);
        $stmt->bindParam(':days', $days);
        $stmt->execute();
        $activity = $stmt->fetchAll();
        
        sendResponse(true, 'Study activity retrieved', $activity);
    } catch (PDOException $e) {
        error_log("Get Study Activity Error: " . $e->getMessage());
        sendResponse(false, 'Error retrieving study activity', null, 500);
    }
}

/**
 * Update daily activity
 */
function updateActivity($db) {
    $studentId = $_SESSION['student_id'];
    $data = json_decode(file_get_contents("php://input"), true);
    
    $studyMinutes = $data['study_minutes'] ?? 0;
    $lessonsCompleted = $data['lessons_completed'] ?? 0;
    
    try {
        $query = "INSERT INTO student_activity 
                  (student_id, activity_date, study_minutes, lessons_completed)
                  VALUES (:student_id, CURDATE(), :study_minutes, :lessons_completed)
                  ON DUPLICATE KEY UPDATE 
                  study_minutes = study_minutes + :study_minutes,
                  lessons_completed = lessons_completed + :lessons_completed";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':student_id', $studentId);
        $stmt->bindParam(':study_minutes', $studyMinutes);
        $stmt->bindParam(':lessons_completed', $lessonsCompleted);
        $stmt->execute();
        
        // Update total study hours
        $updateQuery = "UPDATE students 
                       SET total_study_hours = (
                           SELECT SUM(study_minutes) / 60 
                           FROM student_activity 
                           WHERE student_id = :student_id
                       )
                       WHERE student_id = :student_id";
        $updateStmt = $db->prepare($updateQuery);
        $updateStmt->bindParam(':student_id', $studentId);
        $updateStmt->execute();
        
        sendResponse(true, 'Activity updated successfully');
    } catch (PDOException $e) {
        error_log("Update Activity Error: " . $e->getMessage());
        sendResponse(false, 'Error updating activity', null, 500);
    }
}

/**
 * Get aptitude tests
 */
function getAptitudeTests($db) {
    try {
        $query = "SELECT * FROM aptitude_tests WHERE status = 'active' ORDER BY created_at DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $tests = $stmt->fetchAll();
        
        sendResponse(true, 'Aptitude tests retrieved', $tests);
    } catch (PDOException $e) {
        error_log("Get Aptitude Tests Error: " . $e->getMessage());
        sendResponse(false, 'Error retrieving tests', null, 500);
    }
}

/**
 * Start aptitude test
 */
function startTest($db) {
    $studentId = $_SESSION['student_id'];
    $data = json_decode(file_get_contents("php://input"), true);
    $testId = $data['test_id'] ?? 0;
    
    if (empty($testId)) {
        sendResponse(false, 'Test ID is required', null, 400);
    }
    
    try {
        // Get test details
        $testQuery = "SELECT * FROM aptitude_tests WHERE test_id = :test_id";
        $testStmt = $db->prepare($testQuery);
        $testStmt->bindParam(':test_id', $testId);
        $testStmt->execute();
        $test = $testStmt->fetch();
        
        if (!$test) {
            sendResponse(false, 'Test not found', null, 404);
        }
        
        // Create test attempt
        $insertQuery = "INSERT INTO test_attempts (test_id, student_id, start_time, total_marks) 
                       VALUES (:test_id, :student_id, NOW(), :total_marks)";
        $stmt = $db->prepare($insertQuery);
        $stmt->bindParam(':test_id', $testId);
        $stmt->bindParam(':student_id', $studentId);
        $totalMarks = $test['total_questions'];
        $stmt->bindParam(':total_marks', $totalMarks);
        $stmt->execute();
        
        $attemptId = $db->lastInsertId();
        
        // Get questions
        $questionsQuery = "SELECT question_id, question_text, option_a, option_b, option_c, option_d, marks 
                          FROM aptitude_questions WHERE test_id = :test_id";
        $questionsStmt = $db->prepare($questionsQuery);
        $questionsStmt->bindParam(':test_id', $testId);
        $questionsStmt->execute();
        $questions = $questionsStmt->fetchAll();
        
        sendResponse(true, 'Test started', [
            'attempt_id' => $attemptId,
            'test' => $test,
            'questions' => $questions
        ]);
    } catch (PDOException $e) {
        error_log("Start Test Error: " . $e->getMessage());
        sendResponse(false, 'Error starting test', null, 500);
    }
}

/**
 * Submit test
 */
function submitTest($db) {
    $studentId = $_SESSION['student_id'];
    $data = json_decode(file_get_contents("php://input"), true);
    
    $attemptId = $data['attempt_id'] ?? 0;
    $answers = $data['answers'] ?? [];
    
    if (empty($attemptId) || empty($answers)) {
        sendResponse(false, 'Attempt ID and answers are required', null, 400);
    }
    
    try {
        $db->beginTransaction();
        
        $marksObtained = 0;
        
        // Process each answer
        foreach ($answers as $answer) {
            $questionId = $answer['question_id'];
            $selectedAnswer = $answer['selected_answer'];
            
            // Get correct answer
            $query = "SELECT correct_answer, marks FROM aptitude_questions WHERE question_id = :question_id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':question_id', $questionId);
            $stmt->execute();
            $question = $stmt->fetch();
            
            $isCorrect = ($selectedAnswer === $question['correct_answer']);
            if ($isCorrect) {
                $marksObtained += $question['marks'];
            }
            
            // Save answer
            $insertQuery = "INSERT INTO test_answers (attempt_id, question_id, selected_answer, is_correct) 
                           VALUES (:attempt_id, :question_id, :selected_answer, :is_correct)";
            $insertStmt = $db->prepare($insertQuery);
            $insertStmt->bindParam(':attempt_id', $attemptId);
            $insertStmt->bindParam(':question_id', $questionId);
            $insertStmt->bindParam(':selected_answer', $selectedAnswer);
            $insertStmt->bindParam(':is_correct', $isCorrect, PDO::PARAM_BOOL);
            $insertStmt->execute();
        }
        
        // Update attempt
        $updateQuery = "UPDATE test_attempts 
                       SET end_time = NOW(), 
                           marks_obtained = :marks_obtained, 
                           percentage = (:marks_obtained / total_marks) * 100,
                           status = 'completed'
                       WHERE attempt_id = :attempt_id";
        $updateStmt = $db->prepare($updateQuery);
        $updateStmt->bindParam(':marks_obtained', $marksObtained);
        $updateStmt->bindParam(':attempt_id', $attemptId);
        $updateStmt->execute();
        
        $db->commit();
        
        sendResponse(true, 'Test submitted successfully', [
            'marks_obtained' => $marksObtained
        ]);
    } catch (PDOException $e) {
        $db->rollBack();
        error_log("Submit Test Error: " . $e->getMessage());
        sendResponse(false, 'Error submitting test', null, 500);
    }
}

/**
 * Get coding problems
 */
function getCodingProblems($db) {
    $difficulty = $_GET['difficulty'] ?? '';
    
    try {
        $query = "SELECT * FROM coding_problems WHERE 1=1";
        $params = [];
        
        if (!empty($difficulty)) {
            $query .= " AND difficulty_level = :difficulty";
            $params[':difficulty'] = $difficulty;
        }
        
        $query .= " ORDER BY created_at DESC";
        
        $stmt = $db->prepare($query);
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        $stmt->execute();
        $problems = $stmt->fetchAll();
        
        sendResponse(true, 'Coding problems retrieved', $problems);
    } catch (PDOException $e) {
        error_log("Get Coding Problems Error: " . $e->getMessage());
        sendResponse(false, 'Error retrieving coding problems', null, 500);
    }
}

/**
 * Submit code solution
 */
function submitCode($db) {
    $studentId = $_SESSION['student_id'];
    $data = json_decode(file_get_contents("php://input"), true);
    
    $problemId = $data['problem_id'] ?? 0;
    $code = $data['code'] ?? '';
    $language = $data['language'] ?? 'javascript';
    
    if (empty($problemId) || empty($code)) {
        sendResponse(false, 'Problem ID and code are required', null, 400);
    }
    
    try {
        // Save submission
        $insertQuery = "INSERT INTO coding_submissions 
                       (problem_id, student_id, code, language, status) 
                       VALUES (:problem_id, :student_id, :code, :language, 'pending')";
        $stmt = $db->prepare($insertQuery);
        $stmt->bindParam(':problem_id', $problemId);
        $stmt->bindParam(':student_id', $studentId);
        $stmt->bindParam(':code', $code);
        $stmt->bindParam(':language', $language);
        $stmt->execute();
        
        // TODO: Execute code and check against test cases
        // For now, we'll just mark as accepted
        $submissionId = $db->lastInsertId();
        
        $updateQuery = "UPDATE coding_submissions 
                       SET status = 'accepted', test_cases_passed = 5, total_test_cases = 5
                       WHERE submission_id = :submission_id";
        $updateStmt = $db->prepare($updateQuery);
        $updateStmt->bindParam(':submission_id', $submissionId);
        $updateStmt->execute();
        
        sendResponse(true, 'Code submitted successfully', [
            'submission_id' => $submissionId,
            'status' => 'accepted'
        ]);
    } catch (PDOException $e) {
        error_log("Submit Code Error: " . $e->getMessage());
        sendResponse(false, 'Error submitting code', null, 500);
    }
}

/**
 * Get study materials
 */
function getStudyMaterials($db) {
    $courseId = $_GET['course_id'] ?? 0;
    
    try {
        $query = "SELECT sm.*, c.course_name, cm.module_name 
                  FROM study_materials sm
                  JOIN courses c ON sm.course_id = c.course_id
                  LEFT JOIN course_modules cm ON sm.module_id = cm.module_id
                  WHERE 1=1";
        
        $params = [];
        
        if (!empty($courseId)) {
            $query .= " AND sm.course_id = :course_id";
            $params[':course_id'] = $courseId;
        }
        
        $query .= " ORDER BY sm.upload_date DESC";
        
        $stmt = $db->prepare($query);
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        $stmt->execute();
        $materials = $stmt->fetchAll();
        
        sendResponse(true, 'Study materials retrieved', $materials);
    } catch (PDOException $e) {
        error_log("Get Study Materials Error: " . $e->getMessage());
        sendResponse(false, 'Error retrieving study materials', null, 500);
    }
}

/**
 * Get events
 */
function getEvents($db) {
    try {
        $query = "SELECT e.*, u.full_name as organizer_name 
                  FROM events e
                  LEFT JOIN mentors m ON e.organizer_id = m.mentor_id
                  LEFT JOIN users u ON m.user_id = u.user_id
                  WHERE e.status IN ('upcoming', 'ongoing')
                  ORDER BY e.event_date ASC";
        
        $stmt = $db->prepare($query);
        $stmt->execute();
        $events = $stmt->fetchAll();
        
        sendResponse(true, 'Events retrieved', $events);
    } catch (PDOException $e) {
        error_log("Get Events Error: " . $e->getMessage());
        sendResponse(false, 'Error retrieving events', null, 500);
    }
}

/**
 * Register for event
 */
function registerEvent($db) {
    $userId = $_SESSION['user_id'];
    $data = json_decode(file_get_contents("php://input"), true);
    $eventId = $data['event_id'] ?? 0;
    
    if (empty($eventId)) {
        sendResponse(false, 'Event ID is required', null, 400);
    }
    
    try {
        // Check if already registered
        $checkQuery = "SELECT registration_id FROM event_registrations 
                      WHERE event_id = :event_id AND user_id = :user_id";
        $checkStmt = $db->prepare($checkQuery);
        $checkStmt->bindParam(':event_id', $eventId);
        $checkStmt->bindParam(':user_id', $userId);
        $checkStmt->execute();
        
        if ($checkStmt->rowCount() > 0) {
            sendResponse(false, 'Already registered for this event', null, 409);
        }
        
        // Register for event
        $insertQuery = "INSERT INTO event_registrations (event_id, user_id) 
                       VALUES (:event_id, :user_id)";
        $stmt = $db->prepare($insertQuery);
        $stmt->bindParam(':event_id', $eventId);
        $stmt->bindParam(':user_id', $userId);
        $stmt->execute();
        
        // Update registered count
        $updateQuery = "UPDATE events SET registered_count = registered_count + 1 
                       WHERE event_id = :event_id";
        $updateStmt = $db->prepare($updateQuery);
        $updateStmt->bindParam(':event_id', $eventId);
        $updateStmt->execute();
        
        sendResponse(true, 'Successfully registered for event');
    } catch (PDOException $e) {
        error_log("Register Event Error: " . $e->getMessage());
        sendResponse(false, 'Error registering for event', null, 500);
    }
}
?>
