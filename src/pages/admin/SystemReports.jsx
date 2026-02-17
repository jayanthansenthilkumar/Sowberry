import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { adminApi } from '../../utils/api';
import { exportToPDF, exportToExcel } from '../../utils/exportData';

const SystemReports = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const res = await adminApi.getReports();
      if (res.success) { const { success, message, ...data } = res; setReports(data); }
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <AdminLayout pageTitle="System Reports"><div className="flex items-center justify-center py-20"><i className="ri-loader-4-line animate-spin text-2xl text-primary"></i></div></AdminLayout>;

  const getExportData = () => {
    const columns = ['User', 'Action', 'Description', 'Date'];
    const rows = (reports?.activityLogs || []).map(log => [
      log.fullName || log.userId || 'System',
      log.action,
      log.description,
      new Date(log.createdAt).toLocaleString(),
    ]);
    return { title: 'Activity Logs Report', columns, rows, fileName: 'Sowberry_Activity_Logs' };
  };

  return (
    <AdminLayout pageTitle="System Reports">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 dark-theme:text-gray-100">System Reports</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark-theme:bg-gray-900 rounded-2xl p-5 border border-sand dark-theme:border-gray-800">
            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><i className="ri-user-line text-primary text-lg"></i></div>
            <div><p className="text-xs text-gray-400">Total Users</p><p className="text-xl font-bold text-gray-800 dark-theme:text-gray-100">{reports?.totalUsers || 0}</p></div></div>
          </div>
          <div className="bg-white dark-theme:bg-gray-900 rounded-2xl p-5 border border-sand dark-theme:border-gray-800">
            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center"><i className="ri-check-double-line text-green-500 text-lg"></i></div>
            <div><p className="text-xs text-gray-400">Total Submissions</p><p className="text-xl font-bold text-gray-800 dark-theme:text-gray-100">{reports?.totalSubmissions || 0}</p></div></div>
          </div>
          <div className="bg-white dark-theme:bg-gray-900 rounded-2xl p-5 border border-sand dark-theme:border-gray-800">
            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><i className="ri-book-open-line text-blue-500 text-lg"></i></div>
            <div><p className="text-xs text-gray-400">Total Enrollments</p><p className="text-xl font-bold text-gray-800 dark-theme:text-gray-100">{reports?.totalEnrollments || 0}</p></div></div>
          </div>
          <div className="bg-white dark-theme:bg-gray-900 rounded-2xl p-5 border border-sand dark-theme:border-gray-800">
            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center"><i className="ri-mail-line text-amber-500 text-lg"></i></div>
            <div><p className="text-xs text-gray-400">Contact Messages</p><p className="text-xl font-bold text-gray-800 dark-theme:text-gray-100">{reports?.totalContactMessages || 0}</p></div></div>
          </div>
        </div>

        {/* Activity Logs */}
        <div className="bg-white dark-theme:bg-gray-900 rounded-2xl border border-sand dark-theme:border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-sand dark-theme:border-gray-800 flex items-center justify-between">
            <h3 className="font-bold text-gray-800 dark-theme:text-gray-100">Recent Activity Logs</h3>
            <div className="flex items-center gap-1 bg-cream/50 dark-theme:bg-gray-800/50 border border-sand dark-theme:border-gray-700 rounded-xl px-1">
              <button onClick={() => exportToPDF(getExportData())} className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 dark-theme:hover:bg-red-900/20 transition-colors flex items-center gap-1.5" title="Download PDF">
                <i className="ri-file-pdf-2-line text-sm"></i> PDF
              </button>
              <div className="w-px h-4 bg-sand dark-theme:bg-gray-700"></div>
              <button onClick={() => exportToExcel(getExportData())} className="px-3 py-1.5 rounded-lg text-xs font-medium text-green-600 hover:bg-green-50 dark-theme:hover:bg-green-900/20 transition-colors flex items-center gap-1.5" title="Download Excel">
                <i className="ri-file-excel-2-line text-sm"></i> Excel
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-cream/50 dark-theme:bg-gray-800/50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Description</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand dark-theme:divide-gray-800">
                {(reports?.activityLogs || []).map((log, i) => (
                  <tr key={i} className="hover:bg-cream/30 dark-theme:hover:bg-gray-800/30">
                    <td className="px-6 py-3 text-sm text-gray-700 dark-theme:text-gray-300">{log.fullName || log.userId || 'System'}</td>
                    <td className="px-6 py-3"><span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium">{log.action}</span></td>
                    <td className="px-6 py-3 text-sm text-gray-500 dark-theme:text-gray-400">{log.description}</td>
                    <td className="px-6 py-3 text-sm text-gray-400">{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
                {(!reports?.activityLogs || reports.activityLogs.length === 0) && (
                  <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-400">No activity logs yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
export default SystemReports;
