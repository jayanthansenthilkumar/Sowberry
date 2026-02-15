import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Swal from 'sweetalert2';
import { adminApi } from '../../utils/api';

const ManageMentors = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMentor, setEditMentor] = useState(null);
  const [form, setForm] = useState({ email: '', username: '', fullName: '', phone: '', password: '' });

  const fetchMentors = async () => {
    setLoading(true);
    const res = await adminApi.getMentors(search ? `search=${search}` : '');
    if (res.success) setMentors(res.mentors || []);
    setLoading(false);
  };

  useEffect(() => { fetchMentors(); }, []);

  const handleSearch = (e) => { e.preventDefault(); fetchMentors(); };

  const openCreate = () => {
    setEditMentor(null);
    setForm({ email: '', username: '', fullName: '', phone: '', password: '' });
    setShowModal(true);
  };

  const openEdit = (m) => {
    setEditMentor(m);
    setForm({ email: m.email, username: m.username, fullName: m.fullName, phone: m.phone || '', password: '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editMentor) {
      const body = { ...form };
      if (!body.password) delete body.password;
      const res = await adminApi.updateMentor(editMentor.id, body);
      if (res.success) {
        Swal.fire({ icon: 'success', title: 'Updated!', timer: 1500, showConfirmButton: false, background: '#fff', color: '#1f2937' });
        setShowModal(false); fetchMentors();
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: res.message, background: '#fff', color: '#1f2937' });
      }
    } else {
      const res = await adminApi.createMentor({ ...form, role: 'mentor' });
      if (res.success) {
        Swal.fire({ icon: 'success', title: 'Mentor Created!', timer: 1500, showConfirmButton: false, background: '#fff', color: '#1f2937' });
        setShowModal(false); fetchMentors();
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: res.message, background: '#fff', color: '#1f2937' });
      }
    }
  };

  const handleDelete = (id, name) => {
    Swal.fire({
      title: 'Delete Mentor?', text: `Remove ${name}? This cannot be undone.`, icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#dc2626', confirmButtonText: 'Delete',
      background: '#fff', color: '#1f2937'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await adminApi.deleteMentor(id);
        if (res.success) {
          Swal.fire({ icon: 'success', title: 'Deleted!', timer: 1500, showConfirmButton: false, background: '#fff', color: '#1f2937' });
          fetchMentors();
        }
      }
    });
  };

  const handleToggleStatus = async (m) => {
    const res = await adminApi.updateMentor(m.id, { isActive: !m.isActive });
    if (res.success) fetchMentors();
  };

  return (
    <AdminLayout pageTitle="Manage Mentors">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark-theme:text-white">Manage Mentors</h1>
            <p className="text-sm text-gray-500 dark-theme:text-gray-400 mt-1">{mentors.length} total mentors</p>
          </div>
          <div className="flex gap-3">
            <form onSubmit={handleSearch} className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input type="text" placeholder="Search mentors..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2.5 rounded-xl bg-white dark-theme:bg-gray-900 border border-sand dark-theme:border-gray-700 focus:border-primary outline-none text-sm w-64" />
            </form>
            <button onClick={openCreate} className="px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-2">
              <i className="ri-add-line"></i> Add Mentor
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-20"><div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div></div>
          ) : mentors.length === 0 ? (
            <div className="col-span-full text-center py-20 text-gray-400">
              <i className="ri-team-line text-4xl mb-3 block"></i>
              <p>No mentors found</p>
            </div>
          ) : mentors.map(m => (
            <div key={m.id} className="bg-white dark-theme:bg-gray-900 rounded-2xl border border-sand dark-theme:border-gray-800 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(m.fullName)}&size=44&background=c96442&color=fff`} className="w-11 h-11 rounded-xl" alt="" />
                  <div>
                    <h3 className="font-semibold text-gray-800 dark-theme:text-white text-sm">{m.fullName}</h3>
                    <p className="text-xs text-gray-400">@{m.username}</p>
                  </div>
                </div>
                <button onClick={() => handleToggleStatus(m)} className={`px-2.5 py-1 rounded-full text-xs font-medium ${m.isActive ? 'bg-green-100 text-green-700 dark-theme:bg-green-900/30 dark-theme:text-green-400' : 'bg-red-100 text-red-700 dark-theme:bg-red-900/30 dark-theme:text-red-400'}`}>
                  {m.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>
              <div className="space-y-2 mb-4">
                <p className="text-xs text-gray-500 dark-theme:text-gray-400 flex items-center gap-2"><i className="ri-mail-line"></i>{m.email}</p>
                <p className="text-xs text-gray-500 dark-theme:text-gray-400 flex items-center gap-2"><i className="ri-phone-line"></i>{m.phone || 'No phone'}</p>
                <p className="text-xs text-gray-500 dark-theme:text-gray-400 flex items-center gap-2"><i className="ri-calendar-line"></i>Joined {new Date(m.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(m)} className="flex-1 py-2 rounded-xl bg-blue-50 dark-theme:bg-blue-900/20 text-blue-600 dark-theme:text-blue-400 text-xs font-medium hover:bg-blue-100 transition-colors"><i className="ri-edit-line mr-1"></i>Edit</button>
                <button onClick={() => handleDelete(m.id, m.fullName)} className="flex-1 py-2 rounded-xl bg-red-50 dark-theme:bg-red-900/20 text-red-600 dark-theme:text-red-400 text-xs font-medium hover:bg-red-100 transition-colors"><i className="ri-delete-bin-line mr-1"></i>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
          <div className="bg-white dark-theme:bg-gray-900 rounded-2xl p-6 w-full max-w-md mx-4 border border-sand dark-theme:border-gray-800">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-800 dark-theme:text-white">{editMentor ? 'Edit Mentor' : 'Add Mentor'}</h3>
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
              <input type="password" placeholder={editMentor ? 'New Password (leave blank to keep)' : 'Password'} required={!editMentor} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-cream dark-theme:bg-gray-800 border border-sand dark-theme:border-gray-700 focus:border-primary outline-none text-sm" />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-sand dark-theme:border-gray-700 text-sm font-medium text-gray-600 dark-theme:text-gray-400 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark">{editMentor ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
export default ManageMentors;
