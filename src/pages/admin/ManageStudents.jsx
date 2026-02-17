import { useState, useEffect, useRef } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Swal, { getSwalOpts } from '../../utils/swal';
import { adminApi } from '../../utils/api';
import { exportToPDF, exportToExcel } from '../../utils/exportData';

const ALL_COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'fullName', label: 'Name' },
  { key: 'username', label: 'Username' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'college', label: 'College' },
  { key: 'department', label: 'Department' },
  { key: 'year', label: 'Year' },
  { key: 'rollNumber', label: 'Roll Number' },
  { key: 'gender', label: 'Gender' },
  { key: 'dateOfBirth', label: 'Date of Birth' },
  { key: 'enrolledCourses', label: 'Enrolled Courses' },
  { key: 'isVerified', label: 'Verified' },
  { key: 'isActive', label: 'Status' },
  { key: 'createdAt', label: 'Joined' },
  { key: 'actions', label: 'Actions' },
];

const DEFAULT_VISIBLE = ['id', 'fullName', 'email', 'phone', 'college', 'department', 'rollNumber', 'isActive', 'createdAt', 'actions'];

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [form, setForm] = useState({ email: '', username: '', fullName: '', phone: '', password: '' });
  const [visibleCols, setVisibleCols] = useState(() => {
    try {
      const saved = localStorage.getItem('sowberry_students_cols');
      return saved ? JSON.parse(saved) : DEFAULT_VISIBLE;
    } catch { return DEFAULT_VISIBLE; }
  });
  const [showColMenu, setShowColMenu] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const limit = 20;
  const colMenuRef = useRef(null);

  // Close column menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (colMenuRef.current && !colMenuRef.current.contains(e.target)) setShowColMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Save column visibility to localStorage
  useEffect(() => {
    localStorage.setItem('sowberry_students_cols', JSON.stringify(visibleCols));
  }, [visibleCols]);

  const fetchStudents = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (statusFilter) params.set('status', statusFilter);
    params.set('page', page);
    params.set('limit', limit);
    const res = await adminApi.getStudents(params.toString());
    if (res.success) {
      setStudents(res.students || []);
      setTotal(res.total || 0);
    }
    setLoading(false);
  };

  useEffect(() => { fetchStudents(); }, [page, statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchStudents();
  };

  const toggleCol = (key) => {
    setVisibleCols(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  const restoreVisibility = () => setVisibleCols([...DEFAULT_VISIBLE]);

  const isColVisible = (key) => visibleCols.includes(key);

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
        Swal.fire({ ...getSwalOpts(), icon: 'success', title: 'Updated!', timer: 1500, showConfirmButton: false });
        setShowModal(false);
        fetchStudents();
      } else {
        Swal.fire({ ...getSwalOpts(), icon: 'error', title: 'Error', text: res.message });
      }
    } else {
      const res = await adminApi.createStudent({ ...form, role: 'student' });
      if (res.success) {
        Swal.fire({ ...getSwalOpts(), icon: 'success', title: 'Student Created!', timer: 1500, showConfirmButton: false });
        setShowModal(false);
        fetchStudents();
      } else {
        Swal.fire({ ...getSwalOpts(), icon: 'error', title: 'Error', text: res.message });
      }
    }
  };

  const handleDelete = (id, name) => {
    Swal.fire({
      ...getSwalOpts(), title: 'Delete Student?', text: `Remove ${name}? This cannot be undone.`, icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#dc2626', confirmButtonText: 'Delete'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await adminApi.deleteStudent(id);
        if (res.success) {
          Swal.fire({ ...getSwalOpts(), icon: 'success', title: 'Deleted!', timer: 1500, showConfirmButton: false });
          fetchStudents();
        }
      }
    });
  };

  const handleToggleStatus = async (s) => {
    const res = await adminApi.updateStudent(s.id, { isActive: !s.isActive });
    if (res.success) fetchStudents();
  };

  const getCellText = (s, key) => {
    switch (key) {
      case 'id': return s.id;
      case 'fullName': return s.fullName;
      case 'username': return s.username;
      case 'email': return s.email;
      case 'phone': return s.phone || '—';
      case 'college': return s.college || '—';
      case 'department': return s.department || '—';
      case 'year': return s.year || '—';
      case 'rollNumber': return s.rollNumber || '—';
      case 'gender': return s.gender || '—';
      case 'dateOfBirth': return s.dateOfBirth ? new Date(s.dateOfBirth).toLocaleDateString() : '—';
      case 'enrolledCourses': return s.enrolledCourses || 0;
      case 'isVerified': return s.isVerified ? 'Yes' : 'No';
      case 'isActive': return s.isActive ? 'Active' : 'Inactive';
      case 'createdAt': return new Date(s.createdAt).toLocaleDateString();
      default: return '';
    }
  };

  const getExportData = () => {
    const exportCols = ALL_COLUMNS.filter(c => c.key !== 'actions' && isColVisible(c.key));
    const columns = exportCols.map(c => c.label);
    const rows = students.map(s => exportCols.map(c => getCellText(s, c.key)));
    return { title: 'Students Report', columns, rows, fileName: 'Sowberry_Students' };
  };

  const copyTableData = () => {
    const exportCols = ALL_COLUMNS.filter(c => c.key !== 'actions' && isColVisible(c.key));
    const header = exportCols.map(c => c.label).join('\t');
    const rows = students.map(s => exportCols.map(c => getCellText(s, c.key)).join('\t'));
    navigator.clipboard.writeText([header, ...rows].join('\n')).then(() => {
      Swal.fire({ ...getSwalOpts(), icon: 'success', title: 'Copied!', text: 'Table data copied to clipboard', timer: 1500, showConfirmButton: false });
    });
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <AdminLayout pageTitle="Manage Students">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark-theme:text-gray-100">Manage Students</h1>
            <p className="text-sm text-gray-500 dark-theme:text-gray-400 mt-1">{total} total students</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input type="text" placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2.5 rounded-xl bg-white dark-theme:bg-gray-900 border border-sand dark-theme:border-gray-700 focus:border-primary outline-none text-sm w-56" />
            </form>

            {/* Status Filter */}
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-3 py-2.5 rounded-xl bg-white dark-theme:bg-gray-900 border border-sand dark-theme:border-gray-700 focus:border-primary outline-none text-sm text-gray-600 dark-theme:text-gray-300">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="unverified">Unverified</option>
            </select>

            {/* Column Visibility */}
            <div className="relative" ref={colMenuRef}>
              <button onClick={() => setShowColMenu(!showColMenu)}
                className="px-3 py-2.5 rounded-xl bg-white dark-theme:bg-gray-900 border border-sand dark-theme:border-gray-700 text-sm text-gray-600 dark-theme:text-gray-300 hover:border-primary transition-colors flex items-center gap-1.5">
                <i className="ri-layout-column-line text-sm"></i> Columns <i className="ri-arrow-down-s-line text-xs"></i>
              </button>
              {showColMenu && (
                <div className="absolute right-0 top-full mt-1 w-56 bg-white dark-theme:bg-gray-900 border border-sand dark-theme:border-gray-700 rounded-xl shadow-xl z-50 py-1 max-h-80 overflow-y-auto">
                  {ALL_COLUMNS.map(col => (
                    <button key={col.key} onClick={() => toggleCol(col.key)}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 dark-theme:text-gray-300 hover:bg-cream/50 dark-theme:hover:bg-gray-800/50 transition-colors">
                      <span>{col.label}</span>
                      {isColVisible(col.key) && <i className="ri-check-line text-primary font-bold"></i>}
                    </button>
                  ))}
                  <div className="border-t border-sand dark-theme:border-gray-700 mt-1 pt-1">
                    <button onClick={restoreVisibility}
                      className="w-full px-4 py-2.5 text-sm text-primary hover:bg-cream/50 dark-theme:hover:bg-gray-800/50 transition-colors text-left font-medium">
                      Restore visibility
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Copy */}
            <button onClick={copyTableData}
              className="px-3 py-2.5 rounded-xl bg-white dark-theme:bg-gray-900 border border-sand dark-theme:border-gray-700 text-sm text-gray-600 dark-theme:text-gray-300 hover:border-primary transition-colors flex items-center gap-1.5">
              <i className="ri-file-copy-line text-sm"></i> Copy
            </button>

            {/* Export */}
            <div className="flex items-center gap-1 bg-white dark-theme:bg-gray-900 border border-sand dark-theme:border-gray-700 rounded-xl px-1">
              <button onClick={() => exportToPDF(getExportData())} className="px-3 py-2 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 dark-theme:hover:bg-red-900/20 transition-colors flex items-center gap-1.5" title="Download PDF">
                <i className="ri-file-pdf-2-line text-sm"></i> PDF
              </button>
              <div className="w-px h-5 bg-sand dark-theme:bg-gray-700"></div>
              <button onClick={() => exportToExcel(getExportData())} className="px-3 py-2 rounded-lg text-xs font-medium text-green-600 hover:bg-green-50 dark-theme:hover:bg-green-900/20 transition-colors flex items-center gap-1.5" title="Download Excel">
                <i className="ri-file-excel-2-line text-sm"></i> Excel
              </button>
            </div>

            {/* Add Student */}
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
                    {isColVisible('id') && <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">ID</th>}
                    {isColVisible('fullName') && <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Name</th>}
                    {isColVisible('username') && <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Username</th>}
                    {isColVisible('email') && <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Email</th>}
                    {isColVisible('phone') && <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Phone</th>}
                    {isColVisible('college') && <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">College</th>}
                    {isColVisible('department') && <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Department</th>}
                    {isColVisible('year') && <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Year</th>}
                    {isColVisible('rollNumber') && <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Roll No</th>}
                    {isColVisible('gender') && <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Gender</th>}
                    {isColVisible('dateOfBirth') && <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">DOB</th>}
                    {isColVisible('enrolledCourses') && <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Courses</th>}
                    {isColVisible('isVerified') && <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Verified</th>}
                    {isColVisible('isActive') && <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>}
                    {isColVisible('createdAt') && <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Joined</th>}
                    {isColVisible('actions') && <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand dark-theme:divide-gray-800">
                  {students.map(s => (
                    <tr key={s.id} className="hover:bg-cream/30 dark-theme:hover:bg-gray-800/30 transition-colors">
                      {isColVisible('id') && <td className="px-5 py-3 text-sm text-gray-500 dark-theme:text-gray-400 whitespace-nowrap">{s.id}</td>}
                      {isColVisible('fullName') && (
                        <td className="px-5 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <img src={s.profileImage ? `http://localhost:5000${s.profileImage}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(s.fullName)}&size=36&background=c96442&color=fff`} className="w-8 h-8 rounded-lg object-cover" alt="" />
                            <span className="text-sm font-medium text-gray-800 dark-theme:text-gray-200">{s.fullName}</span>
                          </div>
                        </td>
                      )}
                      {isColVisible('username') && <td className="px-5 py-3 text-sm text-gray-500 dark-theme:text-gray-400 whitespace-nowrap">@{s.username}</td>}
                      {isColVisible('email') && <td className="px-5 py-3 text-sm text-gray-600 dark-theme:text-gray-400 whitespace-nowrap">{s.email}</td>}
                      {isColVisible('phone') && <td className="px-5 py-3 text-sm text-gray-600 dark-theme:text-gray-400 whitespace-nowrap">{s.phone || '—'}</td>}
                      {isColVisible('college') && <td className="px-5 py-3 text-sm text-gray-600 dark-theme:text-gray-400 whitespace-nowrap max-w-[200px] truncate" title={s.college || ''}>{s.college || '—'}</td>}
                      {isColVisible('department') && <td className="px-5 py-3 text-sm text-gray-600 dark-theme:text-gray-400 whitespace-nowrap">{s.department || '—'}</td>}
                      {isColVisible('year') && <td className="px-5 py-3 text-sm text-gray-600 dark-theme:text-gray-400 whitespace-nowrap">{s.year || '—'}</td>}
                      {isColVisible('rollNumber') && <td className="px-5 py-3 text-sm text-gray-600 dark-theme:text-gray-400 whitespace-nowrap">{s.rollNumber || '—'}</td>}
                      {isColVisible('gender') && <td className="px-5 py-3 text-sm text-gray-600 dark-theme:text-gray-400 whitespace-nowrap">{s.gender || '—'}</td>}
                      {isColVisible('dateOfBirth') && <td className="px-5 py-3 text-sm text-gray-600 dark-theme:text-gray-400 whitespace-nowrap">{s.dateOfBirth ? new Date(s.dateOfBirth).toLocaleDateString() : '—'}</td>}
                      {isColVisible('enrolledCourses') && (
                        <td className="px-5 py-3 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark-theme:bg-blue-900/30 dark-theme:text-blue-400">{s.enrolledCourses || 0}</span>
                        </td>
                      )}
                      {isColVisible('isVerified') && (
                        <td className="px-5 py-3 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.isVerified ? 'bg-green-100 text-green-700 dark-theme:bg-green-900/30 dark-theme:text-green-400' : 'bg-amber-100 text-amber-700 dark-theme:bg-amber-900/30 dark-theme:text-amber-400'}`}>
                            {s.isVerified ? 'Yes' : 'No'}
                          </span>
                        </td>
                      )}
                      {isColVisible('isActive') && (
                        <td className="px-5 py-3 whitespace-nowrap">
                          <button onClick={() => handleToggleStatus(s)} className={`px-2.5 py-1 rounded-full text-xs font-medium ${s.isActive ? 'bg-green-100 text-green-700 dark-theme:bg-green-900/30 dark-theme:text-green-400' : 'bg-red-100 text-red-700 dark-theme:bg-red-900/30 dark-theme:text-red-400'}`}>
                            {s.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                      )}
                      {isColVisible('createdAt') && <td className="px-5 py-3 text-sm text-gray-500 whitespace-nowrap">{new Date(s.createdAt).toLocaleDateString()}</td>}
                      {isColVisible('actions') && (
                        <td className="px-5 py-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openEdit(s)} className="w-8 h-8 rounded-lg bg-blue-50 dark-theme:bg-blue-900/20 text-blue-500 flex items-center justify-center hover:bg-blue-100 transition-colors" title="Edit"><i className="ri-edit-line text-sm"></i></button>
                            <button onClick={() => handleDelete(s.id, s.fullName)} className="w-8 h-8 rounded-lg bg-red-50 dark-theme:bg-red-900/20 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors" title="Delete"><i className="ri-delete-bin-line text-sm"></i></button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-sand dark-theme:border-gray-800">
              <p className="text-sm text-gray-500 dark-theme:text-gray-400">
                Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
              </p>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm text-gray-500 hover:bg-cream dark-theme:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                  <i className="ri-arrow-left-s-line"></i>
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (page <= 3) pageNum = i + 1;
                  else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = page - 2 + i;
                  return (
                    <button key={pageNum} onClick={() => setPage(pageNum)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${page === pageNum ? 'bg-primary text-white' : 'text-gray-500 hover:bg-cream dark-theme:hover:bg-gray-800'}`}>
                      {pageNum}
                    </button>
                  );
                })}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm text-gray-500 hover:bg-cream dark-theme:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                  <i className="ri-arrow-right-s-line"></i>
                </button>
              </div>
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
