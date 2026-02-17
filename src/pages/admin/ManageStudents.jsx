import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Swal from 'sweetalert2';
import { adminApi } from '../../utils/api';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [form, setForm] = useState({ email: '', username: '', fullName: '', phone: '', password: '' });

  const fetchStudents = async () => {
    setLoading(true);
    const res = await adminApi.getStudents(search ? `search=${search}` : '');
    if (res.success) setStudents(res.students || []);
    setLoading(false);
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStudents();
  };

  const openCreate = () => {
    setEditStudent(null);
    setForm({ email: '', username: '', fullName: '', phone: '', password: '' });
    setShowModal(true);
  };

  const openEdit = (s) => {
    setEditStudent(s);
    setForm({ email: s.email, username: s.username, fullName: s.fullName, phone: s.phone || '', password: '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editStudent) {
      const body = { ...form };
      if (!body.password) delete body.password;
      const res = await adminApi.updateStudent(editStudent.id, body);
      if (res.success) {
        Swal.fire({ icon: 'success', title: 'Updated!', timer: 1500, showConfirmButton: false, background: '#fff', color: '#1f2937' });
        setShowModal(false);
        fetchStudents();
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: res.message, background: '#fff', color: '#1f2937' });
      }
    } else {
      const res = await adminApi.createStudent({ ...form, role: 'student' });
      if (res.success) {
        Swal.fire({ icon: 'success', title: 'Student Created!', timer: 1500, showConfirmButton: false, background: '#fff', color: '#1f2937' });
        setShowModal(false);
        fetchStudents();
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: res.message, background: '#fff', color: '#1f2937' });
      }
    }
  };

  const handleDelete = (id, name) => {
    Swal.fire({
      title: 'Delete Student?', text: `Remove ${name}? This cannot be undone.`, icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#dc2626', confirmButtonText: 'Delete',
      background: '#fff', color: '#1f2937'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await adminApi.deleteStudent(id);
        if (res.success) {
          Swal.fire({ icon: 'success', title: 'Deleted!', timer: 1500, showConfirmButton: false, background: '#fff', color: '#1f2937' });
          fetchStudents();
        }
      }
    });
  };

  const handleToggleStatus = async (s) => {
    const res = await adminApi.updateStudent(s.id, { isActive: !s.isActive });
    if (res.success) fetchStudents();
  };

  return (
    <AdminLayout pageTitle="Manage Students">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark-theme:text-gray-100">Manage Students</h1>
            <p className="text-sm text-gray-500 dark-theme:text-gray-400 mt-1">{students.length} total students</p>
          </div>
          <div className="flex gap-3">
            <form onSubmit={handleSearch} className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input type="text" placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2.5 rounded-xl bg-white dark-theme:bg-gray-900 border border-sand dark-theme:border-gray-700 focus:border-primary outline-none text-sm w-64" />
            </form>
            <button onClick={openCreate} className="px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-2">
              <i className="ri-add-line"></i> Add Student
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark-theme:bg-gray-900 rounded-2xl border border-sand dark-theme:border-gray-800 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20"><i className="ri-loader-4-line animate-spin text-2xl text-primary"></i></div>
          ) : students.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <i className="ri-user-line text-4xl mb-3 block"></i>
              <p>No students found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-sand dark-theme:border-gray-800 bg-cream/50 dark-theme:bg-gray-800/50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand dark-theme:divide-gray-800">
                  {students.map(s => (
                    <tr key={s.id} className="hover:bg-cream/30 dark-theme:hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(s.fullName)}&size=36&background=c96442&color=fff`} className="w-9 h-9 rounded-lg" alt="" />
                          <div>
                            <p className="text-sm font-medium text-gray-800 dark-theme:text-gray-200">{s.fullName}</p>
                            <p className="text-xs text-gray-400">@{s.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark-theme:text-gray-400">{s.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark-theme:text-gray-400">{s.phone || '—'}</td>
                      <td className="px-6 py-4">
                        <button onClick={() => handleToggleStatus(s)} className={`px-2.5 py-1 rounded-full text-xs font-medium ${s.isActive ? 'bg-green-100 text-green-700 dark-theme:bg-green-900/30 dark-theme:text-green-400' : 'bg-red-100 text-red-700 dark-theme:bg-red-900/30 dark-theme:text-red-400'}`}>
                          {s.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(s.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEdit(s)} className="w-8 h-8 rounded-lg bg-blue-50 dark-theme:bg-blue-900/20 text-blue-500 flex items-center justify-center hover:bg-blue-100 transition-colors"><i className="ri-edit-line text-sm"></i></button>
                          <button onClick={() => handleDelete(s.id, s.fullName)} className="w-8 h-8 rounded-lg bg-red-50 dark-theme:bg-red-900/20 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"><i className="ri-delete-bin-line text-sm"></i></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
          <div className="bg-white dark-theme:bg-gray-900 rounded-2xl p-6 w-full max-w-md mx-4 border border-sand dark-theme:border-gray-800">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-800 dark-theme:text-gray-100">{editStudent ? 'Edit Student' : 'Add Student'}</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 dark-theme:hover:bg-gray-800 flex items-center justify-center"><i className="ri-close-line text-lg text-gray-500"></i></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="email" placeholder="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-cream dark-theme:bg-gray-800 border border-sand dark-theme:border-gray-700 focus:border-primary outline-none text-sm" />
              <input type="text" placeholder="Username" required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-cream dark-theme:bg-gray-800 border border-sand dark-theme:border-gray-700 focus:border-primary outline-none text-sm" />
              <input type="text" placeholder="Full Name" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-cream dark-theme:bg-gray-800 border border-sand dark-theme:border-gray-700 focus:border-primary outline-none text-sm" />
              <input type="tel" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-cream dark-theme:bg-gray-800 border border-sand dark-theme:border-gray-700 focus:border-primary outline-none text-sm" />
              <input type="password" placeholder={editStudent ? 'New Password (leave blank to keep)' : 'Password'} required={!editStudent} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-cream dark-theme:bg-gray-800 border border-sand dark-theme:border-gray-700 focus:border-primary outline-none text-sm" />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-sand dark-theme:border-gray-700 text-sm font-medium text-gray-600 dark-theme:text-gray-400 hover:bg-gray-50 dark-theme:hover:bg-gray-800">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark">{editStudent ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
export default ManageStudents;
