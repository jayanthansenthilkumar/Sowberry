import AdminLayout from '../../components/AdminLayout';


const PerformanceAnalytics = () => {
  return (
    <AdminLayout pageTitle="Performance Analytics">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
          <i className="ri-line-chart-line text-4xl text-primary"></i>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark-theme:text-white mb-3">Performance <span className="text-gradient">Analytics</span></h1>
        <p className="text-gray-500 dark-theme:text-gray-400 max-w-md">Detailed analytics dashboards showing platform-wide performance, trends, and actionable insights.</p>
      </div>
    </AdminLayout>
  );
};
export default PerformanceAnalytics;
