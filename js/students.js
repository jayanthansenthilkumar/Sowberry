document.addEventListener('DOMContentLoaded', () => {
    const studentsTable = $('#studentsTable').DataTable({
        pageLength: 10,
        order: [[0, 'asc']],
        dom: '<"table-container"rt><"table-footer"p>',
        language: {
            paginate: {
                previous: '<i class="ri-arrow-left-s-line"></i>',
                next: '<i class="ri-arrow-right-s-line"></i>'
            },
            info: "",
            infoEmpty: "",
            infoFiltered: ""
        }
    });

    // Fix filter functionality
    document.querySelectorAll('.filter-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            const filterValue = pill.textContent.toLowerCase();
            studentsTable.column(3).search(filterValue === 'all students' ? '' : filterValue).draw();
        });
    });

    document.querySelector('.filter-select').addEventListener('change', function() {
        studentsTable.column(1).search(this.value).draw();
    });

    // Handle action buttons
    $('#studentsTable').on('click', '.action-btn', function() {
        const rowData = studentsTable.row($(this).closest('tr')).data();
        
        if ($(this).hasClass('edit')) {
            // Handle edit
            openEditModal(rowData);
        } else if ($(this).hasClass('delete')) {
            if (confirm(`Are you sure you want to delete ${rowData.name}?`)) {
                studentsTable.row($(this).closest('tr')).remove().draw();
            }
        } else if ($(this).hasClass('view')) {
            // Handle view
            openViewModal(rowData);
        }
    });

    // Ensure proper layout on window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            studentsTable.columns.adjust().responsive.recalc();
        }, 250);
    });

    // Modal functionality
    const modal = document.getElementById('studentModal');
    const addBtn = document.getElementById('addStudentBtn');
    const closeBtn = modal.querySelector('.close-modal');
    const cancelBtn = document.getElementById('cancelBtn');
    const form = document.getElementById('studentForm');

    if (addBtn && modal) {
        // Show modal
        addBtn.addEventListener('click', () => {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        // Close modal handlers
        [closeBtn, cancelBtn].forEach(btn => {
            if (btn) {
                btn.addEventListener('click', closeModal);
            }
        });

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });

        // Handle form submission
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                // Add form handling logic here
                closeModal();
            });
        }
    }

    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            if (form) {
                form.reset();
                form.dataset.editingRow = '';
                // Reset modal to "Add Student" mode
                modal.querySelector('.modal-header h3').textContent = 'Add New Student';
                modal.querySelector('button[type="submit"]').textContent = 'Add Student';
            }
        }
    }

    // Add edit functionality
    function openEditModal(rowData) {
        const modal = document.getElementById('studentModal');
        const form = document.getElementById('studentForm');
        const modalTitle = modal.querySelector('.modal-header h3');
        const submitBtn = modal.querySelector('button[type="submit"]');
        
        // Update modal for edit mode
        modalTitle.textContent = 'Edit Student';
        submitBtn.textContent = 'Update Student';
        
        // Fill form with student data
        form.querySelector('[name="name"]').value = rowData.name;
        form.querySelector('[name="email"]').value = rowData.email;
        form.querySelector('[name="course"]').value = rowData.course;
        form.querySelector('[name="status"]').value = rowData.status;
        
        // Store the current row for updating
        form.dataset.editingRow = studentsTable.row($(this).closest('tr')).index();
        
        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Update form submission handler
        form.onsubmit = function(e) {
            e.preventDefault();
            
            // Get updated data
            const updatedData = {
                name: this.querySelector('[name="name"]').value,
                email: this.querySelector('[name="email"]').value,
                course: this.querySelector('[name="course"]').value,
                status: this.querySelector('[name="status"]').value,
                progress: rowData.progress // Keep existing progress
            };
            
            // Update table row
            studentsTable.row(form.dataset.editingRow).data(updatedData).draw();
            
            // Close modal
            closeModal();
        };
    }
});

// Helper function to generate sample data
function generateStudentData() {
    return [
        {
            name: 'John Doe',
            email: 'john.doe@example.com',
            course: 'Web Development',
            progress: 75,
            status: 'active'
        },
        {
            name: 'Prithika',
            email: 'prithika@example.com',
            course: 'UI/UX Design',
            progress: 85,
            status: 'active'
        },
        {
            name: 'Priyadharshini',
            email: 'priya@example.com',
            course: 'Data Science',
            progress: 90,
            status: 'active'
        },
        {
            name: 'Sreelekha',
            email: 'sreelekha@example.com',
            course: 'Mobile Development',
            progress: 80,
            status: 'active'
        }
    ];
}

// Helper functions
function getInitials(name) {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
}

function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 70%, 60%)`;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
