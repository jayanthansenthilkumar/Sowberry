import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { studentApi } from '../../utils/api';

const MyProgress = () => {
  const [progress, setProgress] = useState([]);
  const [overall, setOverall] = useState({ totalCourses: 0, completedLessons: 0, totalLessons: 0, overallProgress: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      const res = await studentApi.getProgress();
      if (res.success) {
        setProgress(res.progress || []);
        setOverall(res.overall || overall);
      }
      setLoading(false);
    };
    fetchProgress();
  }, []);

  return (
    <DashboardLayout pageTitle="My Progress" role="student">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 dark-theme:text-gray-100">My Progress</h1>

        <div className="bg-white dark-theme:bg-gray-900 rounded-2xl p-6 border border-sand dark-theme:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div><p className="text-sm text-gray-500">Overall Progress</p><p className="text-3xl font-bold text-gray-800 dark-theme:text-gray-100">{overall.overallProgress}%</p></div>
            <div className="w-20 h-20 rounded-full border-4 border-primary flex items-center justify-center">
              <span className="text-lg font-bold text-primary">{overall.overallProgress}%</span>
            </div>
          </div>
          <div className="w-full h-3 bg-gray-200 dark-theme:bg-gray-700 rounded-full"><div className="h-3 bg-gradient-to-r from-primary to-primary-dark rounded-full transition-all" style={{ width: `${overall.overallProgress}%` }}></div></div>
          <div className="flex justify-between mt-3 text-xs text-gray-400">
            <span>{overall.totalCourses} courses</span>
            <span>{overall.completedLessons}/{overall.totalLessons} lessons completed</span>
          </div>
        </div>

        {loading ? <div className="flex justify-center py-10"><div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div></div> :
        progress.length === 0 ? <div className="text-center py-16 text-gray-400"><i className="ri-line-chart-line text-4xl mb-3 block"></i><p>No progress data yet</p></div> :
        <div className="space-y-4">
          {progress.map((p, i) => (
            <div key={i} className="bg-white dark-theme:bg-gray-900 rounded-2xl p-5 border border-sand dark-theme:border-gray-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><i className="ri-book-open-line text-primary"></i></div>
                  <div><h3 className="font-semibold text-gray-800 dark-theme:text-gray-100 text-sm">{p.courseTitle || p.title}</h3><p className="text-[11px] text-gray-400">{p.mentorName || 'Instructor'}</p></div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${p.progress >= 100 ? 'bg-green-500/15 text-green-400' : p.progress >= 50 ? 'bg-blue-500/15 text-blue-400' : 'bg-amber-500/15 text-amber-400'}`}>{p.progress >= 100 ? 'Completed' : 'In Progress'}</span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark-theme:bg-gray-700 rounded-full"><div className={`h-2 rounded-full transition-all ${p.progress >= 100 ? 'bg-green-500' : 'bg-primary'}`} style={{ width: `${p.progress || 0}%` }}></div></div>
              <div className="flex justify-between mt-2 text-[11px] text-gray-400">
                <span>Enrolled: {p.enrolledDate ? new Date(p.enrolledDate).toLocaleDateString() : 'N/A'}</span>
                <span className="font-medium">{p.progress || 0}%</span>
              </div>
            </div>
          ))}
        </div>}
      </div>
    </DashboardLayout>
  );
};
export default MyProgress;
