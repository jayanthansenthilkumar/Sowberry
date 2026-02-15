import AdminLayout from '../../components/AdminLayout';
import '../../styles/dashboard-common.css';

const PerformanceAnalytics = () => {
  return (
    <AdminLayout pageTitle="Performance Analytics">
      <div className="under-construction-page">
        <div className="under-construction-icon">
          <i className="ri-line-chart-line"></i>
        </div>
        <h1>Performance <span>Analytics</span></h1>
        <p>Detailed analytics dashboards showing platform-wide performance, trends, and actionable insights.</p>
      </div>
    </AdminLayout>
  );
};
export default PerformanceAnalytics;
