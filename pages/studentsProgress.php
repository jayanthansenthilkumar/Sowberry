<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Students - Sowberry</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../assets/css/mentor.css">
    <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link rel="stylesheet" href="https://cdn.datatables.net/1.11.5/css/dataTables.bootstrap5.min.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.datatables.net/1.11.5/js/jquery.dataTables.min.js"></script>
</head>
<body>
    <div class="sidebar-overlay"></div>
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
            <a href="mentorDashboard.php"><i class="ri-home-4-line"></i><span>Overview</span></a>
            <a href="newCourses.php"><i class="ri-book-open-line"></i><span>Courses</span></a>
            <a href="#" class="active"><i class="ri-user-follow-line"></i><span>Students</span></a>
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

        <!-- Welcome Section -->
        <div class="welcome-section">
            <div class="welcome-card">
                <div class="welcome-content">
                    <div class="welcome-text">
                        <h1>Student Management</h1>
                        <p>Monitor and manage student activities</p>
                    </div>
                    <div class="welcome-stats">
                        <div class="stat-item floating">
                            <div class="stat-icon">
                                <i class="ri-user-line"></i>
                            </div>
                            <div class="stat-info">
                                <h4>Total Students</h4>
                                <p>3,245</p>
                            </div>
                        </div>
                        <div class="stat-item floating delay-1">
                            <div class="stat-icon active">
                                <i class="ri-user-follow-line"></i>
                            </div>
                            <div class="stat-info">
                                <h4>Active Today</h4>
                                <p>1,285</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Analytics Grid -->
        <div class="dashboard-grid">
            <div class="card animate">
                <div class="card-header">
                    <h3>Enrollment Trends</h3>
                    <i class="ri-line-chart-line"></i>
                </div>
                <div class="chart-container">
                    <canvas id="enrollmentChart"></canvas>
                </div>
            </div>
            <div class="card animate">
                <div class="card-header">
                    <h3>Performance Overview</h3>
                    <i class="ri-bar-chart-line"></i>
                </div>
                <div class="chart-container">
                    <canvas id="performanceChart"></canvas>
                </div>
            </div>
            <div class="card animate">
                <div class="card-header">
                    <h3>Course Distribution</h3>
                    <i class="ri-pie-chart-line"></i>
                </div>
                <div class="chart-container">
                    <canvas id="distributionChart"></canvas>
                </div>
            </div>
        </div>

        <!-- Student List Section -->
        <div class="card list-card">
            <div class="list-header">
                <div class="header-left">
                    <h3>Student List</h3>
                    <div class="search-container">
                        <i class="ri-search-line"></i>
                        <input type="text" placeholder="Search students...">
                    </div>
                </div>
                <button class="action-button primary" id="addStudentBtn">
                    <i class="ri-user-add-line"></i>
                    Add Student
                </button>
            </div>

            <div class="filter-container">
                <div class="filter-pills">
                    <button class="filter-pill active">All Students</button>
                    <button class="filter-pill">Active</button>
                    <button class="filter-pill">Inactive</button>
                </div>
                <select class="filter-select">
                    <option value="">All Courses</option>
                    <option value="web">Web Development</option>
                    <option value="mobile">Mobile Development</option>
                    <option value="data">Data Science</option>
                    <option value="ui">UI/UX Design</option>
                </select>
            </div>

            <div class="table-container">
                <table id="studentsTable" class="display">
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Course</th>
                            <th>Progress</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- John Doe -->
                        <tr>
                            <td>
                                <div class="student-info">
                                    <div class="student-avatar" style="background: #6366f1">JD</div>
                                    <div class="student-details">
                                        <h4>John Doe</h4>
                                        <p>john.doe@example.com</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="course-info">
                                    <i class="ri-code-line"></i>
                                    Web Development
                                </div>
                            </td>
                            <td>
                                <div class="progress-wrapper">
                                    <div class="progress-bar">
                                        <div class="progress-fill warning" style="width: 75%"></div>
                                    </div>
                                    <span class="progress-text">75%</span>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge success">
                                    <i class="ri-checkbox-blank-circle-fill"></i>
                                    Active
                                </span>
                            </td>
                            <td>
                                <div class="action-buttons">
                                    <button class="action-btn edit" title="Edit">
                                        <i class="ri-edit-line"></i>
                                    </button>
                                    <button class="action-btn view" title="View Details">
                                        <i class="ri-eye-line"></i>
                                    </button>
                                    <button class="action-btn delete" title="Delete">
                                        <i class="ri-delete-bin-line"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>

                        <!-- Prithika -->
                        <tr>
                            <td>
                                <div class="student-info">
                                    <div class="student-avatar" style="background: #8b5cf6">P</div>
                                    <div class="student-details">
                                        <h4>Prithika</h4>
                                        <p>prithika@example.com</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="course-info">
                                    <i class="ri-paint-brush-line"></i>
                                    UI/UX Design
                                </div>
                            </td>
                            <td>
                                <div class="progress-wrapper">
                                    <div class="progress-bar">
                                        <div class="progress-fill success" style="width: 85%"></div>
                                    </div>
                                    <span class="progress-text">85%</span>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge success">
                                    <i class="ri-checkbox-blank-circle-fill"></i>
                                    Active
                                </span>
                            </td>
                            <td>
                                <div class="action-buttons">
                                    <button class="action-btn edit" title="Edit">
                                        <i class="ri-edit-line"></i>
                                    </button>
                                    <button class="action-btn view" title="View Details">
                                        <i class="ri-eye-line"></i>
                                    </button>
                                    <button class="action-btn delete" title="Delete">
                                        <i class="ri-delete-bin-line"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>

                        <!-- Priyadharshini -->
                        <tr>
                            <td>
                                <div class="student-info">
                                    <div class="student-avatar" style="background: #06b6d4">P</div>
                                    <div class="student-details">
                                        <h4>Priyadharshini</h4>
                                        <p>priya@example.com</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="course-info">
                                    <i class="ri-database-2-line"></i>
                                    Data Science
                                </div>
                            </td>
                            <td>
                                <div class="progress-wrapper">
                                    <div class="progress-bar">
                                        <div class="progress-fill success" style="width: 90%"></div>
                                    </div>
                                    <span class="progress-text">90%</span>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge success">
                                    <i class="ri-checkbox-blank-circle-fill"></i>
                                    Active
                                </span>
                            </td>
                            <td>
                                <div class="action-buttons">
                                    <button class="action-btn edit" title="Edit">
                                        <i class="ri-edit-line"></i>
                                    </button>
                                    <button class="action-btn view" title="View Details">
                                        <i class="ri-eye-line"></i>
                                    </button>
                                    <button class="action-btn delete" title="Delete">
                                        <i class="ri-delete-bin-line"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>

                        <!-- Sreelekha -->
                        <tr>
                            <td>
                                <div class="student-info">
                                    <div class="student-avatar" style="background: #10b981">S</div>
                                    <div class="student-details">
                                        <h4>Sreelekha</h4>
                                        <p>sreelekha@example.com</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="course-info">
                                    <i class="ri-smartphone-line"></i>
                                    Mobile Development
                                </div>
                            </td>
                            <td>
                                <div class="progress-wrapper">
                                    <div class="progress-bar">
                                        <div class="progress-fill success" style="width: 80%"></div>
                                    </div>
                                    <span class="progress-text">80%</span>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge success">
                                    <i class="ri-checkbox-blank-circle-fill"></i>
                                    Active
                                </span>
                            </td>
                            <td>
                                <div class="action-buttons">
                                    <button class="action-btn edit" title="Edit">
                                        <i class="ri-edit-line"></i>
                                    </button>
                                    <button class="action-btn view" title="View Details">
                                        <i class="ri-eye-line"></i>
                                    </button>
                                    <button class="action-btn delete" title="Delete">
                                        <i class="ri-delete-bin-line"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Remove existing pagination as DataTable will handle it -->
        </div>

        <!-- Add/Edit Student Modal -->
        <div class="modal" id="studentModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Add New Student</h3>
                    <button class="close-modal"><i class="ri-close-line"></i></button>
                </div>
                <form id="studentForm">
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Full Name</label>
                            <input type="text" name="name" required>
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label>Course</label>
                            <select name="course" required>
                                <option value="">Select Course</option>
                                <option value="web">Web Development</option>
                                <option value="mobile">Mobile Development</option>
                                <option value="data">Data Science</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Status</label>
                            <select name="status" required>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn secondary" id="cancelBtn">Cancel</button>
                        <button type="submit" class="btn primary">Add Student</button>
                    </div>
                </form>
            </div>
        </div>
    </main>
    <script src="../assets/script/mentor.js"></script>
</body>
</html>



