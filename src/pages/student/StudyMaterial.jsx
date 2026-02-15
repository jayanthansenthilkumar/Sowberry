import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { studentApi } from '../../utils/api';

const StudyMaterial = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchMaterials = async () => {
      const res = await studentApi.getStudyMaterials();
      if (res.success) setMaterials(res.materials || []);
      setLoading(false);
    };
    fetchMaterials();
  }, []);

  const filtered = materials.filter(m => m.title?.toLowerCase().includes(search.toLowerCase()) || m.courseName?.toLowerCase().includes(search.toLowerCase()));

  const typeIcons = { pdf: 'ri-file-pdf-2-line', video: 'ri-video-line', document: 'ri-file-text-line', link: 'ri-link', presentation: 'ri-slideshow-line', notes: 'ri-sticky-note-line' };
  const typeColors = { pdf: 'bg-red-500/15 text-red-400 dark-theme:bg-red-500/15 dark-theme:text-red-400', video: 'bg-blue-500/15 text-blue-400 dark-theme:bg-blue-500/15 dark-theme:text-blue-400', document: 'bg-green-500/15 text-green-400 dark-theme:bg-green-500/15 dark-theme:text-green-400', link: 'bg-primary/15 text-primary dark-theme:bg-primary/15 dark-theme:text-primary', presentation: 'bg-amber-500/15 text-amber-400 dark-theme:bg-amber-500/15 dark-theme:text-amber-400', notes: 'bg-teal-500/15 text-teal-400 dark-theme:bg-teal-500/15 dark-theme:text-teal-400' };

  return (
    <DashboardLayout pageTitle="Study Material" role="student">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-800 dark-theme:text-gray-100">Study Materials</h1>
          <div className="relative w-full sm:w-64">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
            <input type="text" placeholder="Search materials..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-cream dark-theme:bg-gray-800 border border-sand dark-theme:border-gray-700 focus:border-primary outline-none text-sm" />
          </div>
        </div>

        {loading ? <div className="flex justify-center py-20"><div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div></div> :
        filtered.length === 0 ? <div className="text-center py-20 text-gray-400"><i className="ri-file-text-line text-4xl mb-3 block"></i><p>{search ? 'No matching materials found' : 'No study materials available'}</p></div> :
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((m, i) => {
            const mType = m.type || 'document';
            return (
              <div key={i} className="bg-white dark-theme:bg-gray-900 rounded-2xl p-5 border border-sand dark-theme:border-gray-800 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${typeColors[mType] || typeColors.document}`}>
                    <i className={`${typeIcons[mType] || typeIcons.document} text-lg`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 dark-theme:text-gray-100 text-sm truncate">{m.title}</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">{m.courseName || 'General'}</p>
                  </div>
                </div>
                {m.description && <p className="text-xs text-gray-500 line-clamp-2 mb-3">{m.description}</p>}
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${typeColors[mType] || typeColors.document}`}>{mType}</span>
                  {m.url && <a href={m.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1"><i className="ri-external-link-line"></i>Open</a>}
                </div>
              </div>
            );
          })}
        </div>}
      </div>
    </DashboardLayout>
  );
};
export default StudyMaterial;
