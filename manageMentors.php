<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Mentors - Sowberry Academy</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../assets/css/admin.css">
    <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet">
    <!-- DataTables CSS -->
    <link rel="stylesheet" href="https://cdn.datatables.net/1.11.5/css/jquery.dataTables.min.css">
    <!-- SweetAlert2 CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
</head>
<body>
    <div class="sidebar-overlay"></div>
    <button class="hamburger-menu">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
    </button>
    <div class="sidebar">
        <div class="logo">
            <i class="ri-seedling-fill"></i>
            <div class="logo-text">
                <span class="brand-name">Sowberry</span>
                <span class="brand-suffix">ACADEMY</span>
            </div>
        </div>
        <nav>
            <a href="admin.php"><i class="ri-dashboard-line"></i><span>Dashboard</span></a>
            <a href="manageStudents.php"><i class="ri-user-line"></i><span>Students</span></a>
            <a href="#" class="active"><i class="ri-team-line"></i><span>Mentors</span></a>
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
                <input type="text" placeholder="Search mentors...">
            </div>
            <div class="header-tools">
                <div class="theme-toggle">
                    <i class="ri-sun-line"></i>
                </div>
                <div class="notifications">
                    <i class="ri-notification-3-line"></i>
                    <span class="notification-badge">3</span>
                </div>
                <div class="user-profile">
                    <div class="profile-dropdown">
                        <a href="#"><i class="ri-user-line"></i> My Profile</a>
                        <a href="#"><i class="ri-lock-password-line"></i> Change Password</a>
                        <div class="dropdown-divider"></div>
                        <a href="#" class="logout"><i class="ri-logout-box-line"></i> Logout</a>
                    </div>
                </div>
            </div>
        </header>

        <div class="student-management">
            <div class="actions-header">
                <h2>Mentor Management</h2>
                <button class="add-student-btn">
                    <i class="ri-user-add-line"></i>
                    Add New Mentor
                </button>
            </div>
            
            <table id="mentorsTable" class="display">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Expertise</th>
                        <th>Students</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                <!-- Mentors will be loaded dynamically via API -->
                </tbody>
            </table>
        </div>
    </main>

    <!-- Add/Edit Mentor Modal -->
    <div class="modal" id="addStudentModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title" id="modalTitle">Add New Mentor</h3>
                <button class="close-modal">×</button>
            </div>
            <form class="modal-form" id="addStudentForm">
                <input type="hidden" id="studentEditId" name="studentEditId">
                <div class="form-group">
                    <label for="studentName">Full Name</label>
                    <input type="text" id="studentName" name="studentName" required>
                </div>
                <div class="form-group">
                    <label for="studentEmail">Email</label>
                    <input type="email" id="studentEmail" name="studentEmail" required>
                </div>
                <div class="form-group">
                    <label for="studentPhone">Phone</label>
                    <input type="tel" id="studentPhone" name="studentPhone" required>
                </div>
                <div class="form-group">
                    <label for="studentUsername">Username</label>
                    <input type="text" id="studentUsername" name="studentUsername" required>
                </div>
                <div class="form-group">
                    <label for="expertiseArea">Expertise Area</label>
                    <input type="text" id="expertiseArea" name="expertiseArea" placeholder="e.g., Web Development, Data Science" required>
                </div>
                <div class="form-group">
                    <label for="studentPassword">Password</label>
                    <input type="password" id="studentPassword" name="studentPassword">
                    <small id="passwordHelp" style="color: #6b7280; font-size: 0.85rem;">Leave blank to keep existing password</small>
                </div>
                <div class="form-group">
                    <label for="studentStatus">Status</label>
                    <select id="studentStatus" name="studentStatus" required>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-cancel">Cancel</button>
                    <button type="submit" class="btn-submit">Save Mentor</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Scripts -->
    <script src="../assets/script/main.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.datatables.net/1.11.5/js/jquery.dataTables.min.js"></script>
    <!-- SweetAlert2 JS -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <!-- API Handler -->
    <script src="./assets/script/api.js"></script>
    <script src="./assets/script/common.js"></script>
    <script>
        let mentorsTable;
        
        document.addEventListener('DOMContentLoaded', async function() {
            // Load mentors from API
            await loadMentors();

            // Modal Elements
            const modal = document.getElementById('addStudentModal');
            const addBtn = document.querySelector('.add-student-btn');
            const closeBtn = document.querySelector('.close-modal');
            const cancelBtn = document.querySelector('.btn-cancel');
            const form = document.getElementById('addStudentForm');
            
            // Show Modal
            function showModal(isEdit = false, mentor = null) {
                const modalTitle = document.getElementById('modalTitle');
                const passwordField = document.getElementById('studentPassword');
                const passwordHelp = document.getElementById('passwordHelp');
                
                if (isEdit && mentor) {
                    modalTitle.textContent = 'Edit Mentor';
                    document.getElementById('studentEditId').value = mentor.id;
                    document.getElementById('studentName').value = mentor.full_name;
                    document.getElementById('studentEmail').value = mentor.email;
                    document.getElementById('studentPhone').value = mentor.phone;
                    document.getElementById('studentUsername').value = mentor.username;
                    document.getElementById('expertiseArea').value = mentor.expertise || '';
                    document.getElementById('studentStatus').value = mentor.status;
                    passwordField.required = false;
                    passwordHelp.style.display = 'block';
                } else {
                    modalTitle.textContent = 'Add New Mentor';
                    form.reset();
                    document.getElementById('studentEditId').value = '';
                    passwordField.required = true;
                    passwordHelp.style.display = 'none';
                }
                
                modal.classList.add('active');
            }

            // Hide Modal
            function hideModal() {
                modal.classList.remove('active');
                setTimeout(() => form.reset(), 300);
            }

            // Event Listeners
            addBtn.addEventListener('click', () => showModal(false));
            closeBtn.addEventListener('click', hideModal);
            cancelBtn.addEventListener('click', hideModal);
            modal.addEventListener('click', e => e.target === modal && hideModal());

            // Handle form submission
            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const mentorId = document.getElementById('studentEditId').value;
                const formData = {
                    full_name: document.getElementById('studentName').value,
                    email: document.getElementById('studentEmail').value,
                    phone: document.getElementById('studentPhone').value,
                    username: document.getElementById('studentUsername').value,
                    expertise: document.getElementById('expertiseArea').value,
                    status: document.getElementById('studentStatus').value
                };

                const password = document.getElementById('studentPassword').value;
                if (password) {
                    formData.password = password;
                }

                try {
                    if (mentorId) {
                        // Update existing mentor
                        await API.Mentor.update(mentorId, formData);
                    } else {
                        // Create new mentor
                        formData.password = password;
                        await API.Mentor.create(formData);
                    }
                    hideModal();
                    await loadMentors();
                } catch (error) {
                    console.error('Mentor operation failed:', error);
                }
            });

            // Handle ESC key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && modal.classList.contains('active')) {
                    hideModal();
                }
            });

            // Event delegation for edit and delete buttons
            document.getElementById('mentorsTable').addEventListener('click', async function(e) {
                const editBtn = e.target.closest('.edit-btn');
                const deleteBtn = e.target.closest('.delete-btn');
                
                if (editBtn) {
                    const mentorId = editBtn.dataset.id;
                    try {
                        const mentor = await API.Mentor.getOne(mentorId);
                        showModal(true, mentor);
                    } catch (error) {
                        console.error('Failed to load mentor:', error);
                    }
                }
                
                if (deleteBtn) {
                    const mentorId = deleteBtn.dataset.id;
                    const mentorName = deleteBtn.dataset.name;
                    
                    const result = await Swal.fire({
                        title: 'Delete Mentor?',
                        text: `Are you sure you want to delete ${mentorName}? This action cannot be undone.`,
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#ef4444',
                        cancelButtonColor: '#6b7280',
                        confirmButtonText: 'Yes, delete',
                        cancelButtonText: 'Cancel'
                    });
                    
                    if (result.isConfirmed) {
                        try {
                            await API.Mentor.delete(mentorId);
                            await loadMentors();
                        } catch (error) {
                            console.error('Failed to delete mentor:', error);
                        }
                    }
                }
            });
        });

        // Load mentors function
        async function loadMentors() {
            try {
                const mentors = await API.Mentor.getAll();
                
                // Destroy existing DataTable if it exists
                if (mentorsTable) {
                    mentorsTable.destroy();
                }
                
                // Clear table body
                const tbody = document.querySelector('#mentorsTable tbody');
                tbody.innerHTML = '';
                
                // Populate table
                mentors.forEach(mentor => {
                    const statusClass = mentor.status === 'active' ? 'status-active' : 'status-inactive';
                    const row = `
                        <tr>
                            <td>${mentor.id}</td>
                            <td>${mentor.full_name || mentor.username}</td>
                            <td>${mentor.email}</td>
                            <td>${mentor.expertise || 'N/A'}</td>
                            <td>${mentor.total_students || 0}</td>
                            <td><span class="student-status ${statusClass}">${mentor.status}</span></td>
                            <td>
                                <div class="action-buttons">
                                    <button class="action-btn edit-btn" data-id="${mentor.id}" title="Edit">
                                        <i class="ri-edit-line"></i>
                                    </button>
                                    <button class="action-btn delete-btn" data-id="${mentor.id}" data-name="${mentor.full_name || mentor.username}" title="Delete">
                                        <i class="ri-delete-bin-line"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `;
                    tbody.insertAdjacentHTML('beforeend', row);
                });
                
                // Initialize DataTable
                mentorsTable = $('#mentorsTable').DataTable({
                    scrollY: '60vh',
                    scrollCollapse: true,
                    paging: true,
                    responsive: true,
                    pageLength: 10,
                    order: [[1, 'asc']],
                    dom: '<"top"lf>rt<"bottom"ip><"clear">',
                    language: {
                        search: "",
                        searchPlaceholder: "Search mentors...",
                        info: "_START_ - _END_ of _TOTAL_ mentors",
                        paginate: {
                            previous: "<i class='ri-arrow-left-s-line'></i>",
                            next: "<i class='ri-arrow-right-s-line'></i>"
                        }
                    }
                });
            } catch (error) {
                console.error('Failed to load mentors:', error);
                API.showError('Failed to load mentors data');
            }
        }
    </script>
</body>
</html>
