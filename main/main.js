// Theme toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;

    // Check for saved theme preference or use default
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        body.classList.add(currentTheme);
        if (currentTheme === 'dark-theme') {
            themeToggle.querySelector('i').classList.replace('ri-sun-line', 'ri-moon-line');
        }
    }

    // Theme toggle event listener
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-theme');
        
        let theme = 'light';
        let iconClass = 'ri-sun-line';
        let newIconClass = 'ri-moon-line';
        
        if (body.classList.contains('dark-theme')) {
            theme = 'dark-theme';
            iconClass = 'ri-moon-line';
            newIconClass = 'ri-sun-line';
        }
        
        localStorage.setItem('theme', theme);
        themeToggle.querySelector('i').classList.replace(newIconClass, iconClass);
    });

    // Video play functionality
    const videoContainer = document.querySelector('.video-container');
    const playButton = document.querySelector('.play-button');
    
    if (videoContainer && playButton) {
        playButton.addEventListener('click', function() {
            const thumbnail = videoContainer.querySelector('.video-thumbnail');
            const iframe = document.createElement('iframe');
            
            // Replace with your actual YouTube/Vimeo video URL
            iframe.src = "https://www.youtube.com/embed/your-video-id?autoplay=1";
            iframe.width = "100%";
            iframe.height = "100%";
            iframe.frameBorder = "0";
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
            iframe.allowFullscreen = true;
            
            // Hide thumbnail and play button, insert video
            thumbnail.style.display = 'none';
            playButton.style.display = 'none';
            videoContainer.appendChild(iframe);
        });
    }

    // Course Video Functionality
    const coursePlayButtons = document.querySelectorAll('.course-play-button');
    
    // Create video modal if it doesn't exist
    if (coursePlayButtons.length > 0) {
        // Create modal only if it doesn't exist
        if (!document.querySelector('.course-video-modal')) {
            const videoModal = document.createElement('div');
            videoModal.className = 'course-video-modal';
            videoModal.innerHTML = `
                <div class="course-video-container">
                    <div class="close-video"><i class="ri-close-line"></i></div>
                    <div id="course-video-player"></div>
                </div>
            `;
            document.body.appendChild(videoModal);
            
            // Close modal functionality
            const closeBtn = videoModal.querySelector('.close-video');
            closeBtn.addEventListener('click', () => {
                videoModal.classList.remove('active');
                const videoPlayer = document.getElementById('course-video-player');
                videoPlayer.innerHTML = '';
            });
        }
        
        // Setup video play buttons
        coursePlayButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                const videoId = this.getAttribute('data-video');
                let videoUrl = '';
                
                // Map video IDs to actual URLs
                // In real implementation, these would be your actual YouTube/Vimeo URLs
                const videoMap = {
                    'web-dev-intro': 'https://www.youtube.com/embed/qz0aGYrrlhU?autoplay=1',
                    'data-science-intro': 'https://www.youtube.com/embed/ua-CiDNNj30?autoplay=1',
                    'marketing-intro': 'https://www.youtube.com/embed/bixR-KIJKYM?autoplay=1',
                    'ui-design-intro': 'https://www.youtube.com/embed/c9Wg6Cb_YlU?autoplay=1',
                    'mobile-dev-intro': 'https://www.youtube.com/embed/0-S5a0eXPoc?autoplay=1',
                    'cybersecurity-intro': 'https://www.youtube.com/embed/inWWhr5tnEA?autoplay=1'
                };
                
                videoUrl = videoMap[videoId] || 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1';
                
                const iframe = document.createElement('iframe');
                iframe.src = videoUrl;
                iframe.width = "100%";
                iframe.height = "100%";
                iframe.frameBorder = "0";
                iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
                iframe.allowFullscreen = true;
                
                const videoPlayer = document.getElementById('course-video-player');
                videoPlayer.innerHTML = '';
                videoPlayer.appendChild(iframe);
                
                // Show modal
                const videoModal = document.querySelector('.course-video-modal');
                videoModal.classList.add('active');
            });
        });
    }
    
    // Enhanced Navigation with Smooth Scrolling
    const navLinks = document.querySelectorAll('.floating-sidebar nav a');
    const sections = document.querySelectorAll('section[id]');
    let isScrolling = false;
    const scrollOffset = 80; // Offset to account for any fixed headers
    
    // Throttle function to limit execution frequency
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Function to set active nav link
    function setActiveLink(id) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${id}` || (id === 'hero' && href === '#')) {
                link.classList.add('active');
            }
        });
    }
    
    // Function to check which section is in view
    function getSectionInView() {
        const viewportHeight = window.innerHeight;
        
        // Use the middle of the viewport as the reference point
        const viewportMiddle = window.scrollY + (viewportHeight / 2);
        
        // Check which section contains this point
        for (const section of sections) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (viewportMiddle >= sectionTop && viewportMiddle < (sectionTop + sectionHeight)) {
                return section.id;
            }
        }
        
        // If we're at the top of the page, assume we're at the hero section
        if (window.scrollY < 100) {
            return 'hero';
        }
        
        // If we're at the bottom of the page, assume we're at the last section
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
            return sections[sections.length - 1].id;
        }
        
        return null;
    }
    
    // Handle click on nav links with improved smooth scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Handle empty or hash-only href as home
            if (!href || href === '#') {
                e.preventDefault();
                // Smooth scroll to top
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                setActiveLink('hero');
                return;
            }
            
            // For section links
            if (href.startsWith('#') && href !== '#') {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    isScrolling = true;
                    const targetPosition = targetSection.offsetTop - scrollOffset;
                    
                    // Smooth scroll to section
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update active state
                    setActiveLink(href.substring(1));
                    
                    // Reset scrolling flag after animation completes
                    setTimeout(() => {
                        isScrolling = false;
                    }, 1000);
                }
            }
        });
    });
    
    // Update active link based on scroll position with throttling
    const updateActiveNavOnScroll = throttle(function() {
        if (isScrolling) return; // Don't update during programmatic scrolling
        
        const currentSectionId = getSectionInView();
        if (currentSectionId) {
            setActiveLink(currentSectionId);
        }
    }, 100);
    
    // Listen for scroll events with passive option for better performance
    window.addEventListener('scroll', updateActiveNavOnScroll, { passive: true });
    
    // Set initial active link on page load
    setTimeout(updateActiveNavOnScroll, 100);

    // Add parallax effect to floating badges but exclude team section badges
    const badges = document.querySelectorAll('.floating-badge:not(.member-social *)');
    
    document.addEventListener('mousemove', (e) => {
        // Don't apply parallax if we're hovering over team members
        if (e.target.closest('.team-member')) {
            return;
        }
        
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        badges.forEach((badge, index) => {
            // Skip if this badge is inside a team member
            if (badge.closest('.team-member')) {
                return;
            }
            
            const factor = (index + 1) * 10;
            const offsetX = (x - 0.5) * factor;
            const offsetY = (y - 0.5) * factor;
            
            // Only apply transform if we're not manipulating team member elements
            badge.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        });
    });

    // Contact Form Validation and Submission
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value.trim();
            
            if (!name || !email || !subject || !message) {
                showFormStatus('Please fill in all required fields.', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFormStatus('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission (replace with actual form submission)
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="ri-loader-4-line"></i> Sending...';
            
            setTimeout(() => {
                showFormStatus('Message sent successfully! We\'ll get back to you soon.', 'success');
                contactForm.reset();
                
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    formStatus.classList.remove('success');
                    formStatus.textContent = '';
                    formStatus.style.opacity = 0;
                }, 5000);
            }, 1500);
        });
    }
    
    function showFormStatus(message, type) {
        formStatus.textContent = message;
        formStatus.className = 'form-status';
        formStatus.classList.add(type);
        formStatus.style.opacity = 1;
        
        // Scroll to form status if not visible
        if (!isElementInViewport(formStatus)) {
            formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
    
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
});
