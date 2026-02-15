import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Swal from 'sweetalert2';
import { adminApi } from '../../utils/api';

const CoursesOverview = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchCourses = async () => {
    setLoading(true);
    const res = await adminApi.getCourses();
    if (res.success) setCourses(res.courses || []);
    setLoading(false);
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleApprove = (id, title) => {
    Swal.fire({ title: 'Approve Course?', text: `Approve "${title}" and make it available to students?`, icon: 'question', showCancelButton: true, confirmButtonColor: '#16a34a', confirmButtonText: 'Approve' })
      .then(async r => {
        if (r.isConfirmed) {
          const res = await adminApi.approveCourse(id);
          if (res.success) { Swal.fire({ icon: 'success', title: 'Approved!', timer: 1500, showConfirmButton: false }); fetchCourses(); }
          else Swal.fire({ icon: 'error', title: 'Error', text: res.message });
        }
      });
  };

  const handleReject = async (id, title) => {
    const { value: reason } = await Swal.fire({
      title: 'Reject Course?', input: 'textarea', inputLabel: `Rejection reason for "${title}"`,
      inputPlaceholder: 'Enter the reason for rejection...', inputAttributes: { required: true },
      showCancelButton: true, confirmButtonColor: '#dc2626', confirmButtonText: 'Reject',
      inputValidator: (v) => { if (!v) return 'Please provide a reason'; }
    });
    if (reason) {
      const res = await adminApi.rejectCourse(id, reason);
      if (res.success) { Swal.fire({ icon: 'success', title: 'Rejected', timer: 1500, showConfirmButton: false }); fetchCourses(); }
    }
  };

  const handleDelete = (id, title) => {
    Swal.fire({ title: 'Delete Course?', text: `Permanently remove "${title}" and all its content?`, icon: 'warning', showCancelButton: true, confirmButtonColor: '#dc2626', confirmButtonText: 'Delete' })
      .then(async r => {
        if (r.isConfirmed) {
          const res = await adminApi.deleteCourse(id);
          if (res.success) { Swal.fire({ icon: 'success', title: 'Deleted!', timer: 1500, showConfirmButton: false }); fetchCourses(); }
        }
      });
  };

  const handleStatusChange = async (id, status) => {
    const res = await adminApi.updateCourseStatus(id, status);
    if (res.success) fetchCourses();
  };

  const statusColors = { draft: 'bg-gray-100 text-gray-600', pending: 'bg-amber-100 text-amber-700', active: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700', inactive: 'bg-gray-200 text-gray-500' };
  const statuses = ['all', 'pending', 'active', 'rejected', 'draft', 'inactive'];
  const filtered = statusFilter === 'all' ? courses : courses.filter(c => c.status === statusFilter);
  const pendingCount = courses.filter(c => c.status === 'pending').length;
  const activeCount = courses.filter(c => c.status === 'active').length;

  return (
    <AdminLayout pageTitle="Courses Overview">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark-theme:text-white">Courses Overview</h1>
          <p className="text-sm text-gray-500 dark-theme:text-gray-400 mt-1">{courses.length} total courses</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
          {[
            { label: 'Total', count: courses.length, icon: 'ri-book-open-line', color: 'primary' },
            { label: 'Pending', count: pendingCount, icon: 'ri-time-line', color: 'amber-500' },
            { label: 'Active', count: activeCount, icon: 'ri-check-double-line', color: 'green-500' },
            { label: 'Rejected', count: courses.filter(c => c.status === 'rejected').length, icon: 'ri-close-circle-line', color: 'red-500' },
            { label: 'Enrollments', count: courses.reduce((a, c) => a + (c.enrollmentCount || 0), 0), icon: 'ri-user-line', color: 'blue-500' }
          ].map(s => (
            <div key={s.label} className="bg-white dark-theme:bg-gray-900 rounded-2xl p-4 border border-sand dark-theme:border-gray-800">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-${s.color}/10 flex items-center justify-center`}><i className={`${s.icon} text-${s.color} text-lg`}></i></div>
                <div><p className="text-xs text-gray-400">{s.label}</p><p className="text-lg font-bold text-gray-800 dark-theme:text-white">{s.count}</p></div>
              </div>
            </div>
          ))}
        </div>

        {/* Pending Approval Alert */}
        {pendingCount > 0 && (
          <div className="bg-amber-50 dark-theme:bg-amber-900/20 border border-amber-200 dark-theme:border-amber-800 rounded-xl px-5 py-3 flex items-center gap-3">
            <i className="ri-alarm-warning-line text-amber-500 text-xl"></i>
            <p className="text-sm text-amber-700 dark-theme:text-amber-400 font-medium">{pendingCount} course{pendingCount > 1 ? 's' : ''} waiting for approval</p>
            <button onClick={() => setStatusFilter('pending')} className="ml-auto px-3 py-1 rounded-lg bg-amber-100 dark-theme:bg-amber-900/30 text-amber-700 text-xs font-medium hover:bg-amber-200">Review Now</button>
          </div>
        )}

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap bg-cream dark-theme:bg-gray-800 rounded-xl p-1 w-fit gap-0.5">
          {statuses.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors capitalize ${statusFilter === s ? 'bg-primary text-white' : 'text-gray-500 hover:text-gray-700'}`}>
              {s}{s !== 'all' ? ` (${courses.filter(c => c.status === s).length})` : ''}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400"><i className="ri-book-open-line text-4xl mb-3 block"></i><p>No {statusFilter !== 'all' ? statusFilter : ''} courses found</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(c => (
              <div key={c.id} className="bg-white dark-theme:bg-gray-900 rounded-2xl border border-sand dark-theme:border-gray-800 overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-28 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative">
                  <i className="ri-book-open-line text-4xl text-primary/40"></i>
                  <span className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColors[c.status] || statusColors.draft}`}>{c.status}</span>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-gray-800 dark-theme:text-white text-sm">{c.title}</h3>
                  </div>
                  {c.courseCode && <p className="text-[10px] text-gray-400 mb-1"><i className="ri-hashtag mr-0.5"></i>{c.courseCode}</p>}
                  <p className="text-xs text-gray-500 dark-theme:text-gray-400 line-clamp-2 mb-2">{c.description}</p>
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 mb-1 flex-wrap">
                    <span>{c.category || 'General'}</span><span>•</span><span>{c.difficulty || 'Beginner'}</span>
                    {c.courseType && <><span>•</span><span>{c.courseType}</span></>}
                    {c.semester && <><span>•</span><span>Sem {c.semester}</span></>}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-gray-400 mb-2">
                    <span><i className="ri-user-line mr-0.5"></i>{c.enrollmentCount || 0} enrolled</span>
                    <span><i className="ri-team-line mr-0.5"></i>{c.mentorName || 'Unassigned'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 mb-3">
                    <span><i className="ri-book-2-line mr-0.5"></i>{c.subjectCount || 0} units</span>
                    <span><i className="ri-file-text-line mr-0.5"></i>{c.contentCount || 0} content</span>
                  </div>

                  {/* Rejection reason */}
                  {c.status === 'rejected' && c.rejectionReason && (
                    <div className="bg-red-50 dark-theme:bg-red-900/20 rounded-lg p-2 mb-3 text-[10px] text-red-600"><i className="ri-information-line mr-0.5"></i>{c.rejectionReason}</div>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    {c.status === 'pending' && (
                      <>
                        <button onClick={() => handleApprove(c.id, c.title)} className="flex-1 py-2 rounded-xl bg-green-500 text-white text-xs font-medium hover:bg-green-600"><i className="ri-check-line mr-1"></i>Approve</button>
                        <button onClick={() => handleReject(c.id, c.title)} className="flex-1 py-2 rounded-xl bg-red-50 dark-theme:bg-red-900/20 text-red-600 text-xs font-medium hover:bg-red-100"><i className="ri-close-line mr-1"></i>Reject</button>
                      </>
                    )}
                    {c.status === 'active' && (
                      <button onClick={() => handleStatusChange(c.id, 'inactive')} className="flex-1 py-2 rounded-xl bg-gray-100 dark-theme:bg-gray-800 text-gray-600 text-xs font-medium hover:bg-gray-200"><i className="ri-pause-line mr-1"></i>Deactivate</button>
                    )}
                    {c.status === 'inactive' && (
                      <button onClick={() => handleStatusChange(c.id, 'active')} className="flex-1 py-2 rounded-xl bg-green-50 dark-theme:bg-green-900/20 text-green-600 text-xs font-medium hover:bg-green-100"><i className="ri-play-line mr-1"></i>Activate</button>
                    )}
                    {c.status === 'rejected' && (
                      <button onClick={() => handleApprove(c.id, c.title)} className="flex-1 py-2 rounded-xl bg-green-50 dark-theme:bg-green-900/20 text-green-600 text-xs font-medium hover:bg-green-100"><i className="ri-check-line mr-1"></i>Approve</button>
                    )}
                    <button onClick={() => handleDelete(c.id, c.title)} className="py-2 px-3 rounded-xl bg-red-50 dark-theme:bg-red-900/20 text-red-600 text-xs hover:bg-red-100"><i className="ri-delete-bin-line"></i></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
export default CoursesOverview;
