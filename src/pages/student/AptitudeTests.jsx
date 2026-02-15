import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Swal from 'sweetalert2';
import { studentApi } from '../../utils/api';

// ════════════════════════════════════════════════════════════════
//     BUILT-IN PRACTICE TEST BANK  (available even when DB empty)
// ════════════════════════════════════════════════════════════════
const getSwalOpts = () => { const isDark = document.body.classList.contains('dark-theme'); return { background: isDark ? '#1a1a1a' : '#fff', color: isDark ? '#e8e8e8' : '#1f2937', confirmButtonColor: '#d4a574' }; };

const PRACTICE_TESTS = [
  {
    id: 'p-quant-1', title: 'Quantitative Aptitude — Set 1', description: 'Number system, percentages, ratios and arithmetic.', category: 'Quantitative', duration: 15, icon: 'ri-calculator-line', difficulty: 'Easy',
    questions: [
      { id: 'q1', question: 'If 15% of a number is 45, what is the number?', optionA: '200', optionB: '250', optionC: '300', optionD: '350', correctOption: 'C', marks: 1 },
      { id: 'q2', question: 'The ratio of A to B is 3:5. If the total is 48, what is A?', optionA: '15', optionB: '18', optionC: '20', optionD: '24', correctOption: 'B', marks: 1 },
      { id: 'q3', question: 'What is 25% of 60% of 400?', optionA: '40', optionB: '50', optionC: '60', optionD: '80', correctOption: 'C', marks: 1 },
      { id: 'q4', question: 'A man buys an article for ₹500 and sells for ₹625. Profit %?', optionA: '20%', optionB: '22.5%', optionC: '25%', optionD: '30%', correctOption: 'C', marks: 1 },
      { id: 'q5', question: 'Simple interest on ₹8000 at 5% per annum for 3 years?', optionA: '₹1000', optionB: '₹1100', optionC: '₹1200', optionD: '₹1300', correctOption: 'C', marks: 1 },
      { id: 'q6', question: 'Average of first 10 natural numbers?', optionA: '4.5', optionB: '5', optionC: '5.5', optionD: '6', correctOption: 'C', marks: 1 },
      { id: 'q7', question: 'LCM of 12, 18, and 24?', optionA: '48', optionB: '60', optionC: '72', optionD: '96', correctOption: 'C', marks: 1 },
      { id: 'q8', question: 'If a train travels 300 km in 5 hours, what is its speed?', optionA: '50 km/h', optionB: '55 km/h', optionC: '60 km/h', optionD: '65 km/h', correctOption: 'C', marks: 1 },
      { id: 'q9', question: 'HCF of 36 and 48?', optionA: '6', optionB: '8', optionC: '12', optionD: '18', correctOption: 'C', marks: 1 },
      { id: 'q10', question: 'What is √(144 + 25)?', optionA: '12', optionB: '13', optionC: '14', optionD: '17', correctOption: 'B', marks: 1 },
    ]
  },
  {
    id: 'p-quant-2', title: 'Quantitative Aptitude — Set 2', description: 'Time & work, speed & distance, compound interest.', category: 'Quantitative', duration: 20, icon: 'ri-calculator-line', difficulty: 'Medium',
    questions: [
      { id: 'q11', question: 'A can do a work in 12 days, B in 8 days. Together in?', optionA: '4 days', optionB: '4.8 days', optionC: '5 days', optionD: '6 days', correctOption: 'B', marks: 1 },
      { id: 'q12', question: 'Two trains 150m and 100m long run at 60 and 40 km/h in opposite directions. Time to cross each other?', optionA: '6 sec', optionB: '7 sec', optionC: '9 sec', optionD: '10 sec', correctOption: 'C', marks: 1 },
      { id: 'q13', question: 'CI on ₹10,000 at 10% for 2 years?', optionA: '₹2,000', optionB: '₹2,050', optionC: '₹2,100', optionD: '₹2,200', correctOption: 'C', marks: 1 },
      { id: 'q14', question: 'A pipe can fill a tank in 6 hours. Another empties it in 12 hours. If both open, time to fill?', optionA: '10 hrs', optionB: '12 hrs', optionC: '14 hrs', optionD: '16 hrs', correctOption: 'B', marks: 1 },
      { id: 'q15', question: 'A man walks 5 km/h for 6 hrs and 4 km/h for 12 hrs. Average speed?', optionA: '4.2 km/h', optionB: '4.33 km/h', optionC: '4.5 km/h', optionD: '4.67 km/h', correctOption: 'B', marks: 1 },
      { id: 'q16', question: 'In what time will ₹5000 become ₹6050 at 10% CI per annum?', optionA: '1 year', optionB: '1.5 years', optionC: '2 years', optionD: '2.5 years', correctOption: 'C', marks: 1 },
      { id: 'q17', question: 'The product of two numbers is 120 and sum is 22. What are the numbers?', optionA: '10, 12', optionB: '8, 15', optionC: '6, 20', optionD: '11, 11', correctOption: 'A', marks: 1 },
      { id: 'q18', question: 'A boat goes 24 km downstream in 4 hrs and upstream in 6 hrs. Speed of current?', optionA: '0.5 km/h', optionB: '1 km/h', optionC: '1.5 km/h', optionD: '2 km/h', correctOption: 'B', marks: 1 },
      { id: 'q19', question: 'If the cost price of 20 articles = selling price of 16, profit %?', optionA: '20%', optionB: '25%', optionC: '30%', optionD: '15%', correctOption: 'B', marks: 1 },
      { id: 'q20', question: 'A clock shows 4:15. What is the angle between hour and minute hand?', optionA: '37.5°', optionB: '52.5°', optionC: '67.5°', optionD: '82.5°', correctOption: 'A', marks: 1 },
    ]
  },
  {
    id: 'p-logic-1', title: 'Logical Reasoning — Set 1', description: 'Series, patterns, coding-decoding and syllogisms.', category: 'Logical', duration: 15, icon: 'ri-brain-line', difficulty: 'Easy',
    questions: [
      { id: 'l1', question: 'Find the next in series: 2, 6, 12, 20, 30, ?', optionA: '40', optionB: '42', optionC: '44', optionD: '48', correctOption: 'B', marks: 1 },
      { id: 'l2', question: 'If APPLE is coded as 50, MANGO is coded as?', optionA: '55', optionB: '56', optionC: '57', optionD: '58', correctOption: 'C', marks: 1 },
      { id: 'l3', question: 'Which number replaces ?: 3, 9, 27, 81, ?', optionA: '162', optionB: '200', optionC: '243', optionD: '324', correctOption: 'C', marks: 1 },
      { id: 'l4', question: 'All cats are animals. Some animals are dogs. Conclusion: Some cats are dogs.', optionA: 'True', optionB: 'False', optionC: 'Cannot be determined', optionD: 'Partially true', correctOption: 'B', marks: 1 },
      { id: 'l5', question: 'If A = 1, B = 2, ... Z = 26, what is the value of JAVA?', optionA: '32', optionB: '34', optionC: '36', optionD: '38', correctOption: 'C', marks: 1 },
      { id: 'l6', question: 'Mirror image of EXAM at 12:00?', optionA: 'MAXE', optionB: 'EXAM', optionC: 'XAME', optionD: 'EMAX', correctOption: 'A', marks: 1 },
      { id: 'l7', question: 'Find the odd one out: 11, 13, 17, 19, 21, 23', optionA: '11', optionB: '19', optionC: '21', optionD: '23', correctOption: 'C', marks: 1 },
      { id: 'l8', question: 'Pointing to a photo, Ram says "He is the son of my father\'s only son." Who is in the photo?', optionA: 'Ram', optionB: 'Ram\'s son', optionC: 'Ram\'s father', optionD: 'Ram\'s brother', correctOption: 'B', marks: 1 },
      { id: 'l9', question: 'If 72 × 96 = 6__(fill), using cross multiplication: 7×6=42, 2×9=18 → 42,18. What system?', optionA: '4218', optionB: '6__(missing)', optionC: '6912', optionD: '4128', correctOption: 'C', marks: 1 },
      { id: 'l10', question: 'Complete the analogy: Book : Library :: Weapon : ?', optionA: 'Museum', optionB: 'Arsenal', optionC: 'Factory', optionD: 'Shop', correctOption: 'B', marks: 1 },
    ]
  },
  {
    id: 'p-logic-2', title: 'Logical Reasoning — Set 2', description: 'Seating arrangements, puzzles and critical reasoning.', category: 'Logical', duration: 20, icon: 'ri-brain-line', difficulty: 'Medium',
    questions: [
      { id: 'l11', question: 'Five people A,B,C,D,E sit in a row. A is not at end. B is to the right of A. C is at one end. Who sits in the middle?', optionA: 'A', optionB: 'B', optionC: 'D', optionD: 'Cannot determine', correctOption: 'D', marks: 1 },
      { id: 'l12', question: 'How many triangles in a figure made of 4 horizontal and 4 vertical lines forming a grid?', optionA: '8', optionB: '12', optionC: '16', optionD: '18', correctOption: 'D', marks: 1 },
      { id: 'l13', question: 'Statement: All birds can fly. Penguins are birds. Conclusion: Penguins can fly.', optionA: 'Logically valid', optionB: 'Logically invalid', optionC: 'Factually correct', optionD: 'Partially valid', correctOption: 'A', marks: 1 },
      { id: 'l14', question: 'A, B, C are three friends. A is taller than B. C is shorter than A but taller than B. Tallest?', optionA: 'A', optionB: 'B', optionC: 'C', optionD: 'Cannot determine', correctOption: 'A', marks: 1 },
      { id: 'l15', question: 'In a class, students face north. The teacher asks them to turn 90° clockwise, then 180°. Which direction do they face now?', optionA: 'North', optionB: 'South', optionC: 'East', optionD: 'West', correctOption: 'D', marks: 1 },
      { id: 'l16', question: 'If + means ×, − means ÷, × means −, ÷ means +, then 8 + 6 − 3 × 4 ÷ 2 = ?', optionA: '12', optionB: '14', optionC: '16', optionD: '18', correctOption: 'B', marks: 1 },
      { id: 'l17', question: 'In a certain code, COMPUTER is written as RFUVQNPC. How is MEDICINE written?', optionA: 'EFJDJEFM', optionB: 'MFEJDJOF', optionC: 'ENICIDME', optionD: 'FOJDJENM', correctOption: 'A', marks: 1 },
      { id: 'l18', question: 'Find missing: 1, 4, 27, 256, ?', optionA: '3025', optionB: '3125', optionC: '3225', optionD: '3250', correctOption: 'B', marks: 1 },
      { id: 'l19', question: 'If ROSE is coded as 6821, CHAIR is coded as 73456, then SEARCH is coded as?', optionA: '214673', optionB: '214637', optionC: '214367', optionD: '216437', correctOption: 'A', marks: 1 },
      { id: 'l20', question: 'A is B\'s sister. C is B\'s mother. D is C\'s father. E is D\'s mother. How is A related to D?', optionA: 'Grandmother', optionB: 'Grandfather', optionC: 'Granddaughter', optionD: 'Daughter', correctOption: 'C', marks: 1 },
    ]
  },
  {
    id: 'p-verbal-1', title: 'Verbal Ability — Set 1', description: 'Grammar, vocabulary, comprehension and sentence correction.', category: 'Verbal', duration: 15, icon: 'ri-book-open-line', difficulty: 'Easy',
    questions: [
      { id: 'v1', question: 'Choose the correct synonym for "BENEVOLENT":', optionA: 'Hostile', optionB: 'Kind', optionC: 'Lazy', optionD: 'Strict', correctOption: 'B', marks: 1 },
      { id: 'v2', question: 'Antonym of "EPHEMERAL":', optionA: 'Permanent', optionB: 'Brief', optionC: 'Fragile', optionD: 'Ethereal', correctOption: 'A', marks: 1 },
      { id: 'v3', question: 'Fill the blank: "He is too honest ___ accept a bribe."', optionA: 'for', optionB: 'that', optionC: 'to', optionD: 'with', correctOption: 'C', marks: 1 },
      { id: 'v4', question: 'Spot the error: "Each of the boys have completed their work."', optionA: 'Each of', optionB: 'the boys', optionC: 'have completed', optionD: 'their work', correctOption: 'C', marks: 1 },
      { id: 'v5', question: '"To burn the midnight oil" means:', optionA: 'Waste resources', optionB: 'Study/work late', optionC: 'Start a fire', optionD: 'Be angry', correctOption: 'B', marks: 1 },
      { id: 'v6', question: 'Choose the correctly spelt word:', optionA: 'Occurence', optionB: 'Ocurrence', optionC: 'Occurrence', optionD: 'Occurance', correctOption: 'C', marks: 1 },
      { id: 'v7', question: 'One word for "one who knows everything":', optionA: 'Omnipresent', optionB: 'Omniscient', optionC: 'Omnipotent', optionD: 'Omnivorous', correctOption: 'B', marks: 1 },
      { id: 'v8', question: '"A stitch in time saves nine." This means:', optionA: 'Sewing is important', optionB: 'Time is money', optionC: 'Act early to prevent bigger problems', optionD: 'Nine is a lucky number', correctOption: 'C', marks: 1 },
      { id: 'v9', question: 'Active to Passive: "The cat chased the mouse."', optionA: 'The mouse is chased by the cat', optionB: 'The mouse was chased by the cat', optionC: 'The mouse had been chased by the cat', optionD: 'The mouse has been chased by the cat', correctOption: 'B', marks: 1 },
      { id: 'v10', question: 'Choose correct preposition: "She is good ___ mathematics."', optionA: 'in', optionB: 'at', optionC: 'on', optionD: 'with', correctOption: 'B', marks: 1 },
    ]
  },
  {
    id: 'p-verbal-2', title: 'Verbal Ability — Set 2', description: 'Reading comprehension, para jumbles and critical reasoning.', category: 'Verbal', duration: 20, icon: 'ri-book-open-line', difficulty: 'Medium',
    questions: [
      { id: 'v11', question: 'Choose the best word: "The manager was ___ about the delay in delivery."', optionA: 'apathetic', optionB: 'furious', optionC: 'elated', optionD: 'indifferent', correctOption: 'B', marks: 1 },
      { id: 'v12', question: 'Which sentence is grammatically correct?', optionA: 'Neither the teacher nor the students was present', optionB: 'Neither the teacher nor the students were present', optionC: 'Neither the teacher nor the students is present', optionD: 'Neither the teacher nor student were present', correctOption: 'B', marks: 1 },
      { id: 'v13', question: '"Procrastination" most closely means:', optionA: 'Anticipation', optionB: 'Acceleration', optionC: 'Postponement', optionD: 'Punctuality', correctOption: 'C', marks: 1 },
      { id: 'v14', question: 'Indirect speech: He said, "I am going to the market."', optionA: 'He said that he is going to the market', optionB: 'He said that he was going to the market', optionC: 'He said that he had been going to the market', optionD: 'He said that he goes to the market', correctOption: 'B', marks: 1 },
      { id: 'v15', question: '"To hit the nail on the head" means:', optionA: 'To do carpentry', optionB: 'To be exactly right', optionC: 'To hurt someone', optionD: 'To make a mistake', correctOption: 'B', marks: 1 },
      { id: 'v16', question: 'The plural of "criterion" is:', optionA: 'Criterions', optionB: 'Criterias', optionC: 'Criteria', optionD: 'Criteriae', correctOption: 'C', marks: 1 },
      { id: 'v17', question: 'Which is the correct sentence?', optionA: 'The data shows improvement', optionB: 'The data show improvement', optionC: 'The datas show improvement', optionD: 'The datum shows improvement', correctOption: 'B', marks: 1 },
      { id: 'v18', question: '"Ubiquitous" means:', optionA: 'Rare', optionB: 'Present everywhere', optionC: 'Unknown', optionD: 'Dangerous', correctOption: 'B', marks: 1 },
      { id: 'v19', question: 'Choose the word most similar to "CANDID":', optionA: 'Secretive', optionB: 'Diplomatic', optionC: 'Frank', optionD: 'Sweet', correctOption: 'C', marks: 1 },
      { id: 'v20', question: '"A dime a dozen" means something that is:', optionA: 'Expensive', optionB: 'Very common', optionC: 'Worth exactly 12 cents', optionD: 'Dirty', correctOption: 'B', marks: 1 },
    ]
  },
  {
    id: 'p-cs-1', title: 'Computer Science Fundamentals', description: 'OS, networking, DBMS and programming basics.', category: 'Technical', duration: 20, icon: 'ri-computer-line', difficulty: 'Medium',
    questions: [
      { id: 'c1', question: 'Which data structure uses FIFO?', optionA: 'Stack', optionB: 'Queue', optionC: 'Tree', optionD: 'Graph', correctOption: 'B', marks: 1 },
      { id: 'c2', question: 'Time complexity of binary search?', optionA: 'O(n)', optionB: 'O(n²)', optionC: 'O(log n)', optionD: 'O(1)', correctOption: 'C', marks: 1 },
      { id: 'c3', question: 'Which sorting algorithm has best average case?', optionA: 'Bubble Sort', optionB: 'Selection Sort', optionC: 'Merge Sort', optionD: 'Insertion Sort', correctOption: 'C', marks: 1 },
      { id: 'c4', question: 'Primary key in DBMS must be:', optionA: 'Null', optionB: 'Duplicate', optionC: 'Unique and not null', optionD: 'Foreign', correctOption: 'C', marks: 1 },
      { id: 'c5', question: 'OSI model has how many layers?', optionA: '4', optionB: '5', optionC: '6', optionD: '7', correctOption: 'D', marks: 1 },
      { id: 'c6', question: 'Which is NOT an operating system?', optionA: 'Linux', optionB: 'Oracle', optionC: 'Windows', optionD: 'macOS', correctOption: 'B', marks: 1 },
      { id: 'c7', question: 'What does SQL stand for?', optionA: 'Structured Query Language', optionB: 'Sequential Query Language', optionC: 'Simple Query Language', optionD: 'Standard Query Logic', correctOption: 'A', marks: 1 },
      { id: 'c8', question: 'What is the worst-case time complexity of Quick Sort?', optionA: 'O(n)', optionB: 'O(n log n)', optionC: 'O(n²)', optionD: 'O(log n)', correctOption: 'C', marks: 1 },
      { id: 'c9', question: 'In which normal form is a table if it has no partial dependencies?', optionA: '1NF', optionB: '2NF', optionC: '3NF', optionD: 'BCNF', correctOption: 'B', marks: 1 },
      { id: 'c10', question: 'TCP is a ___ protocol.', optionA: 'Connectionless', optionB: 'Connection-oriented', optionC: 'Stateless', optionD: 'Broadcast', correctOption: 'B', marks: 1 },
    ]
  },
  {
    id: 'p-data-1', title: 'Data Interpretation', description: 'Tables, charts, percentages and data analysis.', category: 'Data', duration: 20, icon: 'ri-pie-chart-line', difficulty: 'Hard',
    questions: [
      { id: 'd1', question: 'Company revenue: Q1=200, Q2=250, Q3=300, Q4=350. % growth from Q1 to Q4?', optionA: '50%', optionB: '60%', optionC: '75%', optionD: '87.5%', correctOption: 'C', marks: 1 },
      { id: 'd2', question: 'In a class: 40% chose Physics, 35% Chemistry, rest Biology. If 200 students, how many chose Biology?', optionA: '40', optionB: '45', optionC: '50', optionD: '55', correctOption: 'C', marks: 1 },
      { id: 'd3', question: 'Population: 2020=10000, 2021=11000, 2022=12100. What is the annual growth rate?', optionA: '5%', optionB: '8%', optionC: '10%', optionD: '12%', correctOption: 'C', marks: 1 },
      { id: 'd4', question: 'Sales in 5 months: 120, 150, 130, 160, 140. What is the median?', optionA: '130', optionB: '140', optionC: '150', optionD: '160', correctOption: 'B', marks: 1 },
      { id: 'd5', question: 'If ratio of A:B:C spending is 3:4:5 and total is ₹24,000, how much is B?', optionA: '₹6,000', optionB: '₹8,000', optionC: '₹10,000', optionD: '₹12,000', correctOption: 'B', marks: 1 },
      { id: 'd6', question: 'Export in 2020 = 500 Cr, Import = 700 Cr. Trade deficit as % of exports?', optionA: '28.5%', optionB: '40%', optionC: '50%', optionD: '71.4%', correctOption: 'B', marks: 1 },
      { id: 'd7', question: 'Productivity increased from 80 to 100 units/day. % increase?', optionA: '20%', optionB: '25%', optionC: '30%', optionD: '80%', correctOption: 'B', marks: 1 },
      { id: 'd8', question: 'If A scores 480/600 and B scores 380/500, who has higher percentage?', optionA: 'A (80%)', optionB: 'B (76%)', optionC: 'Same', optionD: 'Cannot determine', correctOption: 'A', marks: 1 },
      { id: 'd9', question: 'Expenses: Rent=30%, Food=25%, Transport=15%, Savings=20%, Others=10%. On ₹50,000 salary, savings?', optionA: '₹8,000', optionB: '₹10,000', optionC: '₹12,000', optionD: '₹15,000', correctOption: 'B', marks: 1 },
      { id: 'd10', question: 'Average of 5 numbers is 42. If one number (30) is removed, new average?', optionA: '43', optionB: '44', optionC: '45', optionD: '46', correctOption: 'C', marks: 1 },
    ]
  },
];

const CATEGORIES = ['All', 'Quantitative', 'Logical', 'Verbal', 'Technical', 'Data'];
const CAT_ICONS = { Quantitative: 'ri-calculator-line', Logical: 'ri-brain-line', Verbal: 'ri-book-open-line', Technical: 'ri-computer-line', Data: 'ri-pie-chart-line' };
const CAT_COLORS = { Quantitative: 'from-blue-500 to-indigo-500', Logical: 'from-violet-500 to-purple-500', Verbal: 'from-emerald-500 to-green-500', Technical: 'from-orange-500 to-red-500', Data: 'from-amber-500 to-yellow-500' };
const DIFF_CLR = { Easy: 'bg-green-500/10 text-green-400', Medium: 'bg-amber-500/10 text-amber-400', Hard: 'bg-red-500/10 text-red-400' };

// ════════════════════════════════════════════════════════════════
//                       MAIN COMPONENT
// ════════════════════════════════════════════════════════════════
const AptitudeTests = () => {
  const [dbTests, setDbTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTest, setActiveTest] = useState(null);
  const [attemptId, setAttemptId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [isPractice, setIsPractice] = useState(false);
  const [category, setCategory] = useState('All');
  const [currentQ, setCurrentQ] = useState(0);
  const [showResult, setShowResult] = useState(null);
  const [practiceHistory, setPracticeHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sowberry_aptitude_history') || '{}'); } catch { return {}; }
  });

  useEffect(() => { localStorage.setItem('sowberry_aptitude_history', JSON.stringify(practiceHistory)); }, [practiceHistory]);

  useEffect(() => {
    const fetchTests = async () => {
      const res = await studentApi.getAptitudeTests();
      if (res.success) setDbTests(res.tests || []);
      setLoading(false);
    };
    fetchTests();
  }, []);

  useEffect(() => {
    if (!activeTest || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(t => { if (t <= 1) { clearInterval(timer); handleAutoSubmit(); return 0; } return t - 1; }), 1000);
    return () => clearInterval(timer);
  }, [activeTest, timeLeft]);

  // ─── START DB TEST ────
  const startDbTest = async (testId) => {
    const res = await studentApi.startAptitudeTest(testId);
    if (res.success) {
      setActiveTest({ ...res.test, questions: res.questions || [] });
      setAttemptId(res.attemptId);
      setAnswers({}); setCurrentQ(0); setIsPractice(false);
      setTimeLeft((res.test.duration || 30) * 60);
    } else Swal.fire({ ...getSwalOpts(), icon: 'error', title: 'Error', text: res.message });
  };

  // ─── START PRACTICE TEST ────
  const startPracticeTest = (pt) => {
    setActiveTest({ title: pt.title, questions: pt.questions, duration: pt.duration });
    setAttemptId(pt.id);
    setAnswers({}); setCurrentQ(0); setIsPractice(true); setShowResult(null);
    setTimeLeft(pt.duration * 60);
  };

  // ─── SUBMIT ────
  const handleAutoSubmit = () => submitTest(true);

  const submitTest = async (auto = false) => {
    if (!auto) {
      const confirm = await Swal.fire({ ...getSwalOpts(), title: 'Submit Test?', text: 'You cannot change answers after submission.', icon: 'question', showCancelButton: true, confirmButtonText: 'Submit', cancelButtonColor: '#333' });
      if (!confirm.isConfirmed) return;
    }

    if (isPractice) {
      const qs = activeTest.questions || [];
      let score = 0, total = 0;
      qs.forEach(q => {
        total += (q.marks || 1);
        if (answers[q.id] === q.correctOption) score += (q.marks || 1);
      });
      const result = { score, total, answered: Object.keys(answers).length, questions: qs.length, date: new Date().toISOString() };
      setPracticeHistory(prev => ({ ...prev, [attemptId]: [...(prev[attemptId] || []), result] }));
      setShowResult(result);
      setTimeLeft(0);
      Swal.fire({ ...getSwalOpts(), icon: score >= total * 0.7 ? 'success' : score >= total * 0.4 ? 'info' : 'warning', title: auto ? "Time's Up!" : 'Test Submitted!', text: `Score: ${score}/${total} (${Math.round(score / total * 100)}%)` });
      return;
    }

    setSubmitting(true);
    const answersArray = Object.entries(answers).map(([questionId, selectedOption]) => ({ questionId: Number(questionId), selectedOption }));
    const res = await studentApi.submitAptitudeTest(attemptId, { answers: answersArray });
    setSubmitting(false);
    if (res.success) {
      Swal.fire({ ...getSwalOpts(), icon: 'success', title: auto ? "Time's Up!" : 'Submitted!', text: `Score: ${res.score || 0}/${res.totalMarks || 0}` });
      setActiveTest(null); setAttemptId(null);
    } else Swal.fire({ ...getSwalOpts(), icon: 'error', title: 'Error', text: res.message });
  };

  const goBack = () => { setActiveTest(null); setAttemptId(null); setShowResult(null); setIsPractice(false); };

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  // ─── All tests combined ────
  const allTests = [
    ...dbTests.map(t => ({ ...t, source: 'db' })),
    ...PRACTICE_TESTS.map(t => ({ ...t, totalQuestions: t.questions.length, totalMarks: t.questions.reduce((s, q) => s + (q.marks || 1), 0), source: 'practice' })),
  ];
  const filteredTests = category === 'All' ? allTests : allTests.filter(t => t.category === category);

  // ════════════════════════════════════════════════════
  //               RESULT VIEW
  // ════════════════════════════════════════════════════
  if (showResult && activeTest) {
    const qs = activeTest.questions || [];
    return (
      <DashboardLayout pageTitle="Test Results" role="student">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800 dark-theme:text-gray-100">{activeTest.title} — Results</h1>
            <button onClick={goBack} className="px-4 py-2 rounded-xl bg-cream dark-theme:bg-gray-800 border border-sand dark-theme:border-gray-700 text-gray-500 dark-theme:text-gray-400 text-sm hover:bg-cream-dark dark-theme:hover:bg-gray-700 transition-colors"><i className="ri-arrow-left-line mr-1"></i>Back</button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Score', value: `${showResult.score}/${showResult.total}`, icon: 'ri-medal-line', color: showResult.score >= showResult.total * 0.7 ? 'text-green-400' : 'text-amber-400' },
              { label: 'Percentage', value: `${Math.round(showResult.score / showResult.total * 100)}%`, icon: 'ri-percent-line', color: 'text-primary' },
              { label: 'Answered', value: `${showResult.answered}/${showResult.questions}`, icon: 'ri-checkbox-circle-line', color: 'text-blue-400' },
              { label: 'Skipped', value: `${showResult.questions - showResult.answered}`, icon: 'ri-skip-forward-line', color: 'text-gray-500 dark-theme:text-gray-400' },
            ].map((s, i) => (
              <div key={i} className="bg-white dark-theme:bg-gray-900 rounded-2xl p-4 border border-sand dark-theme:border-gray-800 text-center">
                <i className={`${s.icon} text-xl ${s.color} block mb-1`}></i>
                <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-gray-500 dark-theme:text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-500 dark-theme:text-gray-500">Review Answers</h2>
            {qs.map((q, idx) => {
              const userAns = answers[q.id];
              const correct = userAns === q.correctOption;
              return (
                <div key={q.id} className={`bg-white dark-theme:bg-gray-900 rounded-2xl p-5 border ${correct ? 'border-green-500/30' : userAns ? 'border-red-500/30' : 'border-sand dark-theme:border-gray-800'}`}>
                  <div className="flex items-start gap-3 mb-3">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${correct ? 'bg-green-500/15 text-green-400' : userAns ? 'bg-red-500/15 text-red-400' : 'bg-cream-dark dark-theme:bg-gray-800 text-gray-500 dark-theme:text-gray-400'}`}>{idx + 1}</span>
                    <p className="text-sm text-gray-800 dark-theme:text-gray-100 font-medium">{q.question}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-10">
                    {['A', 'B', 'C', 'D'].map(opt => {
                      const isCorrect = opt === q.correctOption;
                      const isUser = opt === userAns;
                      return (
                        <div key={opt} className={`p-3 rounded-xl text-xs border transition-all ${isCorrect ? 'border-green-500 bg-green-500/10 text-green-400 font-medium' : isUser ? 'border-red-500 bg-red-500/10 text-red-400' : 'border-sand dark-theme:border-gray-800 text-gray-500 dark-theme:text-gray-500'}`}>
                          <span className="font-bold mr-2">{opt}.</span>{q[`option${opt}`]}
                          {isCorrect && <i className="ri-check-line ml-2 text-green-400"></i>}
                          {isUser && !isCorrect && <i className="ri-close-line ml-2 text-red-400"></i>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ════════════════════════════════════════════════════
  //               ACTIVE TEST VIEW
  // ════════════════════════════════════════════════════
  if (activeTest) {
    const questions = activeTest.questions || [];
    const q = questions[currentQ];
    return (
      <DashboardLayout pageTitle="Aptitude Test" role="student">
        <div className="space-y-4">
          {/* Header bar */}
          <div className="bg-white dark-theme:bg-gray-900 rounded-2xl p-4 border border-sand dark-theme:border-gray-800 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-gray-800 dark-theme:text-gray-100 text-sm">{activeTest.title}</h2>
                <p className="text-[11px] text-gray-500 dark-theme:text-gray-400">{Object.keys(answers).length}/{questions.length} answered</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-lg font-mono font-bold ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-primary'}`}><i className="ri-time-line mr-1"></i>{formatTime(timeLeft)}</span>
                <button onClick={() => submitTest()} disabled={submitting} className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-dark disabled:opacity-50 transition-colors">{submitting ? 'Submitting...' : 'Submit'}</button>
              </div>
            </div>
            {/* Question navigation pills */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {questions.map((_, idx) => (
                <button key={idx} onClick={() => setCurrentQ(idx)} className={`w-7 h-7 rounded-lg text-[10px] font-bold transition-colors ${currentQ === idx ? 'bg-primary text-white' : answers[questions[idx].id] !== undefined ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-cream dark-theme:bg-gray-800 text-gray-500 dark-theme:text-gray-400 border border-sand dark-theme:border-gray-700'}`}>{idx + 1}</button>
              ))}
            </div>
          </div>

          {/* Current question */}
          {q && (
            <div className="bg-white dark-theme:bg-gray-900 rounded-2xl p-6 border border-sand dark-theme:border-gray-800">
              <div className="flex items-start gap-3 mb-4">
                <span className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">{currentQ + 1}</span>
                <p className="text-gray-800 dark-theme:text-gray-100 font-medium leading-relaxed">{q.question}</p>
              </div>
              <div className="grid grid-cols-1 gap-2.5 ml-11">
                {['A', 'B', 'C', 'D'].map(opt => (
                  <button key={opt} onClick={() => setAnswers({ ...answers, [q.id]: opt })} className={`p-4 rounded-xl text-sm text-left transition-all border ${answers[q.id] === opt ? 'border-primary bg-primary/10 text-primary font-medium' : 'border-sand dark-theme:border-gray-800 text-gray-500 dark-theme:text-gray-400 hover:border-gray-400 dark-theme:hover:border-gray-600 hover:text-gray-800 dark-theme:hover:text-gray-100'}`}>
                    <span className="font-bold mr-3 text-xs opacity-60">{opt}.</span>{q[`option${opt}`]}
                  </button>
                ))}
              </div>
              <p className="ml-11 mt-3 text-[10px] text-gray-400 dark-theme:text-gray-500">{q.marks || 1} mark{(q.marks || 1) > 1 ? 's' : ''}</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button onClick={() => setCurrentQ(c => Math.max(0, c - 1))} disabled={currentQ === 0} className="px-4 py-2 rounded-xl bg-cream dark-theme:bg-gray-800 border border-sand dark-theme:border-gray-700 text-gray-500 dark-theme:text-gray-400 text-xs font-medium hover:bg-cream-dark dark-theme:hover:bg-gray-700 disabled:opacity-30 transition-colors"><i className="ri-arrow-left-line mr-1"></i>Previous</button>
            <span className="text-xs text-gray-400 dark-theme:text-gray-500">{currentQ + 1} of {questions.length}</span>
            <button onClick={() => setCurrentQ(c => Math.min(questions.length - 1, c + 1))} disabled={currentQ >= questions.length - 1} className="px-4 py-2 rounded-xl bg-cream dark-theme:bg-gray-800 border border-sand dark-theme:border-gray-700 text-gray-500 dark-theme:text-gray-400 text-xs font-medium hover:bg-cream-dark dark-theme:hover:bg-gray-700 disabled:opacity-30 transition-colors">Next<i className="ri-arrow-right-line ml-1"></i></button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ════════════════════════════════════════════════════
  //               TEST LISTING VIEW
  // ════════════════════════════════════════════════════
  return (
    <DashboardLayout pageTitle="Aptitude Tests" role="student">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark-theme:text-gray-100">Aptitude Tests</h1>
            <p className="text-sm text-gray-500 dark-theme:text-gray-400 mt-1">{allTests.length} tests available across {CATEGORIES.length - 1} categories</p>
          </div>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)} className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors ${category === c ? 'bg-primary text-white' : 'bg-cream dark-theme:bg-gray-800 text-gray-500 dark-theme:text-gray-500 border border-sand dark-theme:border-gray-700 hover:border-gray-400 dark-theme:hover:border-gray-600'}`}>
              {c !== 'All' && <i className={`${CAT_ICONS[c]} mr-1`}></i>}{c}
            </button>
          ))}
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total Tests', value: allTests.length, icon: 'ri-file-list-3-line', color: 'text-primary' },
            { label: 'Questions', value: allTests.reduce((s, t) => s + (t.totalQuestions || t.questions?.length || 0), 0), icon: 'ri-question-line', color: 'text-blue-400' },
            { label: 'Attempted', value: Object.keys(practiceHistory).length, icon: 'ri-check-double-line', color: 'text-green-400' },
            { label: 'Categories', value: CATEGORIES.length - 1, icon: 'ri-folder-line', color: 'text-violet-400' },
          ].map((s, i) => (
            <div key={i} className="bg-white dark-theme:bg-gray-900 rounded-2xl p-4 border border-sand dark-theme:border-gray-800 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-cream dark-theme:bg-gray-800 flex items-center justify-center ${s.color}`}><i className={`${s.icon} text-lg`}></i></div>
              <div><p className="text-lg font-bold text-gray-800 dark-theme:text-gray-100">{s.value}</p><p className="text-[10px] text-gray-500 dark-theme:text-gray-400">{s.label}</p></div>
            </div>
          ))}
        </div>

        {loading ? <div className="flex justify-center py-20"><div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div></div> :
        filteredTests.length === 0 ? <div className="text-center py-20 text-gray-400 dark-theme:text-gray-500"><i className="ri-question-answer-line text-4xl mb-3 block"></i><p>No tests in this category</p></div> :
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTests.map(t => {
            const history = practiceHistory[t.id];
            const bestScore = history ? Math.max(...history.map(h => Math.round(h.score / h.total * 100))) : null;
            return (
              <div key={t.id} className="bg-white dark-theme:bg-gray-900 rounded-2xl border border-sand dark-theme:border-gray-800 overflow-hidden hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all group">
                <div className={`h-1.5 bg-gradient-to-r ${CAT_COLORS[t.category] || 'from-gray-500 to-gray-600'}`}></div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${CAT_COLORS[t.category] || 'from-gray-500 to-gray-600'} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <i className={`${t.icon || CAT_ICONS[t.category] || 'ri-question-answer-line'} text-white text-lg`}></i>
                    </div>
                    <div className="flex items-center gap-2">
                      {t.difficulty && <span className={`text-[10px] font-medium px-2 py-1 rounded-full ${DIFF_CLR[t.difficulty] || ''}`}>{t.difficulty}</span>}
                      {t.source === 'practice' && <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-violet-500/10 text-violet-400">Practice</span>}
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-800 dark-theme:text-gray-100 text-sm mb-1">{t.title}</h3>
                  <p className="text-[11px] text-gray-500 dark-theme:text-gray-400 line-clamp-2 mb-3">{t.description}</p>
                  <div className="flex items-center gap-3 text-[11px] text-gray-400 dark-theme:text-gray-500 mb-4">
                    <span><i className="ri-time-line mr-0.5"></i>{t.duration} min</span>
                    <span><i className="ri-file-list-line mr-0.5"></i>{t.totalQuestions || t.questions?.length} Q</span>
                    <span><i className="ri-medal-line mr-0.5"></i>{t.totalMarks || t.questions?.reduce((s, q) => s + (q.marks || 1), 0)} marks</span>
                  </div>
                  {bestScore !== null && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className="text-gray-500 dark-theme:text-gray-400">Best Score</span>
                        <span className={bestScore >= 70 ? 'text-green-400' : 'text-amber-400'}>{bestScore}%</span>
                      </div>
                      <div className="h-1.5 bg-cream dark-theme:bg-gray-800 rounded-full"><div className={`h-full rounded-full ${bestScore >= 70 ? 'bg-green-500' : 'bg-amber-500'}`} style={{ width: `${bestScore}%` }}></div></div>
                    </div>
                  )}
                  <button onClick={() => t.source === 'practice' ? startPracticeTest(t) : startDbTest(t.id)} className="w-full py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-colors">
                    <i className="ri-play-line mr-1"></i>{bestScore !== null ? 'Retake' : 'Start Test'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>}
      </div>
    </DashboardLayout>
  );
};

export default AptitudeTests;
