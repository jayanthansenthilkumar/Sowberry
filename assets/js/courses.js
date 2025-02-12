class CourseManager {
    constructor() {
        this.init();
    }

    init() {
        this.addCourseBtn = document.querySelector('.add-course-btn');
        this.newCourseModal = document.getElementById('newCourseModal');
        this.newCourseForm = document.getElementById('newCourseForm');
        this.closeModalBtn = this.newCourseModal.querySelector('.close-modal');
        this.cancelBtn = this.newCourseModal.querySelector('.cancel-btn');
        
        this.bindEvents();
    }

    bindEvents() {
        this.addCourseBtn.addEventListener('click', () => this.openModal());
        this.closeModalBtn.addEventListener('click', () => this.closeModal());
        this.cancelBtn.addEventListener('click', () => this.closeModal());
        this.newCourseForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    openModal() {
        this.newCourseModal.classList.add('active');
    }

    closeModal() {
        this.newCourseModal.classList.remove('active');
        this.newCourseForm.reset();
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
                    <span class="course-badge">${data.status}</span>
                </div>
                <div class="course-content">
                    <h3>${data.title}</h3>
                    <p>${data.description}</p>
                    <div class="course-meta">
                        <span><i class="ri-user-line"></i> 0 Students</span>
                        <span><i class="ri-time-line"></i> ${data.duration} Hours</span>
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
}

document.addEventListener('DOMContentLoaded', () => {
    new CourseManager();
});
