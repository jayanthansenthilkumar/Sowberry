import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ThemeToggle from '../components/ThemeToggle';
import Swal from 'sweetalert2';
import { publicApi } from '../utils/api';


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
  const handleContactFormSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const body = {
      name: form.querySelector('[placeholder*="name" i], [name="name"]')?.value || form.elements[0]?.value,
      email: form.querySelector('[type="email"]')?.value || form.elements[1]?.value,
      phone: form.querySelector('[type="tel"]')?.value || form.elements[2]?.value || '',
      subject: form.querySelector('[placeholder*="subject" i], [name="subject"]')?.value || form.elements[3]?.value || 'Contact Form',
      message: form.querySelector('textarea')?.value || ''
    };
    const res = await publicApi.submitContact(body);
    if (res.success) {
      Swal.fire({ icon: 'success', title: 'Sent!', text: 'Your message has been sent successfully.', timer: 2000, showConfirmButton: false, background: '#fff', color: '#1f2937' });
      form.reset();
    } else {
      Swal.fire({ icon: 'error', title: 'Error', text: res.message || 'Failed to send message.', background: '#fff', color: '#1f2937' });
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]')?.value;
    if (!email) return;
    const res = await publicApi.subscribeNewsletter({ email });
    if (res.success) {
      Swal.fire({ icon: 'success', title: 'Subscribed!', text: 'You have been subscribed to our newsletter.', timer: 2000, showConfirmButton: false, background: '#fff', color: '#1f2937' });
      e.target.reset();
    } else {
      Swal.fire({ icon: 'error', title: 'Error', text: res.message || 'Could not subscribe.', background: '#fff', color: '#1f2937' });
    }
  };



  return (
    <>
      <Sidebar />
      <ThemeToggle />

      <main className="ml-0 lg:ml-20">
        {/* Hero Section — Claude-inspired centered layout with warm gradient orbs */}
        <section id="hero" className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-cream dark-theme:bg-gray-950">
          {/* Gradient Orbs — warm organic backdrop */}
          <div className="hero-orb hero-orb-1 -top-20 -left-24"></div>
          <div className="hero-orb hero-orb-2 top-1/4 -right-16"></div>
          <div className="hero-orb hero-orb-3 bottom-16 left-1/4"></div>
          <div className="hero-orb hero-orb-4 top-12 right-1/3"></div>
          <div className="hero-orb hero-orb-5 -bottom-20 -right-20"></div>

          {/* Subtle grid lines */}
          <div className="hero-grid-line w-px h-full left-1/4 top-0"></div>
          <div className="hero-grid-line w-px h-full left-2/4 top-0"></div>
          <div className="hero-grid-line w-px h-full left-3/4 top-0"></div>
          <div className="hero-grid-line h-px w-full top-1/3 left-0"></div>
          <div className="hero-grid-line h-px w-full top-2/3 left-0"></div>

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

          {/* Centered Hero Content */}
          <div className="relative z-10 max-w-4xl mx-auto px-6 py-32 text-center">
            <div className="animate-fade-in-up">
              {/* Live Activity Indicator */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/60 dark-theme:bg-gray-900/60 backdrop-blur-sm border border-sand/60 dark-theme:border-gray-800 text-xs text-gray-500 dark-theme:text-gray-400 mb-5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span><span className="font-semibold text-gray-700 dark-theme:text-gray-200">2,847</span> students learning right now</span>
              </div>

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-primary text-sm font-medium mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                Transforming Education Since 2020
              </div>

              {/* Heading */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark-theme:text-gray-100 leading-[1.1] tracking-tight mb-6">
                Grow with{' '}
                <span className="relative inline-block">
                  <span className="text-gradient">Sowberry</span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                    <path d="M2 6C50 2 150 2 198 6" stroke="url(#underline-grad)" strokeWidth="3" strokeLinecap="round"/>
                    <defs>
                      <linearGradient id="underline-grad" x1="0" y1="0" x2="200" y2="0">
                        <stop offset="0%" stopColor="#c96442"/>
                        <stop offset="100%" stopColor="#a78058"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-gray-500 dark-theme:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                Cultivating knowledge and growing your potential through
                <span className="text-gray-700 dark-theme:text-gray-200 font-medium"> innovative learning experiences</span> designed for the future.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <Link to="/auth" className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-white font-semibold shadow-sm hover:bg-primary-dark transition-all duration-200">
                  Start Learning Free
                  <i className="ri-arrow-right-line group-hover:translate-x-0.5 transition-transform"></i>
                </Link>
                <a href="#features" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white dark-theme:bg-gray-900 border border-sand dark-theme:border-gray-700 text-gray-700 dark-theme:text-gray-200 font-semibold hover:border-primary/30 hover:text-primary transition-all duration-200">
                  <i className="ri-play-circle-line"></i>
                  Watch Demo
                </a>
              </div>

              {/* Trust line */}
              <p className="text-xs text-gray-400 dark-theme:text-gray-500 mb-14">
                <i className="ri-shield-check-line text-sage mr-1"></i> No credit card required &nbsp;·&nbsp; <i className="ri-time-line text-amber mr-1"></i> 14-day free trial &nbsp;·&nbsp; <i className="ri-lock-line text-primary mr-1"></i> Cancel anytime
              </p>

              {/* Stats Row */}
              <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 mb-12">
                {[
                  { value: '15,000+', label: 'Students', color: 'text-primary', icon: 'ri-group-fill' },
                  { value: '25+', label: 'Courses', color: 'text-amber', icon: 'ri-book-2-fill' },
                  { value: '95%', label: 'Success Rate', color: 'text-sage', icon: 'ri-bar-chart-fill' },
                  { value: '4.8', label: 'Avg Rating', color: 'text-clay', icon: 'ri-star-fill' },
                ].map((stat, i) => (
                  <div key={i} className="text-center group">
                    <div className="flex items-center justify-center gap-1.5">
                      <i className={`${stat.icon} ${stat.color} text-sm opacity-60`}></i>
                      <p className={`text-2xl sm:text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                    <p className="text-xs text-gray-400 dark-theme:text-gray-500 font-medium uppercase tracking-wider mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Palette Accent Cards — floating organic tiles */}
              <div className="flex flex-wrap justify-center gap-3 mb-10">
                {[
                  { icon: 'ri-book-open-line', text: 'Interactive Courses', bg: 'bg-peach/30 dark-theme:bg-peach/10', iconColor: 'text-terracotta' },
                  { icon: 'ri-award-line', text: 'Certified Programs', bg: 'bg-sage/30 dark-theme:bg-sage/10', iconColor: 'text-sage' },
                  { icon: 'ri-rocket-line', text: 'Career Growth', bg: 'bg-amber/20 dark-theme:bg-amber/10', iconColor: 'text-amber' },
                  { icon: 'ri-group-line', text: 'Expert Mentors', bg: 'bg-blush/25 dark-theme:bg-blush/10', iconColor: 'text-clay' },
                  { icon: 'ri-code-s-slash-line', text: 'Hands-on Projects', bg: 'bg-primary/10 dark-theme:bg-primary/8', iconColor: 'text-primary' },
                  { icon: 'ri-trophy-line', text: 'Industry Recognition', bg: 'bg-linen dark-theme:bg-sienna/10', iconColor: 'text-sienna' },
                ].map((card, i) => (
                  <div key={i} className={`${card.bg} px-4 py-2.5 rounded-xl border border-sand/50 dark-theme:border-gray-800 flex items-center gap-2.5 text-sm font-medium text-gray-700 dark-theme:text-gray-300 hover:scale-[1.03] transition-transform duration-200`}>
                    <i className={`${card.icon} ${card.iconColor} text-base`}></i>
                    {card.text}
                  </div>
                ))}
              </div>

              {/* Mini Testimonial */}
              <div className="max-w-md mx-auto mb-10 px-6 py-4 rounded-2xl bg-white/70 dark-theme:bg-gray-900/50 backdrop-blur-sm border border-sand/60 dark-theme:border-gray-800">
                <div className="flex gap-1 mb-2 justify-center">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="ri-star-fill text-amber text-xs"></i>
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark-theme:text-gray-400 italic leading-relaxed">
                  "Sowberry transformed my career. The mentorship and hands-on projects gave me skills no textbook could."
                </p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <div className="w-6 h-6 rounded-full bg-peach/40 flex items-center justify-center text-[10px] font-bold text-terracotta">A</div>
                  <span className="text-xs font-medium text-gray-700 dark-theme:text-gray-300">Aarav K.</span>
                  <span className="text-[10px] text-gray-400">— Data Science Graduate</span>
                </div>
              </div>

              {/* Social Icons */}
              <div className="flex justify-center gap-2 mb-12">
                {[
                  { icon: 'ri-facebook-fill', hover: 'hover:bg-blue-50 hover:text-blue-600 dark-theme:hover:bg-blue-900/20' },
                  { icon: 'ri-twitter-x-fill', hover: 'hover:bg-gray-100 hover:text-gray-900 dark-theme:hover:bg-gray-800' },
                  { icon: 'ri-instagram-fill', hover: 'hover:bg-pink-50 hover:text-pink-500 dark-theme:hover:bg-pink-900/20' },
                  { icon: 'ri-linkedin-fill', hover: 'hover:bg-blue-50 hover:text-blue-700 dark-theme:hover:bg-blue-900/20' },
                  { icon: 'ri-youtube-fill', hover: 'hover:bg-red-50 hover:text-red-500 dark-theme:hover:bg-red-900/20' },
                ].map((social, i) => (
                  <a key={i} href="#" className={`w-9 h-9 rounded-lg bg-white dark-theme:bg-gray-900 border border-sand dark-theme:border-gray-800 flex items-center justify-center text-gray-400 transition-all duration-200 ${social.hover}`}>
                    <i className={social.icon}></i>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Trusted-by Marquee */}
          <div className="relative z-10 mb-16">
            <p className="text-center text-[10px] uppercase tracking-[0.2em] text-gray-400 dark-theme:text-gray-600 font-medium mb-4">Trusted by leading institutions & companies</p>
            <div className="overflow-hidden">
              <div className="hero-marquee flex gap-12 items-center whitespace-nowrap">
                {[...Array(2)].map((_, setIdx) => (
                  <div key={setIdx} className="flex gap-12 items-center shrink-0" aria-hidden={setIdx === 1}>
                    {[
                      { icon: 'ri-google-fill', name: 'Google' },
                      { icon: 'ri-microsoft-fill', name: 'Microsoft' },
                      { icon: 'ri-amazon-fill', name: 'Amazon' },
                      { icon: 'ri-meta-fill', name: 'Meta' },
                      { icon: 'ri-netflix-fill', name: 'Netflix' },
                      { icon: 'ri-apple-fill', name: 'Apple' },
                      { icon: 'ri-spotify-fill', name: 'Spotify' },
                      { icon: 'ri-github-fill', name: 'GitHub' },
                    ].map((brand, i) => (
                      <div key={i} className="flex items-center gap-2 text-gray-300 dark-theme:text-gray-700">
                        <i className={`${brand.icon} text-xl`}></i>
                        <span className="text-sm font-medium tracking-wide">{brand.name}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Subjects Ticker */}
          <div className="relative z-10 mb-20">
            <div className="overflow-hidden">
              <div className="hero-marquee-reverse flex gap-4 whitespace-nowrap">
                {[...Array(2)].map((_, setIdx) => (
                  <div key={setIdx} className="flex gap-4 shrink-0" aria-hidden={setIdx === 1}>
                    {[
                      { text: 'React', color: 'bg-blue-500/10 text-blue-600 dark-theme:text-blue-400' },
                      { text: 'Python', color: 'bg-amber/15 text-amber' },
                      { text: 'Machine Learning', color: 'bg-sage/15 text-sage' },
                      { text: 'UI/UX Design', color: 'bg-pink-500/10 text-pink-500' },
                      { text: 'Data Science', color: 'bg-primary/10 text-primary' },
                      { text: 'Cybersecurity', color: 'bg-red-500/10 text-red-500 dark-theme:text-red-400' },
                      { text: 'Cloud Computing', color: 'bg-sky-500/10 text-sky-500' },
                      { text: 'JavaScript', color: 'bg-yellow-400/15 text-yellow-600 dark-theme:text-yellow-400' },
                      { text: 'Blockchain', color: 'bg-purple-500/10 text-purple-500' },
                      { text: 'DevOps', color: 'bg-blush/15 text-clay' },
                      { text: 'AI & Deep Learning', color: 'bg-emerald-500/10 text-emerald-600 dark-theme:text-emerald-400' },
                      { text: 'Mobile Apps', color: 'bg-peach/25 text-terracotta' },
                    ].map((tag, i) => (
                      <span key={i} className={`${tag.color} px-3.5 py-1.5 rounded-full text-xs font-medium border border-transparent`}>{tag.text}</span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom wave divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" fill="none" className="w-full h-auto">
              <path d="M0 60V30C240 10 480 0 720 10C960 20 1200 40 1440 30V60H0Z" className="fill-white dark-theme:fill-gray-900"/>
            </svg>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="relative py-24 pb-32 bg-white dark-theme:bg-gray-900 overflow-hidden">
          {/* Decorative orb */}
          <div className="hero-orb hero-orb-2 -top-32 -right-32 opacity-20"></div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sage/15 text-sage text-sm font-medium mb-4">
                <i className="ri-seedling-line"></i> Our Story
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark-theme:text-gray-100">
                About <span className="text-gradient">Sowberry</span>
              </h2>
              <p className="mt-4 text-gray-500 dark-theme:text-gray-400 max-w-2xl mx-auto">Modern education nurturing growth and fostering innovation in every learner</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Visual Side */}
              <div className="relative flex justify-center">
                <div className="relative w-72 h-72 sm:w-80 sm:h-80">
                  {/* Layered organic shapes */}
                  <div className="absolute inset-0 rounded-[2rem] bg-peach/20 dark-theme:bg-peach/10 rotate-3"></div>
                  <div className="absolute inset-0 rounded-[2rem] bg-sage/15 dark-theme:bg-sage/8 -rotate-3"></div>
                  <div className="absolute inset-2 rounded-[1.75rem] bg-cream dark-theme:bg-gray-800 flex items-center justify-center">
                    <i className="ri-plant-line text-7xl text-primary opacity-80"></i>
                  </div>
                </div>
                {/* Floating badges with palette colors */}
                <div className="absolute -top-4 -left-4 px-4 py-2.5 bg-white dark-theme:bg-gray-800 rounded-xl border border-sand dark-theme:border-gray-700 shadow-sm flex items-center gap-2 text-sm font-medium text-gray-700 dark-theme:text-gray-200 animate-float">
                  <div className="w-6 h-6 rounded-md bg-sage/20 flex items-center justify-center">
                    <i className="ri-shield-check-line text-sage text-xs"></i>
                  </div>
                  Trusted
                </div>
                <div className="absolute -bottom-4 -right-4 px-4 py-2.5 bg-white dark-theme:bg-gray-800 rounded-xl border border-sand dark-theme:border-gray-700 shadow-sm flex items-center gap-2 text-sm font-medium text-gray-700 dark-theme:text-gray-200 animate-float-delay">
                  <div className="w-6 h-6 rounded-md bg-amber/20 flex items-center justify-center">
                    <i className="ri-medal-line text-amber text-xs"></i>
                  </div>
                  Awarded
                </div>
                <div className="absolute top-1/2 -right-8 px-4 py-2.5 bg-white dark-theme:bg-gray-800 rounded-xl border border-sand dark-theme:border-gray-700 shadow-sm flex items-center gap-2 text-sm font-medium text-gray-700 dark-theme:text-gray-200 animate-float">
                  <div className="w-6 h-6 rounded-md bg-blush/20 flex items-center justify-center">
                    <i className="ri-heart-line text-primary text-xs"></i>
                  </div>
                  5,000+ Reviews
                </div>
              </div>

              {/* Text Side */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-800 dark-theme:text-gray-100">Our Vision</h3>
                <p className="text-gray-500 dark-theme:text-gray-400 leading-relaxed">
                  Sowberry Academy transforms education through innovative methods, cultivating knowledge that grows with you. We prepare learners with a global mindset for success in our interconnected world.
                </p>
                <div className="space-y-3">
                  {[
                    { text: 'Personalized Learning', icon: 'ri-user-settings-line', color: 'bg-peach/20 text-terracotta' },
                    { text: 'Expert Instructors', icon: 'ri-user-star-line', color: 'bg-sage/20 text-sage' },
                    { text: 'Global Curriculum', icon: 'ri-global-line', color: 'bg-amber/20 text-amber' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-cream dark-theme:bg-gray-800 border border-sand/50 dark-theme:border-gray-700">
                      <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center`}>
                        <i className={`${item.icon} text-sm`}></i>
                      </div>
                      <span className="font-medium text-gray-700 dark-theme:text-gray-200">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom wave divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" fill="none" className="w-full h-auto">
              <path d="M0 60V20C360 50 720 50 1080 30C1260 20 1380 10 1440 5V60H0Z" className="fill-cream dark-theme:fill-gray-950"/>
            </svg>
          </div>
        </section>



        {/* Contact Section */}
        <section id="contact" className="relative py-24 pb-32 bg-cream dark-theme:bg-gray-950 overflow-hidden">
          {/* Decorative orbs */}
          <div className="hero-orb hero-orb-5 -top-20 -right-32 opacity-20"></div>
          <div className="hero-orb hero-orb-3 bottom-0 left-10 opacity-15"></div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 text-primary text-sm font-medium mb-4">
                <i className="ri-chat-smile-line"></i> Let's Connect
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark-theme:text-gray-100">
                Get in <span className="text-gradient">Touch</span>
              </h2>
              <p className="mt-4 text-gray-500 dark-theme:text-gray-400 max-w-2xl mx-auto">Have questions or want to learn more? We're here to help you on your learning journey.</p>
            </div>

            <div className="grid lg:grid-cols-5 gap-6">
              {/* Contact Info — dark warm panel */}
              <div className="lg:col-span-2 bg-gray-950 rounded-2xl p-8 text-white relative overflow-hidden">
                {/* Subtle warm gradient overlay */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-sage/10 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-2">Contact Information</h3>
                  <p className="text-white/50 text-sm mb-8">We're here to help you succeed.</p>

                  <div className="space-y-5">
                    {[
                      { icon: 'ri-map-pin-line', title: 'Our Location', lines: ['123 Education Avenue', 'Chennai, Tamil Nadu 600001'], color: 'bg-primary/15' },
                      { icon: 'ri-mail-line', title: 'Email Us', lines: ['berries@sowberry.com', 'support@sowberry.com'], color: 'bg-sage/15' },
                      { icon: 'ri-phone-line', title: 'Call Us', lines: ['+91 8825756388', '+91 9442556789'], color: 'bg-amber/15' },
                      { icon: 'ri-time-line', title: 'Office Hours', lines: ['Mon - Fri: 9:00 AM - 6:00 PM', 'Sat: 9:00 AM - 1:00 PM'], color: 'bg-blush/15' },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-3">
                        <div className={`w-9 h-9 rounded-lg ${item.color} flex items-center justify-center shrink-0`}>
                          <i className={`${item.icon} text-sm`}></i>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-white/90">{item.title}</h4>
                          {item.lines.map((line, j) => (
                            <p key={j} className="text-white/50 text-sm">{line}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/10">
                    <h4 className="text-sm font-medium text-white/70 mb-3">Connect With Us</h4>
                    <div className="flex gap-2">
                      {[
                        { icon: 'ri-facebook-fill', hover: 'hover:bg-blue-500/20' },
                        { icon: 'ri-twitter-x-fill', hover: 'hover:bg-white/15' },
                        { icon: 'ri-instagram-fill', hover: 'hover:bg-pink-500/20' },
                        { icon: 'ri-linkedin-fill', hover: 'hover:bg-blue-600/20' },
                        { icon: 'ri-youtube-fill', hover: 'hover:bg-red-500/20' },
                      ].map((s, i) => (
                        <a key={i} href="#" className={`w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center text-white/60 ${s.hover} hover:text-white transition-all`}>
                          <i className={`${s.icon} text-sm`}></i>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form — warm white */}
              <div className="lg:col-span-3 bg-white dark-theme:bg-gray-900 rounded-2xl p-8 border border-sand dark-theme:border-gray-800">
                <h3 className="text-xl font-bold text-gray-800 dark-theme:text-gray-100 mb-1">Send Us a Message</h3>
                <p className="text-sm text-gray-400 mb-6">We'll get back to you within 24 hours</p>
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
                    <button type="submit" className="group px-8 py-3 rounded-xl bg-primary text-white font-semibold shadow-sm hover:bg-primary-dark transition-all duration-200 flex items-center gap-2">
                      <i className="ri-send-plane-fill group-hover:translate-x-0.5 transition-transform"></i> Send Message
                    </button>
                    {formStatus && <span className="text-sm text-sage font-medium flex items-center gap-1"><i className="ri-check-line"></i> {formStatus}</span>}
                  </div>
                </form>

                <div className="mt-6 rounded-xl overflow-hidden h-44 border border-sand dark-theme:border-gray-700">
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248756.1167341455!2d80.06892704417326!3d13.047485589196454!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5265ea4f7d3361%3A0x6e61a70b6863d433!2sChennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1658404965471!5m2!1sen!2sin" className="w-full h-full border-0" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                </div>
              </div>
            </div>
          </div>
          {/* Bottom wave divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" fill="none" className="w-full h-auto">
              <path d="M0 60V15C300 40 600 50 900 30C1100 18 1300 8 1440 12V60H0Z" className="fill-gray-950"/>
            </svg>
          </div>
        </section>
      </main>

      {/* Footer — warm dark with palette accents */}
      <footer className="bg-gray-950 text-white ml-0 lg:ml-20 relative overflow-hidden">
        {/* Subtle warm gradient */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-sage/5 rounded-full blur-[80px]"></div>

        <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* About Column */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
                  <i className="ri-seedling-fill text-lg text-primary-light"></i>
                </div>
                <h2 className="text-lg font-bold">Sowberry <span className="text-primary-light">Academy</span></h2>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">Cultivating knowledge and growing your potential through innovative learning experiences.</p>
              
              {/* Mini stats with palette colors */}
              <div className="flex gap-5 mb-6">
                {[
                  { num: '15k+', label: 'Students', color: 'text-peach' },
                  { num: '25+', label: 'Courses', color: 'text-sage' },
                  { num: '95%', label: 'Success', color: 'text-amber' },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <span className={`block text-lg font-bold ${stat.color}`}>{stat.num}</span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">{stat.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                {[
                  { icon: 'ri-facebook-fill', hover: 'hover:bg-blue-500/15 hover:text-blue-400' },
                  { icon: 'ri-twitter-x-fill', hover: 'hover:bg-white/10 hover:text-white' },
                  { icon: 'ri-instagram-fill', hover: 'hover:bg-pink-500/15 hover:text-pink-400' },
                  { icon: 'ri-linkedin-fill', hover: 'hover:bg-blue-600/15 hover:text-blue-400' },
                  { icon: 'ri-youtube-fill', hover: 'hover:bg-red-500/15 hover:text-red-400' },
                ].map((s, i) => (
                  <a key={i} href="#" className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 transition-all ${s.hover}`}>
                    <i className={`${s.icon} text-sm`}></i>
                  </a>
                ))}
              </div>
            </div>

            {/* Links Column */}
            <div>
              <h3 className="text-sm font-semibold mb-5 uppercase tracking-wider text-gray-400">Explore</h3>
              <div className="space-y-0.5">
                {['Home', 'About Us', 'Contact Us', 'Blog'].map((link, i) => (
                  <a key={i} href="#" className="flex items-center gap-2 py-1.5 text-sm text-gray-500 hover:text-peach transition-colors group">
                    <i className="ri-arrow-right-s-line text-xs text-gray-600 group-hover:text-peach transition-colors"></i> {link}
                  </a>
                ))}
              </div>
            </div>

            {/* Courses Column */}
            <div>
              <h3 className="text-sm font-semibold mb-5 uppercase tracking-wider text-gray-400">Courses</h3>
              <div className="space-y-0.5">
                {['Web Development', 'Data Science', 'Digital Marketing', 'UI/UX Design', 'Mobile Development', 'Cybersecurity'].map((course, i) => (
                  <a key={i} href="#" className="flex items-center gap-2 py-1.5 text-sm text-gray-500 hover:text-sage transition-colors group">
                    <i className="ri-arrow-right-s-line text-xs text-gray-600 group-hover:text-sage transition-colors"></i> {course}
                  </a>
                ))}
              </div>
            </div>

            {/* Contact & Newsletter Column */}
            <div>
              <h3 className="text-sm font-semibold mb-5 uppercase tracking-wider text-gray-400">Get In Touch</h3>
              <ul className="space-y-3 text-sm text-gray-500 mb-6">
                <li className="flex gap-3"><i className="ri-map-pin-line text-primary-light mt-0.5"></i><span>123 Education Avenue<br />Chennai, TN 600001</span></li>
                <li className="flex gap-3"><i className="ri-mail-line text-primary-light"></i><span>berries@sowberry.com</span></li>
                <li className="flex gap-3"><i className="ri-phone-line text-primary-light"></i><span>+91 8825756388</span></li>
                <li className="flex gap-3"><i className="ri-time-line text-primary-light"></i><span>Mon - Fri: 9 AM - 6 PM</span></li>
              </ul>

              <h4 className="text-sm font-medium text-gray-400 mb-2">Newsletter</h4>
              <form onSubmit={handleNewsletterSubmit} className="flex">
                <input type="email" placeholder="Your Email" required className="flex-1 px-4 py-2.5 rounded-l-xl bg-white/5 border border-white/10 text-sm text-gray-300 outline-none focus:border-primary transition-colors placeholder:text-gray-600" />
                <button type="submit" className="px-4 py-2.5 rounded-r-xl bg-primary text-white hover:bg-primary-dark transition-colors">
                  <i className="ri-send-plane-fill text-sm"></i>
                </button>
              </form>

              <div className="mt-5">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Get Our App</h4>
                <div className="flex gap-2">
                  <a href="#" className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/8 rounded-lg text-xs text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
                    <i className="ri-google-play-fill text-base text-sage"></i> Google Play
                  </a>
                  <a href="#" className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/8 rounded-lg text-xs text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
                    <i className="ri-apple-fill text-base"></i> App Store
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Accreditations */}
        <div className="border-t border-white/5 py-4">
          <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-6">
            <h4 className="text-xs text-gray-500 font-medium uppercase tracking-wider">Accredited By</h4>
            {[
              { name: 'NAAC A++', color: 'text-peach' },
              { name: 'ISO 9001:2015', color: 'text-sage' },
              { name: 'UGC Approved', color: 'text-amber' },
              { name: 'AICTE Recognized', color: 'text-blush' },
            ].map((acc, i) => (
              <span key={i} className={`flex items-center gap-1 text-xs text-gray-600`}>
                <i className={`ri-award-fill ${acc.color}`}></i> {acc.name}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 py-4">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-600">&copy; {currentYear} Sowberry Academy. All Rights Reserved.</p>
            <div className="flex gap-4">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Sitemap'].map((link, i) => (
                <a key={i} href="#" className="text-xs text-gray-600 hover:text-primary-light transition-colors">{link}</a>
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
