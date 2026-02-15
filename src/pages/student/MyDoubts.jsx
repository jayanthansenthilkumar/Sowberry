import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Swal from 'sweetalert2';
import { studentApi } from '../../utils/api';

const MyDoubts = () => {
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoubt, setSelectedDoubt] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [detailLoading, setDetailLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [courses, setCourses] = useState([]);

  const fetchDoubts = async () => {
    setLoading(true);
    const res = await studentApi.getDoubts();
    if (res.success) setDoubts(res.doubts || []);
    setLoading(false);
  };

  const fetchCourses = async () => {
    const res = await studentApi.getCourses();
    if (res.success) setCourses(res.courses || []);
  };

  useEffect(() => { fetchDoubts(); fetchCourses(); }, []);

  const openDetail = async (doubt) => {
    setDetailLoading(true);
    setSelectedDoubt(doubt);
    setReplies([]);
    setReplyText('');
    const res = await studentApi.getDoubt(doubt.id);
    if (res.success) {
      setSelectedDoubt(res.doubt);
      setReplies(res.replies || []);
    }
    setDetailLoading(false);
  };

  const handleCreate = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Ask a Doubt',
      html: `
        <select id="swal-course" class="swal2-select" style="width:100%;margin-bottom:8px">
          <option value="">Select Course (Optional)</option>
          ${courses.map(c => `<option value="${c.id}">${c.title}</option>`).join('')}
        </select>
        <input id="swal-title" class="swal2-input" placeholder="Doubt Title *" style="width:100%">
        <textarea id="swal-desc" class="swal2-textarea" placeholder="Describe your doubt in detail..." style="width:100%"></textarea>
        <select id="swal-priority" class="swal2-select" style="width:100%">
          <option value="low">Low Priority</option>
          <option value="medium" selected>Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Submit Doubt',
      confirmButtonColor: '#7c3aed',
      preConfirm: () => {
        const title = document.getElementById('swal-title').value;
        if (!title) { Swal.showValidationMessage('Doubt title is required'); return false; }
        return {
          courseId: document.getElementById('swal-course').value || null,
          title,
          description: document.getElementById('swal-desc').value,
          priority: document.getElementById('swal-priority').value
        };
      }
    });
    if (formValues) {
      const res = await studentApi.createDoubt(formValues);
      if (res.success) {
        Swal.fire({ icon: 'success', title: 'Doubt Posted!', text: 'A mentor will respond soon.', timer: 2000, showConfirmButton: false });
        fetchDoubts();
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: res.message });
      }
    }
  };

  const handleReply = async () => {
    if (!replyText.trim() || !selectedDoubt) return;
    const res = await studentApi.replyDoubt(selectedDoubt.id, { content: replyText });
    if (res.success) {
      setReplyText('');
      openDetail(selectedDoubt);
    }
  };

  const statusColor = (s) => ({
    open: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    resolved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    closed: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  })[s] || 'bg-gray-100 text-gray-800';

  const priorityColor = (p) => ({
    high: 'text-red-500',
    medium: 'text-amber-500',
    low: 'text-green-500'
  })[p] || 'text-gray-500';

  const filtered = filter === 'all' ? doubts : doubts.filter(d => d.status === filter);

  // ===================== DETAIL VIEW =====================
  if (selectedDoubt) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <button onClick={() => setSelectedDoubt(null)} className="flex items-center gap-2 text-purple-600 hover:text-purple-800 mb-4 font-medium">
            <i className="ri-arrow-left-line"></i> Back to My Doubts
          </button>
          {detailLoading ? (
            <div className="text-center py-16"><i className="ri-loader-4-line animate-spin text-3xl text-purple-500"></i></div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b dark:border-gray-700">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedDoubt.title}</h2>
                    {selectedDoubt.courseTitle && (
                      <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                        <i className="ri-book-open-line mr-1"></i>{selectedDoubt.courseTitle}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(selectedDoubt.status)}`}>
                      {selectedDoubt.status}
                    </span>
                    <span className={priorityColor(selectedDoubt.priority)}><i className="ri-flag-fill"></i></span>
                  </div>
                </div>
                {selectedDoubt.description && (
                  <p className="mt-3 text-gray-600 dark:text-gray-300">{selectedDoubt.description}</p>
                )}
                <div className="mt-3 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  {selectedDoubt.mentorName && (
                    <span><i className="ri-user-star-line mr-1"></i>Assigned: {selectedDoubt.mentorName}</span>
                  )}
                  <span><i className="ri-time-line mr-1"></i>{new Date(selectedDoubt.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Replies */}
              <div className="p-6 space-y-4 max-h-[28rem] overflow-y-auto">
                {replies.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    <i className="ri-chat-3-line text-3xl block mb-2"></i>
                    No replies yet. A mentor will respond soon.
                  </p>
                ) : replies.map(r => (
                  <div key={r.id} className={`flex ${r.authorRole === 'student' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-xl p-4 ${
                      r.authorRole === 'student'
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{r.authorName}</span>
                        <span className="text-xs opacity-60">
                          {r.authorRole === 'mentor' ? '(Mentor)' : r.authorRole === 'admin' ? '(Admin)' : '(You)'}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{r.content}</p>
                      <span className="text-xs opacity-50 mt-1 block">{new Date(r.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Input */}
              {selectedDoubt.status !== 'resolved' && selectedDoubt.status !== 'closed' && (
                <div className="p-4 border-t dark:border-gray-700 flex gap-3">
                  <input
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleReply()}
                    placeholder="Type a follow-up message..."
                    className="flex-1 px-4 py-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button onClick={handleReply} className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium">
                    <i className="ri-send-plane-fill mr-1"></i>Send
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </DashboardLayout>
    );
  }

  // ===================== LIST VIEW =====================
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Doubts</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Ask questions and get help from mentors</p>
          </div>
          <button onClick={handleCreate} className="px-5 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition shadow-lg hover:shadow-xl font-medium">
            <i className="ri-add-line mr-1"></i>Ask a Doubt
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <p className="text-2xl font-bold text-purple-600">{doubts.length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Doubts</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <p className="text-2xl font-bold text-amber-600">{doubts.filter(d => d.status === 'open').length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Awaiting Reply</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <p className="text-2xl font-bold text-blue-600">{doubts.filter(d => d.status === 'in-progress').length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">In Progress</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <p className="text-2xl font-bold text-green-600">{doubts.filter(d => d.status === 'resolved').length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Resolved</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['all', 'open', 'in-progress', 'resolved', 'closed'].map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
              filter === s
                ? 'bg-purple-600 text-white shadow'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border dark:border-gray-700'
            }`}>
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
              {' '}({s === 'all' ? doubts.length : doubts.filter(d => d.status === s).length})
            </button>
          ))}
        </div>

        {/* Doubt List */}
        {loading ? (
          <div className="text-center py-16">
            <i className="ri-loader-4-line animate-spin text-3xl text-purple-500"></i>
            <p className="mt-3 text-gray-500">Loading...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl">
            <i className="ri-question-answer-line text-5xl text-gray-300 dark:text-gray-600 mb-3 block"></i>
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400">No doubts yet</h3>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Click "Ask a Doubt" to post your first question</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(d => (
              <div
                key={d.id}
                onClick={() => openDetail(d)}
                className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md transition cursor-pointer border border-transparent hover:border-purple-200 dark:hover:border-purple-800 group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-purple-600 transition">{d.title}</h3>
                      <span className={priorityColor(d.priority)}><i className="ri-flag-fill text-sm"></i></span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
                      {d.courseTitle && <span><i className="ri-book-open-line mr-1"></i>{d.courseTitle}</span>}
                      {d.mentorName && <span><i className="ri-user-star-line mr-1"></i>{d.mentorName}</span>}
                      <span><i className="ri-chat-3-line mr-1"></i>{d.replyCount || 0} replies</span>
                      <span><i className="ri-time-line mr-1"></i>{new Date(d.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${statusColor(d.status)}`}>
                    {d.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyDoubts;
