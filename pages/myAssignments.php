<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Assignments - Sowberry</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../assets/css/students.css">
    <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet">
</head>
<body>
    <!-- Standard Sidebar -->
    <div class="sidebar">
        <div class="logo">
            <i class="ri-seedling-fill"></i>
            <span>Sowberry</span>
        </div>
        <nav>
            <a href="studentsDashboard.php"><i class="ri-dashboard-line"></i><span>Dashboard</span></a>
            <a href="myCourses.php"><i class="ri-book-open-line"></i><span>My Courses</span></a>
            <a href="assignments.php" class="active"><i class="ri-calendar-todo-line"></i><span>Assignments</span></a>
            <a href="#"><i class="ri-group-line"></i><span>Study Groups</span></a>
            <a href="#"><i class="ri-calendar-event-line"></i><span>Events</span></a>
            <a href="#"><i class="ri-message-3-line"></i><span>Messages</span></a>
            <a href="#"><i class="ri-settings-3-line"></i><span>Settings</span></a>
        </nav>
    </div>
    <main>
        <!-- Standard Header -->
        <header>
            <div class="search-bar">
                <i class="ri-search-line"></i>
                <input type="text" placeholder="Search assignments...">
            </div>
            <div class="header-tools">
                <div class="theme-toggle">
                    <i class="ri-sun-line"></i>
                </div>
                <div class="notifications" id="notifications">
                    <i class="ri-notification-3-line"></i>
                    <span class="notification-badge">3</span>
                    <div class="notifications-dropdown">
                        <!-- ...existing notifications content... -->
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
                        <!-- ...existing profile dropdown content... -->
                    </div>
                </div>
            </div>
        </header>

        <!-- Welcome Section -->
        <div class="welcome-section">
            <div class="welcome-card">
                <div class="welcome-content">
                    <div class="welcome-text">
                        <h1>My Assignments</h1>
                        <p>Track and manage your assignments</p>
                    </div>
                    <div class="welcome-stats">
                        <div class="stat-item floating">
                            <div class="stat-icon">
                                <i class="ri-task-line"></i>
                            </div>
                            <div class="stat-info">
                                <h4>Pending</h4>
                                <p>5</p>
                            </div>
                        </div>
                        <div class="stat-item floating delay-1">
                            <div class="stat-icon">
                                <i class="ri-check-line"></i>
                            </div>
                            <div class="stat-info">
                                <h4>Completed</h4>
                                <p>12</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Assignment Filters -->
        <div class="course-filters">
            <button class="filter-btn active" data-filter="all">All Tasks</button>
            <button class="filter-btn" data-filter="pending">Pending</button>
            <button class="filter-btn" data-filter="submitted">Submitted</button>
            <button class="filter-btn" data-filter="graded">Graded</button>
        </div>

        <!-- Assignment Grid -->
        <div class="assignments-grid">
            <!-- Pending Assignment -->
            <div class="assignment-card pending">
                <div class="assignment-header">
                    <span class="course-tag">JavaScript</span>
                    <span class="status-badge pending">Due in 2 days</span>
                </div>
                <div class="assignment-content">
                    <h3>Build a Todo App</h3>
                    <p>Create a functional todo application using vanilla JavaScript with local storage integration.</p>
                    <div class="assignment-meta">
                        <span><i class="ri-time-line"></i> Due: Dec 15, 2023</span>
                        <span><i class="ri-star-line"></i> 100 points</span>
                    </div>
                    <button class="submit-btn">Start Assignment</button>
                </div>
            </div>

            <!-- Submitted Assignment -->
            <div class="assignment-card submitted">
                <div class="assignment-header">
                    <span class="course-tag">HTML & CSS</span>
                    <span class="status-badge submitted">Submitted</span>
                </div>
                <div class="assignment-content">
                    <h3>Portfolio Website</h3>
                    <p>Design and develop a personal portfolio website using HTML5 and CSS3.</p>
                    <div class="assignment-meta">
                        <span><i class="ri-time-line"></i> Submitted: Dec 10, 2023</span>
                        <span><i class="ri-star-line"></i> 150 points</span>
                    </div>
                    <button class="view-btn">View Submission</button>
                </div>
            </div>

            <!-- Graded Assignment -->
            <div class="assignment-card graded">
                <div class="assignment-header">
                    <span class="course-tag">React</span>
                    <span class="status-badge graded">Graded</span>
                </div>
                <div class="assignment-content">
                    <h3>Weather App</h3>
                    <p>Build a weather application using React and OpenWeather API.</p>
                    <div class="assignment-meta">
                        <span><i class="ri-medal-line"></i> Score: 95/100</span>
                        <span><i class="ri-message-2-line"></i> Feedback Available</span>
                    </div>
                    <button class="feedback-btn">View Feedback</button>
                </div>
            </div>
        </div>
    </main>

    <style>
        /* Updated Assignment Card Styles */
        .assignments-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 2rem;
            margin: 2rem 0;
        }

        .assignment-card {
            display: flex;
            flex-direction: column;
            height: 380px;
            background: var(--card-bg);
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid var(--border-color);
            transition: all 0.3s ease;
        }

        .assignment-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            padding: 1.5rem;
        }

        .assignment-content p {
            flex-grow: 1;
        }

        .assignment-card:hover {
            transform: translateY(-5px);
            box-shadow: var(--shadow);
        }

        .assignment-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            border-bottom: 1px solid var(--border-color);
        }

        .course-tag {
            padding: 4px 12px;
            background: var(--hover-color);
            border-radius: 20px;
            font-size: 0.8rem;
            color: var(--primary);
        }

        .status-badge {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
        }

        .status-badge.pending {
            background: rgba(255, 159, 67, 0.1);
            color: #ff9f43;
        }

        .status-badge.submitted {
            background: rgba(108, 92, 231, 0.1);
            color: var(--secondary);
        }

        .status-badge.graded {
            background: rgba(16, 185, 129, 0.1);
            color: #10b981;
        }

        .assignment-content h3 {
            margin-bottom: 0.5rem;
            color: var(--text);
            font-size: 1.1rem;
        }

        .assignment-content p {
            color: var(--text-secondary);
            font-size: 0.9rem;
            margin-bottom: 1rem;
            line-height: 1.5;
        }

        .assignment-meta {
            display: flex;
            justify-content: space-between;
            margin-bottom: 1rem;
            font-size: 0.8rem;
            color: var(--text-secondary);
        }

        .assignment-meta span {
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .submit-btn, .view-btn, .feedback-btn {
            width: 100%;
            padding: 8px 0;
            border: none;
            border-radius: 6px;
            font-family: 'Poppins', sans-serif;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .submit-btn {
            background: var(--primary);
            color: white;
        }

        .view-btn {
            background: var(--secondary);
            color: white;
        }

        .feedback-btn {
            background: var(--hover-color);
            color: var(--text);
        }

        .submit-btn:hover, .view-btn:hover, .feedback-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(var(--primary), 0.2);
        }
    </style>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Filter functionality
            const filterButtons = document.querySelectorAll('.filter-btn');
            const assignmentCards = document.querySelectorAll('.assignment-card');

            filterButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    filterButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    const filterValue = btn.getAttribute('data-filter');
                    
                    assignmentCards.forEach(card => {
                        if (filterValue === 'all' || card.classList.contains(filterValue)) {
                            card.style.display = 'block';
                            card.style.animation = 'fadeIn 0.5s ease forwards';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                });
            });

            // Theme toggle
            const themeToggle = document.querySelector('.theme-toggle');
            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('dark-theme');
                themeToggle.querySelector('i').classList.toggle('ri-moon-line');
                themeToggle.querySelector('i').classList.toggle('ri-sun-line');
            });

            // Dropdown handlers
            const notifications = document.getElementById('notifications');
            const userProfile = document.getElementById('userProfile');

            notifications.addEventListener('click', function(e) {
                this.classList.toggle('active');
                userProfile.classList.remove('active');
                e.stopPropagation();
            });

            userProfile.addEventListener('click', function(e) {
                this.classList.toggle('active');
                notifications.classList.remove('active');
                e.stopPropagation();
            });

            // Close dropdowns when clicking outside
            document.addEventListener('click', function() {
                notifications.classList.remove('active');
                userProfile.classList.remove('active');
            });

            // Prevent closing when clicking inside dropdowns
            document.querySelectorAll('.notifications-dropdown, .profile-dropdown').forEach(dropdown => {
                dropdown.addEventListener('click', e => e.stopPropagation());
            });
        });
    </script>
</body>
</html>



