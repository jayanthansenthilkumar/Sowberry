<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Students - Sowberry Academy</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../assets/css/admin.css">
    <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet">
    <!-- DataTables CSS -->
    <link rel="stylesheet" href="https://cdn.datatables.net/1.11.5/css/jquery.dataTables.min.css">
    <link rel="stylesheet" href="https://cdn.datatables.net/buttons/2.2.2/css/buttons.dataTables.min.css">
    <style>
        .student-management {
            padding: 24px;
            background: var(--card-bg);
            border-radius: 12px;
            margin: 20px 0;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
        }
        
        .actions-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .add-student-btn {
            background: var(--primary);
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        #studentsTable_wrapper {
            margin-top: 20px;
        }
        
        table.dataTable {
            border-collapse: separate !important;
            border-spacing: 0 8px !important;
            margin-top: 0 !important;
            margin-bottom: 0 !important;
            width: 100% !important;
        }

        table.dataTable thead th {
            border: none !important;
            background: transparent;
            padding: 12px;
            font-weight: 600;
            color: #64748b;
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        table.dataTable tbody td {
            padding: 12px 16px;
            vertical-align: middle;
            background: var(--card-hover);
            border: none;
            color: var(--text-primary);
            font-size: 0.9rem;
        }

        table.dataTable tbody tr {
            transition: all 0.2s ease;
            border-radius: 12px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
        }

        table.dataTable tbody tr:hover {
            transform: translateY(-2px);
            background: var(--primary);
            box-shadow: 0 8px 16px rgba(var(--primary-rgb), 0.12);
        }

        table.dataTable tbody tr:hover td {
            background: var(--card-bg);
        }
        
        .student-status {
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 0.8em;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }
        
        .status-active { 
            background: #dcfce7; 
            color: #166534;
        }

        .status-active::before {
            content: '';
            width: 6px;
            height: 6px;
            background: #166534;
            border-radius: 50%;
        }

        .status-inactive { 
            background: #fee2e2; 
            color: #991b1b;
        }

        .status-inactive::before {
            content: '';
            width: 6px;
            height: 6px;
            background: #991b1b;
            border-radius: 50%;
        }
        
        .action-buttons {
            display: flex;
            gap: 8px;
            justify-content: flex-end;
        }
        
        .action-btn {
            width: 32px;
            height: 32px;
            border-radius: 6px;
            border: none;
            cursor: pointer;
        }

        .edit-btn { 
            background: #dbeafe; 
            color: #1e40af;
            box-shadow: 0 2px 4px rgba(30, 64, 175, 0.1);
        }

        .delete-btn { 
            background: #fee2e2; 
            color: #991b1b;
            box-shadow: 0 2px 4px rgba(153, 27, 27, 0.1);
        }
        
        .dataTables_wrapper .dataTables_filter input {
            min-width: 240px;
            background: var(--card-hover);
            border: 2px solid var(--border-color);
            border-radius: 8px;
            padding: 8px 16px;
            margin-left: 12px;
            transition: all 0.2s ease;
        }

        .dataTables_wrapper .dataTables_filter input:focus {
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
        }
        
        .dataTables_wrapper .dataTables_length select {
            background: var(--card-hover);
            border: 2px solid var(--border-color);
            border-radius: 8px;
            padding: 6px 12px;
            transition: all 0.2s ease;
        }

        .dataTables_wrapper .dataTables_length select:focus {
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
        }

        .dataTables_wrapper .dataTables_info {
            color: var(--text-secondary);
            font-size: 0.9rem;
        }

        .dataTables_wrapper .dataTables_paginate .paginate_button {
            border-radius: 8px !important;
            padding: 8px 16px !important;
            margin: 0 4px;
            border: none !important;
            background: var(--card-hover) !important;
            color: var(--text-primary) !important;
        }

        .dataTables_wrapper .dataTables_paginate .paginate_button.current {
            background: var(--primary) !important;
            color: white !important;
            box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.2);
        }

        .dataTables_wrapper .dataTables_paginate .paginate_button:hover {
            background: var(--border-color) !important;
            color: var(--text-primary) !important;
        }

        /* Custom scrollbar styling for the table */
        div.dataTables_wrapper {
            overflow: hidden;
        }

        div.dataTables_scrollBody {
            overflow-y: auto !important;
            overflow-x: hidden !important;
        }

        /* Hide default scrollbar */
        div.dataTables_scrollBody::-webkit-scrollbar {
            width: 8px;
        }

        div.dataTables_scrollBody::-webkit-scrollbar-track {
            background: transparent;
        }

        div.dataTables_scrollBody::-webkit-scrollbar-thumb {
            background-color: var(--border-color);
            border-radius: 20px;
            border: 3px solid transparent;
        }

        /* Ensure table takes full width */
        .dataTables_wrapper .dataTables_scroll {
            margin-bottom: 0;
        }

        /* Enhanced Modal Styles */
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;  /* Change from 100vw to 100% */
            height: 100%; /* Change from 100vh to 100% */
            background: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            align-items: center;
            justify-content: center;
            padding: 20px;
            box-sizing: border-box;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
            overflow: hidden; /* Prevent modal scroll */
        }

        .modal.active {
            opacity: 1;
            visibility: visible;
        }

        .modal-content {
            background: var(--card-bg);
            border-radius: 16px;
            padding: 32px;
            width: 100%;
            max-width: 500px;
            position: relative;
            margin: 0 auto; /* Center content */
            max-height: 90vh; /* Adjust maximum height */
            overflow-y: auto; /* Allow content scroll */
            transform: scale(0.8);
            opacity: 0;
            transition: all 0.3s ease-in-out;
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }

        .modal.active .modal-content {
            transform: scale(1);
            opacity: 1;
        }

        .modal-header {
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 1px solid var(--border-color);
        }

        .modal-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--text-primary);
        }

        .close-modal {
            position: absolute;
            top: 24px;
            right: 24px;
            background: var(--card-hover);
            border: none;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .close-modal:hover {
            background: var(--border-color);
            transform: rotate(90deg);
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: var(--text-secondary);
        }

        .form-group input,
        .form-group select {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid var(--border-color);
            border-radius: 8px;
            background: var(--card-hover);
            transition: all 0.2s ease;
            font-size: 1rem;
        }

        .form-group input:focus,
        .form-group select:focus {
            border-color: var(--primary);
            outline: none;
            box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
        }

        .modal-footer {
            margin-top: 32px;
            padding-top: 16px;
            border-top: 1px solid var(--border-color);
        }

        .modal-footer button {
            padding: 12px 24px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s ease;
        }

        .btn-cancel {
            background: var(--card-hover);
            color: var(--text-primary);
        }

        .btn-cancel:hover {
            background: var(--border-color);
        }

        .btn-submit {
            background: var(--primary);
            color: white;
        }

        .btn-submit:hover {
            filter: brightness(1.1);
            transform: translateY(-1px);
        }

        body.modal-open {
            overflow: hidden;
            margin-right: 0; /* Remove margin compensation */
            padding-right: 0; /* Remove padding compensation */
        }

        /* Custom scrollbar for modal content */
        .modal-content {
            scrollbar-width: thin;
            scrollbar-color: var(--border-color) transparent;
        }

        .modal-content::-webkit-scrollbar {
            width: 6px;
        }

        .modal-content::-webkit-scrollbar-track {
            background: transparent;
        }

        .modal-content::-webkit-scrollbar-thumb {
            background-color: var(--border-color);
            border-radius: 3px;
        }

        /* Update body and modal styles */
        html, body {
            overflow: hidden;
            height: 100%;
        }

        body.modal-open {
            overflow: hidden !important;
            padding-right: 0 !important;
        }

        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
            z-index: 1000;
            display: none;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }

        .modal-content {
            background: var(--card-bg);
            border-radius: 16px;
            padding: 32px;
            width: 95%;
            max-width: 500px;
            max-height: 85vh;
            overflow-y: auto;
            margin: auto;
            position: relative;
            opacity: 0;
            transform: scale(0.8);
            transition: all 0.3s ease;
        }

        /* Hide all scrollbars but keep functionality */
        .modal-content::-webkit-scrollbar,
        body::-webkit-scrollbar,
        html::-webkit-scrollbar {
            display: none;
        }

        .modal-content,
        body,
        html {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }

        /* Remove any existing modal styles and replace with these */
        html, body {
            margin: 0;
            padding: 0;
            overflow-x: hidden;
        }

        main {
            overflow-y: auto;
            height: calc(100vh - 60px); /* Adjust based on your header height */
        }

        .modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
            z-index: 9999;
            display: none;
            align-items: center;
            justify-content: center;
        }

        .modal.active {
            display: flex;
        }

        .modal-content {
            background: var(--card-bg);
            width: 90%;
            max-width: 500px;
            max-height: 80vh;
            border-radius: 16px;
            padding: 24px;
            position: relative;
            transform: translateY(20px);
            opacity: 0;
            transition: all 0.3s ease;
        }

        .modal.active .modal-content {
            transform: translateY(0);
            opacity: 1;
        }

        body.modal-open {
            position: fixed;
            width: 100%;
        }
    </style>
</head>
<body>
    <!-- Keep the sidebar and header from original -->
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
            <a href="admin.php"><i class="ri-dashboard-line"></i><span>Dashboard</span></a>
            <a href="#" class="active"><i class="ri-user-line"></i><span>Students</span></a>
            <a href="manageMentors.php"><i class="ri-team-line"></i><span>Mentors</span></a>
            <a href="coursesOverview.php"><i class="ri-book-open-line"></i><span>Courses</span></a>
            <a href="performanceAnalytics.php"><i class="ri-line-chart-line"></i><span>Analytics</span></a>
            <a href="systemReports.php"><i class="ri-file-chart-line"></i><span>Reports</span></a>
            <a href="adminSettings.php"><i class="ri-settings-line"></i><span>Settings</span></a>
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
        
        <div class="welcome-section">
            <div class="welcome-card">
                <div class="welcome-content">
                    <div class="welcome-text">
                        <h1>Student <span class="highlight">Management</span></h1>
                        <p>View and manage all student records, enrollments, and activities</p>
                    </div>
                    <div class="welcome-stats">
                        <div class="stat-item floating">
                            <div class="stat-icon"><i class="ri-user-line"></i></div>
                            <div class="stat-info">
                                <h4>Active Students</h4>
                                <p>1,156</p>
                            </div>
                        </div>
                        <div class="stat-item floating delay-1">
                            <div class="stat-icon"><i class="ri-user-add-line"></i></div>
                            <div class="stat-info">
                                <h4>New This Month</h4>
                                <p>129</p>
                            </div>
                        </div>
                        <div class="stat-item floating delay-2">
                            <div class="stat-icon"><i class="ri-graduation-cap-line"></i></div>
                            <div class="stat-info">
                                <h4>Total Enrollments</h4>
                                <p>2,437</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="student-management">
            <div class="actions-header">
                <h2>Student Records</h2>
                <button class="add-student-btn">
                    <i class="ri-user-add-line"></i>
                    Add New Student
                </button>
            </div>
            
            <table id="studentsTable" class="display">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Course</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                <tr>
                    <td>STU001</td>
                    <td>Sowmiya S</td>
                    <td>sowmiya@example.com</td>
                    <td>Web Development</td>
                    <td><span class="student-status status-active">Active</span></td>
                    <td>
                        <div class="action-buttons">
                            <button class="action-btn edit-btn" title="Edit"><i class="ri-edit-line"></i></button>
                            <button class="action-btn delete-btn" title="Delete"><i class="ri-delete-bin-line"></i></button>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>STU002</td>
                    <td>Prithika K</td>
                    <td>prithika@example.com</td>
                    <td>UI/UX Design</td>
                    <td><span class="student-status status-active">Active</span></td>
                    <td>
                        <div class="action-buttons">
                            <button class="action-btn edit-btn" title="Edit"><i class="ri-edit-line"></i></button>
                            <button class="action-btn delete-btn" title="Delete"><i class="ri-delete-bin-line"></i></button>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>STU003</td>
                    <td>Priyadharshini B</td>
                    <td>priyadharshini@example.com</td>
                    <td>Mobile Development</td>
                    <td><span class="student-status status-active">Active</span></td>
                    <td>
                        <div class="action-buttons">
                            <button class="action-btn edit-btn" title="Edit"><i class="ri-edit-line"></i></button>
                            <button class="action-btn delete-btn" title="Delete"><i class="ri-delete-bin-line"></i></button>
                        </div>
                    </td>
                </tr>
            </tbody>
            </table>
        </div>
    </main>

    <div class="modal" id="addStudentModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Add New Student</h3>
                <button class="close-modal">×</button>
            </div>
            <form class="modal-form" id="addStudentForm">
                <div class="form-group">
                    <label for="studentId">Student ID</label>
                    <input type="text" id="studentId" name="studentId" required>
                </div>
                <div class="form-group">
                    <label for="studentName">Full Name</label>
                    <input type="text" id="studentName" name="studentName" required>
                </div>
                <div class="form-group">
                    <label for="studentEmail">Email</label>
                    <input type="email" id="studentEmail" name="studentEmail" required>
                </div>
                <div class="form-group">
                    <label for="studentCourse">Course</label>
                    <select id="studentCourse" name="studentCourse" required>
                        <option value="">Select Course</option>
                        <option value="Web Development">Web Development</option>
                        <option value="UI/UX Design">UI/UX Design</option>
                        <option value="Mobile Development">Mobile Development</option>
                        <option value="Data Science">Data Science</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="studentStatus">Status</label>
                    <select id="studentStatus" name="studentStatus" required>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-cancel">Cancel</button>
                    <button type="submit" class="btn-submit">Add Student</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Scripts -->
    <script src="../assets/script/main.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.datatables.net/1.11.5/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/buttons/2.2.2/js/dataTables.buttons.min.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize DataTable
            $('#studentsTable').DataTable({
                scrollY: '60vh',
                scrollCollapse: true,
                paging: true,
                responsive: true,
                pageLength: 10,
                order: [[1, 'asc']],
                dom: '<"top"lf>rt<"bottom"ip><"clear">',
                language: {
                    search: "",
                    searchPlaceholder: "Search students...",
                    info: "_START_ - _END_ of _TOTAL_ students",
                    paginate: {
                        previous: "<i class='ri-arrow-left-s-line'></i>",
                        next: "<i class='ri-arrow-right-s-line'></i>"
                    }
                }
            });

            // Modal Elements
            const modal = document.getElementById('addStudentModal');
            const addBtn = document.querySelector('.add-student-btn');
            const closeBtn = document.querySelector('.close-modal');
            const cancelBtn = document.querySelector('.btn-cancel');
            const form = document.getElementById('addStudentForm');
            
            // Show Modal with smooth transition
            function showModal() {
                document.body.style.overflow = 'hidden';
                modal.style.display = 'flex';
                requestAnimationFrame(() => {
                    modal.classList.add('active');
                    modal.querySelector('.modal-content').style.opacity = '1';
                    modal.querySelector('.modal-content').style.transform = 'scale(1)';
                });
            }

            // Hide Modal with smooth transition
            function hideModal() {
                modal.querySelector('.modal-content').style.opacity = '0';
                modal.querySelector('.modal-content').style.transform = 'scale(0.8)';
                modal.classList.remove('active');
                setTimeout(() => {
                    modal.style.display = 'none';
                    document.body.style.overflow = '';
                    form.reset();
                }, 300);
            }

            // Event Listeners
            addBtn.addEventListener('click', showModal);
            closeBtn.addEventListener('click', hideModal);
            cancelBtn.addEventListener('click', hideModal);

            // Close on outside click
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    hideModal();
                }
            });

            // Prevent modal close when clicking modal content
            modal.querySelector('.modal-content').addEventListener('click', function(e) {
                e.stopPropagation();
            });

            // Handle form submission
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                hideModal();
            });

            // Handle ESC key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && modal.style.display === 'flex') {
                    hideModal();
                }
            });
        });
    </script>

    <!-- Replace the modal toggle script with this -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // ... existing DataTable initialization ...

            const modal = document.getElementById('addStudentModal');
            const addBtn = document.querySelector('.add-student-btn');
            const closeBtn = document.querySelector('.close-modal');
            const cancelBtn = document.querySelector('.btn-cancel');
            const form = document.getElementById('addStudentForm');
            const scrollPosition = { x: 0, y: 0 };

            function showModal() {
                // Store current scroll position
                scrollPosition.x = window.scrollX;
                scrollPosition.y = window.scrollY;
                
                // Show modal
                document.body.classList.add('modal-open');
                modal.classList.add('active');
                
                // Fix body position
                document.body.style.top = `-${scrollPosition.y}px`;
            }

            function hideModal() {
                modal.classList.remove('active');
                document.body.classList.remove('modal-open');
                
                // Restore scroll position
                document.body.style.top = '';
                window.scrollTo(scrollPosition.x, scrollPosition.y);
                
                // Reset form after animation
                setTimeout(() => form.reset(), 300);
            }

            // Event Listeners
            addBtn.addEventListener('click', showModal);
            closeBtn.addEventListener('click', hideModal);
            cancelBtn.addEventListener('click', hideModal);
            modal.addEventListener('click', e => e.target === modal && hideModal());
            form.addEventListener('submit', e => {
                e.preventDefault();
                hideModal();
            });
            document.addEventListener('keydown', e => {
                if (e.key === 'Escape' && modal.classList.contains('active')) {
                    hideModal();
                }
            });
        });
    </script>
</body>
</html>



