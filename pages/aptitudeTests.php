<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aptitude Tests - Sowberry</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet">
    <link rel="stylesheet" href="../assets/css/students.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <button class="mobile-menu-toggle">
        <i class="ri-menu-line"></i>
    </button>
    <!-- Sidebar -->
    <div class="sidebar">
        <!-- Same sidebar as other pages -->
        <div class="logo">
            <i class="ri-seedling-fill"></i>
            <div class="logo-text">
                <span class="brand-name">Sowberry</span>
                <span class="brand-suffix">LEARNING</span>
            </div>
        </div>
        <nav>
            <a href="studentsDashboard.php"><i class="ri-dashboard-line"></i><span>Dashboard</span></a>
            <a href="myCourses.php"><i class="ri-book-open-line"></i><span>My Courses</span></a>
            <a href="myProgress.php"><i class="ri-line-chart-line"></i><span>My Progress</span></a>
            <a href="myAssignments.php"><i class="ri-task-line"></i><span>Assignments</span></a>
            <a href="studyMaterial.php"><i class="ri-folder-5-line"></i><span>Study Material</span></a>
            <a href="myGrades.php"><i class="ri-medal-line"></i><span>Grades</span></a>
            <a href="aptitudeTests.php" class="active"><i class="ri-brain-line"></i><span>Aptitude</span></a>
            <a href="codingPractice.php"><i class="ri-code-box-line"></i><span>Practice</span></a>
            <a href="codeEditor.php"><i class="ri-terminal-box-line"></i><span>Code Editor</span></a>
            <a href="learningGames.php"><i class="ri-gamepad-line"></i><span>Learning Games</span></a>
            <a href="studentDiscussion.php"><i class="ri-discuss-line"></i><span>Discussion</span></a>
        </nav>
    </div>
    <main>
        <header>
            <div class="search-bar">
                <i class="ri-search-line"></i>
                <input type="text" placeholder="Search...">
            </div>
            <div class="header-tools">
                <div class="theme-toggle">
                    <i class="ri-sun-line"></i>
                </div>
                <div class="notifications" id="notifications">
                    <i class="ri-notification-3-line"></i>
                    <span class="notification-badge">3</span>
                    <div class="notifications-dropdown">
                        <div class="notifications-header">
                            <h4>Notifications</h4>
                            <a href="#" class="mark-all-read">Mark all as read</a>
                        </div>
                        <div class="notification-list">
                            <a href="#" class="notification-item unread">
                                <i class="ri-message-2-line"></i>
                                <div class="notification-content">
                                    <p>Quiz result: Advanced JavaScript</p>
                                    <span>2 minutes ago</span>
                                </div>
                            </a>
                            <a href="#" class="notification-item unread">
                                <i class="ri-trophy-line"></i>
                                <div class="notification-content">
                                    <p>New achievement unlocked!</p>
                                    <span>1 hour ago</span>
                                </div>
                            </a>
                            <a href="#" class="notification-item">
                                <i class="ri-file-list-line"></i>
                                <div class="notification-content">
                                    <p>Weekly progress report available</p>
                                    <span>3 hours ago</span>
                                </div>
                            </a>
                        </div>
                        <a href="#" class="view-all">View all notifications</a>
                    </div>
                </div>
                <div class="user-profile" id="userProfile">
                    <img src="https://ui-avatars.com/api/?name=Sowmiya&size=32" alt="User" class="user-avatar">
                    <div class="user-info">
                        <span class="user-name">Sowmiya</span>
                        <span class="user-status">
                            <i class="ri-checkbox-blank-circle-fill"></i>
                            Active
                        </span>
                    </div>
                    <div class="profile-dropdown">
                        <a href="#"><i class="ri-user-line"></i> My Profile</a>
                        <a href="#"><i class="ri-settings-4-line"></i> Settings</a>
                        <div class="dropdown-divider"></div>
                        <a href="#" class="logout"><i class="ri-logout-box-line"></i> Logout</a>
                    </div>
                </div>
            </div>
        </header>

        <!-- Practice & Test Navigation -->
        <div class="practice-test-nav">
            <div class="nav-tabs">
                <button class="nav-tab active" data-tab="practice">Practice Questions</button>
                <button class="nav-tab" data-tab="tests">Scheduled Tests</button>
                <button class="nav-tab" data-tab="history">Practice History</button>
            </div>
        </div>
        <!-- Practice Section -->
        <div class="tab-content active" id="practiceSection">
            <div class="quick-practice-cards">
                <div class="practice-card">
                    <div class="practice-header">
                        <i class="ri-brain-line"></i>
                        <h3>Logical Reasoning</h3>
                    </div>
                    <div class="topic-list">
                        <!-- Initial visible topics -->
                        <div class="topic-grid">
                            <div class="topic-item">
                                <span>Pattern Recognition</span>
                                <button class="practice-btn">Practice Now</button>
                            </div>
                            <div class="topic-item new">
                                <span>Sequence Analysis</span>
                                <button class="practice-btn">Practice Now</button>
                            </div>
                            <div class="topic-item popular">
                                <span>Verbal Reasoning</span>
                                <button class="practice-btn">Practice Now</button>
                            </div>
                        </div> 
                        <!-- Expandable topics -->
                        <div class="expanded-topics">
                            <div class="topic-columns">
                                <!-- Column 1 -->
                                <div class="topic-column">
                                    <div class="topic-item">
                                        <span>Data Interpretation</span>
                                        <button class="practice-btn">Practice Now</button>
                                    </div>
                                    <div class="topic-item new">
                                        <span>Critical Analysis</span>
                                        <button class="practice-btn">Practice Now</button>
                                    </div>
                                    <div class="topic-item">
                                        <span>Analogies</span>
                                        <button class="practice-btn">Practice Now</button>
                                    </div>
                                </div>
                                
                                <!-- Column 2 -->
                                <div class="topic-column">
                                    <div class="topic-item popular">
                                        <span>Logical Deduction</span>
                                        <button class="practice-btn">Practice Now</button>
                                    </div>
                                    <div class="topic-item">
                                        <span>Syllogisms</span>
                                        <button class="practice-btn">Practice Now</button>
                                    </div>
                                    <div class="topic-item new">
                                        <span>Blood Relations</span>
                                        <button class="practice-btn">Practice Now</button>
                                    </div>
                                </div>
                                
                                <!-- Column 3 -->
                                <div class="topic-column">
                                    <div class="topic-item">
                                        <span>Abstract Reasoning</span>
                                        <button class="practice-btn">Practice Now</button>
                                    </div>
                                    <div class="topic-item popular">
                                        <span>Statement & Assumptions</span>
                                        <button class="practice-btn">Practice Now</button>
                                    </div>
                                    <div class="topic-item">
                                        <span>Coding-Decoding</span>
                                        <button class="practice-btn">Practice Now</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <button class="view-all-btn">
                            View All Topics <i class="ri-arrow-down-s-line"></i>
                        </button>
                    </div>
                </div>
                
                <!-- Technical Skills Card -->
                <div class="practice-card">
                    <div class="practice-header">
                        <i class="ri-code-box-line"></i>
                        <h3>Technical Skills</h3>
                    </div>
                    <div class="topic-list">
                        <div class="topic-grid">
                            <div class="topic-item">
                                <span>Data Structures</span>
                                <button class="practice-btn">Practice Now</button>
                            </div>
                            <div class="topic-item new">
                                <span>Algorithm Analysis</span>
                                <button class="practice-btn">Practice Now</button>
                            </div>
                            <div class="topic-item popular">
                                <span>System Design</span>
                                <button class="practice-btn">Practice Now</button>
                            </div>
                        </div>
                        
                        <!-- Fixed Expandable Topics -->
                        <div class="expanded-topics">
                            <div class="topic-columns">
                                <div class="topic-column">
                                    <div class="topic-item">
                                        <span>Dynamic Programming</span>
                                        <button class="practice-btn">Practice Now</button>
                                    </div>
                                    <div class="topic-item new">
                                        <span>Graph Algorithms</span>
                                        <button class="practice-btn">Practice Now</button>
                                    </div>
                                    <div class="topic-item">
                                        <span>Binary Trees</span>
                                        <button class="practice-btn">Practice Now</button>
                                    </div>
                                </div>
                                
                                <div class="topic-column">
                                    <div class="topic-item popular">
                                        <span>Database Design</span>
                                        <button class="practice-btn">Practice Now</button>
                                    </div>
                                    <div class="topic-item">
                                        <span>Network Protocols</span>
                                        <button class="practice-btn">Practice Now</button>
                                    </div>
                                    <div class="topic-item new">
                                        <span>Operating Systems</span>
                                        <button class="practice-btn">Practice Now</button>
                                    </div>
                                </div>
                                
                                <div class="topic-column">
                                    <div class="topic-item">
                                        <span>Web Architecture</span>
                                        <button class="practice-btn">Practice Now</button>
                                    </div>
                                    <div class="topic-item popular">
                                        <span>System Security</span>
                                        <button class="practice-btn">Practice Now</button>
                                    </div>
                                    <div class="topic-item">
                                        <span>Cloud Computing</span>
                                        <button class="practice-btn">Practice Now</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button class="view-all-btn">
                            View All Topics <i class="ri-arrow-down-s-line"></i>
                        </button>
                    </div>
                </div>
                <!-- Quantitative Card -->
                <div class="practice-card">
                    <div class="practice-header">
                        <i class="ri-calculator-line"></i>
                        <h3>Quantitative</h3>
                    </div>
                    <div class="topic-list">
                        <div class="topic-grid">
                            <div class="topic-item">
                                <span>Number Systems</span>
                                <button class="practice-btn">Practice Now</button>
                            </div>
                            <div class="topic-item new">
                                <span>Probability</span>
                                <button class="practice-btn">Practice Now</button>
                            </div>
                            <div class="topic-item popular">
                                <span>Data Analysis</span>
                                <button class="practice-btn">Practice Now</button>
                            </div>
                        </div>
                        
                        <!-- Fixed Expandable Topics -->
                        <div class="expanded-topics">
                            <div class="topic-columns">
                                <div class="topic-column">
                                    <div class="topic-item">
                                        <span>Time and Work</span>
                                        <button class="practice-btn">Practice Now</button>
                                    </div>
                                    <div class="topic-item new">
                                        <span>Permutation & Combination</span>
                                        <button class="practice-btn">Practice Now</button>
                                    </div>
                                    <div class="topic-item">
                                        <span>Profit and Loss</span>
                                        <button class="practice-btn">Practice Now</button>
                                    </div>
                                </div>
                                
                                <div class="topic-column">
                                    <div class="topic-item popular">
                                        <span>Ratio & Proportion</span>
                                        <button class="practice-btn">Practice Now</button>
                                    </div>
                                    <div class="topic-item">
                                        <span>Simple Interest</span>
                                        <button class="practice-btn">Practice Now</button>
                                    </div>
                                    <div class="topic-item new">
                                        <span>Compound Interest</span>
                                        <button class="practice-btn">Practice Now</button>
                                    </div>
                                </div>
                                
                                <div class="topic-column">
                                    <div class="topic-item">
                                        <span>Algebra</span>
                                        <button class="practice-btn">Practice Now</button>
                                    </div>
                                    <div class="topic-item popular">
                                        <span>Geometry</span>
                                        <button class="practice-btn">Practice Now</button>
                                    </div>
                                    <div class="topic-item">
                                        <span>Trigonometry</span>
                                        <button class="practice-btn">Practice Now</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <button class="view-all-btn">
                            View All Topics <i class="ri-arrow-down-s-line"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Scheduled Tests Section -->
        <div class="tab-content" id="testsSection">
            <div class="upcoming-tests">
                <h3>Upcoming Tests</h3>
                <div class="test-cards">
                    <div class="test-card">
                        <div class="test-status upcoming">Starts in 2 days</div>
                        <h4>Comprehensive Aptitude Test</h4>
                        <p>Duration: 90 minutes</p>
                        <div class="test-info">
                            <span><i class="ri-question-line"></i> 60 Questions</span>
                            <span><i class="ri-time-line"></i> Dec 20, 2023</span>
                        </div>
                        <button class="prepare-btn">Prepare Now</button>
                    </div>
                    <!-- More test cards -->
                </div>
            </div>
        </div>

        <!-- Practice History Section -->
        <div class="tab-content" id="historySection">
            <div class="practice-history">
                <div class="history-filters">
                    <select class="topic-filter">
                        <option value="all">All Topics</option>
                        <option value="logical">Logical Reasoning</option>
                        <option value="technical">Technical Skills</option>
                        <option value="quant">Quantitative</option>
                    </select>
                    <div class="date-filter">
                        <input type="date" class="date-input">
                    </div>
                </div>
                <div class="history-list">
                    <div class="history-item">
                        <div class="history-info">
                            <h4>Pattern Recognition Practice</h4>
                            <p>20 questions attempted</p>
                        </div>
                        <div class="history-stats">
                            <span class="accuracy">85% Accuracy</span>
                            <span class="time">15 mins</span>
                        </div>
                        <button class="review-btn">Review Answers</button>
                    </div>
                    <!-- More history items -->
                </div>
            </div>
        </div>

        <!-- Practice/Test Interface -->
        <div class="practice-interface" style="display: none;">
            <div class="interface-header">
                <div class="question-info">
                    <h3>Question 1 of 20</h3>
                    <div class="timer">Time Left: 29:45</div>
                </div>
                <button class="exit-btn"><i class="ri-close-line"></i> Exit Practice</button>
            </div>

            <div class="question-container">
                <div class="question-content">
                    <!-- Question will be loaded here -->
                </div>
                <div class="answer-options">
                    <!-- Options will be loaded here -->
                </div>
            </div>

            <div class="interface-footer">
                <button class="prev-btn">Previous</button>
                <div class="question-nav">
                    <!-- Question navigation dots -->
                </div>
                <button class="next-btn">Next</button>
                <button class="submit-btn">Submit</button>
            </div>
        </div>
    </main>

    <!-- Test Result Modal -->
    <div class="modal" id="testResultModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Test Results</h3>
                <button class="close-modal"><i class="ri-close-line"></i></button>
            </div>
            <div class="result-summary">
                <!-- Result content -->
            </div>
        </div>
    </div>

    <!-- Add new modal for practice summary -->
    <div class="modal" id="practiceSummaryModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Practice Summary</h3>
                <button class="close-modal"><i class="ri-close-line"></i></button>
            </div>
            <div class="summary-content">
                <div class="score-overview">
                    <div class="score-circle">
                        <svg viewBox="0 0 36 36" class="circular-chart">
                            <!-- Score circle will be added dynamically -->
                        </svg>
                        <div class="score-text">85%</div>
                    </div>
                    <div class="score-details">
                        <div class="detail-item">
                            <span>Correct</span>
                            <span class="correct">17/20</span>
                        </div>
                        <div class="detail-item">
                            <span>Time Taken</span>
                            <span>15:30</span>
                        </div>
                    </div>
                </div>
                <div class="question-analysis">
                    <!-- Question analysis will be added here -->
                </div>
            </div>
            <div class="modal-footer">
                <button class="review-answers-btn">Review Answers</button>
                <button class="practice-again-btn">Practice Again</button>
            </div>
        </div>
    </div>

    <script src="../assets/script/students.js"></script>
    <script>
        // Initialize Performance Chart
        const ctx = document.getElementById('performanceChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
                datasets: [{
                    label: 'Logical Reasoning',
                    data: [75, 82, 85, 88, 90, 92],
                    borderColor: '#ff6b6b',
                    tension: 0.4
                },
                {
                    label: 'Technical Skills',
                    data: [70, 72, 75, 78, 82, 85],
                    borderColor: '#6c5ce7',
                    tension: 0.4
                },
                {
                    label: 'Quantitative',
                    data: [80, 83, 85, 88, 92, 95],
                    borderColor: '#20c997',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    </script>
</body>
</html>



