-- Sowberry Academy Database Schema (3NF)
-- Created: 2025-10-26
-- Database: sowberry_academy

CREATE DATABASE IF NOT EXISTS sowberry_academy;
USE sowberry_academy;

-- ============================================
-- USER MANAGEMENT TABLES
-- ============================================

-- Users table (Main user authentication table)
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    country_code VARCHAR(10) DEFAULT '+91',
    user_role ENUM('admin', 'mentor', 'student') NOT NULL,
    profile_picture VARCHAR(500),
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    email_verified BOOLEAN DEFAULT FALSE,
    last_login DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_role (user_role)
);

-- Admin specific details
CREATE TABLE admins (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    department VARCHAR(100),
    permissions JSON,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Mentor specific details
CREATE TABLE mentors (
    mentor_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    specialization VARCHAR(255),
    bio TEXT,
    experience_years INT DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_students INT DEFAULT 0,
    total_courses INT DEFAULT 0,
    linkedin_url VARCHAR(500),
    github_url VARCHAR(500),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Student specific details
CREATE TABLE students (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    enrollment_date DATE,
    current_streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,
    total_study_hours INT DEFAULT 0,
    total_certificates INT DEFAULT 0,
    grade_level VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ============================================
-- COURSE MANAGEMENT TABLES
-- ============================================

-- Courses table
CREATE TABLE courses (
    course_id INT PRIMARY KEY AUTO_INCREMENT,
    course_name VARCHAR(255) NOT NULL,
    course_code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    thumbnail VARCHAR(500),
    category VARCHAR(100),
    difficulty_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    duration_weeks INT,
    mentor_id INT,
    total_students INT DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00,
    status ENUM('active', 'inactive', 'draft') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (mentor_id) REFERENCES mentors(mentor_id) ON DELETE SET NULL,
    INDEX idx_course_code (course_code),
    INDEX idx_category (category)
);

-- Course modules/lessons
CREATE TABLE course_modules (
    module_id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    module_name VARCHAR(255) NOT NULL,
    module_order INT NOT NULL,
    description TEXT,
    video_url VARCHAR(500),
    content TEXT,
    duration_minutes INT,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

-- Student course enrollments
CREATE TABLE enrollments (
    enrollment_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    enrollment_date DATE NOT NULL,
    completion_status ENUM('enrolled', 'in-progress', 'completed', 'dropped') DEFAULT 'enrolled',
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    completion_date DATE,
    certificate_issued BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    UNIQUE KEY unique_enrollment (student_id, course_id)
);

-- Course materials
CREATE TABLE study_materials (
    material_id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    module_id INT,
    material_name VARCHAR(255) NOT NULL,
    material_type ENUM('pdf', 'video', 'link', 'document', 'code') NOT NULL,
    file_url VARCHAR(500),
    description TEXT,
    uploaded_by INT,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    FOREIGN KEY (module_id) REFERENCES course_modules(module_id) ON DELETE SET NULL,
    FOREIGN KEY (uploaded_by) REFERENCES users(user_id) ON DELETE SET NULL
);

-- ============================================
-- ASSIGNMENT MANAGEMENT TABLES
-- ============================================

-- Assignments
CREATE TABLE assignments (
    assignment_id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    mentor_id INT NOT NULL,
    assignment_title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATETIME,
    max_marks INT DEFAULT 100,
    assignment_type ENUM('theory', 'coding', 'project', 'quiz') DEFAULT 'theory',
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    FOREIGN KEY (mentor_id) REFERENCES mentors(mentor_id) ON DELETE CASCADE
);

-- Student assignment submissions
CREATE TABLE assignment_submissions (
    submission_id INT PRIMARY KEY AUTO_INCREMENT,
    assignment_id INT NOT NULL,
    student_id INT NOT NULL,
    submission_text TEXT,
    file_url VARCHAR(500),
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    marks_obtained INT,
    feedback TEXT,
    graded_by INT,
    graded_date DATETIME,
    status ENUM('pending', 'submitted', 'graded', 'late') DEFAULT 'pending',
    FOREIGN KEY (assignment_id) REFERENCES assignments(assignment_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (graded_by) REFERENCES mentors(mentor_id) ON DELETE SET NULL
);

-- ============================================
-- ASSESSMENT TABLES
-- ============================================

-- Aptitude tests
CREATE TABLE aptitude_tests (
    test_id INT PRIMARY KEY AUTO_INCREMENT,
    test_name VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INT NOT NULL,
    total_questions INT NOT NULL,
    passing_marks INT NOT NULL,
    test_type ENUM('logical', 'verbal', 'quantitative', 'mixed') DEFAULT 'mixed',
    created_by INT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES mentors(mentor_id) ON DELETE SET NULL
);

-- Aptitude test questions
CREATE TABLE aptitude_questions (
    question_id INT PRIMARY KEY AUTO_INCREMENT,
    test_id INT NOT NULL,
    question_text TEXT NOT NULL,
    option_a VARCHAR(500),
    option_b VARCHAR(500),
    option_c VARCHAR(500),
    option_d VARCHAR(500),
    correct_answer CHAR(1) NOT NULL,
    marks INT DEFAULT 1,
    explanation TEXT,
    FOREIGN KEY (test_id) REFERENCES aptitude_tests(test_id) ON DELETE CASCADE
);

-- Student test attempts
CREATE TABLE test_attempts (
    attempt_id INT PRIMARY KEY AUTO_INCREMENT,
    test_id INT NOT NULL,
    student_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    marks_obtained INT,
    total_marks INT,
    percentage DECIMAL(5,2),
    status ENUM('in-progress', 'completed', 'abandoned') DEFAULT 'in-progress',
    FOREIGN KEY (test_id) REFERENCES aptitude_tests(test_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

-- Student answers for tests
CREATE TABLE test_answers (
    answer_id INT PRIMARY KEY AUTO_INCREMENT,
    attempt_id INT NOT NULL,
    question_id INT NOT NULL,
    selected_answer CHAR(1),
    is_correct BOOLEAN,
    time_taken_seconds INT,
    FOREIGN KEY (attempt_id) REFERENCES test_attempts(attempt_id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES aptitude_questions(question_id) ON DELETE CASCADE
);

-- ============================================
-- CODING PRACTICE TABLES
-- ============================================

-- Coding problems
CREATE TABLE coding_problems (
    problem_id INT PRIMARY KEY AUTO_INCREMENT,
    problem_title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    difficulty_level ENUM('easy', 'medium', 'hard') DEFAULT 'easy',
    problem_category VARCHAR(100),
    input_format TEXT,
    output_format TEXT,
    constraints TEXT,
    sample_input TEXT,
    sample_output TEXT,
    test_cases JSON,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES mentors(mentor_id) ON DELETE SET NULL
);

-- Student coding submissions
CREATE TABLE coding_submissions (
    submission_id INT PRIMARY KEY AUTO_INCREMENT,
    problem_id INT NOT NULL,
    student_id INT NOT NULL,
    code TEXT NOT NULL,
    language VARCHAR(50) NOT NULL,
    status ENUM('pending', 'accepted', 'wrong-answer', 'runtime-error', 'time-limit') DEFAULT 'pending',
    execution_time_ms INT,
    memory_used_kb INT,
    test_cases_passed INT,
    total_test_cases INT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (problem_id) REFERENCES coding_problems(problem_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

-- ============================================
-- GRADING AND PERFORMANCE TABLES
-- ============================================

-- Student grades
CREATE TABLE grades (
    grade_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    assignment_id INT,
    test_id INT,
    marks_obtained DECIMAL(5,2) NOT NULL,
    max_marks DECIMAL(5,2) NOT NULL,
    percentage DECIMAL(5,2),
    grade CHAR(2),
    graded_date DATE,
    remarks TEXT,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    FOREIGN KEY (assignment_id) REFERENCES assignments(assignment_id) ON DELETE SET NULL,
    FOREIGN KEY (test_id) REFERENCES aptitude_tests(test_id) ON DELETE SET NULL
);

-- Student activity tracking
CREATE TABLE student_activity (
    activity_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    activity_date DATE NOT NULL,
    study_minutes INT DEFAULT 0,
    lessons_completed INT DEFAULT 0,
    assignments_submitted INT DEFAULT 0,
    problems_solved INT DEFAULT 0,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    UNIQUE KEY unique_daily_activity (student_id, activity_date)
);

-- ============================================
-- EVENTS AND DISCUSSION TABLES
-- ============================================

-- Events
CREATE TABLE events (
    event_id INT PRIMARY KEY AUTO_INCREMENT,
    event_name VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATETIME NOT NULL,
    event_type ENUM('webinar', 'workshop', 'contest', 'seminar') DEFAULT 'webinar',
    organizer_id INT,
    location VARCHAR(255),
    max_participants INT,
    registered_count INT DEFAULT 0,
    status ENUM('upcoming', 'ongoing', 'completed', 'cancelled') DEFAULT 'upcoming',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organizer_id) REFERENCES mentors(mentor_id) ON DELETE SET NULL
);

-- Event registrations
CREATE TABLE event_registrations (
    registration_id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    attendance_status ENUM('registered', 'attended', 'absent') DEFAULT 'registered',
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_event_registration (event_id, user_id)
);

-- Discussion forum
CREATE TABLE discussions (
    discussion_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    course_id INT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    upvotes INT DEFAULT 0,
    status ENUM('active', 'closed', 'resolved') DEFAULT 'active',
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE SET NULL
);

-- Discussion replies
CREATE TABLE discussion_replies (
    reply_id INT PRIMARY KEY AUTO_INCREMENT,
    discussion_id INT NOT NULL,
    user_id INT NOT NULL,
    reply_text TEXT NOT NULL,
    replied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    upvotes INT DEFAULT 0,
    is_accepted_answer BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (discussion_id) REFERENCES discussions(discussion_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ============================================
-- NOTIFICATION AND COMMUNICATION TABLES
-- ============================================

-- Notifications
CREATE TABLE notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    link VARCHAR(500),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_read (user_id, is_read)
);

-- Contact form submissions
CREATE TABLE contact_submissions (
    contact_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('pending', 'in-progress', 'resolved') DEFAULT 'pending',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responded_at DATETIME,
    response_text TEXT
);

-- ============================================
-- REPORTS AND ANALYTICS TABLES
-- ============================================

-- System reports
CREATE TABLE system_reports (
    report_id INT PRIMARY KEY AUTO_INCREMENT,
    report_type VARCHAR(100) NOT NULL,
    report_title VARCHAR(255) NOT NULL,
    report_data JSON,
    generated_by INT,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (generated_by) REFERENCES admins(admin_id) ON DELETE SET NULL
);

-- Learning games
CREATE TABLE learning_games (
    game_id INT PRIMARY KEY AUTO_INCREMENT,
    game_name VARCHAR(255) NOT NULL,
    game_type VARCHAR(100),
    description TEXT,
    difficulty_level ENUM('easy', 'medium', 'hard') DEFAULT 'easy',
    course_id INT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES mentors(mentor_id) ON DELETE SET NULL
);

-- Game scores
CREATE TABLE game_scores (
    score_id INT PRIMARY KEY AUTO_INCREMENT,
    game_id INT NOT NULL,
    student_id INT NOT NULL,
    score INT NOT NULL,
    time_taken_seconds INT,
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES learning_games(game_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

-- OTP for password reset
CREATE TABLE password_reset_otps (
    otp_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    INDEX idx_email_otp (email, otp_code, is_used)
);

-- ============================================
-- INSERT SAMPLE DATA
-- ============================================

-- Insert Admin User
INSERT INTO users (email, username, password, full_name, phone, user_role, status, email_verified)
VALUES ('admin@sowberry.com', 'admin', 'admin123', 'Admin User', '+918825756388', 'admin', 'active', TRUE);

INSERT INTO admins (user_id, department, permissions)
VALUES (1, 'System Administration', '{"manage_users": true, "manage_courses": true, "view_reports": true}');

-- Insert Sample Mentors
INSERT INTO users (email, username, password, full_name, phone, user_role, status, email_verified)
VALUES 
('jayanthan@sowberry.com', 'jayanthan', 'mentor123', 'Jayanthan S', '+919876543210', 'mentor', 'active', TRUE),
('prithika@sowberry.com', 'prithika', 'mentor123', 'Prithika K', '+919876543211', 'mentor', 'active', TRUE),
('sreelekha@sowberry.com', 'sreelekha', 'mentor123', 'Sreelekha S', '+919876543212', 'mentor', 'active', TRUE);

INSERT INTO mentors (user_id, specialization, bio, experience_years, rating)
VALUES 
(2, 'Web Development', 'Expert in full-stack web development with 15+ years experience', 15, 4.8),
(3, 'Data Science', 'Specializes in machine learning and data analytics', 10, 4.6),
(4, 'UI/UX Design', 'Creative designer with expertise in user experience', 12, 4.9);

-- Insert Sample Students
INSERT INTO users (email, username, password, full_name, phone, user_role, status, email_verified)
VALUES 
('student1@sowberry.com', 'student1', 'student123', 'Sowmiya R', '+919876543220', 'student', 'active', TRUE),
('student2@sowberry.com', 'student2', 'student123', 'Ravi Kumar', '+919876543221', 'student', 'active', TRUE),
('student3@sowberry.com', 'student3', 'student123', 'Priya Sharma', '+919876543222', 'student', 'active', TRUE);

INSERT INTO students (user_id, enrollment_date, current_streak, longest_streak, total_study_hours, total_certificates)
VALUES 
(5, '2025-01-15', 7, 15, 248, 3),
(6, '2025-02-01', 5, 10, 180, 2),
(7, '2025-02-10', 3, 8, 120, 1);

-- Insert Sample Courses
INSERT INTO courses (course_name, course_code, description, category, difficulty_level, duration_weeks, mentor_id, total_students, rating, status)
VALUES 
('Web Development Bootcamp', 'WEB101', 'Master HTML, CSS, JavaScript and modern frameworks', 'Web Development', 'beginner', 8, 1, 850, 4.8, 'active'),
('Data Science Fundamentals', 'DS101', 'Learn Python, statistics, and machine learning basics', 'Data Science', 'intermediate', 12, 2, 720, 4.6, 'active'),
('JavaScript Fundamentals', 'JS101', 'Complete JavaScript programming course', 'Programming', 'beginner', 6, 1, 1285, 4.8, 'active'),
('UI/UX Design Essentials', 'UI101', 'Master user interface and experience design', 'Design', 'intermediate', 10, 3, 650, 4.7, 'active');

-- Insert Course Modules
INSERT INTO course_modules (course_id, module_name, module_order, description, duration_minutes)
VALUES 
(1, 'Introduction to HTML', 1, 'Basic HTML structure and tags', 60),
(1, 'CSS Styling Basics', 2, 'Learn CSS selectors and properties', 90),
(1, 'JavaScript Fundamentals', 3, 'Variables, functions, and control structures', 120),
(3, 'JavaScript Basics', 1, 'Introduction to JavaScript programming', 90),
(3, 'DOM Manipulation', 2, 'Working with the Document Object Model', 100);

-- Insert Sample Enrollments
INSERT INTO enrollments (student_id, course_id, enrollment_date, completion_status, progress_percentage)
VALUES 
(1, 1, '2025-01-20', 'in-progress', 75.00),
(1, 3, '2025-02-01', 'in-progress', 65.00),
(2, 2, '2025-02-05', 'in-progress', 45.00),
(3, 1, '2025-02-15', 'enrolled', 25.00);

-- Insert Sample Assignments
INSERT INTO assignments (course_id, mentor_id, assignment_title, description, due_date, max_marks, assignment_type)
VALUES 
(1, 1, 'Build a Portfolio Website', 'Create a responsive portfolio using HTML and CSS', '2025-11-01 23:59:59', 100, 'project'),
(3, 1, 'JavaScript Quiz', 'Test your JavaScript knowledge', '2025-10-30 23:59:59', 50, 'quiz');

-- Insert Sample Events
INSERT INTO events (event_name, description, event_date, event_type, organizer_id, max_participants, status)
VALUES 
('Web Development Workshop', 'Hands-on workshop on modern web development', '2025-11-15 14:00:00', 'workshop', 1, 50, 'upcoming'),
('Data Science Webinar', 'Introduction to machine learning', '2025-11-20 16:00:00', 'webinar', 2, 100, 'upcoming');

-- Insert Sample Notifications
INSERT INTO notifications (user_id, notification_type, title, message)
VALUES 
(5, 'assignment', 'New Assignment Posted', 'Build a Portfolio Website assignment is now available', '/assignments'),
(5, 'course', 'New Course Available', 'Check out the new JavaScript Advanced course', '/courses'),
(5, 'event', 'Upcoming Event', 'Web Development Workshop on Nov 15th', '/events');

-- Insert Sample Aptitude Test
INSERT INTO aptitude_tests (test_name, description, duration_minutes, total_questions, passing_marks, test_type, created_by)
VALUES ('Logical Reasoning Test', 'Test your logical thinking skills', 30, 20, 12, 'logical', 1);

INSERT INTO aptitude_questions (test_id, question_text, option_a, option_b, option_c, option_d, correct_answer, marks)
VALUES 
(1, 'If A = 1, B = 2, C = 3, what is the value of ABC?', '6', '123', '321', '132', 'A', 1),
(1, 'Complete the series: 2, 4, 8, 16, ?', '20', '24', '32', '64', 'C', 1);

-- Insert Sample Coding Problems
INSERT INTO coding_problems (problem_title, description, difficulty_level, problem_category, created_by)
VALUES 
('Two Sum', 'Find two numbers in an array that add up to a target', 'easy', 'Arrays', 1),
('Palindrome Check', 'Check if a string is a palindrome', 'easy', 'Strings', 1);

-- Insert Sample Activity Data
INSERT INTO student_activity (student_id, activity_date, study_minutes, lessons_completed, assignments_submitted, problems_solved)
VALUES 
(1, '2025-10-20', 120, 3, 1, 2),
(1, '2025-10-21', 90, 2, 0, 1),
(1, '2025-10-22', 150, 4, 2, 3),
(1, '2025-10-23', 100, 3, 1, 2),
(1, '2025-10-24', 80, 2, 0, 1),
(1, '2025-10-25', 110, 3, 1, 2),
(1, '2025-10-26', 95, 2, 1, 1);

COMMIT;

-- ============================================
-- END OF DATABASE SCHEMA
-- ============================================
