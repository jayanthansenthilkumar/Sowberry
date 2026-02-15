import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { adminApi } from '../../utils/api';

const CoursesOverview = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await adminApi.getCourses();
      if (res.success) setCourses(res.courses || []);
      setLoading(false);
    };
    fetchCourses();
  }, []);

  return (
    <AdminLayout pageTitle="Courses Overview">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark-theme:text-white">Courses Overview</h1>
          <p className="text-sm text-gray-500 dark-theme:text-gray-400 mt-1">{courses.length} total courses</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark-theme:bg-gray-900 rounded-2xl p-5 border border-sand dark-theme:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><i className="ri-book-open-line text-primary text-lg"></i></div>
              <div><p className="text-xs text-gray-400">Total Courses</p><p className="text-xl font-bold text-gray-800 dark-theme:text-white">{courses.length}</p></div>
            </div>
          </div>
          <div className="bg-white dark-theme:bg-gray-900 rounded-2xl p-5 border border-sand dark-theme:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center"><i className="ri-check-line text-green-500 text-lg"></i></div>
              <div><p className="text-xs text-gray-400">Published</p><p className="text-xl font-bold text-gray-800 dark-theme:text-white">{courses.filter(c => c.isPublished).length}</p></div>
            </div>
          </div>
          <div className="bg-white dark-theme:bg-gray-900 rounded-2xl p-5 border border-sand dark-theme:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><i className="ri-user-line text-blue-500 text-lg"></i></div>
              <div><p className="text-xs text-gray-400">Total Enrollments</p><p className="text-xl font-bold text-gray-800 dark-theme:text-white">{courses.reduce((a, c) => a + (c.enrollmentCount || 0), 0)}</p></div>
            </div>
          </div>
          <div className="bg-white dark-theme:bg-gray-900 rounded-2xl p-5 border border-sand dark-theme:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center"><i className="ri-draft-line text-amber-500 text-lg"></i></div>
              <div><p className="text-xs text-gray-400">Drafts</p><p className="text-xl font-bold text-gray-800 dark-theme:text-white">{courses.filter(c => !c.isPublished).length}</p></div>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div></div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <i className="ri-book-open-line text-4xl mb-3 block"></i>
            <p>No courses found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map(c => (
              <div key={c.id} className="bg-white dark-theme:bg-gray-900 rounded-2xl border border-sand dark-theme:border-gray-800 overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <i className="ri-book-open-line text-4xl text-primary/40"></i>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-800 dark-theme:text-white text-sm">{c.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${c.isPublished ? 'bg-green-100 text-green-700 dark-theme:bg-green-900/30 dark-theme:text-green-400' : 'bg-amber-100 text-amber-700 dark-theme:bg-amber-900/30 dark-theme:text-amber-400'}`}>
                      {c.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark-theme:text-gray-400 line-clamp-2 mb-3">{c.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1"><i className="ri-user-line"></i>{c.enrollmentCount || 0} enrolled</span>
                    <span className="flex items-center gap-1"><i className="ri-team-line"></i>{c.mentorName || 'Unassigned'}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="px-2 py-0.5 rounded-md bg-gray-100 dark-theme:bg-gray-800 text-[10px] text-gray-500">{c.category || 'General'}</span>
                    <span className="px-2 py-0.5 rounded-md bg-gray-100 dark-theme:bg-gray-800 text-[10px] text-gray-500">{c.difficulty || 'Beginner'}</span>
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
