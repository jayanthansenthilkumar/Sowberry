import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '../../components/AdminLayout';
import '../../styles/admin/dashboard.css';

const AdminDashboard = () => {
  const [activeLearnersCount, setActiveLearnersCount] = useState(0);
  const mentorRating = 4.8;
  const completionRate = 78;
  
  const studentsChartRef = useRef(null);
  const mentorChartRef = useRef(null);
  const completionChartRef = useRef(null);

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

  return (
    <AdminLayout>
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
    </AdminLayout>
  );
};

export default AdminDashboard;
