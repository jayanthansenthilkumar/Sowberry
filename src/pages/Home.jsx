import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ThemeToggle from '../components/ThemeToggle';


const Home = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());

    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [formStatus, setFormStatus] = useState('');
  const handleContactFormSubmit = (e) => {
    e.preventDefault();
    setFormStatus('Message sent successfully!');
    e.target.reset();
    setTimeout(() => setFormStatus(''), 3000);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    e.target.reset();
  };

  const teamMembers = [
    { name: 'Jayanthan S', role: 'Founder & Director', description: 'Expert in educational psychology with over 15 years of teaching experience.', image: '/team/jayanthan.jpg' },
    { name: 'Prithika K', role: 'Head of Curriculum', description: 'Specializes in innovative teaching methods and curriculum development.', image: '/team/paasamalar.jpg' },
    { name: 'Sreelekha S', role: 'Learning Specialist', description: 'PhD in cognitive science with expertise in personalized learning approaches.', image: '/team/sreelekha.png' },
    { name: 'Priyadharshini B', role: 'Technology Director', description: 'Leads our educational technology initiatives and digital learning platforms.', image: '/team/pasamalar.jpg' },
    { name: 'Sridevi S', role: 'Student Success Coach', description: 'Dedicated to helping students achieve their full potential through mentoring.', image: '/team/sri.jpg' },
  ];

  const features = [
    { icon: 'ri-device-line', title: 'Digital Learning', description: 'Access our comprehensive curriculum anytime, anywhere through our intuitive digital platform.' },
    { icon: 'ri-group-line', title: 'Community Support', description: 'Join our vibrant learning community for collaboration, discussion, and peer support.' },
    { icon: 'ri-brain-line', title: 'Personalized Learning', description: 'Our adaptive learning system adjusts to your pace, style, and educational goals.' },
    { icon: 'ri-vidicon-line', title: 'Live Sessions', description: 'Engage with instructors through interactive live sessions and master complex concepts.' },
    { icon: 'ri-award-line', title: 'Certifications', description: 'Earn industry-recognized certifications to advance your career and showcase your skills.' },
    { icon: 'ri-user-voice-line', title: 'Expert Mentorship', description: 'Get guidance from industry professionals who provide personalized feedback and support.' },
  ];

  const courses = [
    { title: 'Web Development Bootcamp', description: 'Master HTML, CSS, JavaScript and modern frameworks to build responsive websites.', image: './assets/courses/web-development.jpg', duration: '8 weeks', students: '1,245', rating: 4.8, badge: 'Bestseller' },
    { title: 'Data Science Fundamentals', description: 'Learn statistics, Python, data analysis, machine learning and visualization tools.', image: './assets/courses/data-science.jpg', duration: '12 weeks', students: '875', rating: 4.0, badge: 'New' },
    { title: 'Digital Marketing Masterclass', description: 'Comprehensive training in SEO, social media, email, content marketing and analytics.', image: './assets/courses/digital-marketing.jpg', duration: '6 weeks', students: '1,540', rating: 4.9, badge: null },
    { title: 'UI/UX Design Essentials', description: 'Master user interface design principles and create stunning, user-friendly digital experiences.', image: './assets/courses/ui-design.jpg', duration: '10 weeks', students: '985', rating: 4.6, badge: 'Popular' },
    { title: 'Mobile App Development', description: 'Build native iOS and Android applications using React Native and modern mobile frameworks.', image: './assets/courses/mobile-dev.jpg', duration: '14 weeks', students: '755', rating: 4.3, badge: null },
    { title: 'Cybersecurity Fundamentals', description: 'Learn to identify vulnerabilities, implement security measures, and protect digital assets.', image: './assets/courses/cybersecurity.jpg', duration: '12 weeks', students: '425', rating: 5.0, badge: 'New' },
  ];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    for (let i = 0; i < fullStars; i++) stars.push(<i key={`full-${i}`} className="ri-star-fill text-yellow-400"></i>);
    if (hasHalfStar) stars.push(<i key="half" className="ri-star-half-fill text-yellow-400"></i>);
    for (let i = stars.length; i < 5; i++) stars.push(<i key={`empty-${i}`} className="ri-star-line text-gray-300"></i>);
    return stars;
  };

  return (
    <>
      <Sidebar />
      <ThemeToggle />

      <main className="ml-0 lg:ml-20">
        {/* Hero Section */}
        <section id="hero" className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-cream dark-theme:bg-gray-950">
          {/* Top Contact Bar */}
          <div className="absolute top-0 left-0 right-0 flex justify-center gap-6 py-3 text-sm text-gray-500 dark-theme:text-gray-400 z-10">
            <div className="flex items-center gap-2">
              <i className="ri-mail-line text-primary"></i>
              <span>berries@sowberry.com</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <i className="ri-phone-line text-primary"></i>
              <span>+91 8825756388</span>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Text */}
            <div className="space-y-6 animate-fade-in-up">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark-theme:text-white leading-tight">
                Welcome to <span className="text-gradient">Sowberry</span>
              </h1>
              <p className="text-lg text-gray-600 dark-theme:text-gray-300 max-w-lg">
                Cultivating knowledge and growing your potential through innovative learning experiences.
              </p>

              {/* Social Icons */}
              <div className="flex gap-3">
                {['ri-facebook-fill', 'ri-twitter-x-fill', 'ri-instagram-fill', 'ri-linkedin-fill'].map((icon, i) => (
                  <a key={i} href="#" className="w-9 h-9 rounded-lg bg-white dark-theme:bg-gray-800 border border-sand dark-theme:border-gray-700 flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary/30 transition-all duration-200">
                    <i className={icon}></i>
                  </a>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-2">
                <Link to="/auth" className="px-8 py-3 rounded-xl bg-primary text-white font-semibold shadow-sm hover:bg-primary-dark transition-all duration-200">
                  Get Started
                </Link>
                <a href="#features" className="px-8 py-3 rounded-xl border border-primary text-primary font-semibold hover:bg-primary/5 transition-all duration-200">
                  Learn More
                </a>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative flex justify-center items-center">
              <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-primary/10 dark-theme:bg-primary/15 flex items-center justify-center animate-pulse-glow">
                <i className="ri-seedling-line text-7xl sm:text-8xl text-primary"></i>
              </div>
              {/* Floating Badges */}
              {[
                { icon: 'ri-book-open-line', text: 'Learning', pos: 'top-0 left-0' },
                { icon: 'ri-award-line', text: 'Excellence', pos: 'top-0 right-0' },
                { icon: 'ri-rocket-line', text: 'Innovation', pos: 'bottom-0 left-0' },
                { icon: 'ri-group-line', text: 'Community', pos: 'bottom-0 right-0' },
              ].map((badge, i) => (
                <div key={i} className={`absolute ${badge.pos} px-4 py-2 bg-white dark-theme:bg-gray-800 rounded-lg border border-sand dark-theme:border-gray-700 shadow-sm flex items-center gap-2 text-sm font-medium text-gray-700 dark-theme:text-gray-200 ${i % 2 === 0 ? 'animate-float' : 'animate-float-delay'}`}>
                  <i className={`${badge.icon} text-primary`}></i>
                  {badge.text}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 bg-white dark-theme:bg-gray-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark-theme:text-white">
                About <span className="text-gradient">Sowberry</span>
              </h2>
              <p className="mt-4 text-gray-500 dark-theme:text-gray-400 max-w-2xl mx-auto">Modern education nurturing growth and fostering innovation</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Image */}
              <div className="relative flex justify-center">
                <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-3xl bg-primary/10 dark-theme:bg-primary/15 flex items-center justify-center">
                  <i className="ri-plant-line text-7xl text-primary"></i>
                </div>
                <div className="absolute -top-4 -left-4 px-4 py-2 bg-white dark-theme:bg-gray-800 rounded-lg border border-sand dark-theme:border-gray-700 shadow-sm flex items-center gap-2 text-sm font-medium text-gray-700 dark-theme:text-gray-200 animate-float">
                  <i className="ri-shield-check-line text-green-500"></i> Trusted
                </div>
                <div className="absolute -bottom-4 -right-4 px-4 py-2 bg-white dark-theme:bg-gray-800 rounded-lg border border-sand dark-theme:border-gray-700 shadow-sm flex items-center gap-2 text-sm font-medium text-gray-700 dark-theme:text-gray-200 animate-float-delay">
                  <i className="ri-medal-line text-yellow-500"></i> Awarded
                </div>
              </div>

              {/* Text */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-800 dark-theme:text-white">Our Vision</h3>
                <p className="text-gray-600 dark-theme:text-gray-300 leading-relaxed">
                  Sowberry Academy transforms education through innovative methods, cultivating knowledge that grows with you. We prepare learners with a global mindset for success in our interconnected world.
                </p>
                <div className="space-y-3">
                  {['Personalized Learning', 'Expert Instructors', 'Global Curriculum'].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-gray-700 dark-theme:text-gray-200">
                      <i className="ri-check-double-line text-primary text-xl"></i>
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section id="team" className="py-20 bg-cream dark-theme:bg-gray-950">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark-theme:text-white">
                Our <span className="text-gradient">Team</span>
              </h2>
              <p className="mt-4 text-gray-500 dark-theme:text-gray-400 max-w-2xl mx-auto">Meet the passionate educators behind Sowberry Academy</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {teamMembers.map((member, index) => (
                <div key={index} className="group bg-white dark-theme:bg-gray-900 rounded-2xl overflow-hidden border border-sand dark-theme:border-gray-800 hover:border-primary/30 transition-all duration-200">
                  <div className="relative h-48 bg-primary/5 dark-theme:bg-primary/10 overflow-hidden">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4 gap-3">
                      {['ri-linkedin-fill', 'ri-twitter-fill', 'ri-mail-fill'].map((icon, i) => (
                        <a key={i} href="#" className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-primary transition-colors">
                          <i className={`${icon} text-sm`}></i>
                        </a>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-semibold text-gray-800 dark-theme:text-white">{member.name}</h3>
                    <p className="text-sm text-primary font-medium mt-1">{member.role}</p>
                    <p className="text-xs text-gray-500 dark-theme:text-gray-400 mt-2 line-clamp-2">{member.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white dark-theme:bg-gray-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark-theme:text-white">
                Our <span className="text-gradient">Features</span>
              </h2>
              <p className="mt-4 text-gray-500 dark-theme:text-gray-400 max-w-2xl mx-auto">Discover what makes our learning experience unique</p>
            </div>

            {/* Video Showcase */}
            <div className="grid lg:grid-cols-2 gap-8 mb-20 items-center">
              <div className="relative rounded-2xl overflow-hidden bg-primary/5 dark-theme:bg-primary/10 aspect-video flex items-center justify-center group cursor-pointer">
                <img src="./assets/video-thumbnail.jpg" alt="Feature Video" className="absolute inset-0 w-full h-full object-cover" />
                <div className="relative z-10 w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                  <i className="ri-play-fill text-2xl"></i>
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark-theme:text-white">
                  Learn Anywhere, <span className="text-gradient">Anytime</span>
                </h2>
                <p className="text-gray-600 dark-theme:text-gray-300 leading-relaxed">
                  Experience our innovative teaching methodology that combines modern technology with proven educational practices. Watch our introduction video to see how Sowberry Academy transforms learning.
                </p>
                <a href="#" className="inline-flex px-6 py-3 rounded-xl bg-primary text-white font-semibold shadow-sm hover:bg-primary-dark transition-all duration-200">
                  Explore All Videos
                </a>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="group p-6 bg-cream dark-theme:bg-gray-800 rounded-2xl border border-sand dark-theme:border-gray-700 hover:border-primary/30 transition-all duration-200 cursor-pointer">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <i className={`${feature.icon} text-2xl text-primary`}></i>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark-theme:text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-500 dark-theme:text-gray-400 mb-4">{feature.description}</p>
                  <a href="#" className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Learn More <i className="ri-arrow-right-line"></i>
                  </a>
                </div>
              ))}
            </div>

            {/* Courses */}
            <div className="text-center mt-20 mb-10">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark-theme:text-white">
                Popular <span className="text-gradient">Courses</span>
              </h3>
              <p className="mt-3 text-gray-500 dark-theme:text-gray-400">Start your learning journey with our most sought-after programs</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => (
                <div key={index} className="bg-white dark-theme:bg-gray-800 rounded-2xl overflow-hidden border border-sand dark-theme:border-gray-700 hover:border-primary/30 transition-all duration-200 group">
                  <div className="relative h-48 bg-primary/5 dark-theme:bg-primary/10 overflow-hidden">
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-primary/80 flex items-center justify-center text-white">
                        <i className="ri-play-fill text-xl"></i>
                      </div>
                    </div>
                    {course.badge && (
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-primary text-white text-xs font-semibold shadow-lg">{course.badge}</span>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark-theme:text-gray-400 mb-3">
                      <span className="flex items-center gap-1"><i className="ri-time-line"></i> {course.duration}</span>
                      <span className="flex items-center gap-1"><i className="ri-user-line"></i> {course.students} students</span>
                    </div>
                    <h3 className="font-semibold text-gray-800 dark-theme:text-white mb-2">{course.title}</h3>
                    <p className="text-sm text-gray-500 dark-theme:text-gray-400 line-clamp-2 mb-4">{course.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {renderStars(course.rating)}
                        <span className="text-xs text-gray-400 ml-1">{course.rating}</span>
                      </div>
                      <a href="#" className="px-4 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary hover:text-white transition-all">
                        Enroll Now
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <a href="#" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl border border-primary text-primary font-semibold hover:bg-primary/5 transition-all duration-200">
                View All Courses <i className="ri-arrow-right-line"></i>
              </a>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-cream dark-theme:bg-gray-950">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark-theme:text-white">
                Get in <span className="text-gradient">Touch</span>
              </h2>
              <p className="mt-4 text-gray-500 dark-theme:text-gray-400 max-w-2xl mx-auto">Have questions or want to learn more? We're here to help you on your learning journey.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Contact Info */}
              <div className="bg-gray-950 rounded-2xl p-8 text-white">
                <h3 className="text-xl font-bold mb-3">Contact Information</h3>
                <p className="text-white/70 text-sm mb-8">Our team is ready to assist you with any inquiries.</p>

                <div className="space-y-6">
                  {[
                    { icon: 'ri-map-pin-line', title: 'Our Location', lines: ['123 Education Avenue', 'Chennai, Tamil Nadu 600001'] },
                    { icon: 'ri-mail-line', title: 'Email Us', lines: ['berries@sowberry.com', 'support@sowberry.com'] },
                    { icon: 'ri-phone-line', title: 'Call Us', lines: ['+91 8825756388', '+91 9442556789'] },
                    { icon: 'ri-time-line', title: 'Office Hours', lines: ['Mon - Fri: 9:00 AM - 6:00 PM', 'Sat: 9:00 AM - 1:00 PM'] },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                        <i className={`${item.icon} text-lg`}></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{item.title}</h4>
                        {item.lines.map((line, j) => (
                          <p key={j} className="text-white/70 text-sm">{line}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-white/20">
                  <h4 className="font-semibold text-sm mb-3">Connect With Us</h4>
                  <div className="flex gap-3">
                    {['ri-facebook-fill', 'ri-twitter-x-fill', 'ri-instagram-fill', 'ri-linkedin-fill', 'ri-youtube-fill'].map((icon, i) => (
                      <a key={i} href="#" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                        <i className={`${icon} text-sm`}></i>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-white dark-theme:bg-gray-900 rounded-2xl p-8 border border-sand dark-theme:border-gray-800">
                <h3 className="text-xl font-bold text-gray-800 dark-theme:text-white mb-6">Send Us a Message</h3>
                <form onSubmit={handleContactFormSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="relative">
                    <i className="ri-user-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                      <input type="text" placeholder="Your Name" required className="w-full pl-10 pr-4 py-3 rounded-xl bg-cream dark-theme:bg-gray-800 border border-sand dark-theme:border-gray-700 focus:border-primary outline-none text-sm text-gray-700 dark-theme:text-gray-200 transition-colors" />
                    </div>
                    <div className="relative">
                      <i className="ri-mail-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                      <input type="email" placeholder="Your Email" required className="w-full pl-10 pr-4 py-3 rounded-xl bg-cream dark-theme:bg-gray-800 border border-sand dark-theme:border-gray-700 focus:border-primary outline-none text-sm text-gray-700 dark-theme:text-gray-200 transition-colors" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <i className="ri-phone-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                      <input type="tel" placeholder="Your Phone (optional)" className="w-full pl-10 pr-4 py-3 rounded-xl bg-cream dark-theme:bg-gray-800 border border-sand dark-theme:border-gray-700 focus:border-primary outline-none text-sm text-gray-700 dark-theme:text-gray-200 transition-colors" />
                    </div>
                    <div className="relative">
                      <i className="ri-menu-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                      <select required className="w-full pl-10 pr-4 py-3 rounded-xl bg-cream dark-theme:bg-gray-800 border border-sand dark-theme:border-gray-700 focus:border-primary outline-none text-sm text-gray-700 dark-theme:text-gray-200 transition-colors appearance-none">
                        <option value="" disabled>Select Subject</option>
                        <option>Course Inquiry</option>
                        <option>Enrollment</option>
                        <option>Technical Support</option>
                        <option>Feedback</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="relative">
                    <i className="ri-message-2-line absolute left-3 top-4 text-gray-400"></i>
                    <textarea placeholder="Your Message" required rows={4} className="w-full pl-10 pr-4 py-3 rounded-xl bg-cream dark-theme:bg-gray-800 border border-sand dark-theme:border-gray-700 focus:border-primary outline-none text-sm text-gray-700 dark-theme:text-gray-200 resize-none transition-colors"></textarea>
                  </div>
                  <div className="flex items-center gap-4">
                    <button type="submit" className="px-8 py-3 rounded-xl bg-primary text-white font-semibold shadow-sm hover:bg-primary-dark transition-all duration-200 flex items-center gap-2">
                      <i className="ri-send-plane-fill"></i> Send Message
                    </button>
                    {formStatus && <span className="text-sm text-primary font-medium">{formStatus}</span>}
                  </div>
                </form>

                <div className="mt-6 rounded-xl overflow-hidden h-48">
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248756.1167341455!2d80.06892704417326!3d13.047485589196454!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5265ea4f7d3361%3A0x6e61a70b6863d433!2sChennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1658404965471!5m2!1sen!2sin" className="w-full h-full border-0" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-950 text-white ml-0 lg:ml-20">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* About Column */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <i className="ri-seedling-fill text-2xl text-primary"></i>
                <h2 className="text-xl font-bold">Sowberry <span className="text-primary">Academy</span></h2>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">Cultivating knowledge and growing your potential through innovative learning experiences.</p>
              <div className="flex gap-4 text-center">
                {[{ num: '15k+', label: 'Students' }, { num: '25+', label: 'Courses' }, { num: '95%', label: 'Success' }].map((stat, i) => (
                  <div key={i}>
                    <span className="block text-lg font-bold text-primary">{stat.num}</span>
                    <span className="text-xs text-gray-400">{stat.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-3">Connect With Us</h4>
                <div className="flex gap-2">
                  {['ri-facebook-fill', 'ri-twitter-x-fill', 'ri-instagram-fill', 'ri-linkedin-fill', 'ri-youtube-fill'].map((icon, i) => (
                    <a key={i} href="#" className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all">
                      <i className={`${icon} text-sm`}></i>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Links Column */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Explore</h3>
              <div className="grid grid-cols-1 gap-1">
                <h4 className="text-sm font-semibold text-primary mb-2">Main Pages</h4>
                {['Home', 'About Us', 'Our Team', 'Features', 'Contact Us', 'Blog'].map((link, i) => (
                  <a key={i} href="#" className="text-sm text-gray-400 hover:text-primary flex items-center gap-2 py-1 transition-colors">
                    <i className="ri-arrow-right-s-line text-xs"></i> {link}
                  </a>
                ))}
              </div>
            </div>

            {/* Courses Column */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Courses</h3>
              {['Web Development', 'Data Science', 'Digital Marketing', 'UI/UX Design', 'Mobile Development', 'Cybersecurity'].map((course, i) => (
                <a key={i} href="#" className="block text-sm text-gray-400 hover:text-primary py-1 transition-colors">
                  <i className="ri-arrow-right-s-line text-xs mr-1"></i> {course}
                </a>
              ))}
            </div>

            {/* Contact Column */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Get In Touch</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex gap-3"><i className="ri-map-pin-line text-primary mt-0.5"></i><span>123 Education Avenue<br />Chennai, Tamil Nadu 600001</span></li>
                <li className="flex gap-3"><i className="ri-mail-line text-primary"></i><span>berries@sowberry.com</span></li>
                <li className="flex gap-3"><i className="ri-phone-line text-primary"></i><span>+91 8825756388</span></li>
                <li className="flex gap-3"><i className="ri-time-line text-primary"></i><span>Mon - Fri: 9:00 AM - 6:00 PM</span></li>
              </ul>

              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-2">Subscribe to Newsletter</h4>
                <form onSubmit={handleNewsletterSubmit} className="flex">
                  <input type="email" placeholder="Your Email" required className="flex-1 px-4 py-2 rounded-l-xl bg-gray-800 border border-gray-700 text-sm text-gray-200 outline-none focus:border-primary transition-colors" />
                  <button type="submit" className="px-4 py-2 rounded-r-xl bg-primary text-white hover:bg-primary-dark transition-colors">
                    <i className="ri-send-plane-fill"></i>
                  </button>
                </form>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-2">Get Our App</h4>
                <div className="flex gap-2">
                  <a href="#" className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-lg text-xs text-gray-300 hover:bg-gray-700 transition-colors">
                    <i className="ri-google-play-fill text-base"></i> Google Play
                  </a>
                  <a href="#" className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-lg text-xs text-gray-300 hover:bg-gray-700 transition-colors">
                    <i className="ri-apple-fill text-base"></i> App Store
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Accreditations */}
        <div className="border-t border-gray-800 py-4">
          <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-6">
            <h4 className="text-sm text-gray-400 font-semibold">Accredited By</h4>
            {['NAAC A++', 'ISO 9001:2015', 'UGC Approved', 'AICTE Recognized'].map((acc, i) => (
              <span key={i} className="flex items-center gap-1 text-xs text-gray-500">
                <i className="ri-award-fill text-primary"></i> {acc}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 py-4">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">&copy; {currentYear} Sowberry Academy. All Rights Reserved.</p>
            <div className="flex gap-4">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Sitemap'].map((link, i) => (
                <a key={i} href="#" className="text-xs text-gray-500 hover:text-primary transition-colors">{link}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Go to top */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-50 w-11 h-11 rounded-xl bg-primary text-white shadow-sm flex items-center justify-center hover:bg-primary-dark transition-all duration-200 cursor-pointer
          ${showTopBtn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
      >
        <i className="ri-arrow-up-line text-lg"></i>
      </button>
    </>
  );
};

export default Home;
