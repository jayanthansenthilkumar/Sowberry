import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { adminApi } from '../../utils/api';

const PerformanceAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const res = await adminApi.getAnalytics();
      if (res.success) { const { success, message, ...data } = res; setAnalytics(data); }
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <AdminLayout pageTitle="Performance Analytics"><div className="flex items-center justify-center py-20"><i className="ri-loader-4-line animate-spin text-2xl text-primary"></i></div></AdminLayout>;

  return (
    <AdminLayout pageTitle="Performance Analytics">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 dark-theme:text-gray-100">Performance Analytics</h1>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Students', value: analytics?.totalStudents || 0, icon: 'ri-user-line', color: 'primary', change: '+12%' },
            { label: 'Total Mentors', value: analytics?.totalMentors || 0, icon: 'ri-team-line', color: 'blue-500', change: '+5%' },
            { label: 'Active Courses', value: analytics?.totalCourses || 0, icon: 'ri-book-open-line', color: 'green-500', change: '+8%' },
            { label: 'Completion Rate', value: `${analytics?.completionRate || 0}%`, icon: 'ri-medal-line', color: 'amber-500', change: '+3%' },
          ].map((m, i) => (
            <div key={i} className="bg-white dark-theme:bg-gray-900 rounded-2xl p-5 border border-sand dark-theme:border-gray-800">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-${m.color}/10 flex items-center justify-center`}><i className={`${m.icon} text-${m.color} text-lg`}></i></div>
                <span className="text-xs text-green-500 font-medium bg-green-50 dark-theme:bg-green-900/20 px-2 py-0.5 rounded-full">{m.change}</span>
              </div>
              <p className="text-xs text-gray-400 mb-1">{m.label}</p>
              <p className="text-2xl font-bold text-gray-800 dark-theme:text-gray-100">{m.value}</p>
            </div>
          ))}
        </div>

        {/* Course Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark-theme:bg-gray-900 rounded-2xl p-6 border border-sand dark-theme:border-gray-800">
            <h3 className="text-lg font-bold text-gray-800 dark-theme:text-gray-100 mb-4">Top Courses by Enrollment</h3>
            <div className="space-y-4">
              {(analytics?.courseCompletion || []).slice(0, 5).map((c, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="w-6 h-6 rounded-md bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 dark-theme:text-gray-200 truncate">{c.title}</p>
                    <div className="mt-1 h-1.5 bg-gray-100 dark-theme:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.min(100, (c.enrollmentCount / (analytics?.totalStudents || 1)) * 100)}%` }}></div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-600 dark-theme:text-gray-400">{c.enrollmentCount}</span>
                </div>
              ))}
              {(!analytics?.courseCompletion || analytics.courseCompletion.length === 0) && <p className="text-sm text-gray-400 text-center py-4">No course data available</p>}
            </div>
          </div>

          <div className="bg-white dark-theme:bg-gray-900 rounded-2xl p-6 border border-sand dark-theme:border-gray-800">
            <h3 className="text-lg font-bold text-gray-800 dark-theme:text-gray-100 mb-4">Monthly Trends</h3>
            <div className="space-y-4">
              {(analytics?.registrationTrends || []).map((t, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-cream/50 dark-theme:bg-gray-800/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><i className="ri-calendar-line text-primary text-sm"></i></div>
                    <span className="text-sm font-medium text-gray-700 dark-theme:text-gray-200">{t.month}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-800 dark-theme:text-gray-100">{t.enrollments} enrollments</p>
                    <p className="text-[11px] text-gray-400">{t.newStudents} new students</p>
                  </div>
                </div>
              ))}
              {(!analytics?.registrationTrends || analytics.registrationTrends.length === 0) && <p className="text-sm text-gray-400 text-center py-4">No trend data available</p>}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
export default PerformanceAnalytics;
