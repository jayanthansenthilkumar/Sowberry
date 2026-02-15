import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Swal from 'sweetalert2';
import { studentApi } from '../../utils/api';

const MyCourses = () => {
  const [enrolled, setEnrolled] = useState([]);
  const [browse, setBrowse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('enrolled');
  const [materials, setMaterials] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

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
      Swal.fire({ icon: 'success', title: 'Enrolled!', text: 'You have been enrolled in the course.', timer: 1500, showConfirmButton: false, background: '#fff', color: '#1f2937' });
      fetchData();
    } else Swal.fire({ icon: 'error', title: 'Error', text: res.message, background: '#fff', color: '#1f2937' });
  };

  const viewMaterials = async (course) => {
    setSelectedCourse(course);
    const res = await studentApi.getCourseMaterials(course.id || course.courseId);
    setMaterials(res.success ? res.materials || [] : []);
  };

  return (
    <DashboardLayout pageTitle="My Courses" role="student">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-800 dark-theme:text-white">My Courses</h1>
          <div className="flex bg-cream dark-theme:bg-gray-800 rounded-xl p-1">
            <button onClick={() => { setTab('enrolled'); setMaterials(null); }} className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${tab === 'enrolled' ? 'bg-primary text-white' : 'text-gray-500 hover:text-gray-700'}`}>Enrolled</button>
            <button onClick={() => { setTab('browse'); setMaterials(null); }} className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${tab === 'browse' ? 'bg-primary text-white' : 'text-gray-500 hover:text-gray-700'}`}>Browse</button>
          </div>
        </div>

        {materials && selectedCourse ? (
          <div className="bg-white dark-theme:bg-gray-900 rounded-2xl p-6 border border-sand dark-theme:border-gray-800">
            <button onClick={() => setMaterials(null)} className="text-sm text-primary hover:underline mb-4 flex items-center gap-1"><i className="ri-arrow-left-line"></i>Back</button>
            <h2 className="text-lg font-bold text-gray-800 dark-theme:text-white mb-4">{selectedCourse.title} - Materials</h2>
            {materials.length === 0 ? <p className="text-sm text-gray-400 text-center py-8">No materials available yet</p> :
            <div className="space-y-3">
              {materials.map((m, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-cream dark-theme:bg-gray-800 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><i className="ri-file-text-line text-primary"></i></div>
                  <div className="flex-1"><p className="text-sm font-medium text-gray-800 dark-theme:text-white">{m.title}</p><p className="text-[11px] text-gray-400">{m.type || 'Document'}</p></div>
                </div>
              ))}
            </div>}
          </div>
        ) : loading ? <div className="flex justify-center py-20"><div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div></div> :
        tab === 'enrolled' ? (
          enrolled.length === 0 ? <div className="text-center py-20 text-gray-400"><i className="ri-book-open-line text-4xl mb-3 block"></i><p>No enrolled courses. Browse and enroll!</p></div> :
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {enrolled.map(c => (
              <div key={c.id || c.courseId} className="bg-white dark-theme:bg-gray-900 rounded-2xl border border-sand dark-theme:border-gray-800 overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-2 bg-gradient-to-r from-primary to-primary-dark"></div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary">{c.category || 'General'}</span></div>
                  <h3 className="font-semibold text-gray-800 dark-theme:text-white text-sm mb-1">{c.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">{c.description}</p>
                  <div className="mb-3"><div className="flex justify-between text-[10px] text-gray-400 mb-1"><span>Progress</span><span>{c.progress || 0}%</span></div>
                    <div className="w-full h-1.5 bg-gray-200 dark-theme:bg-gray-700 rounded-full"><div className="h-1.5 bg-primary rounded-full transition-all" style={{ width: `${c.progress || 0}%` }}></div></div>
                  </div>
                  <button onClick={() => viewMaterials(c)} className="w-full py-2 rounded-xl bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20"><i className="ri-book-read-line mr-1"></i>View Materials</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          browse.length === 0 ? <div className="text-center py-20 text-gray-400"><i className="ri-search-line text-4xl mb-3 block"></i><p>No courses available to browse</p></div> :
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {browse.map(c => (
              <div key={c.id} className="bg-white dark-theme:bg-gray-900 rounded-2xl border border-sand dark-theme:border-gray-800 overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-2 bg-gradient-to-r from-green-400 to-green-600"></div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700">{c.category || 'General'}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-700">{c.difficulty || 'Beginner'}</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 dark-theme:text-white text-sm mb-1">{c.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-2">{c.description}</p>
                  <p className="text-[11px] text-gray-400 mb-3"><i className="ri-user-line mr-1"></i>{c.mentorName || 'Instructor'}</p>
                  <button onClick={() => handleEnroll(c.id)} className="w-full py-2 rounded-xl bg-green-500 text-white text-xs font-medium hover:bg-green-600"><i className="ri-add-line mr-1"></i>Enroll Now</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
export default MyCourses;
