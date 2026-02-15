import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/dashboard/variables.css';
import '../styles/dashboard/layout.css';
import '../styles/dashboard/components.css';
import 'remixicon/fonts/remixicon.css';

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
    <div className="admin-layout">
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      <button className="mobile-menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <i className="ri-menu-line"></i>
      </button>

      <div className={`admin-sidebar ${sidebarOpen ? 'active' : ''}`}>
        <div className="logo">
          <i className="ri-seedling-fill"></i>
          <div className="logo-text">
            <span className="brand-name">Sowberry</span>
            <span className="brand-suffix">ACADEMY</span>
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
      </div>

      <main className="admin-main">
        <header>
          <div className="search-bar">
            <i className="ri-search-line"></i>
            <input type="text" placeholder="Search..." />
          </div>
          <div className="header-tools">
            <div className="admin-theme-toggle" onClick={toggleTheme}>
              <i className={theme === 'dark-theme' ? 'ri-moon-line' : 'ri-sun-line'}></i>
            </div>
            
            <div 
              ref={notificationsRef}
              className={`notifications ${notificationsOpen ? 'active' : ''}`} 
              onClick={toggleNotifications}
            >
              <i className="ri-notification-3-line"></i>
              <span className="notification-badge">3</span>
              <div className="notifications-dropdown" onClick={(e) => e.stopPropagation()}>
                <div className="notifications-header">
                  <h4>Notifications</h4>
                  <a href="#" className="mark-all-read">Mark all as read</a>
                </div>
                <div className="notification-list">
                  <Link to="#" className="notification-item unread">
                    <i className="ri-message-2-line"></i>
                    <div className="notification-content">
                      <p>New comment on your post</p>
                      <span>2 minutes ago</span>
                    </div>
                  </Link>
                  <Link to="#" className="notification-item unread">
                    <i className="ri-user-follow-line"></i>
                    <div className="notification-content">
                      <p>New student enrolled</p>
                      <span>1 hour ago</span>
                    </div>
                  </Link>
                  <Link to="#" className="notification-item">
                    <i className="ri-file-list-line"></i>
                    <div className="notification-content">
                      <p>Assignment deadline</p>
                      <span>3 hours ago</span>
                    </div>
                  </Link>
                </div>
                <Link to="#" className="view-all">View all notifications</Link>
              </div>
            </div>

            <div
              ref={profileRef}
              className={`user-profile ${profileOpen ? 'active' : ''}`}
            >
              <img
                src="https://ui-avatars.com/api/?name=Admin&size=30"
                alt="User"
                className="user-avatar"
                onClick={() => setProfileOpen(!profileOpen)}
              />
              <div className="user-info" onClick={() => setProfileOpen(!profileOpen)}>
                <span className="user-name">Admin</span>
                <span className="user-status">
                  <i className="ri-checkbox-blank-circle-fill"></i>
                  Active
                </span>
              </div>
              <div className="profile-dropdown">
                <Link to="/admin"><i className="ri-dashboard-line"></i> Dashboard</Link>
                <Link to="/admin/settings"><i className="ri-settings-line"></i> Settings</Link>
                <div className="dropdown-divider"></div>
                <Link to="/auth" className="logout"><i className="ri-logout-box-line"></i> Logout</Link>
              </div>
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
