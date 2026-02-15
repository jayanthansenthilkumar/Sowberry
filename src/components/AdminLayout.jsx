import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminLayout = ({ children, pageTitle }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();

  const savedTheme = localStorage.getItem('theme');
  const [theme, setTheme] = useState(savedTheme || 'light');
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);

  useEffect(() => {
    if (theme === 'dark-theme') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark-theme' : 'light';
    setTheme(newTheme);
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', newTheme);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    setProfileOpen(false);
  };

  const navItems = [
    { path: '/admin', icon: 'ri-dashboard-line', label: 'Dashboard' },
    { path: '/admin/manage-students', icon: 'ri-user-line', label: 'Students' },
    { path: '/admin/manage-mentors', icon: 'ri-team-line', label: 'Mentors' },
    { path: '/admin/courses-overview', icon: 'ri-book-open-line', label: 'Courses' },
    { path: '/admin/performance-analytics', icon: 'ri-line-chart-line', label: 'Analytics' },
    { path: '/admin/system-reports', icon: 'ri-file-chart-line', label: 'Reports' },
    { path: '/admin/settings', icon: 'ri-settings-line', label: 'Settings' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark-theme:bg-gray-950">
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Menu Toggle */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden w-10 h-10 rounded-xl bg-white dark-theme:bg-gray-800 shadow-lg flex items-center justify-center text-gray-600 dark-theme:text-gray-300"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <i className="ri-menu-line text-xl"></i>
      </button>

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark-theme:bg-gray-900 border-r border-gray-200 dark-theme:border-gray-800 flex flex-col transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200 dark-theme:border-gray-800">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/20">
            <i className="ri-seedling-fill text-white text-xl"></i>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-gray-800 dark-theme:text-white leading-tight">Sowberry</span>
            <span className="text-[10px] font-semibold tracking-widest text-primary uppercase">ACADEMY</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${location.pathname === item.path
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'text-gray-600 dark-theme:text-gray-400 hover:bg-gray-100 dark-theme:hover:bg-gray-800 hover:text-gray-900 dark-theme:hover:text-white'
                }`}
              onClick={() => setSidebarOpen(false)}
            >
              <i className={`${item.icon} text-lg`}></i>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white dark-theme:bg-gray-900 border-b border-gray-200 dark-theme:border-gray-800 flex items-center justify-between px-4 lg:px-6 shrink-0">
          {/* Search */}
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative w-full hidden sm:block">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-100 dark-theme:bg-gray-800 border border-transparent focus:border-primary focus:bg-white dark-theme:focus:bg-gray-700 outline-none text-sm text-gray-700 dark-theme:text-gray-200 transition-all"
              />
            </div>
          </div>

          {/* Header Tools */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-600 dark-theme:text-gray-300 hover:bg-gray-100 dark-theme:hover:bg-gray-800 transition-colors"
            >
              <i className={theme === 'dark-theme' ? 'ri-moon-line text-lg' : 'ri-sun-line text-lg'}></i>
            </button>

            {/* Notifications */}
            <div ref={notificationsRef} className="relative">
              <button
                onClick={toggleNotifications}
                className="relative w-10 h-10 rounded-xl flex items-center justify-center text-gray-600 dark-theme:text-gray-300 hover:bg-gray-100 dark-theme:hover:bg-gray-800 transition-colors"
              >
                <i className="ri-notification-3-line text-lg"></i>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 top-12 w-80 bg-white dark-theme:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark-theme:border-gray-700 overflow-hidden z-50">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark-theme:border-gray-800">
                    <h4 className="font-semibold text-gray-800 dark-theme:text-white text-sm">Notifications</h4>
                    <button className="text-xs text-primary hover:underline">Mark all as read</button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {[
                      { icon: 'ri-message-2-line', text: 'New comment on your post', time: '2 minutes ago', unread: true },
                      { icon: 'ri-user-follow-line', text: 'New student enrolled', time: '1 hour ago', unread: true },
                      { icon: 'ri-file-list-line', text: 'Assignment deadline', time: '3 hours ago', unread: false },
                    ].map((n, i) => (
                      <div key={i} className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark-theme:hover:bg-gray-800 transition-colors cursor-pointer ${n.unread ? 'bg-primary/5' : ''}`}>
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <i className={`${n.icon} text-primary text-sm`}></i>
                        </div>
                        <div>
                          <p className="text-sm text-gray-700 dark-theme:text-gray-200">{n.text}</p>
                          <span className="text-xs text-gray-400">{n.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 dark-theme:border-gray-800 p-2">
                    <button className="w-full text-center text-sm text-primary hover:bg-primary/5 rounded-lg py-2 transition-colors">View all notifications</button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => { setProfileOpen(!profileOpen); setNotificationsOpen(false); }}
                className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-100 dark-theme:hover:bg-gray-800 transition-colors"
              >
                <img
                  src="https://ui-avatars.com/api/?name=Admin&size=30&background=6c5ce7&color=fff"
                  alt="User"
                  className="w-8 h-8 rounded-lg"
                />
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-sm font-medium text-gray-700 dark-theme:text-gray-200">Admin</span>
                  <span className="text-[10px] text-green-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span>
                    Active
                  </span>
                </div>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 w-48 bg-white dark-theme:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark-theme:border-gray-700 overflow-hidden z-50 py-1">
                  <Link to="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark-theme:text-gray-200 hover:bg-gray-50 dark-theme:hover:bg-gray-800 transition-colors">
                    <i className="ri-dashboard-line"></i> Dashboard
                  </Link>
                  <Link to="/admin/settings" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark-theme:text-gray-200 hover:bg-gray-50 dark-theme:hover:bg-gray-800 transition-colors">
                    <i className="ri-settings-line"></i> Settings
                  </Link>
                  <div className="border-t border-gray-100 dark-theme:border-gray-800 my-1"></div>
                  <Link to="/auth" className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark-theme:hover:bg-red-900/20 transition-colors">
                    <i className="ri-logout-box-line"></i> Logout
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
