-- ============================================
-- Sowberry Academy - Database Schema
-- Learning Management System (LMS)
-- Created: October 26, 2025
-- ============================================

-- Drop existing database if exists
DROP DATABASE IF EXISTS sowberry;

-- Create database
CREATE DATABASE sowberry CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sowberry;

-- ============================================
-- USER MANAGEMENT TABLES
-- ============================================

-- Users table (main authentication)
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    country_code VARCHAR(10) DEFAULT '+91',
    profile_image VARCHAR(500),
    user_type ENUM('admin', 'mentor', 'student') NOT NULL,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_user_type (user_type),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- User profiles (extended information)
CREATE TABLE user_profiles (
    profile_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other', 'prefer_not_to_say'),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    postal_code VARCHAR(20),
    bio TEXT,
    linkedin_url VARCHAR(500),
    github_url VARCHAR(500),
    twitter_url VARCHAR(500),
    website_url VARCHAR(500),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB;

-- Student specific data
CREATE TABLE students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    student_code VARCHAR(50) UNIQUE NOT NULL,
    enrollment_date DATE NOT NULL,
    graduation_date DATE NULL,
    academic_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    current_semester INT DEFAULT 1,
    total_credits INT DEFAULT 0,
    gpa DECIMAL(3,2) DEFAULT 0.00,
    learning_hours INT DEFAULT 0,
    current_streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,
    last_activity_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_student_code (student_code),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB;

-- Mentor specific data
CREATE TABLE mentors (
    mentor_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    mentor_code VARCHAR(50) UNIQUE NOT NULL,
    specialization VARCHAR(255),
    years_of_experience INT DEFAULT 0,
    education_qualification VARCHAR(255),
    rating DECIMAL(2,1) DEFAULT 0.0,
    total_reviews INT DEFAULT 0,
    total_students INT DEFAULT 0,
    total_courses INT DEFAULT 0,
    hire_date DATE NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_mentor_code (mentor_code),
    INDEX idx_user_id (user_id),
    INDEX idx_rating (rating)
) ENGINE=InnoDB;

-- Admin specific data
CREATE TABLE admins (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    admin_code VARCHAR(50) UNIQUE NOT NULL,
    role ENUM('super_admin', 'admin', 'moderator') DEFAULT 'admin',
    permissions JSON,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_admin_code (admin_code),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB;

-- ============================================
-- COURSE MANAGEMENT TABLES
-- ============================================

-- Categories for courses
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    parent_category_id INT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_category_id) REFERENCES categories(category_id) ON DELETE SET NULL,
    INDEX idx_parent_category (parent_category_id)
) ENGINE=InnoDB;

-- Courses table
CREATE TABLE courses (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    course_code VARCHAR(50) UNIQUE NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id INT,
    mentor_id INT,
    difficulty_level ENUM('beginner', 'intermediate', 'advanced') NOT NULL,
    duration_hours INT DEFAULT 0,
    duration_weeks INT DEFAULT 0,
    credits INT DEFAULT 0,
    max_students INT DEFAULT 100,
    price DECIMAL(10,2) DEFAULT 0.00,
    thumbnail_url VARCHAR(500),
    video_intro_url VARCHAR(500),
    syllabus_file VARCHAR(500),
    prerequisites TEXT,
    learning_outcomes TEXT,
    course_status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    rating DECIMAL(2,1) DEFAULT 0.0,
    total_reviews INT DEFAULT 0,
    total_enrollments INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    published_at TIMESTAMP NULL,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL,
    FOREIGN KEY (mentor_id) REFERENCES mentors(mentor_id) ON DELETE SET NULL,
    INDEX idx_course_code (course_code),
    INDEX idx_category (category_id),
    INDEX idx_mentor (mentor_id),
    INDEX idx_difficulty (difficulty_level),
    INDEX idx_status (course_status),
    INDEX idx_rating (rating)
) ENGINE=InnoDB;

-- Course modules/chapters
CREATE TABLE course_modules (
    module_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    module_number INT NOT NULL,
    module_title VARCHAR(255) NOT NULL,
    module_description TEXT,
    duration_minutes INT DEFAULT 0,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    UNIQUE KEY unique_module (course_id, module_number),
    INDEX idx_course_id (course_id)
) ENGINE=InnoDB;

-- Course lessons/lectures
CREATE TABLE course_lessons (
    lesson_id INT AUTO_INCREMENT PRIMARY KEY,
    module_id INT NOT NULL,
    lesson_number INT NOT NULL,
    lesson_title VARCHAR(255) NOT NULL,
    lesson_type ENUM('video', 'text', 'quiz', 'assignment', 'live_session') NOT NULL,
    content_url VARCHAR(500),
    content_text LONGTEXT,
    duration_minutes INT DEFAULT 0,
    is_free_preview BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    order_index INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (module_id) REFERENCES course_modules(module_id) ON DELETE CASCADE,
    INDEX idx_module_id (module_id),
    INDEX idx_lesson_type (lesson_type)
) ENGINE=InnoDB;

-- Course enrollments
CREATE TABLE course_enrollments (
    enrollment_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completion_date TIMESTAMP NULL,
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    status ENUM('enrolled', 'in_progress', 'completed', 'dropped') DEFAULT 'enrolled',
    certificate_issued BOOLEAN DEFAULT FALSE,
    certificate_url VARCHAR(500),
    final_grade DECIMAL(5,2),
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    UNIQUE KEY unique_enrollment (student_id, course_id),
    INDEX idx_student_id (student_id),
    INDEX idx_course_id (course_id),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- Student lesson progress
CREATE TABLE lesson_progress (
    progress_id INT AUTO_INCREMENT PRIMARY KEY,
    enrollment_id INT NOT NULL,
    lesson_id INT NOT NULL,
    status ENUM('not_started', 'in_progress', 'completed') DEFAULT 'not_started',
    time_spent_minutes INT DEFAULT 0,
    last_position_seconds INT DEFAULT 0,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (enrollment_id) REFERENCES course_enrollments(enrollment_id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES course_lessons(lesson_id) ON DELETE CASCADE,
    UNIQUE KEY unique_progress (enrollment_id, lesson_id),
    INDEX idx_enrollment_id (enrollment_id),
    INDEX idx_lesson_id (lesson_id),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- Course reviews and ratings
CREATE TABLE course_reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    student_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    UNIQUE KEY unique_review (course_id, student_id),
    INDEX idx_course_id (course_id),
    INDEX idx_student_id (student_id),
    INDEX idx_rating (rating)
) ENGINE=InnoDB;

-- ============================================
-- ASSIGNMENT & ASSESSMENT TABLES
-- ============================================

-- Assignments
CREATE TABLE assignments (
    assignment_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    lesson_id INT NULL,
    assignment_title VARCHAR(255) NOT NULL,
    description TEXT,
    assignment_type ENUM('homework', 'project', 'quiz', 'exam') NOT NULL,
    max_points INT DEFAULT 100,
    passing_score INT DEFAULT 60,
    due_date TIMESTAMP NULL,
    instructions TEXT,
    attachment_url VARCHAR(500),
    is_published BOOLEAN DEFAULT TRUE,
    allow_late_submission BOOLEAN DEFAULT FALSE,
    late_penalty_percentage INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES course_lessons(lesson_id) ON DELETE SET NULL,
    INDEX idx_course_id (course_id),
    INDEX idx_assignment_type (assignment_type),
    INDEX idx_due_date (due_date)
) ENGINE=InnoDB;

-- Student assignment submissions
CREATE TABLE assignment_submissions (
    submission_id INT AUTO_INCREMENT PRIMARY KEY,
    assignment_id INT NOT NULL,
    student_id INT NOT NULL,
    submission_text LONGTEXT,
    attachment_url VARCHAR(500),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('submitted', 'graded', 'returned', 'late') DEFAULT 'submitted',
    score DECIMAL(5,2),
    feedback TEXT,
    graded_by INT NULL,
    graded_at TIMESTAMP NULL,
    FOREIGN KEY (assignment_id) REFERENCES assignments(assignment_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (graded_by) REFERENCES mentors(mentor_id) ON DELETE SET NULL,
    INDEX idx_assignment_id (assignment_id),
    INDEX idx_student_id (student_id),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- Aptitude tests
CREATE TABLE aptitude_tests (
    test_id INT AUTO_INCREMENT PRIMARY KEY,
    test_title VARCHAR(255) NOT NULL,
    description TEXT,
    test_type ENUM('logical_reasoning', 'quantitative', 'verbal', 'technical', 'mixed') NOT NULL,
    difficulty_level ENUM('easy', 'medium', 'hard') NOT NULL,
    duration_minutes INT NOT NULL,
    total_questions INT NOT NULL,
    passing_score INT DEFAULT 60,
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES mentors(mentor_id) ON DELETE SET NULL,
    INDEX idx_test_type (test_type),
    INDEX idx_difficulty (difficulty_level)
) ENGINE=InnoDB;

-- Aptitude test questions
CREATE TABLE aptitude_questions (
    question_id INT AUTO_INCREMENT PRIMARY KEY,
    test_id INT NOT NULL,
    question_text TEXT NOT NULL,
    question_type ENUM('multiple_choice', 'true_false', 'fill_blank') NOT NULL,
    option_a TEXT,
    option_b TEXT,
    option_c TEXT,
    option_d TEXT,
    correct_answer VARCHAR(10) NOT NULL,
    explanation TEXT,
    points INT DEFAULT 1,
    FOREIGN KEY (test_id) REFERENCES aptitude_tests(test_id) ON DELETE CASCADE,
    INDEX idx_test_id (test_id)
) ENGINE=InnoDB;

-- Student aptitude test attempts
CREATE TABLE aptitude_attempts (
    attempt_id INT AUTO_INCREMENT PRIMARY KEY,
    test_id INT NOT NULL,
    student_id INT NOT NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    score DECIMAL(5,2),
    percentage DECIMAL(5,2),
    status ENUM('in_progress', 'completed', 'abandoned') DEFAULT 'in_progress',
    FOREIGN KEY (test_id) REFERENCES aptitude_tests(test_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    INDEX idx_test_id (test_id),
    INDEX idx_student_id (student_id)
) ENGINE=InnoDB;

-- Student answers for aptitude tests
CREATE TABLE aptitude_answers (
    answer_id INT AUTO_INCREMENT PRIMARY KEY,
    attempt_id INT NOT NULL,
    question_id INT NOT NULL,
    selected_answer VARCHAR(10),
    is_correct BOOLEAN DEFAULT FALSE,
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (attempt_id) REFERENCES aptitude_attempts(attempt_id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES aptitude_questions(question_id) ON DELETE CASCADE,
    INDEX idx_attempt_id (attempt_id),
    INDEX idx_question_id (question_id)
) ENGINE=InnoDB;

-- ============================================
-- CODING PRACTICE TABLES
-- ============================================

-- Coding problems
CREATE TABLE coding_problems (
    problem_id INT AUTO_INCREMENT PRIMARY KEY,
    problem_title VARCHAR(255) NOT NULL,
    problem_description TEXT NOT NULL,
    difficulty_level ENUM('easy', 'medium', 'hard') NOT NULL,
    topic VARCHAR(100),
    input_format TEXT,
    output_format TEXT,
    constraints TEXT,
    sample_input TEXT,
    sample_output TEXT,
    explanation TEXT,
    solution_code TEXT,
    time_limit_seconds INT DEFAULT 2,
    memory_limit_mb INT DEFAULT 256,
    points INT DEFAULT 10,
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES mentors(mentor_id) ON DELETE SET NULL,
    INDEX idx_difficulty (difficulty_level),
    INDEX idx_topic (topic)
) ENGINE=InnoDB;

-- Test cases for coding problems
CREATE TABLE problem_test_cases (
    test_case_id INT AUTO_INCREMENT PRIMARY KEY,
    problem_id INT NOT NULL,
    input_data TEXT NOT NULL,
    expected_output TEXT NOT NULL,
    is_sample BOOLEAN DEFAULT FALSE,
    is_hidden BOOLEAN DEFAULT TRUE,
    points INT DEFAULT 10,
    FOREIGN KEY (problem_id) REFERENCES coding_problems(problem_id) ON DELETE CASCADE,
    INDEX idx_problem_id (problem_id)
) ENGINE=InnoDB;

-- Student code submissions
CREATE TABLE code_submissions (
    submission_id INT AUTO_INCREMENT PRIMARY KEY,
    problem_id INT NOT NULL,
    student_id INT NOT NULL,
    language VARCHAR(50) NOT NULL,
    source_code LONGTEXT NOT NULL,
    status ENUM('pending', 'running', 'accepted', 'wrong_answer', 'time_limit', 'runtime_error', 'compile_error') DEFAULT 'pending',
    execution_time_ms INT,
    memory_used_kb INT,
    test_cases_passed INT DEFAULT 0,
    total_test_cases INT DEFAULT 0,
    score DECIMAL(5,2),
    error_message TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (problem_id) REFERENCES coding_problems(problem_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    INDEX idx_problem_id (problem_id),
    INDEX idx_student_id (student_id),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- ============================================
-- GAMIFICATION TABLES
-- ============================================

-- Learning games
CREATE TABLE learning_games (
    game_id INT AUTO_INCREMENT PRIMARY KEY,
    game_name VARCHAR(255) NOT NULL,
    description TEXT,
    game_type ENUM('quiz', 'puzzle', 'simulation', 'trivia', 'challenge') NOT NULL,
    category_id INT,
    difficulty_level ENUM('easy', 'medium', 'hard') NOT NULL,
    points_reward INT DEFAULT 10,
    thumbnail_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL,
    INDEX idx_game_type (game_type),
    INDEX idx_difficulty (difficulty_level)
) ENGINE=InnoDB;

-- Student game scores
CREATE TABLE game_scores (
    score_id INT AUTO_INCREMENT PRIMARY KEY,
    game_id INT NOT NULL,
    student_id INT NOT NULL,
    score INT NOT NULL,
    time_taken_seconds INT,
    level_reached INT DEFAULT 1,
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES learning_games(game_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    INDEX idx_game_id (game_id),
    INDEX idx_student_id (student_id)
) ENGINE=InnoDB;

-- Badges/Achievements
CREATE TABLE badges (
    badge_id INT AUTO_INCREMENT PRIMARY KEY,
    badge_name VARCHAR(255) NOT NULL,
    description TEXT,
    icon_url VARCHAR(500),
    badge_type ENUM('course_completion', 'streak', 'assignment', 'problem_solving', 'special') NOT NULL,
    criteria JSON,
    points_reward INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_badge_type (badge_type)
) ENGINE=InnoDB;

-- Student earned badges
CREATE TABLE student_badges (
    student_badge_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    badge_id INT NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (badge_id) REFERENCES badges(badge_id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_badge (student_id, badge_id),
    INDEX idx_student_id (student_id),
    INDEX idx_badge_id (badge_id)
) ENGINE=InnoDB;

-- Student activity log (for streak tracking)
CREATE TABLE student_activities (
    activity_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    activity_date DATE NOT NULL,
    activity_type ENUM('login', 'lesson_complete', 'assignment_submit', 'quiz_attempt', 'code_submit') NOT NULL,
    duration_minutes INT DEFAULT 0,
    points_earned INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    INDEX idx_student_id (student_id),
    INDEX idx_activity_date (activity_date),
    INDEX idx_activity_type (activity_type)
) ENGINE=InnoDB;

-- ============================================
-- STUDY MATERIALS & RESOURCES
-- ============================================

-- Study materials
CREATE TABLE study_materials (
    material_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT,
    lesson_id INT,
    material_title VARCHAR(255) NOT NULL,
    description TEXT,
    material_type ENUM('pdf', 'video', 'slides', 'code', 'external_link', 'other') NOT NULL,
    file_url VARCHAR(500),
    file_size_kb INT,
    is_downloadable BOOLEAN DEFAULT TRUE,
    uploaded_by INT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES course_lessons(lesson_id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES mentors(mentor_id) ON DELETE SET NULL,
    INDEX idx_course_id (course_id),
    INDEX idx_lesson_id (lesson_id),
    INDEX idx_material_type (material_type)
) ENGINE=InnoDB;

-- ============================================
-- COMMUNICATION TABLES
-- ============================================

-- Discussion forums
CREATE TABLE discussion_forums (
    forum_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT,
    forum_title VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    INDEX idx_course_id (course_id)
) ENGINE=InnoDB;

-- Discussion threads
CREATE TABLE discussion_threads (
    thread_id INT AUTO_INCREMENT PRIMARY KEY,
    forum_id INT NOT NULL,
    user_id INT NOT NULL,
    thread_title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE,
    views_count INT DEFAULT 0,
    replies_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (forum_id) REFERENCES discussion_forums(forum_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_forum_id (forum_id),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- Discussion replies
CREATE TABLE discussion_replies (
    reply_id INT AUTO_INCREMENT PRIMARY KEY,
    thread_id INT NOT NULL,
    user_id INT NOT NULL,
    parent_reply_id INT NULL,
    content TEXT NOT NULL,
    is_solution BOOLEAN DEFAULT FALSE,
    likes_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (thread_id) REFERENCES discussion_threads(thread_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (parent_reply_id) REFERENCES discussion_replies(reply_id) ON DELETE CASCADE,
    INDEX idx_thread_id (thread_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB;

-- Messages/Chat
CREATE TABLE messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    subject VARCHAR(255),
    message_text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_sender_id (sender_id),
    INDEX idx_receiver_id (receiver_id),
    INDEX idx_is_read (is_read)
) ENGINE=InnoDB;

-- ============================================
-- EVENTS & SCHEDULING
-- ============================================

-- Events (webinars, live sessions, etc.)
CREATE TABLE events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    event_title VARCHAR(255) NOT NULL,
    description TEXT,
    event_type ENUM('webinar', 'workshop', 'live_session', 'meeting', 'exam') NOT NULL,
    course_id INT NULL,
    host_id INT NOT NULL,
    start_datetime TIMESTAMP NOT NULL,
    end_datetime TIMESTAMP NOT NULL,
    meeting_link VARCHAR(500),
    max_participants INT,
    is_recorded BOOLEAN DEFAULT FALSE,
    recording_url VARCHAR(500),
    status ENUM('scheduled', 'ongoing', 'completed', 'cancelled') DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE SET NULL,
    FOREIGN KEY (host_id) REFERENCES mentors(mentor_id) ON DELETE CASCADE,
    INDEX idx_course_id (course_id),
    INDEX idx_host_id (host_id),
    INDEX idx_start_datetime (start_datetime),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- Event registrations
CREATE TABLE event_registrations (
    registration_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    attendance_status ENUM('registered', 'attended', 'absent', 'cancelled') DEFAULT 'registered',
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_registration (event_id, user_id),
    INDEX idx_event_id (event_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB;

-- ============================================
-- NOTIFICATIONS
-- ============================================

-- Notifications
CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    notification_type ENUM('assignment', 'grade', 'message', 'enrollment', 'event', 'system', 'achievement') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    reference_id INT NULL,
    reference_type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- ============================================
-- ANALYTICS & REPORTS
-- ============================================

-- Student performance analytics
CREATE TABLE student_analytics (
    analytics_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    date DATE NOT NULL,
    total_time_minutes INT DEFAULT 0,
    lessons_completed INT DEFAULT 0,
    assignments_completed INT DEFAULT 0,
    quizzes_attempted INT DEFAULT 0,
    average_score DECIMAL(5,2),
    points_earned INT DEFAULT 0,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_date (student_id, date),
    INDEX idx_student_id (student_id),
    INDEX idx_date (date)
) ENGINE=InnoDB;

-- Course analytics
CREATE TABLE course_analytics (
    analytics_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    date DATE NOT NULL,
    total_enrollments INT DEFAULT 0,
    active_students INT DEFAULT 0,
    completion_rate DECIMAL(5,2),
    average_rating DECIMAL(2,1),
    total_reviews INT DEFAULT 0,
    revenue DECIMAL(10,2) DEFAULT 0.00,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    UNIQUE KEY unique_course_date (course_id, date),
    INDEX idx_course_id (course_id),
    INDEX idx_date (date)
) ENGINE=InnoDB;

-- System reports
CREATE TABLE system_reports (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    report_type ENUM('student_performance', 'course_analytics', 'revenue', 'engagement', 'custom') NOT NULL,
    report_title VARCHAR(255) NOT NULL,
    report_data JSON,
    generated_by INT,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (generated_by) REFERENCES admins(admin_id) ON DELETE SET NULL,
    INDEX idx_report_type (report_type),
    INDEX idx_generated_at (generated_at)
) ENGINE=InnoDB;

-- ============================================
-- PAYMENT & TRANSACTIONS (Optional)
-- ============================================

-- Payment transactions
CREATE TABLE transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    payment_method ENUM('credit_card', 'debit_card', 'upi', 'net_banking', 'wallet') NOT NULL,
    transaction_status ENUM('pending', 'success', 'failed', 'refunded') DEFAULT 'pending',
    payment_gateway_ref VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE SET NULL,
    INDEX idx_student_id (student_id),
    INDEX idx_transaction_status (transaction_status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- ============================================
-- SETTINGS & CONFIGURATIONS
-- ============================================

-- System settings
CREATE TABLE system_settings (
    setting_id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_setting_key (setting_key)
) ENGINE=InnoDB;

-- ============================================
-- PASSWORD RESET & VERIFICATION
-- ============================================

-- OTP/Token storage for password reset
CREATE TABLE password_resets (
    reset_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    otp VARCHAR(10),
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_token (token),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB;

-- Email verification tokens
CREATE TABLE email_verifications (
    verification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_token (token)
) ENGINE=InnoDB;

-- ============================================
-- SAMPLE DATA INSERTION
-- ============================================

-- Insert sample categories
INSERT INTO categories (category_name, description, icon) VALUES
('Web Development', 'Learn modern web development technologies', 'ri-code-s-line'),
('Data Science', 'Master data analysis and machine learning', 'ri-bar-chart-line'),
('Mobile Development', 'Build native and cross-platform mobile apps', 'ri-smartphone-line'),
('UI/UX Design', 'Create beautiful and user-friendly interfaces', 'ri-palette-line'),
('Digital Marketing', 'Grow your business with digital strategies', 'ri-megaphone-line'),
('Cybersecurity', 'Protect systems and secure digital assets', 'ri-shield-check-line');

-- Insert sample admin user
INSERT INTO users (email, username, password, full_name, phone, user_type, status, email_verified, profile_image) VALUES
('admin@sowberry.com', 'admin', 'admin123', 'System Admin', '+918825756388', 'admin', 'active', TRUE, './assets/images/team/admin.jpg');

INSERT INTO admins (user_id, admin_code, role) VALUES
(1, 'ADM001', 'super_admin');

-- Insert sample system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description) VALUES
('site_name', 'Sowberry Academy', 'string', 'Website name'),
('site_email', 'berries@sowberry.com', 'string', 'Contact email'),
('site_phone', '+918825756388', 'string', 'Contact phone'),
('max_login_attempts', '5', 'number', 'Maximum login attempts before lockout'),
('session_timeout', '30', 'number', 'Session timeout in minutes'),
('default_language', 'en', 'string', 'Default system language');

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- View for active courses with mentor details
CREATE VIEW v_active_courses AS
SELECT 
    c.course_id,
    c.course_code,
    c.course_name,
    c.difficulty_level,
    c.duration_hours,
    c.price,
    c.rating,
    c.total_enrollments,
    cat.category_name,
    u.full_name AS mentor_name,
    m.rating AS mentor_rating
FROM courses c
LEFT JOIN categories cat ON c.category_id = cat.category_id
LEFT JOIN mentors m ON c.mentor_id = m.mentor_id
LEFT JOIN users u ON m.user_id = u.user_id
WHERE c.course_status = 'published';

-- View for student progress summary
CREATE VIEW v_student_progress AS
SELECT 
    s.student_id,
    u.full_name,
    u.email,
    s.student_code,
    COUNT(DISTINCT ce.course_id) AS enrolled_courses,
    COUNT(DISTINCT CASE WHEN ce.status = 'completed' THEN ce.course_id END) AS completed_courses,
    AVG(ce.progress_percentage) AS average_progress,
    s.gpa,
    s.total_credits,
    s.learning_hours,
    s.current_streak,
    s.longest_streak
FROM students s
JOIN users u ON s.user_id = u.user_id
LEFT JOIN course_enrollments ce ON s.student_id = ce.student_id
WHERE u.status = 'active'
GROUP BY s.student_id;

-- View for mentor statistics
CREATE VIEW v_mentor_stats AS
SELECT 
    m.mentor_id,
    u.full_name,
    u.email,
    m.mentor_code,
    m.specialization,
    m.rating,
    m.total_reviews,
    COUNT(DISTINCT c.course_id) AS total_courses,
    COUNT(DISTINCT ce.student_id) AS total_students,
    AVG(c.rating) AS average_course_rating
FROM mentors m
JOIN users u ON m.user_id = u.user_id
LEFT JOIN courses c ON m.mentor_id = c.mentor_id
LEFT JOIN course_enrollments ce ON c.course_id = ce.course_id
WHERE u.status = 'active'
GROUP BY m.mentor_id;

-- ============================================
-- TRIGGERS
-- ============================================

-- Update course rating when new review is added
DELIMITER //
CREATE TRIGGER update_course_rating_after_review
AFTER INSERT ON course_reviews
FOR EACH ROW
BEGIN
    UPDATE courses c
    SET 
        c.rating = (SELECT AVG(rating) FROM course_reviews WHERE course_id = NEW.course_id),
        c.total_reviews = (SELECT COUNT(*) FROM course_reviews WHERE course_id = NEW.course_id)
    WHERE c.course_id = NEW.course_id;
END;//
DELIMITER ;

-- Update student streak on activity
DELIMITER //
CREATE TRIGGER update_student_streak
AFTER INSERT ON student_activities
FOR EACH ROW
BEGIN
    DECLARE last_activity DATE;
    DECLARE current_streak INT;
    
    SELECT MAX(activity_date) INTO last_activity
    FROM student_activities
    WHERE student_id = NEW.student_id AND activity_date < NEW.activity_date;
    
    IF last_activity = DATE_SUB(NEW.activity_date, INTERVAL 1 DAY) THEN
        UPDATE students 
        SET current_streak = current_streak + 1,
            longest_streak = GREATEST(longest_streak, current_streak + 1),
            last_activity_date = NEW.activity_date
        WHERE student_id = NEW.student_id;
    ELSE
        UPDATE students 
        SET current_streak = 1,
            last_activity_date = NEW.activity_date
        WHERE student_id = NEW.student_id;
    END IF;
END;//
DELIMITER ;

-- ============================================
-- INDEXES FOR OPTIMIZATION
-- ============================================

-- Additional composite indexes for better query performance
CREATE INDEX idx_enrollment_student_status ON course_enrollments(student_id, status);
CREATE INDEX idx_assignment_course_due ON assignments(course_id, due_date);
CREATE INDEX idx_lesson_progress_enrollment_status ON lesson_progress(enrollment_id, status);
CREATE INDEX idx_notification_user_read ON notifications(user_id, is_read, created_at);
CREATE INDEX idx_student_activity_date ON student_activities(student_id, activity_date);

-- ============================================
-- END OF SCHEMA
-- ============================================
