// Theme toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle
    const themeToggle = document.querySelector('.theme-toggle');
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const icon = themeToggle.querySelector('i');
        
        if (icon.classList.contains('ri-sun-line')) {
            icon.classList.remove('ri-sun-line');
            icon.classList.add('ri-moon-line');
        } else {
            icon.classList.remove('ri-moon-line');
            icon.classList.add('ri-sun-line');
        }
    });
    
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
});
