import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import Swal from 'sweetalert2';
import { studentApi } from '../../utils/api';

const MyCourses = () => {
  const navigate = useNavigate();
  const [enrolled, setEnrolled] = useState([]);
  const [browse, setBrowse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('enrolled');
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    setLoading(true);
    const [eRes, bRes] = await Promise.all([studentApi.getCourses(), studentApi.browseCourses()]);
    if (eRes.success) setEnrolled(eRes.courses || []);
    if (bRes.success) setBrowse(bRes.courses || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleEnroll = async (courseId) => {
    const res = await studentApi.enrollCourse(courseId);
    if (res.success) {
      Swal.fire({ icon: 'success', title: 'Enrolled!', text: 'You have been enrolled in the course.', timer: 1500, showConfirmButton: false });
      fetchData();
    } else Swal.fire({ icon: 'error', title: 'Error', text: res.message });
  };

  const handleUnenroll = (courseId, title) => {
    Swal.fire({ title: 'Unenroll?', text: `Are you sure you want to leave "${title}"? Your progress will be lost.`, icon: 'warning', showCancelButton: true, confirmButtonColor: '#dc2626', confirmButtonText: 'Unenroll' })
      .then(async r => {
        if (r.isConfirmed) {
          const res = await studentApi.unenrollCourse(courseId);
          if (res.success) { Swal.fire({ icon: 'success', title: 'Unenrolled', timer: 1500, showConfirmButton: false }); fetchData(); }
          else Swal.fire({ icon: 'error', title: 'Error', text: res.message });
        }
      });
  };

  const filteredBrowse = browse.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (c.title || '').toLowerCase().includes(q) || (c.courseCode || '').toLowerCase().includes(q) || (c.category || '').toLowerCase().includes(q);
  });

  return (
    <DashboardLayout pageTitle="My Courses" role="student">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-800 dark-theme:text-gray-100">My Courses</h1>
          <div className="flex bg-cream dark-theme:bg-gray-800 rounded-xl p-1">
            <button onClick={() => setTab('enrolled')} className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${tab === 'enrolled' ? 'bg-primary text-white' : 'text-gray-500 hover:text-gray-700'}`}>Enrolled ({enrolled.length})</button>
            <button onClick={() => setTab('browse')} className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${tab === 'browse' ? 'bg-primary text-white' : 'text-gray-500 hover:text-gray-700'}`}>Browse</button>
          </div>
        </div>

        {loading ? <div className="flex justify-center py-20"><div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div></div> :
        tab === 'enrolled' ? (
          enrolled.length === 0 ? <div className="text-center py-20 text-gray-400"><i className="ri-book-open-line text-4xl mb-3 block"></i><p>No enrolled courses. Browse and enroll!</p></div> :
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {enrolled.map(c => {
              const pct = c.completionPercentage || c.progress || 0;
              return (
                <div key={c.id || c.courseId} className="bg-white dark-theme:bg-gray-900 rounded-2xl border border-sand dark-theme:border-gray-800 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-2 bg-gradient-to-r from-primary to-primary-dark"></div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary">{c.category || 'General'}</span>
                      {c.courseCode && <span className="text-[10px] text-gray-400"><i className="ri-hashtag mr-0.5"></i>{c.courseCode}</span>}
                    </div>
                    <h3 className="font-semibold text-gray-800 dark-theme:text-gray-100 text-sm mb-1">{c.title}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-2">{c.description}</p>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 mb-3">
                      {c.mentorName && <span><i className="ri-user-line mr-0.5"></i>{c.mentorName}</span>}
                      <span><i className="ri-stack-line mr-0.5"></i>{c.contentCount || 0} content</span>
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-between text-[10px] text-gray-400 mb-1"><span>Progress</span><span className="font-medium">{pct}%</span></div>
                      <div className="w-full h-1.5 bg-gray-200 dark-theme:bg-gray-700 rounded-full"><div className={`h-1.5 rounded-full transition-all ${pct === 100 ? 'bg-green-500' : 'bg-primary'}`} style={{ width: `${pct}%` }}></div></div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => navigate(`/student/course-viewer/${c.courseId || c.id}`)} className="flex-1 py-2 rounded-xl bg-primary text-white text-xs font-medium hover:bg-primary-dark"><i className="ri-play-circle-line mr-1"></i>Continue Learning</button>
                      <button onClick={() => handleUnenroll(c.courseId || c.id, c.title)} className="py-2 px-3 rounded-xl bg-red-50 dark-theme:bg-red-900/20 text-red-500 text-xs hover:bg-red-100" title="Unenroll"><i className="ri-logout-box-r-line"></i></button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <>
            <div className="relative w-full max-w-sm">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              <input type="text" placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-cream dark-theme:bg-gray-800 border border-sand dark-theme:border-gray-700 text-sm outline-none focus:border-primary" />
            </div>
            {filteredBrowse.length === 0 ? <div className="text-center py-20 text-gray-400"><i className="ri-search-line text-4xl mb-3 block"></i><p>No courses available to browse</p></div> :
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredBrowse.map(c => (
                <div key={c.id} className="bg-white dark-theme:bg-gray-900 rounded-2xl border border-sand dark-theme:border-gray-800 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-2 bg-gradient-to-r from-green-400 to-green-600"></div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-500/15 text-green-400">{c.category || 'General'}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-700">{c.difficulty || 'Beginner'}</span>
                      {c.courseCode && <span className="text-[10px] text-gray-400"><i className="ri-hashtag mr-0.5"></i>{c.courseCode}</span>}
                    </div>
                    <h3 className="font-semibold text-gray-800 dark-theme:text-gray-100 text-sm mb-1">{c.title}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-2">{c.description}</p>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 mb-3 flex-wrap">
                      <span><i className="ri-user-line mr-0.5"></i>{c.mentorName || 'Instructor'}</span>
                      {c.courseType && <span>• {c.courseType}</span>}
                      <span>• <i className="ri-stack-line mr-0.5"></i>{c.contentCount || 0} content</span>
                      <span>• <i className="ri-book-2-line mr-0.5"></i>{c.subjectCount || 0} units</span>
                    </div>
                    {c.isEnrolled ? (
                      <button disabled className="w-full py-2 rounded-xl bg-gray-200 dark-theme:bg-gray-700 text-gray-500 dark-theme:text-gray-400 text-xs font-medium cursor-not-allowed"><i className="ri-check-line mr-1"></i>Already Enrolled</button>
                    ) : (
                      <button onClick={() => handleEnroll(c.id)} className="w-full py-2 rounded-xl bg-green-500 text-white text-xs font-medium hover:bg-green-600"><i className="ri-add-line mr-1"></i>Enroll Now</button>
                    )}
                  </div>
                </div>
              ))}
            </div>}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};
export default MyCourses;
