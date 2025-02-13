class CourseManager {
    constructor() {
        this.addCourseBtn = document.querySelector('.add-course-btn');
        this.newCourseModal = document.getElementById('newCourseModal');
        this.newCourseForm = document.getElementById('newCourseForm');
        this.closeModalBtn = this.newCourseModal.querySelector('.close-modal');
        this.cancelBtn = this.newCourseModal.querySelector('.cancel-btn');
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupFileInput();
    }

    bindEvents() {
        this.addCourseBtn.addEventListener('click', () => this.openModal());
        this.closeModalBtn.addEventListener('click', () => this.closeModal());
        this.cancelBtn.addEventListener('click', () => this.closeModal());
        this.newCourseForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    openModal() {
        this.newCourseModal.classList.add('active');
        requestAnimationFrame(() => {
            document.body.style.overflow = 'hidden';
        });
    }

    closeModal() {
        this.newCourseModal.classList.add('closing');
        this.newCourseModal.addEventListener('transitionend', (e) => {
            if (e.propertyName === 'opacity') {
                this.newCourseModal.classList.remove('active', 'closing');
                this.newCourseForm.reset();
                const preview = document.querySelector('.file-preview');
                if (preview) {
                    preview.classList.remove('active');
                    preview.querySelector('img').src = '';
                }
                document.body.style.overflow = '';
            }
        }, { once: true });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        const formData = new FormData(this.newCourseForm);
        const courseData = Object.fromEntries(formData);
        const courseCard = this.createCourseCard(courseData);
        document.querySelector('.courses-grid').insertAdjacentHTML('afterbegin', courseCard);
        this.closeModal();
        this.showNotification('Course created successfully!');
    }

    createCourseCard(data) {
        const status = data.status.toLowerCase();
        const statusDisplay = data.status.charAt(0).toUpperCase() + data.status.slice(1);
        const badgeClass = status === 'published' ? 'active' : status;
        return `
            <div class="course-card">
                <div class="admin-controls">
                    <input type="checkbox" class="course-select">
                    <div class="course-actions">
                        <button class="action-btn"><i class="ri-edit-line"></i></button>
                        <button class="action-btn"><i class="ri-settings-line"></i></button>
                        <button class="action-btn danger"><i class="ri-delete-bin-line"></i></button>
                    </div>
                </div>
                <div class="course-image">
                    <img src="${data.image ? URL.createObjectURL(data.image) : 'https://source.unsplash.com/800x600/?course'}" alt="${data.title}">
                    <span class="course-badge ${badgeClass}">${statusDisplay}</span>
                </div>
                <div class="course-content">
                    <h3>${data.title}</h3>
                    <p>${data.description}</p>
                    <div class="course-meta">
                        <span><i class="ri-time-line"></i> ${data.duration} Hours</span>
                        <span><i class="ri-user-line"></i> 0 Students</span>
                    </div>
                </div>
                <div class="course-stats">
                    <span><i class="ri-flag-line"></i> 0 Reports</span>
                    <span><i class="ri-star-line"></i> 0.0 Rating</span>
                    <span><i class="ri-money-dollar-circle-line"></i> $${data.price}</span>
                </div>
            </div>
        `;
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    setupFileInput() {
        const fileInput = document.getElementById('courseImage');
        const fileLabel = document.querySelector('.file-name');
        const preview = document.querySelector('.file-preview');
        const previewImg = preview.querySelector('img');
        const removeButton = preview.querySelector('.remove-file');

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                fileLabel.textContent = file.name;
                previewImg.src = URL.createObjectURL(file);
                preview.classList.add('active');
            }
        });

        removeButton.addEventListener('click', () => {
            fileInput.value = '';
            fileLabel.textContent = 'Choose an image file';
            previewImg.src = '';
            preview.classList.remove('active');
        });
    }
}

// Initialize only CourseManager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize CourseManager if on courses page
    if (document.querySelector('.courses-grid')) {
        new CourseManager();
    }
});