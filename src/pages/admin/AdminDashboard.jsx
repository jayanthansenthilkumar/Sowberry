import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/admin.css';
import 'remixicon/fonts/remixicon.css';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeLearnersCount, setActiveLearnersCount] = useState(0);
  const mentorRating = 4.8;
  const completionRate = 78;
  
  // Initialize theme from localStorage
  const savedTheme = localStorage.getItem('theme');
  const [theme, setTheme] = useState(savedTheme || 'light');
  
  const notificationsRef = useRef(null);
  const profileRef = useRef(null);
  const studentsChartRef = useRef(null);
  const mentorChartRef = useRef(null);
  const completionChartRef = useRef(null);

  // Apply theme on mount
  useEffect(() => {
    if (theme === 'dark-theme') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [theme]);

  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initialize charts and counters
  useEffect(() => {
    // Sample data for charts
    const monthlyData = {
      students: [1847, 2100, 2320, 2500, 2700, 2847],
      completion: [65, 68, 72, 75, 77, 78],
      enrollments: [8500, 9600, 10400, 11200, 12000, 12583]
    };

    const labels = ['January', 'February', 'March', 'April', 'May', 'June'];

    // Common chart options
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'var(--card-bg)',
          titleColor: 'var(--text)',
          bodyColor: 'var(--text)',
          borderColor: 'var(--border-color)',
          borderWidth: 1,
          padding: 10,
          cornerRadius: 8
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(99, 102, 241, 0.1)'
          }
        },
        x: {
          grid: { display: false }
        }
      }
    };

    // Create chart function
    const createChart = (canvasRef, data, color) => {
      if (canvasRef && window.Chart) {
        const ctx = canvasRef.getContext('2d');
        return new window.Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              data: data,
              borderColor: color,
              backgroundColor: color + '20',
              tension: 0.4,
              fill: true
            }]
          },
          options: chartOptions
        });
      }
    };

    // Initialize charts
    let charts = [];
    if (studentsChartRef.current) {
      charts.push(createChart(studentsChartRef.current, monthlyData.students, '#6366f1'));
    }
    if (completionChartRef.current) {
      charts.push(createChart(completionChartRef.current, monthlyData.completion, '#8b5cf6'));
    }
    if (mentorChartRef.current) {
      charts.push(createChart(mentorChartRef.current, monthlyData.students, '#06b6d4'));
    }

    // Animate counter function
    const animateCounter = (setValue, targetValue, duration = 2000) => {
      const start = 0;
      const increment = targetValue / (duration / 16);
      let current = start;

      const animate = () => {
        current += increment;
        if (current >= targetValue) {
          setValue(targetValue);
        } else {
          setValue(Math.round(current));
          requestAnimationFrame(animate);
        }
      };

      animate();
    };

    // Animate the counters after a short delay
    setTimeout(() => {
      animateCounter(setActiveLearnersCount, 2847);
    }, 500);

    // Cleanup charts on unmount
    return () => {
      charts.forEach(chart => {
        if (chart) chart.destroy();
      });
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark-theme' : 'light';
    setTheme(newTheme);
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', newTheme);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    setProfileOpen(false);
  };

  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
    setNotificationsOpen(false);
  };

  return (
    <>
      {/* Sidebar Overlay for Mobile */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={toggleSidebar}
      ></div>

      {/* Mobile Menu Toggle */}
      <button className="mobile-menu-toggle" onClick={toggleSidebar}>
        <i className="ri-menu-line"></i>
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'active' : ''}`}>
        <div className="logo">
          <i className="ri-seedling-fill"></i>
          <div className="logo-text">
            <span className="brand-name">Sowberry</span>
            <span className="brand-suffix">ACADEMY</span>
          </div>
        </div>
        <nav>
          <Link to="/admin" className="active">
            <i className="ri-dashboard-line"></i>
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/students">
            <i className="ri-user-line"></i>
            <span>Students</span>
          </Link>
          <Link to="/admin/mentors">
            <i className="ri-team-line"></i>
            <span>Mentors</span>
          </Link>
          <Link to="/admin/courses">
            <i className="ri-book-open-line"></i>
            <span>Courses</span>
          </Link>
          <Link to="/admin/analytics">
            <i className="ri-line-chart-line"></i>
            <span>Analytics</span>
          </Link>
          <Link to="/admin/reports">
            <i className="ri-file-chart-line"></i>
            <span>Reports</span>
          </Link>
          <Link to="/admin/settings">
            <i className="ri-settings-line"></i>
            <span>Settings</span>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <main>
        <header>
          <div className="search-bar">
            <i className="ri-search-line"></i>
            <input type="text" placeholder="Search..." />
          </div>
          <div className="header-tools">
            <div className="theme-toggle" onClick={toggleTheme}>
              <i className={theme === 'dark-theme' ? 'ri-moon-line' : 'ri-sun-line'}></i>
            </div>
            <div 
              ref={notificationsRef}
              className={`notifications ${notificationsOpen ? 'active' : ''}`} 
              id="notifications"
            >
              <i className="ri-notification-3-line" onClick={toggleNotifications}></i>
              <span className="notification-badge">3</span>
              <div className="notifications-dropdown">
                <div className="notifications-header">
                  <h4>Notifications</h4>
                  <a href="#" className="mark-all-read">Mark all as read</a>
                </div>
                <div className="notification-list">
                  <a href="#" className="notification-item unread">
                    <i className="ri-message-2-line"></i>
                    <div className="notification-content">
                      <p>New comment on your post</p>
                      <span>2 minutes ago</span>
                    </div>
                  </a>
                  <a href="#" className="notification-item unread">
                    <i className="ri-user-follow-line"></i>
                    <div className="notification-content">
                      <p>New student enrolled in JavaScript course</p>
                      <span>1 hour ago</span>
                    </div>
                  </a>
                  <a href="#" className="notification-item">
                    <i className="ri-file-list-line"></i>
                    <div className="notification-content">
                      <p>Assignment deadline reminder</p>
                      <span>3 hours ago</span>
                    </div>
                  </a>
                </div>
                <a href="#" className="view-all">View all notifications</a>
              </div>
            </div>
            <div 
              ref={profileRef}
              className={`user-profile ${profileOpen ? 'active' : ''}`} 
              id="userProfile"
            >
              <img 
                src="https://ui-avatars.com/api/?name=Sowmiya&size=30" 
                alt="User" 
                className="user-avatar"
                onClick={toggleProfile}
              />
              <div className="user-info" onClick={toggleProfile}>
                <span className="user-name">Sowmiya</span>
                <span className="user-status">
                  <i className="ri-checkbox-blank-circle-fill"></i>
                  Active
                </span>
              </div>
              <div className="profile-dropdown">
                <a href="#"><i className="ri-user-line"></i> My Profile</a>
                <a href="#"><i className="ri-lock-password-line"></i> Change Password</a>
                <div className="dropdown-divider"></div>
                <a href="#" className="logout"><i className="ri-logout-box-line"></i> Logout</a>
              </div>
            </div>
          </div>
        </header>
        
        {/* Welcome Section */}
        <div className="welcome-section">
          <div className="welcome-card">
            <div className="welcome-content">
              <div className="welcome-text">
                <h1>Welcome, <span className="highlight">Sowmiya!</span></h1>
                <p>Monitor and manage your platform activities from the admin dashboard</p>
              </div>
              <div className="welcome-stats">
                <div className="stat-item floating">
                  <div className="stat-icon"><i className="ri-team-line"></i></div>
                  <div className="stat-info">
                    <h4>Total Mentors</h4>
                    <p>45</p>
                  </div>
                </div>
                <div className="stat-item floating delay-1">
                  <div className="stat-icon"><i className="ri-user-line"></i></div>
                  <div className="stat-info">
                    <h4>Total Students</h4>
                    <p>1,285</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="dashboard-grid">
          <div className="card animate">
            <div className="card-header">
              <h3>Student Enrollment Trends</h3>
              <i className="ri-line-chart-line"></i>
            </div>
            <h2 id="activeLearnersCount">{activeLearnersCount.toLocaleString()}</h2>
            <div className="chart-container">
              <canvas ref={studentsChartRef} id="studentsChart"></canvas>
            </div>
          </div>
          <div className="card animate">
            <div className="card-header">
              <h3>Mentor Performance</h3>
              <i className="ri-team-line"></i>
            </div>
            <h2 id="mentorRating">{mentorRating}</h2>
            <div className="chart-container">
              <canvas ref={mentorChartRef} id="mentorChart"></canvas>
            </div>
          </div>
          <div className="card animate">
            <div className="card-header">
              <h3>Course Completion Rate</h3>
              <i className="ri-medal-line"></i>
            </div>
            <h2 id="completionRate">{completionRate}%</h2>
            <div className="chart-container">
              <canvas ref={completionChartRef} id="completionChart"></canvas>
            </div>
          </div>
        </div>

        {/* Activity Section */}
        <div className="activity-section">
          <div className="card animate">
            <h3>Recent Activities</h3>
            <div className="activity-list">
              <div className="activity-item">
                <i className="ri-user-add-line"></i>
                <div className="activity-info">
                  <p>New Mentor Application: John Smith</p>
                  <span>30 minutes ago</span>
                </div>
              </div>
              <div className="activity-item">
                <i className="ri-flag-line"></i>
                <div className="activity-info">
                  <p>Student Report: Technical Issue</p>
                  <span>1 hour ago</span>
                </div>
              </div>
              <div className="activity-item">
                <i className="ri-user-star-line"></i>
                <div className="activity-info">
                  <p>Mentor Rating Update: Sarah Johnson</p>
                  <span>2 hours ago</span>
                </div>
              </div>
            </div>
          </div>
          <div className="card animate">
            <h3>System Alerts</h3>
            <div className="activity-list">
              <div className="activity-item alert-high">
                <i className="ri-error-warning-line"></i>
                <div className="activity-info">
                  <p>3 Pending Mentor Applications</p>
                  <span>Requires Review</span>
                </div>
              </div>
              <div className="activity-item alert-medium">
                <i className="ri-shield-check-line"></i>
                <div className="activity-info">
                  <p>5 New Student Verifications</p>
                  <span>Awaiting Approval</span>
                </div>
              </div>
              <div className="activity-item">
                <i className="ri-question-line"></i>
                <div className="activity-info">
                  <p>2 Support Tickets Pending</p>
                  <span>From Students</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminDashboard;
