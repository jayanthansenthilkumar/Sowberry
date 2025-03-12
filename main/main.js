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

    // Auto update copyright year
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // AI Assistant Toggle
    const aiAssistantContainer = document.querySelector('.ai-assistant-container');
    const aiToggleBtn = document.getElementById('aiToggleBtn');
    const aiCloseBtn = document.getElementById('aiCloseBtn');
    const aiMinimizeBtn = document.getElementById('aiMinimizeBtn');
    const aiChatMessages = document.getElementById('aiChatMessages');
    const aiMessageInput = document.getElementById('aiMessageInput');
    const aiSendBtn = document.getElementById('aiSendBtn');

    // Initialize AI assistant
    if (aiToggleBtn && aiAssistantContainer) {
        // Toggle chat window
        aiToggleBtn.addEventListener('click', function() {
            aiAssistantContainer.classList.toggle('active');
            aiToggleBtn.classList.toggle('active');
            
            // Focus input when opening
            if (aiAssistantContainer.classList.contains('active') && aiMessageInput) {
                setTimeout(() => aiMessageInput.focus(), 300);
            }
        });

        // Close chat window
        if (aiCloseBtn) {
            aiCloseBtn.addEventListener('click', function() {
                aiAssistantContainer.classList.remove('active');
                aiToggleBtn.classList.remove('active');
            });
        }

        // Minimize chat window (same as close for now)
        if (aiMinimizeBtn) {
            aiMinimizeBtn.addEventListener('click', function() {
                aiAssistantContainer.classList.remove('active');
                aiToggleBtn.classList.remove('active');
            });
        }

        // Send message functionality
        if (aiSendBtn && aiMessageInput && aiChatMessages) {
            // Function to send message
            function sendMessage() {
                const message = aiMessageInput.value.trim();
                if (!message) return;
                
                // Add user message to chat
                addMessage(message, 'outgoing');
                aiMessageInput.value = '';
                
                // Show typing indicator
                showTypingIndicator();
                
                // Process response after delay (simulating AI thinking)
                setTimeout(() => {
                    // Remove typing indicator
                    removeTypingIndicator();
                    
                    // Generate and add AI response
                    const response = generateResponse(message);
                    addMessage(response, 'incoming');
                    
                    // Scroll to bottom
                    scrollToBottom();
                }, 1000 + Math.random() * 1000); // Random delay between 1-2s
                
                // Scroll to bottom immediately after sending
                scrollToBottom();
            }
            
            // Function to add message to chat
            function addMessage(text, type) {
                const messageDiv = document.createElement('div');
                messageDiv.className = `ai-message ai-${type}`;
                
                const avatar = document.createElement('div');
                avatar.className = 'ai-avatar';
                
                const avatarIcon = document.createElement('i');
                avatarIcon.className = type === 'incoming' ? 'ri-robot-line' : 'ri-user-line';
                avatar.appendChild(avatarIcon);
                
                const content = document.createElement('div');
                content.className = 'ai-message-content';
                
                const paragraph = document.createElement('p');
                paragraph.textContent = text;
                content.appendChild(paragraph);
                
                messageDiv.appendChild(avatar);
                messageDiv.appendChild(content);
                
                aiChatMessages.appendChild(messageDiv);
            }
            
            // Function to show typing indicator
            function showTypingIndicator() {
                const typingDiv = document.createElement('div');
                typingDiv.className = 'ai-message ai-incoming ai-typing-indicator';
                
                const avatar = document.createElement('div');
                avatar.className = 'ai-avatar';
                
                const avatarIcon = document.createElement('i');
                avatarIcon.className = 'ri-robot-line';
                avatar.appendChild(avatarIcon);
                
                const content = document.createElement('div');
                content.className = 'ai-message-content ai-typing';
                
                for (let i = 0; i < 3; i++) {
                    const dot = document.createElement('span');
                    content.appendChild(dot);
                }
                
                typingDiv.appendChild(avatar);
                typingDiv.appendChild(content);
                
                aiChatMessages.appendChild(typingDiv);
                scrollToBottom();
            }
            
            // Function to remove typing indicator
            function removeTypingIndicator() {
                const typingIndicator = aiChatMessages.querySelector('.ai-typing-indicator');
                if (typingIndicator) {
                    typingIndicator.remove();
                }
            }
            
            // Function to scroll chat to bottom
            function scrollToBottom() {
                aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
            }
            
            // Function to generate AI response based on user input
            function generateResponse(message) {
                message = message.toLowerCase();
                
                // Simple response logic with very concise answers
                if (message.includes('hello') || message.includes('hi ') || message.includes('hey')) {
                    return "Hello! How can I help you?";
                }
                else if (message.includes('course') || message.includes('class') || message.includes('program')) {
                    return "We offer Web Dev, Data Science, Digital Marketing, UI/UX, Mobile Dev, and Cybersecurity.";
                }
                else if (message.includes('enroll') || message.includes('join') || message.includes('register') || message.includes('sign up')) {
                    return "Click 'Enroll Now' on any course page to register.";
                }
                else if (message.includes('contact') || message.includes('reach') || message.includes('support')) {
                    return "Email: berries@sowberry.com | Phone: +91 8825756388";
                }
                else if (message.includes('location') || message.includes('address') || message.includes('where')) {
                    return "123 Education Avenue, Chennai, TN 600001";
                }
                else if (message.includes('thank')) {
                    return "You're welcome!";
                }
                else if (message.includes('bye') || message.includes('goodbye')) {
                    return "Thanks for chatting!";
                }
                else if (message.includes('web development') || message.includes('web dev') || message.includes('frontend') || message.includes('backend')) {
                    return "8-week course: HTML, CSS, JS, React, Node.js";
                }
                else if (message.includes('data science') || message.includes('machine learning') || message.includes('ml') || message.includes('ai')) {
                    return "12-week course: Python, statistics, ML basics";
                }
                else if (message.includes('digital marketing') || message.includes('marketing') || message.includes('seo')) {
                    return "6-week course: SEO, social media, content marketing";
                }
                else if (message.includes('ui') || message.includes('ux') || message.includes('design')) {
                    return "10-week course: UX research, wireframing, prototyping";
                }
                else if (message.includes('mobile') || message.includes('app development') || message.includes('android') || message.includes('ios')) {
                    return "14-week course: React Native for iOS/Android";
                }
                else if (message.includes('cyber') || message.includes('security') || message.includes('hacking')) {
                    return "12-week course: Network security and ethical hacking";
                }
                else if (message.includes('certificate') || message.includes('certification')) {
                    return "All courses include industry-recognized certificates.";
                }
                else if (message.includes('job') || message.includes('career') || message.includes('placement')) {
                    return "Career support with 200+ hiring partners.";
                }
                else if (message.includes('schedule') || message.includes('timing') || message.includes('time')) {
                    return "Full-time and part-time options available.";
                }
                else if (message.includes('faculty') || message.includes('teacher') || message.includes('instructor') || message.includes('mentor')) {
                    return "Industry professionals with 8+ years experience.";
                }
                else if (message.includes('prerequisite') || message.includes('eligibility')) {
                    return "Basic computer skills for beginner courses.";
                }
                else if (message.includes('duration') || message.includes('how long') || message.includes('weeks')) {
                    return "Courses run 6-14 weeks depending on program.";
                }
                else if (message.includes('online') || message.includes('remote') || message.includes('virtual')) {
                    return "Both online and in-person formats available.";
                }
                else if (message.includes('material') || message.includes('resource') || message.includes('book')) {
                    return "All materials included at no extra cost.";
                }
                else if (message.includes('scholarship') || message.includes('financial aid') || message.includes('discount')) {
                    return "Scholarships and payment plans available.";
                }
                else if (message.includes('batch') || message.includes('intake') || message.includes('start date')) {
                    return "New batches start 1st and 15th monthly.";
                }
                else if (message.includes('project') || message.includes('portfolio')) {
                    return "All courses include portfolio-building projects.";
                }
                else if (message.includes('demo') || message.includes('trial') || message.includes('free class')) {
                    return "Free demos every Saturday at 11AM.";
                }
                else if (message.includes('internship')) {
                    return "Top students get internship opportunities.";
                }
                else {
                    return "How can I help with our courses?";
                }
            }
            
            // Event listeners
            aiSendBtn.addEventListener('click', sendMessage);
            
            aiMessageInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
            
            // Initial scroll to bottom
            scrollToBottom();
        }
    }

    // Go to Top Button Functionality
    const goToTopBtn = document.getElementById('goToTopBtn');
    
    if (goToTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                goToTopBtn.classList.add('active');
            } else {
                goToTopBtn.classList.remove('active');
            }
        });
        
        // Smooth scroll to top when button is clicked
        goToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});