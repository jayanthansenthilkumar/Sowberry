import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Swal from 'sweetalert2';
import { mentorApi } from '../../utils/api';

const MentorDoubts = () => {
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoubt, setSelectedDoubt] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [detailLoading, setDetailLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  const fetchDoubts = async () => {
    setLoading(true);
    const res = await mentorApi.getDoubts();
    if (res.success) setDoubts(res.doubts || []);
    setLoading(false);
  };

  useEffect(() => { fetchDoubts(); }, []);

  const openDetail = async (doubt) => {
    setDetailLoading(true);
    setSelectedDoubt(doubt);
    setReplies([]);
    setReplyText('');
    const res = await mentorApi.getDoubt(doubt.id);
    if (res.success) {
      setSelectedDoubt(res.doubt);
      setReplies(res.replies || []);
    }
    setDetailLoading(false);
  };

  const handleReply = async () => {
    if (!replyText.trim() || !selectedDoubt) return;
    const wasUnassigned = !selectedDoubt.assignedMentorId;
    const res = await mentorApi.replyDoubt(selectedDoubt.id, { content: replyText });
    if (res.success) {
      setReplyText('');
      if (wasUnassigned) {
        Swal.fire({
          icon: 'success',
          title: 'You are now assigned!',
          text: 'This doubt has been assigned to you. You will see future updates.',
          timer: 2500,
          showConfirmButton: false
        });
      }
      openDetail(selectedDoubt);
      fetchDoubts();
    }
  };

  const handleResolve = async () => {
    const result = await Swal.fire({
      title: 'Resolve Doubt?',
      text: 'Mark this doubt as resolved?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#16a34a',
      confirmButtonText: 'Yes, Resolve'
    });
    if (result.isConfirmed) {
      const res = await mentorApi.resolveDoubt(selectedDoubt.id);
      if (res.success) {
        Swal.fire({ icon: 'success', title: 'Resolved!', timer: 1500, showConfirmButton: false });
        setSelectedDoubt(prev => ({ ...prev, status: 'resolved' }));
        fetchDoubts();
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: res.message || 'Could not resolve. You may not be assigned to this doubt.' });
      }
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
            <i className="ri-arrow-left-line"></i> Back to Doubts
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
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
                      <span><i className="ri-user-line mr-1"></i>{selectedDoubt.studentName}</span>
                      {selectedDoubt.studentEmail && <span className="text-gray-400">{selectedDoubt.studentEmail}</span>}
                      {selectedDoubt.courseTitle && <span><i className="ri-book-open-line mr-1"></i>{selectedDoubt.courseTitle}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(selectedDoubt.status)}`}>
                      {selectedDoubt.status}
                    </span>
                    <span className={priorityColor(selectedDoubt.priority)}><i className="ri-flag-fill"></i></span>
                  </div>
                </div>
                {selectedDoubt.description && (
                  <p className="mt-3 text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{selectedDoubt.description}</p>
                )}
                <div className="mt-3 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
                  {selectedDoubt.mentorName && (
                    <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded text-xs">
                      <i className="ri-user-star-line mr-1"></i>Assigned: {selectedDoubt.mentorName}
                    </span>
                  )}
                  {!selectedDoubt.assignedMentorId && (
                    <span className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded text-xs font-medium animate-pulse">
                      <i className="ri-alert-line mr-1"></i>Unassigned — reply to claim this doubt
                    </span>
                  )}
                  <span><i className="ri-time-line mr-1"></i>{new Date(selectedDoubt.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Conversation */}
              <div className="p-6 space-y-4 max-h-[28rem] overflow-y-auto">
                {replies.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    <i className="ri-chat-3-line text-3xl block mb-2"></i>
                    No replies yet. Be the first to respond!
                  </p>
                ) : replies.map(r => (
                  <div key={r.id} className={`flex ${r.authorRole === 'student' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[80%] rounded-xl p-4 ${
                      r.authorRole === 'student'
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                        : 'bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{r.authorName}</span>
                        <span className="text-xs opacity-60">({r.authorRole})</span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{r.content}</p>
                      <span className="text-xs opacity-50 mt-1 block">{new Date(r.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Bar */}
              {selectedDoubt.status !== 'resolved' && selectedDoubt.status !== 'closed' && (
                <div className="p-4 border-t dark:border-gray-700">
                  <div className="flex gap-3">
                    <input
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleReply()}
                      placeholder={selectedDoubt.assignedMentorId ? 'Type your reply...' : 'Reply to claim this doubt...'}
                      className="flex-1 px-4 py-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button onClick={handleReply} className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium">
                      <i className="ri-send-plane-fill mr-1"></i>Reply
                    </button>
                    {selectedDoubt.status === 'in-progress' && (
                      <button onClick={handleResolve} className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium">
                        <i className="ri-check-double-line mr-1"></i>Resolve
                      </button>
                    )}
                  </div>
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
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Doubts</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Answer student questions — first mentor to reply gets auto-assigned
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <p className="text-2xl font-bold text-amber-600">{doubts.filter(d => d.status === 'open').length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Open (Unassigned)</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <p className="text-2xl font-bold text-blue-600">{doubts.filter(d => d.status === 'in-progress').length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">In Progress</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <p className="text-2xl font-bold text-green-600">{doubts.filter(d => d.status === 'resolved').length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Resolved</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <p className="text-2xl font-bold text-purple-600">{doubts.length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Visible</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['all', 'open', 'in-progress', 'resolved'].map(s => (
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
            <p className="mt-3 text-gray-500">Loading doubts...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl">
            <i className="ri-question-answer-line text-5xl text-gray-300 dark:text-gray-600 mb-3 block"></i>
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400">No doubts found</h3>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Student doubts will appear here when posted</p>
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
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-purple-600 transition">{d.title}</h3>
                      <span className={priorityColor(d.priority)}><i className="ri-flag-fill text-sm"></i></span>
                      {!d.assignedMentorId && (
                        <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs px-2 py-0.5 rounded-full font-medium">
                          Unassigned
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
                      <span><i className="ri-user-line mr-1"></i>{d.studentName}</span>
                      {d.courseTitle && <span><i className="ri-book-open-line mr-1"></i>{d.courseTitle}</span>}
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

export default MentorDoubts;
