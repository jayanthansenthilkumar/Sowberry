import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Swal from 'sweetalert2';
import { mentorApi } from '../../utils/api';

const NewCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', category: '', difficulty: 'beginner', duration: '', maxStudents: 50, isPublished: false });

  const fetchCourses = async () => {
    setLoading(true);
    const res = await mentorApi.getCourses();
    if (res.success) setCourses(res.courses || []);
    setLoading(false);
  };

  useEffect(() => { fetchCourses(); }, []);

  const openCreate = () => { setEditCourse(null); setForm({ title: '', description: '', category: '', difficulty: 'beginner', duration: '', maxStudents: 50, isPublished: false }); setShowModal(true); };
  const openEdit = (c) => { setEditCourse(c); setForm({ title: c.title, description: c.description || '', category: c.category || '', difficulty: c.difficulty || 'beginner', duration: c.duration || '', maxStudents: c.maxStudents || 50, isPublished: !!c.isPublished }); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = editCourse ? await mentorApi.updateCourse(editCourse.id, form) : await mentorApi.createCourse(form);
    if (res.success) {
      Swal.fire({ icon: 'success', title: editCourse ? 'Updated!' : 'Created!', timer: 1500, showConfirmButton: false, background: '#fff', color: '#1f2937' });
      setShowModal(false); fetchCourses();
    } else {
      Swal.fire({ icon: 'error', title: 'Error', text: res.message, background: '#fff', color: '#1f2937' });
    }
  };

  const handleDelete = (id, title) => {
    Swal.fire({ title: 'Delete Course?', text: `Remove "${title}"?`, icon: 'warning', showCancelButton: true, confirmButtonColor: '#dc2626', confirmButtonText: 'Delete', background: '#fff', color: '#1f2937' })
      .then(async r => { if (r.isConfirmed) { const res = await mentorApi.deleteCourse(id); if (res.success) { Swal.fire({ icon: 'success', title: 'Deleted!', timer: 1500, showConfirmButton: false, background: '#fff', color: '#1f2937' }); fetchCourses(); } } });
  };

  return (
    <DashboardLayout pageTitle="Courses" role="mentor">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div><h1 className="text-2xl font-bold text-gray-800 dark-theme:text-white">My Courses</h1><p className="text-sm text-gray-500 mt-1">{courses.length} courses</p></div>
          <button onClick={openCreate} className="px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark flex items-center gap-2"><i className="ri-add-line"></i>New Course</button>
        </div>

        {loading ? <div className="flex justify-center py-20"><div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div></div> :
        courses.length === 0 ? <div className="text-center py-20 text-gray-400"><i className="ri-book-open-line text-4xl mb-3 block"></i><p>No courses yet. Create your first course!</p></div> :
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map(c => (
            <div key={c.id} className="bg-white dark-theme:bg-gray-900 rounded-2xl border border-sand dark-theme:border-gray-800 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-28 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center"><i className="ri-book-open-line text-4xl text-primary/40"></i></div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-800 dark-theme:text-white text-sm">{c.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${c.isPublished ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{c.isPublished ? 'Published' : 'Draft'}</span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2 mb-3">{c.description}</p>
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                  <span>{c.category || 'General'}</span><span>•</span><span>{c.difficulty}</span><span>•</span><span>{c.duration || 'N/A'}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(c)} className="flex-1 py-2 rounded-xl bg-blue-50 dark-theme:bg-blue-900/20 text-blue-600 text-xs font-medium hover:bg-blue-100"><i className="ri-edit-line mr-1"></i>Edit</button>
                  <button onClick={() => handleDelete(c.id, c.title)} className="flex-1 py-2 rounded-xl bg-red-50 dark-theme:bg-red-900/20 text-red-600 text-xs font-medium hover:bg-red-100"><i className="ri-delete-bin-line mr-1"></i>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
          <div className="bg-white dark-theme:bg-gray-900 rounded-2xl p-6 w-full max-w-lg mx-4 border border-sand dark-theme:border-gray-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-800 dark-theme:text-white">{editCourse ? 'Edit Course' : 'New Course'}</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 dark-theme:hover:bg-gray-800 flex items-center justify-center"><i className="ri-close-line text-lg text-gray-500"></i></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" placeholder="Course Title" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-cream dark-theme:bg-gray-800 border border-sand dark-theme:border-gray-700 focus:border-primary outline-none text-sm" />
              <textarea placeholder="Description" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-cream dark-theme:bg-gray-800 border border-sand dark-theme:border-gray-700 focus:border-primary outline-none text-sm resize-none" />
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-cream dark-theme:bg-gray-800 border border-sand dark-theme:border-gray-700 focus:border-primary outline-none text-sm" />
                <select value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-cream dark-theme:bg-gray-800 border border-sand dark-theme:border-gray-700 focus:border-primary outline-none text-sm">
                  <option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Duration (e.g. 6 weeks)" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-cream dark-theme:bg-gray-800 border border-sand dark-theme:border-gray-700 focus:border-primary outline-none text-sm" />
                <input type="number" placeholder="Max Students" value={form.maxStudents} onChange={e => setForm({ ...form, maxStudents: parseInt(e.target.value) || 50 })} className="w-full px-4 py-2.5 rounded-xl bg-cream dark-theme:bg-gray-800 border border-sand dark-theme:border-gray-700 focus:border-primary outline-none text-sm" />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600 dark-theme:text-gray-400 cursor-pointer">
                <input type="checkbox" checked={form.isPublished} onChange={e => setForm({ ...form, isPublished: e.target.checked })} className="rounded border-gray-300 text-primary focus:ring-primary" /> Publish immediately
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-sand dark-theme:border-gray-700 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark">{editCourse ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
export default NewCourses;
