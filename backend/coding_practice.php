<?php
/**
 * Coding Practice Handler
 * Manages coding problems and submissions
 */

require_once 'config.php';

header('Content-Type: application/json');

$action = $_POST['action'] ?? $_GET['action'] ?? '';

switch ($action) {
    case 'get_problems':
        getProblems();
        break;
    
    case 'get_problem':
        getProblem();
        break;
    
    case 'create_problem':
        createProblem();
        break;
    
    case 'submit_code':
        submitCode();
        break;
    
    case 'get_submissions':
        getSubmissions();
        break;
    
    case 'get_leaderboard':
        getLeaderboard();
        break;
    
    default:
        sendResponse(false, 'Invalid action');
}

/**
 * Get all problems
 */
function getProblems() {
    global $conn;
    
    $difficulty = sanitize($_GET['difficulty'] ?? '');
    $topic = sanitize($_GET['topic'] ?? '');
    
    $whereClause = "WHERE is_active = 1";
    
    if ($difficulty) {
        $whereClause .= " AND difficulty_level = '$difficulty'";
    }
    
    if ($topic) {
        $whereClause .= " AND topic = '$topic'";
    }
    
    $query = "SELECT 
                p.*,
                COUNT(DISTINCT cs.submission_id) as total_submissions,
                COUNT(DISTINCT CASE WHEN cs.status = 'accepted' THEN cs.student_id END) as solved_count
              FROM coding_problems p
              LEFT JOIN code_submissions cs ON p.problem_id = cs.problem_id
              $whereClause
              GROUP BY p.problem_id
              ORDER BY p.problem_id DESC";
    
    $result = mysqli_query($conn, $query);
    $problems = [];
    
    while ($row = mysqli_fetch_assoc($result)) {
        $problems[] = $row;
    }
    
    sendResponse(true, 'Problems retrieved successfully', ['problems' => $problems]);
}

/**
 * Get single problem
 */
function getProblem() {
    global $conn;
    
    $problem_id = intval($_GET['id'] ?? 0);
    
    if (!$problem_id) {
        sendResponse(false, 'Problem ID required');
    }
    
    $query = "SELECT * FROM coding_problems WHERE problem_id = $problem_id";
    $result = mysqli_query($conn, $query);
    
    if ($problem = mysqli_fetch_assoc($result)) {
        // Get test cases (only sample ones for students)
        $testCasesQuery = "SELECT * FROM problem_test_cases 
                          WHERE problem_id = $problem_id AND is_sample = 1";
        $testCasesResult = mysqli_query($conn, $testCasesQuery);
        $testCases = [];
        
        while ($tc = mysqli_fetch_assoc($testCasesResult)) {
            $testCases[] = $tc;
        }
        
        $problem['sample_test_cases'] = $testCases;
        
        sendResponse(true, 'Problem retrieved successfully', ['problem' => $problem]);
    } else {
        sendResponse(false, 'Problem not found');
    }
}

/**
 * Create coding problem
 */
function createProblem() {
    global $conn;
    
    requireLogin();
    hasPermission('mentor');
    
    $problem_title = sanitize($_POST['problem_title'] ?? '');
    $problem_description = sanitize($_POST['problem_description'] ?? '');
    $difficulty_level = sanitize($_POST['difficulty_level'] ?? 'easy');
    $topic = sanitize($_POST['topic'] ?? '');
    $points = intval($_POST['points'] ?? 10);
    $created_by = intval($_SESSION['type_id'] ?? 0);
    
    if (empty($problem_title)) {
        sendResponse(false, 'Problem title is required');
    }
    
    $query = "INSERT INTO coding_problems (
                problem_title, problem_description, difficulty_level, topic, points, created_by
              ) VALUES (
                '$problem_title', '$problem_description', '$difficulty_level', '$topic', $points, $created_by
              )";
    
    if (mysqli_query($conn, $query)) {
        sendResponse(true, 'Problem created successfully', [
            'problem_id' => mysqli_insert_id($conn)
        ]);
    } else {
        sendResponse(false, 'Failed to create problem');
    }
}

/**
 * Submit code
 */
function submitCode() {
    global $conn;
    
    requireLogin();
    
    $problem_id = intval($_POST['problem_id'] ?? 0);
    $student_id = intval($_POST['student_id'] ?? $_SESSION['type_id'] ?? 0);
    $language = sanitize($_POST['language'] ?? 'python');
    $source_code = sanitize($_POST['source_code'] ?? '');
    
    if (!$problem_id || !$student_id || empty($source_code)) {
        sendResponse(false, 'Invalid submission data');
    }
    
    // Get problem details
    $problemQuery = "SELECT * FROM coding_problems WHERE problem_id = $problem_id";
    $problemResult = mysqli_query($conn, $problemQuery);
    $problem = mysqli_fetch_assoc($problemResult);
    
    if (!$problem) {
        sendResponse(false, 'Problem not found');
    }
    
    // Get test cases
    $testCasesQuery = "SELECT * FROM problem_test_cases WHERE problem_id = $problem_id";
    $testCasesResult = mysqli_query($conn, $testCasesQuery);
    $totalTestCases = mysqli_num_rows($testCasesResult);
    
    // Simulate code execution (in production, use a code execution engine)
    $status = 'accepted'; // Mock status
    $testCasesPassed = $totalTestCases; // Mock
    $executionTime = rand(50, 500); // Mock
    $memoryUsed = rand(1000, 5000); // Mock
    $score = ($testCasesPassed / $totalTestCases) * 100;
    
    // Insert submission
    $query = "INSERT INTO code_submissions (
                problem_id, student_id, language, source_code, status,
                execution_time_ms, memory_used_kb, test_cases_passed, total_test_cases, score
              ) VALUES (
                $problem_id, $student_id, '$language', '$source_code', '$status',
                $executionTime, $memoryUsed, $testCasesPassed, $totalTestCases, $score
              )";
    
    if (mysqli_query($conn, $query)) {
        sendResponse(true, 'Code submitted successfully', [
            'submission_id' => mysqli_insert_id($conn),
            'status' => $status,
            'test_cases_passed' => $testCasesPassed,
            'total_test_cases' => $totalTestCases,
            'execution_time' => $executionTime,
            'memory_used' => $memoryUsed,
            'score' => $score
        ]);
    } else {
        sendResponse(false, 'Failed to submit code');
    }
}

/**
 * Get submissions
 */
function getSubmissions() {
    global $conn;
    
    $student_id = intval($_GET['student_id'] ?? 0);
    $problem_id = intval($_GET['problem_id'] ?? 0);
    
    $whereClause = "WHERE 1=1";
    
    if ($student_id) {
        $whereClause .= " AND cs.student_id = $student_id";
    }
    
    if ($problem_id) {
        $whereClause .= " AND cs.problem_id = $problem_id";
    }
    
    $query = "SELECT 
                cs.*,
                p.problem_title,
                p.difficulty_level,
                s.student_code,
                u.full_name as student_name
              FROM code_submissions cs
              JOIN coding_problems p ON cs.problem_id = p.problem_id
              JOIN students st ON cs.student_id = st.student_id
              JOIN users u ON st.user_id = u.user_id
              $whereClause
              ORDER BY cs.submitted_at DESC
              LIMIT 50";
    
    $result = mysqli_query($conn, $query);
    $submissions = [];
    
    while ($row = mysqli_fetch_assoc($result)) {
        $submissions[] = $row;
    }
    
    sendResponse(true, 'Submissions retrieved successfully', ['submissions' => $submissions]);
}

/**
 * Get leaderboard
 */
function getLeaderboard() {
    global $conn;
    
    $query = "SELECT 
                s.student_id,
                s.student_code,
                u.full_name,
                u.profile_image,
                COUNT(DISTINCT CASE WHEN cs.status = 'accepted' THEN cs.problem_id END) as problems_solved,
                SUM(CASE WHEN cs.status = 'accepted' THEN p.points ELSE 0 END) as total_points,
                COUNT(DISTINCT cs.submission_id) as total_submissions
              FROM students s
              JOIN users u ON s.user_id = u.user_id
              LEFT JOIN code_submissions cs ON s.student_id = cs.student_id
              LEFT JOIN coding_problems p ON cs.problem_id = p.problem_id
              GROUP BY s.student_id
              HAVING problems_solved > 0
              ORDER BY total_points DESC, problems_solved DESC
              LIMIT 50";
    
    $result = mysqli_query($conn, $query);
    $leaderboard = [];
    $rank = 1;
    
    while ($row = mysqli_fetch_assoc($result)) {
        $row['rank'] = $rank++;
        $leaderboard[] = $row;
    }
    
    sendResponse(true, 'Leaderboard retrieved successfully', ['leaderboard' => $leaderboard]);
}

?>
