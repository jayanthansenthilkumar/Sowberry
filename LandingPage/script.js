// Sample course data
const courses = [
    {
        title: 'Web Development Masterclass',
        instructor: 'John Doe',
        rating: 4.8,
        students: 1500,
        price: 89.99
    },
    {
        title: 'Data Science Fundamentals',
        instructor: 'Jane Smith',
        rating: 4.9,
        students: 2200,
        price: 99.99
    },
    {
        title: 'Digital Marketing Essential',
        instructor: 'Mike Johnson',
        rating: 4.7,
        students: 1800,
        price: 79.99
    }
];

// Populate trending courses
function populateCourses() {
    const courseSlider = document.querySelector('.course-slider');
    
    courses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        courseCard.innerHTML = `
            <div class="course-image"></div>
            <h3>${course.title}</h3>
            <p>By ${course.instructor}</p>
            <div class="course-stats">
                <span>⭐ ${course.rating}</span>
                <span>👥 ${course.students}</span>
            </div>
            <div class="course-price">$${course.price}</div>
        `;
        courseSlider.appendChild(courseCard);
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    populateCourses();
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Navbar functionality
    const navbar = document.querySelector('.navbar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navContent = document.querySelector('.nav-content');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navContent.classList.toggle('active');
    });

    // Active link handling
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Close mobile menu when link is clicked
            mobileMenuBtn.classList.remove('active');
            navContent.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navContent.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            mobileMenuBtn.classList.remove('active');
            navContent.classList.remove('active');
        }
    });
});

// Add scroll animation for elements
window.addEventListener('scroll', () => {
    const elements = document.querySelectorAll('.feature-card, .course-card');
    elements.forEach(element => {
        const position = element.getBoundingClientRect();
        if (position.top < window.innerHeight) {
            element.classList.add('animate');
        }
    });
});
