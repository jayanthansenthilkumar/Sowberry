import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Swal from 'sweetalert2';

const GAMES = [
  { id: 'typing', title: 'Speed Typing', description: 'Test your typing speed and accuracy with programming keywords.', icon: 'ri-keyboard-line', color: 'from-blue-500 to-blue-600' },
  { id: 'quiz', title: 'Quick Quiz', description: 'Answer rapid-fire questions on programming concepts.', icon: 'ri-questionnaire-line', color: 'from-green-500 to-green-600' },
  { id: 'memory', title: 'Memory Match', description: 'Match programming concept pairs to boost retention.', icon: 'ri-brain-line', color: 'from-purple-500 to-purple-600' },
  { id: 'debug', title: 'Bug Hunter', description: 'Find and fix bugs in code snippets to score points.', icon: 'ri-bug-line', color: 'from-red-500 to-red-600' },
];

const QUIZ_DATA = [
  { q: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language'], answer: 0 },
  { q: 'Which keyword declares a variable in JavaScript?', options: ['var', 'int', 'string', 'dim'], answer: 0 },
  { q: 'What does CSS stand for?', options: ['Creative Style Sheets', 'Cascading Style Sheets', 'Computer Style Sheets', 'Colorful Style Sheets'], answer: 1 },
  { q: 'Which symbol is used for single-line comments in JS?', options: ['#', '//', '/* */', '--'], answer: 1 },
  { q: 'What is the output of typeof null in JS?', options: ['null', 'undefined', 'object', 'boolean'], answer: 2 },
];

const TYPING_WORDS = ['function', 'const', 'return', 'import', 'export', 'async', 'await', 'class', 'interface', 'component', 'useState', 'useEffect', 'promise', 'callback', 'array', 'object', 'string', 'boolean', 'number', 'render'];

const MEMORY_PAIRS = ['React', 'Vue', 'Angular', 'Node', 'Python', 'Java', 'CSS', 'HTML'];

const LearningGames = () => {
  const [activeGame, setActiveGame] = useState(null);

  // --- Typing Game State ---
  const [typingWord, setTypingWord] = useState('');
  const [typingInput, setTypingInput] = useState('');
  const [typingScore, setTypingScore] = useState(0);
  const [typingTime, setTypingTime] = useState(30);
  const [typingStarted, setTypingStarted] = useState(false);

  // --- Quiz Game State ---
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  // --- Memory Game State ---
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [memoryMoves, setMemoryMoves] = useState(0);

  const nextTypingWord = useCallback(() => { setTypingWord(TYPING_WORDS[Math.floor(Math.random() * TYPING_WORDS.length)]); setTypingInput(''); }, []);

  useEffect(() => {
    if (activeGame === 'typing' && typingStarted && typingTime > 0) {
      const t = setInterval(() => setTypingTime(p => { if (p <= 1) { clearInterval(t); Swal.fire({ icon: 'success', title: 'Time\'s Up!', text: `You typed ${typingScore} words correctly!`, background: '#fff', color: '#1f2937' }); setTypingStarted(false); return 0; } return p - 1; }), 1000);
      return () => clearInterval(t);
    }
  }, [activeGame, typingStarted, typingTime]);

  const startTyping = () => { setTypingScore(0); setTypingTime(30); setTypingStarted(true); nextTypingWord(); };

  const handleTypingInput = (val) => {
    setTypingInput(val);
    if (val.trim().toLowerCase() === typingWord.toLowerCase()) { setTypingScore(s => s + 1); nextTypingWord(); }
  };

  const answerQuiz = (idx) => {
    if (idx === QUIZ_DATA[quizIdx].answer) setQuizScore(s => s + 1);
    if (quizIdx + 1 >= QUIZ_DATA.length) setQuizDone(true);
    else setQuizIdx(i => i + 1);
  };

  const initMemory = useCallback(() => {
    const shuffled = [...MEMORY_PAIRS, ...MEMORY_PAIRS].sort(() => Math.random() - 0.5).map((val, i) => ({ id: i, val, matched: false }));
    setCards(shuffled); setFlipped([]); setMatched([]); setMemoryMoves(0);
  }, []);

  const flipCard = (idx) => {
    if (flipped.length === 2 || flipped.includes(idx) || matched.includes(idx)) return;
    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      setMemoryMoves(m => m + 1);
      if (cards[newFlipped[0]].val === cards[newFlipped[1]].val) {
        setMatched(p => [...p, ...newFlipped]);
        setFlipped([]);
        if (matched.length + 2 === cards.length) Swal.fire({ icon: 'success', title: 'All Matched!', text: `Completed in ${memoryMoves + 1} moves!`, background: '#fff', color: '#1f2937' });
      } else setTimeout(() => setFlipped([]), 800);
    }
  };

  const startGame = (id) => {
    setActiveGame(id);
    if (id === 'quiz') { setQuizIdx(0); setQuizScore(0); setQuizDone(false); }
    if (id === 'memory') initMemory();
    if (id === 'typing') { setTypingStarted(false); setTypingScore(0); setTypingTime(30); }
  };

  const renderGame = () => {
    if (activeGame === 'typing') return (
      <div className="bg-white dark-theme:bg-gray-900 rounded-2xl p-6 border border-sand dark-theme:border-gray-800 text-center">
        <h2 className="text-lg font-bold text-gray-800 dark-theme:text-white mb-4">Speed Typing</h2>
        {!typingStarted ? <button onClick={startTyping} className="px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary-dark">Start Game ({typingTime}s)</button> : (
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-400"><span>Score: <b className="text-primary">{typingScore}</b></span><span className={`font-mono font-bold ${typingTime < 10 ? 'text-red-500' : 'text-gray-600'}`}>{typingTime}s</span></div>
            <div className="text-4xl font-mono font-bold text-primary py-6 bg-cream dark-theme:bg-gray-800 rounded-xl">{typingWord}</div>
            <input type="text" autoFocus value={typingInput} onChange={e => handleTypingInput(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-cream dark-theme:bg-gray-800 border-2 border-sand dark-theme:border-gray-700 focus:border-primary outline-none text-center text-lg font-mono" placeholder="Type the word above..." />
          </div>
        )}
      </div>
    );
    if (activeGame === 'quiz') return (
      <div className="bg-white dark-theme:bg-gray-900 rounded-2xl p-6 border border-sand dark-theme:border-gray-800">
        <h2 className="text-lg font-bold text-gray-800 dark-theme:text-white mb-4">Quick Quiz</h2>
        {quizDone ? <div className="text-center py-6"><p className="text-3xl font-bold text-primary mb-2">{quizScore}/{QUIZ_DATA.length}</p><p className="text-gray-500 mb-4">Quiz Complete!</p><button onClick={() => { setQuizIdx(0); setQuizScore(0); setQuizDone(false); }} className="px-4 py-2 rounded-xl bg-primary text-white text-sm hover:bg-primary-dark">Retry</button></div> : (
          <div><div className="text-xs text-gray-400 mb-2">Question {quizIdx + 1}/{QUIZ_DATA.length}</div><p className="font-medium text-gray-800 dark-theme:text-white mb-4">{QUIZ_DATA[quizIdx].q}</p><div className="space-y-2">{QUIZ_DATA[quizIdx].options.map((o, i) => (<button key={i} onClick={() => answerQuiz(i)} className="w-full p-3 rounded-xl text-left text-sm border border-sand dark-theme:border-gray-700 hover:border-primary hover:bg-primary/5 transition-colors">{o}</button>))}</div></div>
        )}
      </div>
    );
    if (activeGame === 'memory') return (
      <div className="bg-white dark-theme:bg-gray-900 rounded-2xl p-6 border border-sand dark-theme:border-gray-800">
        <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-bold text-gray-800 dark-theme:text-white">Memory Match</h2><span className="text-sm text-gray-400">Moves: <b className="text-primary">{memoryMoves}</b></span></div>
        <div className="grid grid-cols-4 gap-3">
          {cards.map((c, i) => (
            <button key={i} onClick={() => flipCard(i)} className={`aspect-square rounded-xl text-sm font-bold transition-all ${flipped.includes(i) || matched.includes(i) ? 'bg-primary text-white rotate-0' : 'bg-cream dark-theme:bg-gray-800 text-transparent hover:bg-primary/10'}`}>{flipped.includes(i) || matched.includes(i) ? c.val : '?'}</button>
          ))}
        </div>
      </div>
    );
    if (activeGame === 'debug') return (
      <div className="bg-white dark-theme:bg-gray-900 rounded-2xl p-6 border border-sand dark-theme:border-gray-800 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4"><i className="ri-bug-line text-3xl text-red-600"></i></div>
        <h2 className="text-lg font-bold text-gray-800 dark-theme:text-white mb-2">Bug Hunter</h2>
        <p className="text-sm text-gray-500 mb-4">Interactive debugging challenges coming soon! Practice finding and fixing bugs in real code snippets.</p>
        <div className="bg-gray-950 rounded-xl p-4 text-left"><pre className="text-xs text-green-400 font-mono">{'function greet(name) {\n  console.log("Hello, " + name)\n  return name\n}\n\n// Find the bug!'}</pre></div>
      </div>
    );
  };

  return (
    <DashboardLayout pageTitle="Learning Games" role="student">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800 dark-theme:text-white">Learning Games</h1>
          {activeGame && <button onClick={() => setActiveGame(null)} className="text-sm text-primary hover:underline flex items-center gap-1"><i className="ri-arrow-left-line"></i>All Games</button>}
        </div>

        {activeGame ? renderGame() : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {GAMES.map(g => (
              <div key={g.id} onClick={() => startGame(g.id)} className="bg-white dark-theme:bg-gray-900 rounded-2xl border border-sand dark-theme:border-gray-800 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                <div className={`h-2 bg-gradient-to-r ${g.color}`}></div>
                <div className="p-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${g.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}><i className={`${g.icon} text-white text-xl`}></i></div>
                  <h3 className="font-bold text-gray-800 dark-theme:text-white mb-1">{g.title}</h3>
                  <p className="text-xs text-gray-500">{g.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
export default LearningGames;
