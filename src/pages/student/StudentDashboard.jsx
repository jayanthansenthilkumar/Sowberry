import DashboardLayout from '../../components/DashboardLayout';

const StudentDashboard = () => {
  return (
    <DashboardLayout pageTitle="Dashboard" role="student">
      <div className="under-construction-page">
        <div className="under-construction-icon">
          <i className="ri-dashboard-line"></i>
        </div>
        <h1>Student <span>Dashboard</span></h1>
        <p>Your personalized dashboard with course progress, upcoming assignments, and performance insights is coming soon.</p>
      </div>
    </DashboardLayout>
  );
};
export default StudentDashboard;
