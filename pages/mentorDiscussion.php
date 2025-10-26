<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Discussion - Sowberry</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../assets/css/mentor.css">
    <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet">
</head>
<body>
    <div class="sidebar-overlay"></div>
    <button class="mobile-menu-toggle">
        <i class="ri-menu-line"></i>
    </button>
    
    <!-- Sidebar -->
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
            <a href="mentorDashboard.php"><i class="ri-home-4-line"></i><span>Overview</span></a>
            <a href="newCourses.php"><i class="ri-book-open-line"></i><span>Courses</span></a>
            <a href="studentsProgress.php"><i class="ri-user-follow-line"></i><span>Students</span></a>
            <a href="newAssignments.php"><i class="ri-award-line"></i><span>Assignments</span></a>
            <a href="newEvents.php"><i class="ri-calendar-event-line"></i><span>Events</span></a>
            <a href="newAptitude.php"><i class="ri-mental-health-line"></i><span>Aptitude</span></a>
            <a href="newproblemSolving.php"><i class="ri-code-box-line"></i><span>Problem Solving</span></a>
            <a href="#" class="active"><i class="ri-chat-1-line"></i><span>Discussion</span></a>
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

        <!-- Welcome Section -->
        <div class="welcome-section">
            <div class="welcome-card">
                <div class="welcome-content">
                    <div class="welcome-text">
                        <h1>Discussion <span class="highlight">Forum</span></h1>
                        <p>Manage student discussions and forums</p>
                    </div>
                    <div class="welcome-stats">
                        <div class="stat-item floating">
                            <div class="stat-icon"><i class="ri-discuss-line"></i></div>
                            <div class="stat-info">
                                <h4>Total Topics</h4>
                                <p>156</p>
                            </div>
                        </div>
                        <div class="stat-item floating delay-1">
                            <div class="stat-icon"><i class="ri-message-3-line"></i></div>
                            <div class="stat-info">
                                <h4>Active Threads</h4>
                                <p>28</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Discussion Categories -->
        <div class="dashboard-grid">
            <div class="card animate">
                <div class="card-header">
                    <h3>Course Discussions</h3>
                    <i class="ri-book-read-line"></i>
                </div>
                <div class="category-stats">
                    <div class="stat-row">
                        <span>Active Threads</span>
                        <strong>42</strong>
                    </div>
                    <div class="stat-row">
                        <span>Today's Posts</span>
                        <strong>18</strong>
                    </div>
                </div>
            </div>
            <div class="card animate">
                <div class="card-header">
                    <h3>Q&A Section</h3>
                    <i class="ri-question-answer-line"></i>
                </div>
                <div class="category-stats">
                    <div class="stat-row">
                        <span>Open Questions</span>
                        <strong>35</strong>
                    </div>
                    <div class="stat-row">
                        <span>Resolved</span>
                        <strong>89</strong>
                    </div>
                </div>
            </div>
            <div class="card animate">
                <div class="card-header">
                    <h3>Community Hub</h3>
                    <i class="ri-team-line"></i>
                </div>
                <div class="category-stats">
                    <div class="stat-row">
                        <span>Active Users</span>
                        <strong>245</strong>
                    </div>
                    <div class="stat-row">
                        <span>Today's Posts</span>
                        <strong>32</strong>
                    </div>
                </div>
            </div>
        </div>

        <!-- Discussion List -->
        <div class="list-card">
            <div class="list-header">
                <div class="header-left">
                    <h3>Recent Discussions</h3>
                    <div class="search-container">
                        <i class="ri-search-line"></i>
                        <input type="text" placeholder="Search discussions...">
                    </div>
                </div>
                <button class="action-button" id="addTopicBtn">
                    <i class="ri-add-line"></i>
                    New Topic
                </button>
            </div>

            <div class="filter-container">
                <div class="filter-pills">
                    <button class="filter-pill active">All</button>
                    <button class="filter-pill">Course</button>
                    <button class="filter-pill">Q&A</button>
                    <button class="filter-pill">General</button>
                </div>
                <select class="filter-select">
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                </select>
            </div>

            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Topic</th>
                            <th>Category</th>
                            <th>Author</th>
                            <th>Activity</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <div class="topic-info">
                                    <div class="topic-icon">
                                        <i class="ri-message-2-line"></i>
                                    </div>
                                    <div>
                                        <h4>Help with JavaScript Promises</h4>
                                        <p>15 replies • Last reply 2h ago</p>
                                    </div>
                                </div>
                            </td>
                            <td><span class="category-badge course">Course</span></td>
                            <td>
                                <div class="author-info">
                                    <img src="https://ui-avatars.com/api/?name=John+Doe" alt="John Doe">
                                    <span>John Doe</span>
                                </div>
                            </td>
                            <td>
                                <div class="activity-indicator high">
                                    <i class="ri-pulse-line"></i>
                                    <span>High</span>
                                </div>
                            </td>
                            <td>
                                <div class="action-buttons">
                                    <button class="action-btn"><i class="ri-eye-line"></i></button>
                                    <button class="action-btn"><i class="ri-pin-line"></i></button>
                                    <button class="action-btn danger"><i class="ri-close-line"></i></button>
                                </div>
                            </td>
                        </tr>
                        <!-- Add more discussion rows as needed -->
                    </tbody>
                </table>
            </div>
        </div>
    </main>

    <!-- New Topic Modal -->
    <div class="modal" id="topicModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Create New Topic</h3>
                <button class="close-modal">&times;</button>
            </div>
            <form id="topicForm">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="title">Topic Title</label>
                        <input type="text" id="title" name="title" required>
                    </div>
                    <div class="form-group">
                        <label for="category">Category</label>
                        <select id="category" name="category" required>
                            <option value="">Select Category</option>
                            <option value="course">Course Discussion</option>
                            <option value="qa">Q&A</option>
                            <option value="general">General</option>
                        </select>
                    </div>
                    <div class="form-group full-width">
                        <label for="description">Description</label>
                        <textarea id="description" name="description" rows="4" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="tags">Tags</label>
                        <input type="text" id="tags" name="tags" placeholder="Separate with commas">
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn secondary" id="cancelBtn">Cancel</button>
                    <button type="submit" class="btn primary">Create Topic</button>
                </div>
            </form>
        </div>
    </div>

    <script src="../assets/script/mentor.js"></script>
</body>
</html>



