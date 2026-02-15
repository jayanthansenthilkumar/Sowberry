import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ThemeToggle from '../components/ThemeToggle';
import '../styles/main.css';

const Home = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    // Initialize current year
    setCurrentYear(new Date().getFullYear());

    // Scroll to top button functionality
    const goToTopBtn = document.getElementById('goToTopBtn');
    
    const handleScroll = () => {
      if (window.scrollY > 300) {
        goToTopBtn?.classList.add('active');
      } else {
        goToTopBtn?.classList.remove('active');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContactFormSubmit = (e) => {
    e.preventDefault();
    const formStatus = document.getElementById('formStatus');
    if (formStatus) {
      formStatus.textContent = 'Message sent successfully!';
      formStatus.style.color = 'var(--primary-color)';
      e.target.reset();
      setTimeout(() => {
        formStatus.textContent = '';
      }, 3000);
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    e.target.reset();
  };

  const teamMembers = [
    {
      name: 'Jayanthan S',
      role: 'Founder & Director',
      description: 'Expert in educational psychology with over 15 years of teaching experience.',
      image: '/team/jayanthan.jpg'
    },
    {
      name: 'Prithika K',
      role: 'Head of Curriculum',
      description: 'Specializes in innovative teaching methods and curriculum development.',
      image: '/team/paasamalar.jpg'
    },
    {
      name: 'Sreelekha S',
      role: 'Learning Specialist',
      description: 'PhD in cognitive science with expertise in personalized learning approaches.',
      image: '/team/sreelekha.png'
    },
    {
      name: 'Priyadharshini B',
      role: 'Technology Director',
      description: 'Leads our educational technology initiatives and digital learning platforms.',
      image: '/team/pasamalar.jpg'
    },
    {
      name: 'Sridevi S',
      role: 'Student Success Coach',
      description: 'Dedicated to helping students achieve their full potential through mentoring.',
      image: '/team/sri.jpg'
    }
  ];

  const features = [
    {
      icon: 'ri-device-line',
      title: 'Digital Learning',
      description: 'Access our comprehensive curriculum anytime, anywhere through our intuitive digital platform.'
    },
    {
      icon: 'ri-group-line',
      title: 'Community Support',
      description: 'Join our vibrant learning community for collaboration, discussion, and peer support.'
    },
    {
      icon: 'ri-brain-line',
      title: 'Personalized Learning',
      description: 'Our adaptive learning system adjusts to your pace, style, and educational goals.'
    },
    {
      icon: 'ri-vidicon-line',
      title: 'Live Sessions',
      description: 'Engage with instructors through interactive live sessions and master complex concepts.'
    },
    {
      icon: 'ri-award-line',
      title: 'Certifications',
      description: 'Earn industry-recognized certifications to advance your career and showcase your skills.'
    },
    {
      icon: 'ri-user-voice-line',
      title: 'Expert Mentorship',
      description: 'Get guidance from industry professionals who provide personalized feedback and support.'
    }
  ];

  const courses = [
    {
      title: 'Web Development Bootcamp',
      description: 'Master HTML, CSS, JavaScript and modern frameworks to build responsive websites.',
      image: './assets/courses/web-development.jpg',
      duration: '8 weeks',
      students: '1,245',
      rating: 4.8,
      badge: 'Bestseller'
    },
    {
      title: 'Data Science Fundamentals',
      description: 'Learn statistics, Python, data analysis, machine learning and visualization tools.',
      image: './assets/courses/data-science.jpg',
      duration: '12 weeks',
      students: '875',
      rating: 4.0,
      badge: 'New'
    },
    {
      title: 'Digital Marketing Masterclass',
      description: 'Comprehensive training in SEO, social media, email, content marketing and analytics.',
      image: './assets/courses/digital-marketing.jpg',
      duration: '6 weeks',
      students: '1,540',
      rating: 4.9,
      badge: null
    },
    {
      title: 'UI/UX Design Essentials',
      description: 'Master user interface design principles and create stunning, user-friendly digital experiences.',
      image: './assets/courses/ui-design.jpg',
      duration: '10 weeks',
      students: '985',
      rating: 4.6,
      badge: 'Popular'
    },
    {
      title: 'Mobile App Development',
      description: 'Build native iOS and Android applications using React Native and modern mobile frameworks.',
      image: './assets/courses/mobile-dev.jpg',
      duration: '14 weeks',
      students: '755',
      rating: 4.3,
      badge: null
    },
    {
      title: 'Cybersecurity Fundamentals',
      description: 'Learn to identify vulnerabilities, implement security measures, and protect digital assets.',
      image: './assets/courses/cybersecurity.jpg',
      duration: '12 weeks',
      students: '425',
      rating: 5.0,
      badge: 'New'
    }
  ];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="ri-star-fill"></i>);
    }
    if (hasHalfStar) {
      stars.push(<i key="half" className="ri-star-half-fill"></i>);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<i key={`empty-${i}`} className="ri-star-line"></i>);
    }
    return stars;
  };

  return (
    <>
      <Sidebar />
      <ThemeToggle />
      
      <main className="content">
        {/* Hero Section */}
        <section id="hero" className="hero">
          <div className="contact-batch">
            <div className="contact-item">
              <i className="ri-mail-line"></i>
              <span>berries@sowberry.com</span>
            </div>
            <div className="contact-item">
              <i className="ri-phone-line"></i>
              <span>+91 8825756388</span>
            </div>
          </div>

          <div className="hero-content">
            <h1>Welcome to <span>Sowberry</span></h1>
            <p>Cultivating knowledge and growing your potential through innovative learning experiences.</p>
            
            <div className="social-icons">
              <a href="#" className="social-icon"><i className="ri-facebook-fill"></i></a>
              <a href="#" className="social-icon"><i className="ri-twitter-x-fill"></i></a>
              <a href="#" className="social-icon"><i className="ri-instagram-fill"></i></a>
              <a href="#" className="social-icon"><i className="ri-linkedin-fill"></i></a>
            </div>
            
            <div className="hero-buttons">
              <Link to="/auth" className="btn primary-btn">Get Started</Link>
              <a href="#features" className="btn outline-btn">Learn More</a>
            </div>
          </div>
          <div className="hero-image">
            <div className="image-container">
              <i className="ri-seedling-line"></i>
            </div>
            <div className="floating-badge badge-1"><i className="ri-book-open-line"></i> Learning</div>
            <div className="floating-badge badge-2"><i className="ri-award-line"></i> Excellence</div>
            <div className="floating-badge badge-3"><i className="ri-rocket-line"></i> Innovation</div>
            <div className="floating-badge badge-4"><i className="ri-group-line"></i> Community</div>
          </div>
        </section>
        
        {/* About Section */}
        <section id="about" className="about-section">
          <div className="section-header">
            <h2>About <span>Sowberry</span></h2>
            <p>Modern education nurturing growth and fostering innovation</p>
          </div>
          
          <div className="about-content">
            <div className="about-image-column">
              <div className="about-image">
                <div className="image-container">
                  <i className="ri-plant-line"></i>
                </div>
                <div className="floating-badge badge-about-1"><i className="ri-shield-check-line"></i> Trusted</div>
                <div className="floating-badge badge-about-2"><i className="ri-medal-line"></i> Awarded</div>
              </div>
            </div>
            <div className="about-text-column">
              <div className="about-text">
                <h3>Our Vision</h3>
                <p className="about-description">
                  Sowberry Academy transforms education through innovative methods, cultivating knowledge that grows with you. We prepare learners with a global mindset for success in our interconnected world.
                </p>
                <div className="about-features">
                  <div className="feature-item">
                    <i className="ri-check-double-line"></i>
                    <span>Personalized Learning</span>
                  </div>
                  <div className="feature-item">
                    <i className="ri-check-double-line"></i>
                    <span>Expert Instructors</span>
                  </div>
                  <div className="feature-item">
                    <i className="ri-check-double-line"></i>
                    <span>Global Curriculum</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section id="team" className="team-section">
          <div className="section-header">
            <h2>Our <span>Team</span></h2>
            <p>Meet the passionate educators behind Sowberry Academy</p>
          </div>
          
          <div className="team-container">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-member">
                <div className="member-image">
                  <img src={member.image} alt={member.name} className="team-member-photo" />
                  <div className="member-social">
                    <a href="#"><i className="ri-linkedin-fill"></i></a>
                    <a href="#"><i className="ri-twitter-fill"></i></a>
                    <a href="#"><i className="ri-mail-fill"></i></a>
                  </div>
                </div>
                <div className="member-info">
                  <h3>{member.name}</h3>
                  <p className="member-role">{member.role}</p>
                  <p className="member-desc">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Features Section */}
        <section id="features" className="features-section">
          <div className="section-header">
            <h2>Our <span>Features</span></h2>
            <p>Discover what makes our learning experience unique</p>
          </div>
          
          {/* Video Showcase */}
          <div className="video-showcase">
            <div className="video-container">
              <img src="./assets/video-thumbnail.jpg" alt="Feature Video" className="video-thumbnail" />
              <div className="play-button">
                <i className="ri-play-fill"></i>
              </div>
            </div>
            <div className="video-content">
              <h2>Learn Anywhere, <span>Anytime</span></h2>
              <p>Experience our innovative teaching methodology that combines modern technology with proven educational practices. Watch our introduction video to see how Sowberry Academy transforms learning.</p>
              <a href="#" className="btn primary-btn">Explore All Videos</a>
            </div>
          </div>
          
          <div className="features-container">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  <i className={feature.icon}></i>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <a href="#" className="feature-link">Learn More <i className="ri-arrow-right-line"></i></a>
              </div>
            ))}
          </div>
          
          {/* Sample Courses */}
          <div className="section-subheader">
            <h3>Popular <span>Courses</span></h3>
            <p>Start your learning journey with our most sought-after programs</p>
          </div>
          
          <div className="courses-container">
            {courses.map((course, index) => (
              <div key={index} className="course-card">
                <div className="course-image video-thumbnail-container">
                  <img src={course.image} alt={course.title} className="course-thumbnail" />
                  <div className="course-play-button">
                    <i className="ri-play-fill"></i>
                  </div>
                  {course.badge && <div className="course-badge">{course.badge}</div>}
                </div>
                <div className="course-content">
                  <div className="course-info">
                    <span><i className="ri-time-line"></i> {course.duration}</span>
                    <span><i className="ri-user-line"></i> {course.students} students</span>
                  </div>
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  <div className="course-footer">
                    <div className="course-rating">
                      {renderStars(course.rating)}
                      <span>{course.rating}</span>
                    </div>
                    <a href="#" className="btn course-btn">Enroll Now</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="courses-cta">
            <a href="#" className="btn outline-btn">View All Courses <i className="ri-arrow-right-line"></i></a>
          </div>
        </section>
        
        {/* Contact Section */}
        <section id="contact" className="contact-section">
          <div className="section-header">
            <h2>Get in <span>Touch</span></h2>
            <p>Have questions or want to learn more? We're here to help you on your learning journey.</p>
          </div>
          
          <div className="contact-container">
            <div className="contact-info">
              <h3>Contact Information</h3>
              <p>Our team is ready to assist you with any inquiries you may have about our courses, enrollment process, or educational opportunities.</p>
              
              <div className="contact-details">
                <div className="contact-detail-item">
                  <div className="contact-icon">
                    <i className="ri-map-pin-line"></i>
                  </div>
                  <div className="detail-text">
                    <h4>Our Location</h4>
                    <p>123 Education Avenue, Learning District, Chennai, Tamil Nadu 600001</p>
                  </div>
                </div>
                
                <div className="contact-detail-item">
                  <div className="contact-icon">
                    <i className="ri-mail-line"></i>
                  </div>
                  <div className="detail-text">
                    <h4>Email Us</h4>
                    <p>berries@sowberry.com</p>
                    <p>support@sowberry.com</p>
                  </div>
                </div>
                
                <div className="contact-detail-item">
                  <div className="contact-icon">
                    <i className="ri-phone-line"></i>
                  </div>
                  <div className="detail-text">
                    <h4>Call Us</h4>
                    <p>+91 8825756388</p>
                    <p>+91 9442556789</p>
                  </div>
                </div>
                
                <div className="contact-detail-item">
                  <div className="contact-icon">
                    <i className="ri-time-line"></i>
                  </div>
                  <div className="detail-text">
                    <h4>Office Hours</h4>
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 9:00 AM - 1:00 PM</p>
                  </div>
                </div>
              </div>
              
              <div className="contact-social">
                <h4>Connect With Us</h4>
                <div className="social-icons">
                  <a href="#" className="social-icon"><i className="ri-facebook-fill"></i></a>
                  <a href="#" className="social-icon"><i className="ri-twitter-x-fill"></i></a>
                  <a href="#" className="social-icon"><i className="ri-instagram-fill"></i></a>
                  <a href="#" className="social-icon"><i className="ri-linkedin-fill"></i></a>
                  <a href="#" className="social-icon"><i className="ri-youtube-fill"></i></a>
                </div>
              </div>
            </div>
            
            <div className="contact-form-container">
              <h3>Send Us a Message</h3>
              <form id="contactForm" className="contact-form" onSubmit={handleContactFormSubmit}>
                <div className="form-group">
                  <div className="input-group">
                    <i className="ri-user-line"></i>
                    <input type="text" id="name" name="name" placeholder="Your Name" required />
                  </div>
                  <div className="input-group">
                    <i className="ri-mail-line"></i>
                    <input type="email" id="email" name="email" placeholder="Your Email" required />
                  </div>
                </div>
                
                <div className="form-group">
                  <div className="input-group">
                    <i className="ri-phone-line"></i>
                    <input type="tel" id="phone" name="phone" placeholder="Your Phone (optional)" />
                  </div>
                  <div className="input-group">
                    <i className="ri-menu-line"></i>
                    <select id="subject" name="subject" required>
                      <option value="" disabled>Select Subject</option>
                      <option value="Course Inquiry">Course Inquiry</option>
                      <option value="Enrollment">Enrollment</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Feedback">Feedback</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group full-width">
                  <div className="input-group textarea-group">
                    <i className="ri-message-2-line"></i>
                    <textarea id="message" name="message" placeholder="Your Message" required></textarea>
                  </div>
                </div>
                
                <div className="form-submit">
                  <button type="submit" className="btn primary-btn">
                    <i className="ri-send-plane-fill"></i> Send Message
                  </button>
                  <div className="form-status" id="formStatus"></div>
                </div>
              </form>
              
              <div className="contact-map">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248756.1167341455!2d80.06892704417326!3d13.047485589196454!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5265ea4f7d3361%3A0x6e61a70b6863d433!2sChennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1658404965471!5m2!1sen!2sin" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-waves">
            <div className="wave wave1"></div>
            <div className="wave wave2"></div>
            <div className="wave wave3"></div>
          </div>
          
          <div className="footer-content">
            <div className="footer-column footer-about">
              <div className="footer-logo">
                <i className="ri-seedling-fill"></i>
                <h2>Sowberry <span>Academy</span></h2>
              </div>
              <p className="footer-description">Cultivating knowledge and growing your potential through innovative learning experiences that prepare you for success in a rapidly evolving world.</p>
              <div className="footer-stats">
                <div className="stat-item">
                  <span className="stat-number">15k+</span>
                  <span className="stat-label">Students</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">25+</span>
                  <span className="stat-label">Courses</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">95%</span>
                  <span className="stat-label">Success Rate</span>
                </div>
              </div>
              <div className="footer-social">
                <h4>Connect With Us</h4>
                <div className="social-icons">
                  <a href="#" className="social-icon" aria-label="Facebook"><i className="ri-facebook-fill"></i></a>
                  <a href="#" className="social-icon" aria-label="Twitter"><i className="ri-twitter-x-fill"></i></a>
                  <a href="#" className="social-icon" aria-label="Instagram"><i className="ri-instagram-fill"></i></a>
                  <a href="#" className="social-icon" aria-label="LinkedIn"><i className="ri-linkedin-fill"></i></a>
                  <a href="#" className="social-icon" aria-label="YouTube"><i className="ri-youtube-fill"></i></a>
                </div>
              </div>
            </div>
            
            <div className="footer-column footer-links">
              <h3>Explore</h3>
              <div className="footer-links-grid">
                <div className="footer-links-column">
                  <h4>Main Pages</h4>
                  <ul>
                    <li><a href="#"><i className="ri-arrow-right-s-line"></i> Home</a></li>
                    <li><a href="#about"><i className="ri-arrow-right-s-line"></i> About Us</a></li>
                    <li><a href="#team"><i className="ri-arrow-right-s-line"></i> Our Team</a></li>
                    <li><a href="#features"><i className="ri-arrow-right-s-line"></i> Features</a></li>
                    <li><a href="#contact"><i className="ri-arrow-right-s-line"></i> Contact Us</a></li>
                    <li><a href="#"><i className="ri-arrow-right-s-line"></i> Blog</a></li>
                  </ul>
                </div>
                <div className="footer-links-column">
                  <h4>Courses</h4>
                  <ul>
                    <li><a href="#"><i className="ri-arrow-right-s-line"></i> Web Development</a></li>
                    <li><a href="#"><i className="ri-arrow-right-s-line"></i> Data Science</a></li>
                    <li><a href="#"><i className="ri-arrow-right-s-line"></i> Digital Marketing</a></li>
                    <li><a href="#"><i className="ri-arrow-right-s-line"></i> UI/UX Design</a></li>
                    <li><a href="#"><i className="ri-arrow-right-s-line"></i> Mobile Development</a></li>
                    <li><a href="#"><i className="ri-arrow-right-s-line"></i> Cybersecurity</a></li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="footer-column footer-contact">
              <h3>Get In Touch</h3>
              <ul className="footer-contact-info">
                <li>
                  <i className="ri-map-pin-line"></i>
                  <span>123 Education Avenue<br />Chennai, Tamil Nadu 600001</span>
                </li>
                <li>
                  <i className="ri-mail-line"></i>
                  <span>berries@sowberry.com</span>
                </li>
                <li>
                  <i className="ri-phone-line"></i>
                  <span>+91 8825756388</span>
                </li>
                <li>
                  <i className="ri-time-line"></i>
                  <span>Mon - Fri: 9:00 AM - 6:00 PM</span>
                </li>
              </ul>
              
              <div className="newsletter">
                <h4>Subscribe to Newsletter</h4>
                <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                  <div className="newsletter-input">
                    <input type="email" placeholder="Your Email" required />
                    <button type="submit"><i className="ri-send-plane-fill"></i></button>
                  </div>
                </form>
              </div>
              
              <div className="footer-app-links">
                <h4>Get Our App</h4>
                <div className="app-buttons">
                  <a href="#" className="app-btn">
                    <i className="ri-google-play-fill"></i>
                    <span>Google Play</span>
                  </a>
                  <a href="#" className="app-btn">
                    <i className="ri-apple-fill"></i>
                    <span>App Store</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-middle">
          <div className="accreditations">
            <h4>Accredited By</h4>
            <div className="accreditation-logos">
              <span><i className="ri-award-fill"></i> NAAC A++</span>
              <span><i className="ri-award-fill"></i> ISO 9001:2015</span>
              <span><i className="ri-award-fill"></i> UGC Approved</span>
              <span><i className="ri-award-fill"></i> AICTE Recognized</span>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="copyright">
            <p>&copy; <span id="current-year">{currentYear}</span> Sowberry Academy. All Rights Reserved.</p>
          </div>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
            <a href="#">Sitemap</a>
          </div>
        </div>
      </footer>
      
      {/* Go to top button */}
      <button className="go-to-top" id="goToTopBtn" title="Go to top" onClick={scrollToTop}>
        <i className="ri-arrow-up-line"></i>
      </button>
    </>
  );
};

export default Home;
