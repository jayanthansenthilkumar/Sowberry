<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sowberry Academy</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../assets/css/mentor.css">
    <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <!-- Add this div for mobile overlay -->
    <div class="sidebar-overlay"></div>
    
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
            <!-- <span>Sowberry</span> -->
            <div class="logo-text">
                <span class="brand-name">Sowberry</span>
                <span class="brand-suffix">ACADEMY</span>
            </div>
        </div>
        <nav>
            <a href="#" class="active"><i class="ri-home-4-line"></i><span>Overview</span></a>
            <a href="newCourses.php"><i class="ri-book-open-line"></i><span>Courses</span></a>
            <a href="studentsProgress.php"><i class="ri-user-follow-line"></i><span>Students</span></a>
            <a href="newAssignments.php"><i class="ri-award-line"></i><span>Assignments</span></a>
            <a href="newEvents.php"><i class="ri-calendar-event-line"></i><span>Events</span></a>
            <a href="newAptitude.php"><i class="ri-mental-health-line"></i><span>Aptitude</span></a>
            <a href="newproblemSolving.php"><i class="ri-code-box-line"></i><span>Problem Solving</span></a>
            <a href="mentorDiscussion.php"><i class="ri-chat-1-line"></i><span>Discussion</span></a>
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
                    <img src="https://ui-avatars.com/api/?name=Sowmiya&size=30" alt="User" class="user-avatar">
                    <div class="user-info">
                        <span class="user-name">Sowmiya</span>
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
                        <h1>Welcome,<span class="highlight">Sowmiya!</span></h1>
                        <p>Here's what's happening with your courses today.</p>
                    </div>
                    <div class="welcome-stats">
                        <div class="stat-item floating">
                            <div class="stat-icon"><i class="ri-user-line"></i></div>
                            <div class="stat-info">
                                <h4>Active Students</h4>
                                <p>1,285</p>
                            </div>
                        </div>
                        <div class="stat-item floating delay-1">
                            <div class="stat-icon"><i class="ri-book-open-line"></i></div>
                            <div class="stat-info">
                                <h4>Total Courses</h4>
                                <p>42</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="dashboard-grid">
            <div class="card animate">
                <div class="card-header">
                    <h3>Active Learners</h3><i class="ri-user-smile-line"></i>
                </div>
                <h2 id="activeLearnersCount">0</h2>
                <div class="chart-container">
                    <canvas id="studentsChart"></canvas>
                </div>
            </div>
            <div class="card animate">
                <div class="card-header">
                    <h3>Learning Progress</h3><i class="ri-line-chart-line"></i>
                </div>
                <h2 id="learningProgressPercent">0%</h2>
                <div class="chart-container">
                    <canvas id="completionChart"></canvas>
                </div>
            </div>
            <div class="card animate">
                <div class="card-header">
                    <h3>Course Enrollments</h3><i class="ri-book-mark-line"></i>
                </div>
                <h2 id="enrollmentsCount">0</h2>
                <div class="chart-container">
                    <canvas id="enrollmentsChart"></canvas>
                </div>
            </div>
        </div>
        <div class="activity-section">
            <div class="card animate">
                <h3>Recent Activities</h3>
                <div class="activity-list">
                    <div class="activity-item">
                        <i class="ri-video-line"></i>
                        <div class="activity-info">
                            <p>New course published: "Advanced JavaScript"</p>
                            <span>2 hours ago</span>
                        </div>
                    </div>
                    <div class="activity-item">
                        <i class="ri-task-line"></i>
                        <div class="activity-info">
                            <p>Assignment submitted by 45 students</p>
                            <span>5 hours ago</span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Add Popular Courses Card -->
            <div class="card animate">
                <h3>Popular Courses</h3>
                <div class="popular-courses">
                    <div class="course-item">
                        <div class="course-info">
                            <div class="course-icon">
                                <i class="ri-code-s-line"></i>
                            </div>
                            <div>
                                <h4>JavaScript Fundamentals</h4>
                                <p>850 students</p>
                            </div>
                        </div>
                        <div class="course-stats">
                            <div class="rating">
                                <i class="ri-star-fill"></i>
                                <span>4.8</span>
                            </div>
                            <div class="trend up">
                                <i class="ri-arrow-up-line"></i>
                                <span>12%</span>
                            </div>
                        </div>
                    </div>
                    <div class="course-item">
                        <div class="course-info">
                            <div class="course-icon">
                                <i class="ri-html5-line"></i>
                            </div>
                            <div>
                                <h4>HTML & CSS Mastery</h4>
                                <p>720 students</p>
                            </div>
                        </div>
                        <div class="course-stats">
                            <div class="rating">
                                <i class="ri-star-fill"></i>
                                <span>4.6</span>
                            </div>
                            <div class="trend up">
                                <i class="ri-arrow-up-line"></i>
                                <span>8%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
    <script src="../assets/script/mentor.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Sample data for charts
            const monthlyData = {
                students: [1847, 2100, 2320, 2500, 2700, 2847],
                completion: [65, 68, 72, 75, 77, 78],
                enrollments: [8500, 9600, 10400, 11200, 12000, 12583]
            };

            const labels = ['January', 'February', 'March', 'April', 'May', 'June'];

            // Common chart options
            const chartOptions = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'var(--card-bg)',
                        titleColor: 'var(--text)',
                        bodyColor: 'var(--text)',
                        borderColor: 'var(--border-color)',
                        borderWidth: 1,
                        padding: 10,
                        cornerRadius: 8
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(99, 102, 241, 0.1)'
                        }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            };

            // Create charts
            function createChart(canvasId, data, color) {
                return new Chart(document.getElementById(canvasId), {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            data: data,
                            borderColor: color,
                            backgroundColor: color + '20',
                            tension: 0.4,
                            fill: true
                        }]
                    },
                    options: chartOptions
                });
            }

            // Initialize charts
            createChart('studentsChart', monthlyData.students, '#6366f1');
            createChart('completionChart', monthlyData.completion, '#8b5cf6');
            createChart('enrollmentsChart', monthlyData.enrollments, '#06b6d4');

            // Animate counter function
            function animateCounter(elementId, targetValue, duration = 2000, prefix = '', suffix = '') {
                const element = document.getElementById(elementId);
                const start = Number(element.innerText.replace(/[^0-9.-]+/g, ''));
                const increment = (targetValue - start) / (duration / 16);
                let current = start;

                const animate = () => {
                    current += increment;
                    if ((increment >= 0 && current >= targetValue) || 
                        (increment < 0 && current <= targetValue)) {
                        element.textContent = prefix + targetValue.toLocaleString() + suffix;
                    } else {
                        element.textContent = prefix + Math.round(current).toLocaleString() + suffix;
                        requestAnimationFrame(animate);
                    }
                };

                animate();
            }

            // Animate the counters
            setTimeout(() => {
                animateCounter('activeLearnersCount', 2847);
                animateCounter('learningProgressPercent', 78, 2000, '', '%');
                animateCounter('enrollmentsCount', 12583);
            }, 500);

            // Update real-time data every 5 minutes
            setInterval(() => {
                // Simulate real-time data updates
                const randomChange = () => Math.floor(Math.random() * 21) - 10; // -10 to +10

                monthlyData.students = monthlyData.students.map(val => 
                    Math.max(0, val + randomChange()));
                monthlyData.completion = monthlyData.completion.map(val => 
                    Math.min(100, Math.max(0, val + randomChange() / 10)));
                monthlyData.enrollments = monthlyData.enrollments.map(val => 
                    Math.max(0, val + randomChange() * 10));

                // Update charts
                Chart.instances.forEach(chart => chart.update());

                // Update counters
                animateCounter('activeLearnersCount', monthlyData.students[5], 1000);
                animateCounter('learningProgressPercent', monthlyData.completion[5], 1000, '', '%');
                animateCounter('enrollmentsCount', monthlyData.enrollments[5], 1000);
            }, 300000); // 5 minutes
        });
    </script>
</body>
</html>



