<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sowberry</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../assets/css/students.css">
    <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <!-- jQuery and SweetAlert2 -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>
<body>
    <button class="hamburger-menu">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
    </button>
    <button class="mobile-menu-toggle">
        <i class="ri-menu-line"></i>
    </button>
    <div class="sidebar">
        <div class="logo">
            <i class="ri-seedling-fill"></i>
            <span>Sowberry</span>
        </div>
        <nav>
            <a href="#" class="active"><i class="ri-dashboard-line"></i><span>Dashboard</span></a>
            <a href="myCourses.php"><i class="ri-book-open-line"></i><span>My Courses</span></a>
            <a href="myProgress.php"><i class="ri-line-chart-line"></i><span>My Progress</span></a>
            <a href="myAssignments.php"><i class="ri-task-line"></i><span>Assignments</span></a>
            <a href="studyMaterial.php"><i class="ri-folder-5-line"></i><span>Study Material</span></a>
            <a href="myGrades.php"><i class="ri-medal-line"></i><span>Grades</span></a>
            <a href="aptitudeTests.php"><i class="ri-brain-line"></i><span>Aptitude</span></a>
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
                                    <p>New comment on your post</p>
                                    <span>2 minutes ago</span>
                                </div>
                            </a>
                            <a href="#" class="notification-item unread">
                                <i class="ri-user-follow-line"></i>
                                <div class="notification-content">
                                    <p>New student enrolled in JavaScript course</p>
                                    <span>1 hour ago</span>
                                </div>
                            </a>
                            <a href="#" class="notification-item">
                                <i class="ri-file-list-line"></i>
                                <div class="notification-content">
                                    <p>Assignment deadline reminder</p>
                                    <span>3 hours ago</span>
                                </div>
                            </a>
                        </div>
                        <a href="#" class="view-all">View all notifications</a>
                    </div>
                </div>
                <div class="user-profile" id="userProfile">
                    <img src="https://ui-avatars.com/api/?name=Student&size=30" alt="User" class="user-avatar" id="userAvatar">
                    <div class="user-info">
                        <span class="user-name" id="userName">Student</span>
                        <span class="user-status">
                            <i class="ri-checkbox-blank-circle-fill"></i>
                            Active
                        </span>
                    </div>
                    <div class="profile-dropdown">
                        <a href="#"><i class="ri-user-line"></i> My Profile</a>
                        <a href="#"><i class="ri-lock-password-line"></i> Change Password</a>
                        <div class="dropdown-divider"></div>
                        <a href="#" class="logout"><i class="ri-logout-box-line"></i> Logout</a>
                    </div>
                </div>
            </div>
        </header>
        
        <!-- Add Welcome Card -->
        <div class="welcome-section">
            <div class="welcome-card">
                <div class="welcome-content">
                    <div class="welcome-text">
                        <h1>Welcome back, <span class="highlight" id="welcomeName">Student</span>!</h1>
                        <p>Continue your learning journey. You're making great progress!</p>
                    </div>
                    <div class="welcome-stats">
                        <div class="stat-item floating">
                            <div class="stat-icon">
                                <i class="ri-book-mark-line"></i>
                            </div>
                            <div class="stat-info">
                                <h4>Enrolled Courses</h4>
                                <p id="enrolledCourses">0</p>
                            </div>
                        </div>
                        <div class="stat-item floating delay-1">
                            <div class="stat-icon">
                                <i class="ri-award-line"></i>
                            </div>
                            <div class="stat-info">
                                <h4>Certificates</h4>
                                <p id="certificatesCount">0</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add Streak Section -->
        <div class="streak-section">
            <div class="streak-container">
                <div class="streak-stats">
                    <div class="stat-card">
                        <i class="ri-fire-fill"></i>
                        <div class="stat-info">
                            <h4>Current Streak</h4>
                            <div class="stat-value">7 days</div>
                            <span class="stat-date">Feb 8 - Feb 14</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <i class="ri-trophy-fill"></i>
                        <div class="stat-info">
                            <h4>Longest Streak</h4>
                            <div class="stat-value">15 days</div>
                            <span class="stat-date">Jan 1 - Jan 15</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <i class="ri-time-fill"></i>
                        <div class="stat-info">
                            <h4>Total Study Hours</h4>
                            <div class="stat-value">248h</div>
                            <span class="stat-date">Last 365 days</span>
                        </div>
                    </div>
                </div>
                <div class="contributions-calendar">
                    <div class="calendar-header">Study Activity</div>
                    <div class="calendar-grid">
                        <div class="weekdays">
                            <span>Mon</span>
                            <span>Wed</span>
                            <span>Fri</span>
                            <span>Sun</span>
                        </div>
                        <div id="contributionsGrid" class="contributions">
                            <!-- Will be populated by JS -->
                        </div>
                    </div>
                    <div class="calendar-legend">
                        <span>Less</span>
                        <div class="legend-cells">
                            <div class="cell level-0"></div>
                            <div class="cell level-1"></div>
                            <div class="cell level-2"></div>
                            <div class="cell level-3"></div>
                            <div class="cell level-4"></div>
                        </div>
                        <span>More</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="dashboard-grid">
            <div class="card animate">
                <div class="card-header">
                    <h3>Learning Progress</h3>    
                    <i class="ri-line-chart-line"></i>
                </div>
                <h2 id="overallProgress">0%</h2>
                <div class="chart-container">
                    <canvas id="progressChart"></canvas>
                </div>
            </div>
            <div class="card animate">
                <div class="card-header">
                    <h3>Hours Studied</h3>
                    <i class="ri-time-line"></i>
                </div>
                <h2 id="hoursStudied">0h</h2>
                <div class="chart-container">
                    <canvas id="studyTimeChart"></canvas>
                </div>
            </div>
            <div class="card animate">
                <div class="card-header">
                    <h3>Assignments</h3>
                    <i class="ri-task-line"></i>
                </div>
                <h2 id="assignmentProgress">0%</h2>
                <div class="chart-container">
                    <canvas id="assignmentsChart"></canvas>
                </div>
            </div>
        </div>
        <div class="activity-section">
            <div class="card animate">
                <h3>Recent Activities</h3>
                <div class="activity-list" id="activityList">
                    <div class="activity-item">
                        <i class="ri-loader-4-line"></i>
                        <div class="activity-info">
                            <p>Loading activities...</p>
                            <span></span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Add Upcoming Tasks Section -->
            <div class="card animate">
                <h3>Upcoming Tasks</h3>
                <div class="task-list" id="taskList">
                    <div class="task-item">
                        <div class="task-info">
                            <h4>Loading...</h4>
                            <p></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
    <!-- API Handler -->
    <script src="./assets/script/api.js"></script>
    <script src="./assets/script/common.js"></script>
    <script src="../assets/script/students.js"></script>
    <script>
        let currentUser = null;
        
        // Load student dashboard data
        async function loadStudentDashboard() {
            try {
                // Check session and get current user
                const session = await API.Auth.checkSession();
                if (!session || !session.user) {
                    window.location.href = 'login.php';
                    return;
                }
                
                currentUser = session.user;
                const studentId = currentUser.id;
                
                // Update user info in header
                document.getElementById('userName').textContent = currentUser.full_name || currentUser.username;
                document.getElementById('welcomeName').textContent = currentUser.full_name || currentUser.username;
                document.getElementById('userAvatar').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.full_name || currentUser.username)}&size=30`;
                
                // Get student progress
                const progress = await API.Student.getProgress(studentId);
                
                // Update progress stats
                document.getElementById('overallProgress').textContent = `${progress.overall_progress || 0}%`;
                document.getElementById('enrolledCourses').textContent = progress.enrolled_courses || 0;
                document.getElementById('certificatesCount').textContent = progress.completed_courses || 0;
                document.getElementById('hoursStudied').textContent = `${progress.total_study_hours || 0}h`;
                
                // Load courses
                const courses = await API.Course.getAll({ student_id: studentId });
                
                // Load assignments
                const assignments = await API.Assignment.getAll({ student_id: studentId });
                
                // Calculate assignment completion
                const completedAssignments = assignments.filter(a => a.status === 'submitted' || a.status === 'graded').length;
                const assignmentPercent = assignments.length > 0 ? Math.round((completedAssignments / assignments.length) * 100) : 0;
                document.getElementById('assignmentProgress').textContent = `${assignmentPercent}%`;
                
                // Render upcoming tasks
                renderUpcomingTasks(assignments);
                
                // Render recent activities (simulate for now)
                renderRecentActivities(courses, assignments);
                
            } catch (error) {
                console.error('Failed to load dashboard:', error);
                if (error.message && error.message.includes('session')) {
                    window.location.href = 'login.php';
                }
            }
        }
        
        function renderUpcomingTasks(assignments) {
            const taskList = document.getElementById('taskList');
            taskList.innerHTML = '';
            
            // Filter pending assignments
            const pending = assignments.filter(a => a.status === 'pending').slice(0, 5);
            
            if (pending.length === 0) {
                taskList.innerHTML = `
                    <div class="task-item">
                        <div class="task-info">
                            <h4>No pending assignments</h4>
                            <p>Great job! You're all caught up!</p>
                        </div>
                        <span class="task-priority low">✓</span>
                    </div>
                `;
                return;
            }
            
            pending.forEach(assignment => {
                const dueDate = new Date(assignment.due_date);
                const today = new Date();
                const daysUntil = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
                const priority = daysUntil <= 2 ? 'high' : daysUntil <= 5 ? 'medium' : 'low';
                
                const task = `
                    <div class="task-item">
                        <div class="task-info">
                            <h4>${assignment.title}</h4>
                            <p>Due in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}</p>
                        </div>
                        <span class="task-priority ${priority}">${priority}</span>
                    </div>
                `;
                taskList.insertAdjacentHTML('beforeend', task);
            });
        }
        
        function renderRecentActivities(courses, assignments) {
            const activityList = document.getElementById('activityList');
            activityList.innerHTML = '';
            
            const activities = [];
            
            // Add course enrollments
            courses.slice(0, 2).forEach(course => {
                activities.push({
                    icon: 'ri-book-open-line',
                    text: `Enrolled in "${course.title}"`,
                    time: 'Recently',
                    type: 'course'
                });
            });
            
            // Add assignment submissions
            const submitted = assignments.filter(a => a.status === 'submitted' || a.status === 'graded').slice(0, 2);
            submitted.forEach(assignment => {
                activities.push({
                    icon: 'ri-file-text-line',
                    text: `Submitted assignment: "${assignment.title}"`,
                    time: 'Recently',
                    type: 'assignment'
                });
            });
            
            if (activities.length === 0) {
                activityList.innerHTML = `
                    <div class="activity-item">
                        <i class="ri-information-line"></i>
                        <div class="activity-info">
                            <p>No recent activities</p>
                            <span>Start learning to see your progress!</span>
                        </div>
                    </div>
                `;
                return;
            }
            
            activities.slice(0, 5).forEach(activity => {
                const item = `
                    <div class="activity-item">
                        <i class="${activity.icon}"></i>
                        <div class="activity-info">
                            <p>${activity.text}</p>
                            <span>${activity.time}</span>
                        </div>
                    </div>
                `;
                activityList.insertAdjacentHTML('beforeend', item);
            });
        }
        
        // Load dashboard on page load
        document.addEventListener('DOMContentLoaded', loadStudentDashboard);
    </script>
</body>
</html>



