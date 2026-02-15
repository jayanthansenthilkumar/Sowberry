import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import Swal from 'sweetalert2';
import { studentApi } from '../../utils/api';

const swalOpts = { background: '#0f0f0f', color: '#e8e8e8', confirmButtonColor: '#d4a574' };

const CAT_COLORS = {
  'Web Development': 'from-blue-500 to-indigo-500',
  'Data Structures': 'from-violet-500 to-purple-500',
  'Python': 'from-green-500 to-emerald-500',
  'Machine Learning': 'from-orange-500 to-red-500',
  'Database': 'from-amber-500 to-yellow-500',
  'Programming': 'from-cyan-500 to-blue-500',
  'Software Engineering': 'from-teal-500 to-cyan-500',
  'General': 'from-gray-500 to-gray-600',
};

const MyCourses = () => {
  const navigate = useNavigate();
  const [enrolled, setEnrolled] = useState([]);
  const [browse, setBrowse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('enrolled');
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');

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
      Swal.fire({ ...swalOpts, icon: 'success', title: 'Enrolled!', text: 'You have been enrolled in the course.', timer: 1500, showConfirmButton: false });
      fetchData();
    } else Swal.fire({ ...swalOpts, icon: 'error', title: 'Error', text: res.message });
  };

  const handleUnenroll = (courseId, title) => {
    Swal.fire({ ...swalOpts, title: 'Unenroll?', text: `Leave "${title}"? Your progress will be lost.`, icon: 'warning', showCancelButton: true, confirmButtonColor: '#dc2626', cancelButtonColor: '#333', confirmButtonText: 'Unenroll' })
      .then(async r => {
        if (r.isConfirmed) {
          const res = await studentApi.unenrollCourse(courseId);
          if (res.success) { Swal.fire({ ...swalOpts, icon: 'success', title: 'Unenrolled', timer: 1500, showConfirmButton: false }); fetchData(); }
          else Swal.fire({ ...swalOpts, icon: 'error', title: 'Error', text: res.message });
        }
      });
  };

  const categories = ['All', ...new Set(browse.map(c => c.category || 'General').filter(Boolean))];
  const filteredBrowse = browse.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !search || (c.title || '').toLowerCase().includes(q) || (c.courseCode || '').toLowerCase().includes(q) || (c.category || '').toLowerCase().includes(q);
    const matchCat = catFilter === 'All' || (c.category || 'General') === catFilter;
    return matchSearch && matchCat;
  });

  const getGradient = (cat) => CAT_COLORS[cat] || CAT_COLORS.General;

  return (
    <DashboardLayout pageTitle="My Courses" role="student">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#e8e8e8]">My Courses</h1>
            <p className="text-sm text-[#666] mt-1">{enrolled.length} enrolled, {browse.length} available</p>
          </div>
          <div className="flex bg-[#222] rounded-xl p-1 border border-[#333]">
            <button onClick={() => setTab('enrolled')} className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${tab === 'enrolled' ? 'bg-[#d4a574] text-[#1a1a1a]' : 'text-[#888] hover:text-[#e8e8e8]'}`}>Enrolled ({enrolled.length})</button>
            <button onClick={() => setTab('browse')} className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${tab === 'browse' ? 'bg-[#d4a574] text-[#1a1a1a]' : 'text-[#888] hover:text-[#e8e8e8]'}`}>Browse</button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Enrolled', value: enrolled.length, icon: 'ri-book-open-line', color: 'text-[#d4a574]' },
            { label: 'In Progress', value: enrolled.filter(c => (c.completionPercentage || 0) > 0 && (c.completionPercentage || 0) < 100).length, icon: 'ri-loader-4-line', color: 'text-blue-400' },
            { label: 'Completed', value: enrolled.filter(c => (c.completionPercentage || 0) === 100).length, icon: 'ri-check-double-line', color: 'text-green-400' },
            { label: 'Available', value: browse.length, icon: 'ri-compass-3-line', color: 'text-violet-400' },
          ].map((s, i) => (
            <div key={i} className="bg-[#1a1a1a] rounded-2xl p-4 border border-[#2a2a2a] flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-[#222] flex items-center justify-center ${s.color}`}><i className={`${s.icon} text-lg`}></i></div>
              <div><p className="text-lg font-bold text-[#e8e8e8]">{s.value}</p><p className="text-[10px] text-[#666]">{s.label}</p></div>
            </div>
          ))}
        </div>

        {loading ? <div className="flex justify-center py-20"><div className="w-8 h-8 border-3 border-[#d4a574] border-t-transparent rounded-full animate-spin"></div></div> :
        tab === 'enrolled' ? (
          enrolled.length === 0 ? <div className="text-center py-20 text-[#555]"><i className="ri-book-open-line text-4xl mb-3 block"></i><p>No enrolled courses. Browse and enroll!</p></div> :
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrolled.map(c => {
              const pct = c.completionPercentage || c.progress || 0;
              const cat = c.category || 'General';
              return (
                <div key={c.id || c.courseId} className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] overflow-hidden hover:border-[#d4a574]/30 hover:shadow-lg hover:shadow-[#d4a574]/5 transition-all group">
                  <div className={`h-1.5 bg-gradient-to-r ${getGradient(cat)}`}></div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#d4a574]/10 text-[#d4a574]">{cat}</span>
                      {c.courseCode && <span className="text-[10px] text-[#555]"><i className="ri-hashtag mr-0.5"></i>{c.courseCode}</span>}
                    </div>
                    <h3 className="font-bold text-[#e8e8e8] text-sm mb-1 group-hover:text-[#d4a574] transition-colors">{c.title}</h3>
                    <p className="text-[11px] text-[#666] line-clamp-2 mb-2">{c.description}</p>
                    <div className="flex items-center gap-2 text-[10px] text-[#555] mb-3">
                      {c.mentorName && <span><i className="ri-user-line mr-0.5"></i>{c.mentorName}</span>}
                      <span><i className="ri-stack-line mr-0.5"></i>{c.contentCount || 0} content</span>
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-between text-[10px] mb-1"><span className="text-[#666]">Progress</span><span className={pct === 100 ? 'text-green-400 font-medium' : 'text-[#d4a574]'}>{pct}%</span></div>
                      <div className="w-full h-1.5 bg-[#222] rounded-full"><div className={`h-1.5 rounded-full transition-all ${pct === 100 ? 'bg-green-500' : 'bg-[#d4a574]'}`} style={{ width: `${pct}%` }}></div></div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => navigate(`/student/course-viewer/${c.courseId || c.id}`)} className="flex-1 py-2.5 rounded-xl bg-[#d4a574] text-[#1a1a1a] text-xs font-semibold hover:bg-[#c4956a] transition-colors"><i className="ri-play-circle-line mr-1"></i>Continue</button>
                      <button onClick={() => handleUnenroll(c.courseId || c.id, c.title)} className="py-2.5 px-3 rounded-xl bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 transition-colors" title="Unenroll"><i className="ri-logout-box-r-line"></i></button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative w-full sm:w-64">
                <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-[#555] text-sm"></i>
                <input type="text" placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#222] border border-[#333] text-sm text-[#e8e8e8] placeholder-[#555] outline-none focus:border-[#d4a574]" />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map(c => (
                  <button key={c} onClick={() => setCatFilter(c)} className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${catFilter === c ? 'bg-[#d4a574] text-[#1a1a1a]' : 'bg-[#222] text-[#888] border border-[#333] hover:border-[#555]'}`}>{c}</button>
                ))}
              </div>
            </div>
            {filteredBrowse.length === 0 ? <div className="text-center py-20 text-[#555]"><i className="ri-search-line text-4xl mb-3 block"></i><p>{search || catFilter !== 'All' ? 'No matching courses' : 'No courses available'}</p></div> :
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBrowse.map(c => {
                const cat = c.category || 'General';
                return (
                  <div key={c.id} className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] overflow-hidden hover:border-[#d4a574]/30 hover:shadow-lg hover:shadow-[#d4a574]/5 transition-all group">
                    <div className={`h-1.5 bg-gradient-to-r ${getGradient(cat)}`}></div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-500/10 text-green-400">{cat}</span>
                        {c.difficulty && <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${c.difficulty === 'Beginner' ? 'bg-green-500/10 text-green-400' : c.difficulty === 'Intermediate' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'}`}>{c.difficulty}</span>}
                        {c.courseCode && <span className="text-[10px] text-[#555]"><i className="ri-hashtag mr-0.5"></i>{c.courseCode}</span>}
                      </div>
                      <h3 className="font-bold text-[#e8e8e8] text-sm mb-1 group-hover:text-[#d4a574] transition-colors">{c.title}</h3>
                      <p className="text-[11px] text-[#666] line-clamp-2 mb-2">{c.description}</p>
                      <div className="flex items-center gap-2 text-[10px] text-[#555] mb-4 flex-wrap">
                        <span><i className="ri-user-line mr-0.5"></i>{c.mentorName || 'Instructor'}</span>
                        {c.courseType && <span>• {c.courseType}</span>}
                        <span>• <i className="ri-stack-line mr-0.5"></i>{c.contentCount || 0} items</span>
                        <span>• <i className="ri-book-2-line mr-0.5"></i>{c.subjectCount || 0} units</span>
                      </div>
                      {c.isEnrolled ? (
                        <button disabled className="w-full py-2.5 rounded-xl bg-[#222] text-[#555] text-xs font-medium cursor-not-allowed border border-[#333]"><i className="ri-check-line mr-1"></i>Already Enrolled</button>
                      ) : (
                        <button onClick={() => handleEnroll(c.id)} className="w-full py-2.5 rounded-xl bg-green-500 text-white text-xs font-semibold hover:bg-green-600 transition-colors"><i className="ri-add-line mr-1"></i>Enroll Now</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};
export default MyCourses;
