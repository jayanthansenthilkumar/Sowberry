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
    <div className="flex h-screen overflow-hidden bg-cream dark-theme:bg-gray-950">
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-[260px] bg-gray-950 dark-theme:bg-gray-900 flex flex-col transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5">
          <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
            <i className="ri-seedling-fill text-primary-light text-lg"></i>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[15px] text-white leading-tight">Sowberry</span>
            <span className="text-[10px] font-medium tracking-wider text-gray-500 uppercase">{role === 'mentor' ? 'MENTOR' : 'STUDENT'}</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-0.5">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150
                ${location.pathname === item.path
                  ? 'bg-white/10 text-white'
                  : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                }`}
              onClick={() => setSidebarOpen(false)}
            >
              <i className={`${item.icon} text-base`}></i>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="px-3 py-4 border-t border-white/10">
          <Link to="/auth" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-gray-400 hover:bg-white/5 hover:text-gray-200 transition-all duration-150">
            <i className="ri-logout-box-line text-base"></i>
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Header */}
        <header className="h-14 bg-white dark-theme:bg-gray-900 border-b border-sand dark-theme:border-gray-800 flex items-center justify-between px-4 lg:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-gray-600 dark-theme:text-gray-400 hover:bg-cream-dark dark-theme:hover:bg-gray-800 transition-colors"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <i className="ri-menu-line text-lg"></i>
            </button>
            <h2 className="text-[15px] font-semibold text-gray-800 dark-theme:text-gray-200">{pageTitle}</h2>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 dark-theme:text-gray-400 hover:bg-cream-dark dark-theme:hover:bg-gray-800 hover:text-gray-700 dark-theme:hover:text-gray-200 transition-colors"
            >
              <i className={theme === 'dark-theme' ? 'ri-moon-line text-base' : 'ri-sun-line text-base'}></i>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-5 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
