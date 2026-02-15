import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';



const studentNav = [
  { path: '/student', icon: 'ri-dashboard-line', label: 'Dashboard' },
  { path: '/student/my-courses', icon: 'ri-book-open-line', label: 'My Courses' },
  { path: '/student/my-assignments', icon: 'ri-task-line', label: 'Assignments' },
  { path: '/student/my-grades', icon: 'ri-bar-chart-box-line', label: 'My Grades' },
  { path: '/student/my-progress', icon: 'ri-line-chart-line', label: 'My Progress' },
  { path: '/student/coding-practice', icon: 'ri-code-s-slash-line', label: 'Coding Practice' },
  { path: '/student/code-editor', icon: 'ri-terminal-box-line', label: 'Code Editor' },
  { path: '/student/aptitude-tests', icon: 'ri-question-answer-line', label: 'Aptitude Tests' },
  { path: '/student/study-material', icon: 'ri-file-text-line', label: 'Study Material' },
  { path: '/student/learning-games', icon: 'ri-gamepad-line', label: 'Learning Games' },
];

const mentorNav = [
  { path: '/mentor', icon: 'ri-dashboard-line', label: 'Dashboard' },
  { path: '/mentor/new-courses', icon: 'ri-book-open-line', label: 'Courses' },
  { path: '/mentor/new-assignments', icon: 'ri-task-line', label: 'Assignments' },
  { path: '/mentor/students-progress', icon: 'ri-line-chart-line', label: 'Student Progress' },
  { path: '/mentor/new-problem-solving', icon: 'ri-code-s-slash-line', label: 'Problem Solving' },
  { path: '/mentor/new-aptitude', icon: 'ri-question-answer-line', label: 'Aptitude' },
  { path: '/mentor/new-events', icon: 'ri-calendar-event-line', label: 'Events' },
  { path: '/mentor/discussion', icon: 'ri-discuss-line', label: 'Discussion' },
];

const DashboardLayout = ({ children, pageTitle, role = 'student' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const savedTheme = localStorage.getItem('theme');
  const [theme, setTheme] = useState(savedTheme || 'light');

  useEffect(() => {
    if (theme === 'dark-theme') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark-theme' : 'light';
    setTheme(newTheme);
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', newTheme);
  };

  const navItems = role === 'mentor' ? mentorNav : studentNav;

  return (
    <div className="dashboard-layout">
      <div
        className={`sidebar-overlay-dashboard ${sidebarOpen ? 'active' : ''}`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <i className="ri-seedling-fill"></i>
          <div className="logo-text">
            <span className="brand-name">Sowberry</span>
            <span className="brand-suffix">{role === 'mentor' ? 'MENTOR' : 'STUDENT'}</span>
          </div>
        </div>
        <nav>
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={location.pathname === item.path ? 'active' : ''}
              onClick={() => setSidebarOpen(false)}
            >
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <button
              className="mobile-sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <i className="ri-menu-line"></i>
            </button>
            <h2>{pageTitle}</h2>
          </div>
          <div className="dashboard-header-actions">
            <div className="dashboard-theme-toggle" onClick={toggleTheme}>
              <i className={theme === 'dark-theme' ? 'ri-moon-line' : 'ri-sun-line'}></i>
            </div>
            <Link to="/auth" title="Logout">
              <div className="dashboard-theme-toggle">
                <i className="ri-logout-box-line"></i>
              </div>
            </Link>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
