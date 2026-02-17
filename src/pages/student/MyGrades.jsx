import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { studentApi } from '../../utils/api';

const MyGrades = () => {
  const [grades, setGrades] = useState([]);
  const [summary, setSummary] = useState({ avgPercentage: 0, highestScore: 0, totalGrades: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrades = async () => {
      const res = await studentApi.getGrades();
      if (res.success) {
        setGrades(res.grades || []);
        setSummary(res.stats || summary);
      }
      setLoading(false);
    };
    fetchGrades();
  }, []);

  const getGradeColor = (pct) => pct >= 80 ? 'text-green-600' : pct >= 60 ? 'text-amber-600' : 'text-red-600';
  const getGradeBg = (pct) => pct >= 80 ? 'bg-green-500/15' : pct >= 60 ? 'bg-amber-500/15' : 'bg-red-500/15';

  return (
    <DashboardLayout pageTitle="My Grades" role="student">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 dark-theme:text-gray-100">My Grades</h1>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white dark-theme:bg-gray-900 rounded-2xl p-5 border border-sand dark-theme:border-gray-800 text-center">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center mx-auto mb-2"><i className="ri-bar-chart-box-line text-blue-600"></i></div>
            <p className="text-2xl font-bold text-gray-800 dark-theme:text-gray-100">{summary.avgPercentage}%</p>
            <p className="text-xs text-gray-500">Average</p>
          </div>
          <div className="bg-white dark-theme:bg-gray-900 rounded-2xl p-5 border border-sand dark-theme:border-gray-800 text-center">
            <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center mx-auto mb-2"><i className="ri-arrow-up-line text-green-600"></i></div>
            <p className="text-2xl font-bold text-gray-800 dark-theme:text-gray-100">{summary.highestScore}%</p>
            <p className="text-xs text-gray-500">Highest</p>
          </div>
          <div className="bg-white dark-theme:bg-gray-900 rounded-2xl p-5 border border-sand dark-theme:border-gray-800 text-center">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-2"><i className="ri-file-list-line text-purple-600"></i></div>
            <p className="text-2xl font-bold text-gray-800 dark-theme:text-gray-100">{summary.totalGrades}</p>
            <p className="text-xs text-gray-500">Graded</p>
          </div>
        </div>

        {loading ? null :
        grades.length === 0 ? <div className="text-center py-20 text-gray-400"><i className="ri-bar-chart-box-line text-4xl mb-3 block"></i><p>No grades yet</p></div> :
        <div className="bg-white dark-theme:bg-gray-900 rounded-2xl border border-sand dark-theme:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream dark-theme:bg-gray-800">
                <tr className="text-left text-xs text-gray-500">
                  <th className="px-5 py-3 font-medium">Assignment</th>
                  <th className="px-5 py-3 font-medium">Course</th>
                  <th className="px-5 py-3 font-medium">Score</th>
                  <th className="px-5 py-3 font-medium">Grade</th>
                  <th className="px-5 py-3 font-medium">Feedback</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand dark-theme:divide-gray-800">
                {grades.map((g, i) => {
                  const pct = g.maxScore ? Math.round((g.grade / g.maxScore) * 100) : 0;
                  return (
                    <tr key={i} className="hover:bg-cream/50 dark-theme:hover:bg-gray-800/50">
                      <td className="px-5 py-3 font-medium text-gray-800 dark-theme:text-gray-100">{g.assignmentTitle || g.testTitle || 'Untitled Assessment'}</td>
                      <td className="px-5 py-3 text-gray-500">{g.courseName || (g.testTitle ? 'Aptitude Test' : '-')}</td>
                      <td className="px-5 py-3 text-gray-600 dark-theme:text-gray-300">{g.grade}/{g.maxScore}</td>
                      <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getGradeBg(pct)} ${getGradeColor(pct)}`}>{pct}%</span></td>
                      <td className="px-5 py-3 text-gray-500 text-xs max-w-[200px] truncate">{g.feedback || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>}
      </div>
    </DashboardLayout>
  );
};
export default MyGrades;
