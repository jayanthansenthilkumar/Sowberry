import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Swal from 'sweetalert2';
import { studentApi } from '../../utils/api';

const MyAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(null);

  const fetchAssignments = async () => {
    setLoading(true);
    const res = await studentApi.getAssignments();
    if (res.success) setAssignments(res.assignments || []);
    setLoading(false);
  };

  useEffect(() => { fetchAssignments(); }, []);

  const handleSubmit = async (assignment) => {
    const { value: content } = await Swal.fire({
      title: `Submit: ${assignment.title}`,
      input: 'textarea',
      inputPlaceholder: 'Paste your answer or solution here...',
      showCancelButton: true,
      confirmButtonText: 'Submit',
      confirmButtonColor: '#6366f1',
      background: '#fff',
      color: '#1f2937',
      inputValidator: v => !v && 'Please enter your submission'
    });
    if (content) {
      setSubmitting(assignment.id);
      const res = await studentApi.submitAssignment(assignment.id, { content });
      setSubmitting(null);
      if (res.success) {
        Swal.fire({ icon: 'success', title: 'Submitted!', timer: 1500, showConfirmButton: false, background: '#fff', color: '#1f2937' });
        fetchAssignments();
      } else Swal.fire({ icon: 'error', title: 'Error', text: res.message, background: '#fff', color: '#1f2937' });
    }
  };

  const getStatusStyle = (status) => {
    const styles = { pending: 'bg-amber-500/15 text-amber-400', submitted: 'bg-blue-500/15 text-blue-400', graded: 'bg-green-500/15 text-green-400', late: 'bg-red-500/15 text-red-400' };
    return styles[status] || styles.pending;
  };

  return (
    <DashboardLayout pageTitle="My Assignments" role="student">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 dark-theme:text-gray-100">My Assignments</h1>

        {loading ? <div className="flex justify-center py-20"><div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div></div> :
        assignments.length === 0 ? <div className="text-center py-20 text-gray-400"><i className="ri-task-line text-4xl mb-3 block"></i><p>No assignments yet</p></div> :
        <div className="space-y-4">
          {assignments.map(a => (
            <div key={a.id} className="bg-white dark-theme:bg-gray-900 rounded-2xl p-5 border border-sand dark-theme:border-gray-800 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0"><i className="ri-task-line text-primary"></i></div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark-theme:text-gray-100 text-sm">{a.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{a.courseName || 'Course'}</p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-400">
                      <span><i className="ri-calendar-line mr-1"></i>Due: {a.dueDate ? new Date(a.dueDate).toLocaleDateString() : 'No deadline'}</span>
                      <span><i className="ri-medal-line mr-1"></i>{a.maxScore || 100} pts</span>
                      {a.grade != null && <span className="text-green-600 font-medium"><i className="ri-check-line mr-1"></i>Grade: {a.grade}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium ${getStatusStyle(a.status)}`}>{a.status || 'pending'}</span>
                  {(!a.status || a.status === 'pending') && (
                    <button onClick={() => handleSubmit(a)} disabled={submitting === a.id}
                      className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-medium hover:bg-primary-dark disabled:opacity-50">
                      {submitting === a.id ? 'Submitting...' : 'Submit'}
                    </button>
                  )}
                </div>
              </div>
              {a.feedback && <div className="mt-3 p-3 bg-green-50 dark-theme:bg-green-900/20 rounded-xl text-xs text-green-700 dark-theme:text-green-400"><i className="ri-chat-1-line mr-1"></i>Feedback: {a.feedback}</div>}
            </div>
          ))}
        </div>}
      </div>
    </DashboardLayout>
  );
};
export default MyAssignments;
