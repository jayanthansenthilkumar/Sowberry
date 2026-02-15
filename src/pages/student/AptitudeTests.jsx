import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Swal from 'sweetalert2';
import { studentApi } from '../../utils/api';

const AptitudeTests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTest, setActiveTest] = useState(null);
  const [attemptId, setAttemptId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTests = async () => {
      const res = await studentApi.getAptitudeTests();
      if (res.success) setTests(res.tests || []);
      setLoading(false);
    };
    fetchTests();
  }, []);

  useEffect(() => {
    if (!activeTest || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(t => { if (t <= 1) { clearInterval(timer); handleAutoSubmit(); return 0; } return t - 1; }), 1000);
    return () => clearInterval(timer);
  }, [activeTest, timeLeft]);

  const startTest = async (testId) => {
    const res = await studentApi.startAptitudeTest(testId);
    if (res.success) {
      setActiveTest({ ...res.test, questions: res.questions || [] });
      setAttemptId(res.attemptId);
      setAnswers({});
      setTimeLeft((res.test.duration || 30) * 60);
    } else Swal.fire({ icon: 'error', title: 'Error', text: res.message, background: '#fff', color: '#1f2937' });
  };

  const handleAutoSubmit = () => { submitTest(true); };

  const submitTest = async (auto = false) => {
    if (!auto) {
      const confirm = await Swal.fire({ title: 'Submit Test?', text: 'You cannot change your answers after submission.', icon: 'question', showCancelButton: true, confirmButtonText: 'Submit', confirmButtonColor: '#6366f1', background: '#fff', color: '#1f2937' });
      if (!confirm.isConfirmed) return;
    }
    setSubmitting(true);
    // Convert answers from {questionId: 'A'} map to [{questionId, selectedOption}] array
    const answersArray = Object.entries(answers).map(([questionId, selectedOption]) => ({ questionId: Number(questionId), selectedOption }));
    const res = await studentApi.submitAptitudeTest(attemptId, { answers: answersArray });
    setSubmitting(false);
    if (res.success) {
      Swal.fire({ icon: 'success', title: auto ? 'Time\'s Up!' : 'Submitted!', text: `Score: ${res.score || 0}/${res.totalMarks || 0}`, background: '#fff', color: '#1f2937' });
      setActiveTest(null);
      setAttemptId(null);
    } else Swal.fire({ icon: 'error', title: 'Error', text: res.message, background: '#fff', color: '#1f2937' });
  };

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  if (activeTest) {
    const questions = activeTest.questions || [];
    return (
      <DashboardLayout pageTitle="Aptitude Test" role="student">
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white dark-theme:bg-gray-900 rounded-2xl p-4 border border-sand dark-theme:border-gray-800 sticky top-0 z-10">
            <div><h2 className="font-bold text-gray-800 dark-theme:text-white text-sm">{activeTest.title}</h2><p className="text-[11px] text-gray-400">{Object.keys(answers).length}/{questions.length} answered</p></div>
            <div className="flex items-center gap-3">
              <span className={`text-lg font-mono font-bold ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-primary'}`}><i className="ri-time-line mr-1"></i>{formatTime(timeLeft)}</span>
              <button onClick={() => submitTest()} disabled={submitting} className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-medium hover:bg-primary-dark disabled:opacity-50">{submitting ? 'Submitting...' : 'Submit'}</button>
            </div>
          </div>

          {questions.map((q, idx) => (
            <div key={idx} className="bg-white dark-theme:bg-gray-900 rounded-2xl p-5 border border-sand dark-theme:border-gray-800">
              <div className="flex items-start gap-3 mb-3">
                <span className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">{idx + 1}</span>
                <p className="text-sm text-gray-800 dark-theme:text-white font-medium">{q.question}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-10">
                {['A', 'B', 'C', 'D'].map(opt => (
                  <button key={opt} onClick={() => setAnswers({ ...answers, [q.id || idx]: opt })}
                    className={`p-3 rounded-xl text-xs text-left transition-all border ${answers[q.id || idx] === opt ? 'border-primary bg-primary/10 text-primary font-medium' : 'border-sand dark-theme:border-gray-700 text-gray-600 dark-theme:text-gray-300 hover:border-primary/50'}`}>
                    <span className="font-bold mr-2">{opt}.</span>{q[`option${opt}`]}
                  </button>
                ))}
              </div>
              <div className="ml-10 mt-2 text-[10px] text-gray-400">{q.marks || 1} mark{(q.marks || 1) > 1 ? 's' : ''}</div>
            </div>
          ))}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Aptitude Tests" role="student">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 dark-theme:text-white">Aptitude Tests</h1>

        {loading ? <div className="flex justify-center py-20"><div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div></div> :
        tests.length === 0 ? <div className="text-center py-20 text-gray-400"><i className="ri-question-answer-line text-4xl mb-3 block"></i><p>No aptitude tests available</p></div> :
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tests.map(t => (
            <div key={t.id} className="bg-white dark-theme:bg-gray-900 rounded-2xl p-5 border border-sand dark-theme:border-gray-800 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3"><i className="ri-question-answer-line text-primary"></i></div>
              <h3 className="font-semibold text-gray-800 dark-theme:text-white text-sm mb-1">{t.title}</h3>
              <p className="text-xs text-gray-500 line-clamp-2 mb-3">{t.description}</p>
              <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                <span><i className="ri-time-line mr-1"></i>{t.duration} min</span>
                <span><i className="ri-file-list-line mr-1"></i>{t.totalQuestions} questions</span>
                <span><i className="ri-medal-line mr-1"></i>{t.totalMarks} marks</span>
              </div>
              <button onClick={() => startTest(t.id)} className="w-full py-2.5 rounded-xl bg-primary text-white text-xs font-medium hover:bg-primary-dark"><i className="ri-play-line mr-1"></i>Start Test</button>
            </div>
          ))}
        </div>}
      </div>
    </DashboardLayout>
  );
};
export default AptitudeTests;
