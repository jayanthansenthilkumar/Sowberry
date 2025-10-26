/**
 * Student Management Frontend Handler
 * Handles student CRUD operations with DataTables integration
 */

$(document).ready(function() {
    
    // Initialize DataTable if it exists
    let studentsTable;
    if ($('#studentsTable').length) {
        loadStudents();
    }
    
    /**
     * Load all students
     */
    function loadStudents() {
        API.Student.getAll({
            limit: 100,
            offset: 0
        }).then(response => {
            if (response.success) {
                renderStudentsTable(response.data.students);
            } else {
                Utils.showError(response.message);
            }
        });
    }
    
    /**
     * Render students in DataTable
     */
    function renderStudentsTable(students) {
        if ($.fn.DataTable.isDataTable('#studentsTable')) {
            $('#studentsTable').DataTable().destroy();
        }
        
        studentsTable = $('#studentsTable').DataTable({
            data: students,
            columns: [
                {
                    data: null,
                    render: function(data) {
                        const initials = data.full_name.split(' ').map(n => n[0]).join('');
                        return `
                            <div class="student-info">
                                <div class="student-avatar">${initials}</div>
                                <div>
                                    <div class="student-name">${data.full_name}</div>
                                    <div class="student-code">${data.student_code}</div>
                                </div>
                            </div>
                        `;
                    }
                },
                { data: 'email' },
                { data: 'enrolled_courses', defaultContent: '0' },
                { data: 'completed_courses', defaultContent: '0' },
                {
                    data: 'avg_progress',
                    render: function(data) {
                        const progress = data || 0;
                        return `
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${progress}%"></div>
                                <span>${Math.round(progress)}%</span>
                            </div>
                        `;
                    }
                },
                {
                    data: 'status',
                    render: function(data) {
                        const statusColors = {
                            'active': 'success',
                            'inactive': 'warning',
                            'suspended': 'danger'
                        };
                        return `<span class="badge badge-${statusColors[data]}">${data}</span>`;
                    }
                },
                {
                    data: null,
                    render: function(data) {
                        return `
                            <div class="action-buttons">
                                <button class="btn-icon view-student" data-id="${data.student_id}" title="View">
                                    <i class="ri-eye-line"></i>
                                </button>
                                <button class="btn-icon edit-student" data-id="${data.student_id}" title="Edit">
                                    <i class="ri-edit-line"></i>
                                </button>
                                <button class="btn-icon delete-student" data-id="${data.student_id}" title="Delete">
                                    <i class="ri-delete-bin-line"></i>
                                </button>
                            </div>
                        `;
                    }
                }
            ],
            pageLength: 10,
            order: [[0, 'asc']],
            language: {
                search: "Search students:",
                lengthMenu: "Show _MENU_ students",
                info: "Showing _START_ to _END_ of _TOTAL_ students"
            }
        });
    }
    
    /**
     * Add new student
     */
    $('#addStudentBtn').on('click', function() {
        Swal.fire({
            title: 'Add New Student',
            html: `
                <form id="addStudentForm" class="swal-form">
                    <div class="form-group">
                        <label>Full Name *</label>
                        <input type="text" name="full_name" class="swal2-input" required>
                    </div>
                    <div class="form-group">
                        <label>Email *</label>
                        <input type="email" name="email" class="swal2-input" required>
                    </div>
                    <div class="form-group">
                        <label>Phone</label>
                        <input type="tel" name="phone" class="swal2-input">
                    </div>
                    <div class="form-group">
                        <label>Academic Level</label>
                        <select name="academic_level" class="swal2-select">
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Password (default: student123)</label>
                        <input type="password" name="password" class="swal2-input" value="student123">
                    </div>
                </form>
            `,
            showCancelButton: true,
            confirmButtonText: 'Add Student',
            confirmButtonColor: '#7c3aed',
            width: '500px',
            preConfirm: () => {
                const form = document.getElementById('addStudentForm');
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                
                if (!data.full_name || !data.email) {
                    Swal.showValidationMessage('Name and email are required');
                    return false;
                }
                
                return data;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                API.Student.create(result.value).then(response => {
                    if (response.success) {
                        Utils.showSuccess(response.message);
                        loadStudents(); // Reload table
                    } else {
                        Utils.showError(response.message);
                    }
                });
            }
        });
    });
    
    /**
     * View student details
     */
    $(document).on('click', '.view-student', function() {
        const studentId = $(this).data('id');
        
        Utils.showLoading('Loading student details...');
        
        API.Student.getOne(studentId).then(response => {
            Utils.hideLoading();
            
            if (response.success) {
                const student = response.data.student;
                
                Swal.fire({
                    title: student.full_name,
                    html: `
                        <div class="student-details">
                            <p><strong>Student Code:</strong> ${student.student_code}</p>
                            <p><strong>Email:</strong> ${student.email}</p>
                            <p><strong>Phone:</strong> ${student.phone || 'N/A'}</p>
                            <p><strong>Academic Level:</strong> ${student.academic_level}</p>
                            <p><strong>GPA:</strong> ${student.gpa}</p>
                            <p><strong>Total Credits:</strong> ${student.total_credits}</p>
                            <p><strong>Learning Hours:</strong> ${student.learning_hours}</p>
                            <p><strong>Current Streak:</strong> ${student.current_streak} days</p>
                            <p><strong>Enrollment Date:</strong> ${student.enrollment_date}</p>
                            <p><strong>Status:</strong> ${student.status}</p>
                        </div>
                    `,
                    confirmButtonColor: '#7c3aed',
                    width: '600px'
                });
            } else {
                Utils.showError(response.message);
            }
        });
    });
    
    /**
     * Edit student
     */
    $(document).on('click', '.edit-student', function() {
        const studentId = $(this).data('id');
        
        Utils.showLoading('Loading student data...');
        
        API.Student.getOne(studentId).then(response => {
            Utils.hideLoading();
            
            if (response.success) {
                const student = response.data.student;
                
                Swal.fire({
                    title: 'Edit Student',
                    html: `
                        <form id="editStudentForm" class="swal-form">
                            <div class="form-group">
                                <label>Full Name *</label>
                                <input type="text" name="full_name" class="swal2-input" value="${student.full_name}" required>
                            </div>
                            <div class="form-group">
                                <label>Email *</label>
                                <input type="email" name="email" class="swal2-input" value="${student.email}" required>
                            </div>
                            <div class="form-group">
                                <label>Phone</label>
                                <input type="tel" name="phone" class="swal2-input" value="${student.phone || ''}">
                            </div>
                            <div class="form-group">
                                <label>Academic Level</label>
                                <select name="academic_level" class="swal2-select">
                                    <option value="beginner" ${student.academic_level === 'beginner' ? 'selected' : ''}>Beginner</option>
                                    <option value="intermediate" ${student.academic_level === 'intermediate' ? 'selected' : ''}>Intermediate</option>
                                    <option value="advanced" ${student.academic_level === 'advanced' ? 'selected' : ''}>Advanced</option>
                                </select>
                            </div>
                        </form>
                    `,
                    showCancelButton: true,
                    confirmButtonText: 'Update Student',
                    confirmButtonColor: '#7c3aed',
                    width: '500px',
                    preConfirm: () => {
                        const form = document.getElementById('editStudentForm');
                        const formData = new FormData(form);
                        return Object.fromEntries(formData.entries());
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        API.Student.update(studentId, result.value).then(response => {
                            if (response.success) {
                                Utils.showSuccess(response.message);
                                loadStudents(); // Reload table
                            } else {
                                Utils.showError(response.message);
                            }
                        });
                    }
                });
            } else {
                Utils.showError(response.message);
            }
        });
    });
    
    /**
     * Delete student
     */
    $(document).on('click', '.delete-student', function() {
        const studentId = $(this).data('id');
        
        Utils.confirmAction(
            'Delete Student?',
            'This action cannot be undone!',
            'Yes, delete'
        ).then((result) => {
            if (result.isConfirmed) {
                API.Student.delete(studentId).then(response => {
                    if (response.success) {
                        Utils.showSuccess(response.message);
                        loadStudents(); // Reload table
                    } else {
                        Utils.showError(response.message);
                    }
                });
            }
        });
    });
    
    /**
     * Filter students by status
     */
    $('.filter-pill').on('click', function() {
        $('.filter-pill').removeClass('active');
        $(this).addClass('active');
        
        const status = $(this).data('status');
        
        if (status === 'all') {
            loadStudents();
        } else {
            API.Student.getAll({ status: status }).then(response => {
                if (response.success) {
                    renderStudentsTable(response.data.students);
                }
            });
        }
    });
    
});
