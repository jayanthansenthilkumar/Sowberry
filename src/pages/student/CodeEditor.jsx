import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Swal from 'sweetalert2';
import { studentApi } from '../../utils/api';
import { useSearchParams } from 'react-router-dom';

const CodeEditor = () => {
  const [searchParams] = useSearchParams();
  const problemId = searchParams.get('problem');
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('// Write your solution here\n');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(!!problemId);

  useEffect(() => {
    if (problemId) {
      const fetchProblem = async () => {
        const res = await studentApi.getCodingProblem(problemId);
        if (res.success) setProblem(res.problem);
        setLoading(false);
      };
      fetchProblem();
    }
  }, [problemId]);

  const handleRun = async () => {
    setRunning(true);
    setOutput('Running...');
    if (problemId) {
      const res = await studentApi.submitCode(problemId, { code, language });
      setOutput(res.success ? (res.output || 'Code executed successfully!') : (res.message || 'Error executing code'));
    } else {
      setTimeout(() => setOutput('\u2713 Code executed successfully (local simulation)\n\nTo test against actual test cases, open a problem from Coding Practice.'), 1000);
    }
    setRunning(false);
  };

  const handleSubmit = async () => {
    if (!problemId) return;
    setRunning(true);
    const res = await studentApi.submitCode(problemId, { code, language });
    setRunning(false);
    if (res.success) {
      Swal.fire({ icon: 'success', title: 'Solution Submitted!', text: res.message || 'Your code has been submitted for evaluation.', background: '#fff', color: '#1f2937' });
      setOutput(res.output || 'Submitted successfully!');
    } else {
      Swal.fire({ icon: 'error', title: 'Submission Failed', text: res.message, background: '#fff', color: '#1f2937' });
    }
  };

  const diffColors = { easy: 'bg-green-100 text-green-700', medium: 'bg-amber-100 text-amber-700', hard: 'bg-red-100 text-red-700' };

  return (
    <DashboardLayout pageTitle="Code Editor" role="student">
      <div className="space-y-4 h-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark-theme:text-gray-100">{problem ? problem.title : 'Code Editor'}</h1>
            {problem && <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${diffColors[problem.difficulty] || ''}`}>{problem.difficulty}</span>
              {problem.category && <span className="text-xs text-gray-400">{problem.category}</span>}
            </div>}
          </div>
          <div className="flex items-center gap-2">
            <select value={language} onChange={e => setLanguage(e.target.value)} className="px-3 py-2 rounded-xl bg-cream dark-theme:bg-gray-800 border border-sand dark-theme:border-gray-700 text-xs outline-none">
              <option value="javascript">JavaScript</option><option value="python">Python</option><option value="java">Java</option><option value="cpp">C++</option><option value="c">C</option>
            </select>
            <button onClick={handleRun} disabled={running} className="px-4 py-2 rounded-xl bg-green-500 text-white text-xs font-medium hover:bg-green-600 disabled:opacity-50 flex items-center gap-1">
              <i className="ri-play-line"></i>{running ? 'Running...' : 'Run'}
            </button>
            {problemId && <button onClick={handleSubmit} disabled={running} className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-medium hover:bg-primary-dark disabled:opacity-50 flex items-center gap-1">
              <i className="ri-send-plane-line"></i>Submit
            </button>}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {problem && (
            <div className="lg:col-span-1 bg-white dark-theme:bg-gray-900 rounded-2xl p-5 border border-sand dark-theme:border-gray-800 max-h-[70vh] overflow-y-auto">
              <h3 className="font-semibold text-gray-800 dark-theme:text-gray-100 text-sm mb-3">Problem Description</h3>
              <p className="text-xs text-gray-600 dark-theme:text-gray-300 whitespace-pre-wrap mb-4">{problem.description}</p>
              {problem.constraints && <><h4 className="font-medium text-gray-700 dark-theme:text-gray-300 text-xs mb-1">Constraints</h4><p className="text-xs text-gray-500 mb-3 whitespace-pre-wrap">{problem.constraints}</p></>}
              {problem.sampleInput && <><h4 className="font-medium text-gray-700 dark-theme:text-gray-300 text-xs mb-1">Sample Input</h4><pre className="text-xs bg-cream dark-theme:bg-gray-800 p-2 rounded-lg mb-3 overflow-x-auto">{problem.sampleInput}</pre></>}
              {problem.sampleOutput && <><h4 className="font-medium text-gray-700 dark-theme:text-gray-300 text-xs mb-1">Sample Output</h4><pre className="text-xs bg-cream dark-theme:bg-gray-800 p-2 rounded-lg overflow-x-auto">{problem.sampleOutput}</pre></>}
            </div>
          )}

          <div className={`${problem ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-4`}>
            <div className="bg-white dark-theme:bg-gray-900 rounded-2xl border border-sand dark-theme:border-gray-800 overflow-hidden">
              <div className="px-4 py-2 bg-cream dark-theme:bg-gray-800 border-b border-sand dark-theme:border-gray-700 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span className="ml-2 text-xs text-gray-500">solution.{language === 'python' ? 'py' : language === 'java' ? 'java' : language === 'cpp' ? 'cpp' : language === 'c' ? 'c' : 'js'}</span>
              </div>
              <textarea value={code} onChange={e => setCode(e.target.value)} spellCheck={false}
                className="w-full h-[40vh] bg-gray-950 text-green-400 font-mono text-sm p-4 outline-none resize-none"
                placeholder="// Write your code here..." />
            </div>

            <div className="bg-white dark-theme:bg-gray-900 rounded-2xl border border-sand dark-theme:border-gray-800 overflow-hidden">
              <div className="px-4 py-2 bg-cream dark-theme:bg-gray-800 border-b border-sand dark-theme:border-gray-700">
                <span className="text-xs font-medium text-gray-500"><i className="ri-terminal-line mr-1"></i>Output</span>
              </div>
              <pre className="p-4 text-xs text-gray-700 dark-theme:text-gray-300 font-mono min-h-[80px] max-h-[150px] overflow-auto whitespace-pre-wrap">{output || 'Click "Run" to execute your code'}</pre>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
export default CodeEditor;
