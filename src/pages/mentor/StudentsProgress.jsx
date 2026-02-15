import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import AdminLayout from '../../components/AdminLayout';
import { mentorApi } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const StudentsProgress = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const Layout = isAdmin ? AdminLayout : DashboardLayout;
  const layoutProps = isAdmin ? {} : { pageTitle: 'Student Progress', role: 'mentor' };
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const res = await mentorApi.getStudentsProgress();
      if (res.success) setStudents(res.students || []);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <Layout {...layoutProps}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 dark-theme:text-gray-100">Student Progress</h1>

        {loading ? <div className="flex justify-center py-20"><div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div></div> :
        students.length === 0 ? <div className="text-center py-20 text-gray-400"><i className="ri-line-chart-line text-4xl mb-3 block"></i><p>No student data available</p></div> :
        <div className="bg-white dark-theme:bg-gray-900 rounded-2xl border border-sand dark-theme:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-sand dark-theme:border-gray-800 bg-cream/50 dark-theme:bg-gray-800/50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Student</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Course</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Progress</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Enrolled</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand dark-theme:divide-gray-800">
                {students.map((s, i) => (
                  <tr key={i} className="hover:bg-cream/30 dark-theme:hover:bg-gray-800/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(s.studentName)}&size=32&background=c96442&color=fff`} className="w-8 h-8 rounded-lg" alt="" />
                        <span className="text-sm font-medium text-gray-700 dark-theme:text-gray-200">{s.studentName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark-theme:text-gray-400">{s.courseTitle}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-100 dark-theme:bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${s.completionPercentage || 0}%` }}></div>
                        </div>
                        <span className="text-xs font-medium text-gray-600 dark-theme:text-gray-400 w-10">{s.completionPercentage || 0}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">{new Date(s.enrolledAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>}
      </div>
    </Layout>
  );
};
export default StudentsProgress;
