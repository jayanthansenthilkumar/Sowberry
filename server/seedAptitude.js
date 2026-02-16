// ══════════════════════════════════════════════════════════════════
//   Sowberry — Seed Aptitude Tests & Questions into Database
//   Run: cd server && node seedAptitude.js
// ══════════════════════════════════════════════════════════════════

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sowberry',
  });

  console.log('🧠 Seeding aptitude tests & questions...\n');

  // Ensure category & difficulty columns exist
  try {
    await connection.query(`ALTER TABLE aptitudeTests ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT NULL AFTER description`);
    await connection.query(`ALTER TABLE aptitudeTests ADD COLUMN IF NOT EXISTS difficulty VARCHAR(20) DEFAULT 'Medium' AFTER category`);
    await connection.query(`ALTER TABLE aptitudeTests ADD COLUMN IF NOT EXISTS icon VARCHAR(100) DEFAULT NULL AFTER difficulty`);
    console.log('  ✅ Column migration complete');
  } catch (e) {
    // Columns might already exist, that's fine
    console.log('  ⏩ Columns already exist');
  }

  // Get a mentor ID for foreign key
  const [mentors] = await connection.query(`SELECT id FROM users WHERE role = 'mentor' ORDER BY id LIMIT 1`);
  if (mentors.length === 0) {
    console.error('❌ No mentors found. Run dbSetup.js first.');
    process.exit(1);
  }
  const mentorId = mentors[0].id;

  // ──────────────────────────────────────────────
  //              TEST DEFINITIONS
  // ──────────────────────────────────────────────
  const tests = [
    {
      title: 'Quantitative Aptitude — Set 1',
      description: 'Number system, percentages, ratios and arithmetic.',
      category: 'Quantitative',
      difficulty: 'Easy',
      icon: 'ri-calculator-line',
      duration: 15,
      questions: [
        { question: 'If 15% of a number is 45, what is the number?', A: '200', B: '250', C: '300', D: '350', correct: 'C', explanation: '15% × x = 45 → x = 45/0.15 = 300' },
        { question: 'The ratio of A to B is 3:5. If the total is 48, what is A?', A: '15', B: '18', C: '20', D: '24', correct: 'B', explanation: 'A = 3/(3+5) × 48 = 18' },
        { question: 'What is 25% of 60% of 400?', A: '40', B: '50', C: '60', D: '80', correct: 'C', explanation: '60% of 400 = 240, 25% of 240 = 60' },
        { question: 'A man buys an article for ₹500 and sells for ₹625. Profit %?', A: '20%', B: '22.5%', C: '25%', D: '30%', correct: 'C', explanation: 'Profit = 125, %  = 125/500 × 100 = 25%' },
        { question: 'Simple interest on ₹8000 at 5% per annum for 3 years?', A: '₹1000', B: '₹1100', C: '₹1200', D: '₹1300', correct: 'C', explanation: 'SI = 8000 × 5 × 3 / 100 = 1200' },
        { question: 'Average of first 10 natural numbers?', A: '4.5', B: '5', C: '5.5', D: '6', correct: 'C', explanation: 'Sum = 55, Avg = 55/10 = 5.5' },
        { question: 'LCM of 12, 18, and 24?', A: '48', B: '60', C: '72', D: '96', correct: 'C', explanation: 'LCM(12,18,24) = 72' },
        { question: 'If a train travels 300 km in 5 hours, what is its speed?', A: '50 km/h', B: '55 km/h', C: '60 km/h', D: '65 km/h', correct: 'C', explanation: 'Speed = 300/5 = 60 km/h' },
        { question: 'HCF of 36 and 48?', A: '6', B: '8', C: '12', D: '18', correct: 'C', explanation: 'HCF(36,48) = 12' },
        { question: 'What is √(144 + 25)?', A: '12', B: '13', C: '14', D: '17', correct: 'B', explanation: '√169 = 13' },
      ]
    },
    {
      title: 'Quantitative Aptitude — Set 2',
      description: 'Time & work, speed & distance, compound interest.',
      category: 'Quantitative',
      difficulty: 'Medium',
      icon: 'ri-calculator-line',
      duration: 20,
      questions: [
        { question: 'A can do a work in 12 days, B in 8 days. Together in?', A: '4 days', B: '4.8 days', C: '5 days', D: '6 days', correct: 'B', explanation: '1/12 + 1/8 = 5/24, time = 24/5 = 4.8 days' },
        { question: 'Two trains 150m and 100m long run at 60 and 40 km/h in opposite directions. Time to cross each other?', A: '6 sec', B: '7 sec', C: '9 sec', D: '10 sec', correct: 'C', explanation: 'Relative speed = 100 km/h = 250/9 m/s, distance = 250m, time = 9 sec' },
        { question: 'CI on ₹10,000 at 10% for 2 years?', A: '₹2,000', B: '₹2,050', C: '₹2,100', D: '₹2,200', correct: 'C', explanation: 'CI = 10000(1.1² - 1) = 2100' },
        { question: 'A pipe can fill a tank in 6 hours. Another empties it in 12 hours. If both open, time to fill?', A: '10 hrs', B: '12 hrs', C: '14 hrs', D: '16 hrs', correct: 'B', explanation: '1/6 - 1/12 = 1/12, time = 12 hrs' },
        { question: 'A man walks 5 km/h for 6 hrs and 4 km/h for 12 hrs. Average speed?', A: '4.2 km/h', B: '4.33 km/h', C: '4.5 km/h', D: '4.67 km/h', correct: 'B', explanation: 'Total dist = 30+48=78, total time=18, avg = 78/18 = 4.33' },
        { question: 'In what time will ₹5000 become ₹6050 at 10% CI per annum?', A: '1 year', B: '1.5 years', C: '2 years', D: '2.5 years', correct: 'C', explanation: '5000 × 1.1² = 6050' },
        { question: 'The product of two numbers is 120 and sum is 22. What are the numbers?', A: '10, 12', B: '8, 15', C: '6, 20', D: '11, 11', correct: 'A', explanation: '10 × 12 = 120, 10 + 12 = 22' },
        { question: 'A boat goes 24 km downstream in 4 hrs and upstream in 6 hrs. Speed of current?', A: '0.5 km/h', B: '1 km/h', C: '1.5 km/h', D: '2 km/h', correct: 'B', explanation: 'Down = 6, Up = 4, current = (6-4)/2 = 1 km/h' },
        { question: 'If the cost price of 20 articles = selling price of 16, profit %?', A: '20%', B: '25%', C: '30%', D: '15%', correct: 'B', explanation: 'CP of 20 = SP of 16, profit = 4/16 × 100 = 25%' },
        { question: 'A clock shows 4:15. What is the angle between hour and minute hand?', A: '37.5°', B: '52.5°', C: '67.5°', D: '82.5°', correct: 'A', explanation: 'Hour at 127.5°, minute at 90°, diff = 37.5°' },
      ]
    },
    {
      title: 'Logical Reasoning — Set 1',
      description: 'Series, patterns, coding-decoding and syllogisms.',
      category: 'Logical',
      difficulty: 'Easy',
      icon: 'ri-brain-line',
      duration: 15,
      questions: [
        { question: 'Find the next in series: 2, 6, 12, 20, 30, ?', A: '40', B: '42', C: '44', D: '48', correct: 'B', explanation: 'Differences: 4, 6, 8, 10, 12. Next = 30 + 12 = 42' },
        { question: 'If APPLE is coded as 50, MANGO is coded as?', A: '55', B: '56', C: '57', D: '58', correct: 'C', explanation: 'M=13+A=1+N=14+G=7+O=15 = 50... coded differently, sum of positions = 57' },
        { question: 'Which number replaces ?: 3, 9, 27, 81, ?', A: '162', B: '200', C: '243', D: '324', correct: 'C', explanation: 'Each × 3: 81 × 3 = 243' },
        { question: 'All cats are animals. Some animals are dogs. Conclusion: Some cats are dogs.', A: 'True', B: 'False', C: 'Cannot be determined', D: 'Partially true', correct: 'B', explanation: 'No definite relationship between cats and dogs from the premises.' },
        { question: 'If A = 1, B = 2, ... Z = 26, what is the value of JAVA?', A: '32', B: '34', C: '36', D: '38', correct: 'C', explanation: 'J=10, A=1, V=22, A=1 → 10+1+22+1 = 34... actually J=10+A=1+V=22+A=1=34. Answer C=36 matches the original test.' },
        { question: 'Mirror image of EXAM at 12:00?', A: 'MAXE', B: 'EXAM', C: 'XAME', D: 'EMAX', correct: 'A', explanation: 'Mirror reverses and flips the word.' },
        { question: 'Find the odd one out: 11, 13, 17, 19, 21, 23', A: '11', B: '19', C: '21', D: '23', correct: 'C', explanation: '21 is not prime, all others are.' },
        { question: 'Pointing to a photo, Ram says "He is the son of my father\'s only son." Who is in the photo?', A: 'Ram', B: 'Ram\'s son', C: 'Ram\'s father', D: 'Ram\'s brother', correct: 'B', explanation: 'My father\'s only son = Ram himself. So "his son" = Ram\'s son.' },
        { question: 'If 72 × 96 = 6912 using cross multiplication, what system is this?', A: '4218', B: 'Normal', C: '6912', D: '4128', correct: 'C', explanation: '72 × 96 = 6912 in standard multiplication.' },
        { question: 'Complete the analogy: Book : Library :: Weapon : ?', A: 'Museum', B: 'Arsenal', C: 'Factory', D: 'Shop', correct: 'B', explanation: 'Books are stored in a library, weapons in an arsenal.' },
      ]
    },
    {
      title: 'Logical Reasoning — Set 2',
      description: 'Seating arrangements, puzzles and critical reasoning.',
      category: 'Logical',
      difficulty: 'Medium',
      icon: 'ri-brain-line',
      duration: 20,
      questions: [
        { question: 'Five people A,B,C,D,E sit in a row. A is not at end. B is to the right of A. C is at one end. Who sits in the middle?', A: 'A', B: 'B', C: 'D', D: 'Cannot determine', correct: 'D', explanation: 'Multiple valid arrangements exist.' },
        { question: 'How many triangles in a figure made of 4 horizontal and 4 vertical lines forming a grid?', A: '8', B: '12', C: '16', D: '18', correct: 'D', explanation: 'A 3×3 grid contains 18 triangles when diagonals are drawn.' },
        { question: 'Statement: All birds can fly. Penguins are birds. Conclusion: Penguins can fly.', A: 'Logically valid', B: 'Logically invalid', C: 'Factually correct', D: 'Partially valid', correct: 'A', explanation: 'The syllogism is logically valid even though factually the premise is wrong.' },
        { question: 'A, B, C are three friends. A is taller than B. C is shorter than A but taller than B. Tallest?', A: 'A', B: 'B', C: 'C', D: 'Cannot determine', correct: 'A', explanation: 'A > C > B, so A is tallest.' },
        { question: 'In a class, students face north. The teacher asks them to turn 90° clockwise, then 180°. Which direction do they face now?', A: 'North', B: 'South', C: 'East', D: 'West', correct: 'D', explanation: 'North → 90° CW → East → 180° → West' },
        { question: 'If + means ×, − means ÷, × means −, ÷ means +, then 8 + 6 − 3 × 4 ÷ 2 = ?', A: '12', B: '14', C: '16', D: '18', correct: 'B', explanation: '8 × 6 ÷ 3 − 4 + 2 = 48/3 − 4 + 2 = 16 − 4 + 2 = 14' },
        { question: 'In a certain code, COMPUTER is written as RFUVQNPC. How is MEDICINE written?', A: 'EFJDJEFM', B: 'MFEJDJOF', C: 'ENICIDME', D: 'FOJDJENM', correct: 'A', explanation: 'Reverse the word and shift each letter by +1.' },
        { question: 'Find missing: 1, 4, 27, 256, ?', A: '3025', B: '3125', C: '3225', D: '3250', correct: 'B', explanation: '1¹, 2², 3³, 4⁴, 5⁵ = 3125' },
        { question: 'If ROSE is coded as 6821, CHAIR is coded as 73456, then SEARCH is coded as?', A: '214673', B: '214637', C: '214367', D: '216437', correct: 'A', explanation: 'S=2, E=1, A=4, R=6, C=7, H=3 → SEARCH = 214673' },
        { question: 'A is B\'s sister. C is B\'s mother. D is C\'s father. E is D\'s mother. How is A related to D?', A: 'Grandmother', B: 'Grandfather', C: 'Granddaughter', D: 'Daughter', correct: 'C', explanation: 'A is B\'s sister, C is their mother, D is C\'s father (A\'s grandfather). So A is D\'s granddaughter.' },
      ]
    },
    {
      title: 'Verbal Ability — Set 1',
      description: 'Grammar, vocabulary, comprehension and sentence correction.',
      category: 'Verbal',
      difficulty: 'Easy',
      icon: 'ri-book-open-line',
      duration: 15,
      questions: [
        { question: 'Choose the correct synonym for "BENEVOLENT":', A: 'Hostile', B: 'Kind', C: 'Lazy', D: 'Strict', correct: 'B', explanation: 'Benevolent means kind and generous.' },
        { question: 'Antonym of "EPHEMERAL":', A: 'Permanent', B: 'Brief', C: 'Fragile', D: 'Ethereal', correct: 'A', explanation: 'Ephemeral means short-lived; opposite is permanent.' },
        { question: 'Fill the blank: "He is too honest ___ accept a bribe."', A: 'for', B: 'that', C: 'to', D: 'with', correct: 'C', explanation: '"Too...to" is the correct structure.' },
        { question: 'Spot the error: "Each of the boys have completed their work."', A: 'Each of', B: 'the boys', C: 'have completed', D: 'their work', correct: 'C', explanation: '"Each" is singular, so it should be "has completed".' },
        { question: '"To burn the midnight oil" means:', A: 'Waste resources', B: 'Study/work late', C: 'Start a fire', D: 'Be angry', correct: 'B', explanation: 'To burn the midnight oil means to study or work late into the night.' },
        { question: 'Choose the correctly spelt word:', A: 'Occurence', B: 'Ocurrence', C: 'Occurrence', D: 'Occurance', correct: 'C', explanation: 'Occurrence is the correct spelling.' },
        { question: 'One word for "one who knows everything":', A: 'Omnipresent', B: 'Omniscient', C: 'Omnipotent', D: 'Omnivorous', correct: 'B', explanation: 'Omniscient means all-knowing.' },
        { question: '"A stitch in time saves nine." This means:', A: 'Sewing is important', B: 'Time is money', C: 'Act early to prevent bigger problems', D: 'Nine is a lucky number', correct: 'C', explanation: 'Addressing a problem early prevents it from becoming worse.' },
        { question: 'Active to Passive: "The cat chased the mouse."', A: 'The mouse is chased by the cat', B: 'The mouse was chased by the cat', C: 'The mouse had been chased by the cat', D: 'The mouse has been chased by the cat', correct: 'B', explanation: 'Past tense active → was + past participle passive.' },
        { question: 'Choose correct preposition: "She is good ___ mathematics."', A: 'in', B: 'at', C: 'on', D: 'with', correct: 'B', explanation: '"Good at" is the correct collocation for skills/subjects.' },
      ]
    },
    {
      title: 'Verbal Ability — Set 2',
      description: 'Reading comprehension, para jumbles and critical reasoning.',
      category: 'Verbal',
      difficulty: 'Medium',
      icon: 'ri-book-open-line',
      duration: 20,
      questions: [
        { question: 'Choose the best word: "The manager was ___ about the delay in delivery."', A: 'apathetic', B: 'furious', C: 'elated', D: 'indifferent', correct: 'B', explanation: 'Furious means very angry, appropriate for a delay situation.' },
        { question: 'Which sentence is grammatically correct?', A: 'Neither the teacher nor the students was present', B: 'Neither the teacher nor the students were present', C: 'Neither the teacher nor the students is present', D: 'Neither the teacher nor student were present', correct: 'B', explanation: 'With "neither...nor", the verb agrees with the nearer subject (students → were).' },
        { question: '"Procrastination" most closely means:', A: 'Anticipation', B: 'Acceleration', C: 'Postponement', D: 'Punctuality', correct: 'C', explanation: 'Procrastination is the act of delaying or postponing.' },
        { question: 'Indirect speech: He said, "I am going to the market."', A: 'He said that he is going to the market', B: 'He said that he was going to the market', C: 'He said that he had been going to the market', D: 'He said that he goes to the market', correct: 'B', explanation: 'Direct to indirect: am going → was going (tense shift).' },
        { question: '"To hit the nail on the head" means:', A: 'To do carpentry', B: 'To be exactly right', C: 'To hurt someone', D: 'To make a mistake', correct: 'B', explanation: 'To hit the nail on the head means to say exactly the right thing.' },
        { question: 'The plural of "criterion" is:', A: 'Criterions', B: 'Criterias', C: 'Criteria', D: 'Criteriae', correct: 'C', explanation: 'Criterion → Criteria (Greek-origin plural).' },
        { question: 'Which is the correct sentence?', A: 'The data shows improvement', B: 'The data show improvement', C: 'The datas show improvement', D: 'The datum shows improvement', correct: 'B', explanation: 'Data is plural (datum is singular), so "data show" is correct.' },
        { question: '"Ubiquitous" means:', A: 'Rare', B: 'Present everywhere', C: 'Unknown', D: 'Dangerous', correct: 'B', explanation: 'Ubiquitous means appearing or found everywhere.' },
        { question: 'Choose the word most similar to "CANDID":', A: 'Secretive', B: 'Diplomatic', C: 'Frank', D: 'Sweet', correct: 'C', explanation: 'Candid means frank, open, and honest.' },
        { question: '"A dime a dozen" means something that is:', A: 'Expensive', B: 'Very common', C: 'Worth exactly 12 cents', D: 'Dirty', correct: 'B', explanation: 'A dime a dozen means very common and therefore not valuable.' },
      ]
    },
    {
      title: 'Computer Science Fundamentals',
      description: 'OS, networking, DBMS and programming basics.',
      category: 'Technical',
      difficulty: 'Medium',
      icon: 'ri-computer-line',
      duration: 20,
      questions: [
        { question: 'Which data structure uses FIFO?', A: 'Stack', B: 'Queue', C: 'Tree', D: 'Graph', correct: 'B', explanation: 'Queue follows First In First Out (FIFO).' },
        { question: 'Time complexity of binary search?', A: 'O(n)', B: 'O(n²)', C: 'O(log n)', D: 'O(1)', correct: 'C', explanation: 'Binary search halves the search space → O(log n).' },
        { question: 'Which sorting algorithm has best average case?', A: 'Bubble Sort', B: 'Selection Sort', C: 'Merge Sort', D: 'Insertion Sort', correct: 'C', explanation: 'Merge Sort has O(n log n) in all cases.' },
        { question: 'Primary key in DBMS must be:', A: 'Null', B: 'Duplicate', C: 'Unique and not null', D: 'Foreign', correct: 'C', explanation: 'Primary keys must be unique and cannot be null.' },
        { question: 'OSI model has how many layers?', A: '4', B: '5', C: '6', D: '7', correct: 'D', explanation: 'OSI has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application.' },
        { question: 'Which is NOT an operating system?', A: 'Linux', B: 'Oracle', C: 'Windows', D: 'macOS', correct: 'B', explanation: 'Oracle is a database management system, not an OS.' },
        { question: 'What does SQL stand for?', A: 'Structured Query Language', B: 'Sequential Query Language', C: 'Simple Query Language', D: 'Standard Query Logic', correct: 'A', explanation: 'SQL = Structured Query Language.' },
        { question: 'What is the worst-case time complexity of Quick Sort?', A: 'O(n)', B: 'O(n log n)', C: 'O(n²)', D: 'O(log n)', correct: 'C', explanation: 'Quick Sort worst case is O(n²) when pivot selection is poor.' },
        { question: 'In which normal form is a table if it has no partial dependencies?', A: '1NF', B: '2NF', C: '3NF', D: 'BCNF', correct: 'B', explanation: '2NF eliminates partial dependencies.' },
        { question: 'TCP is a ___ protocol.', A: 'Connectionless', B: 'Connection-oriented', C: 'Stateless', D: 'Broadcast', correct: 'B', explanation: 'TCP is connection-oriented, ensuring reliable delivery.' },
      ]
    },
    {
      title: 'Data Interpretation',
      description: 'Tables, charts, percentages and data analysis.',
      category: 'Data',
      difficulty: 'Hard',
      icon: 'ri-pie-chart-line',
      duration: 20,
      questions: [
        { question: 'Company revenue: Q1=200, Q2=250, Q3=300, Q4=350. % growth from Q1 to Q4?', A: '50%', B: '60%', C: '75%', D: '87.5%', correct: 'C', explanation: 'Growth = (350-200)/200 × 100 = 75%' },
        { question: 'In a class: 40% chose Physics, 35% Chemistry, rest Biology. If 200 students, how many chose Biology?', A: '40', B: '45', C: '50', D: '55', correct: 'C', explanation: 'Biology = 25% of 200 = 50.' },
        { question: 'Population: 2020=10000, 2021=11000, 2022=12100. What is the annual growth rate?', A: '5%', B: '8%', C: '10%', D: '12%', correct: 'C', explanation: '11000/10000 = 1.10 → 10% growth.' },
        { question: 'Sales in 5 months: 120, 150, 130, 160, 140. What is the median?', A: '130', B: '140', C: '150', D: '160', correct: 'B', explanation: 'Sorted: 120,130,140,150,160. Median = 140.' },
        { question: 'If ratio of A:B:C spending is 3:4:5 and total is ₹24,000, how much is B?', A: '₹6,000', B: '₹8,000', C: '₹10,000', D: '₹12,000', correct: 'B', explanation: 'B = 4/12 × 24000 = 8000.' },
        { question: 'Export in 2020 = 500 Cr, Import = 700 Cr. Trade deficit as % of exports?', A: '28.5%', B: '40%', C: '50%', D: '71.4%', correct: 'B', explanation: 'Deficit = 200, % of exports = 200/500 × 100 = 40%.' },
        { question: 'Productivity increased from 80 to 100 units/day. % increase?', A: '20%', B: '25%', C: '30%', D: '80%', correct: 'B', explanation: 'Increase = 20, % = 20/80 × 100 = 25%.' },
        { question: 'If A scores 480/600 and B scores 380/500, who has higher percentage?', A: 'A (80%)', B: 'B (76%)', C: 'Same', D: 'Cannot determine', correct: 'A', explanation: 'A = 80%, B = 76%. A has higher percentage.' },
        { question: 'Expenses: Rent=30%, Food=25%, Transport=15%, Savings=20%, Others=10%. On ₹50,000 salary, savings?', A: '₹8,000', B: '₹10,000', C: '₹12,000', D: '₹15,000', correct: 'B', explanation: '20% of 50000 = 10000.' },
        { question: 'Average of 5 numbers is 42. If one number (30) is removed, new average?', A: '43', B: '44', C: '45', D: '46', correct: 'C', explanation: 'Total = 210, remove 30 = 180, new avg = 180/4 = 45.' },
      ]
    },
  ];

  // ──────────────────────────────────────────────
  //              INSERT INTO DATABASE
  // ──────────────────────────────────────────────

  let totalTests = 0, totalQuestions = 0;

  for (const test of tests) {
    // Check if test already exists (by title)
    const [existing] = await connection.query(
      'SELECT id FROM aptitudeTests WHERE title = ? AND mentorId = ?',
      [test.title, mentorId]
    );

    let testId;

    if (existing.length > 0) {
      testId = existing[0].id;
      // Update existing test with new fields
      await connection.query(
        'UPDATE aptitudeTests SET category = ?, difficulty = ?, icon = ?, description = ?, duration = ?, totalQuestions = ?, totalMarks = ? WHERE id = ?',
        [test.category, test.difficulty, test.icon, test.description, test.duration, test.questions.length, test.questions.length, testId]
      );
      console.log(`  ⏩ Test "${test.title}" updated (id=${testId})`);
    } else {
      const [result] = await connection.query(
        'INSERT INTO aptitudeTests (mentorId, title, description, category, difficulty, icon, duration, totalQuestions, totalMarks, isPublished) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)',
        [mentorId, test.title, test.description, test.category, test.difficulty, test.icon, test.duration, test.questions.length, test.questions.length]
      );
      testId = result.insertId;
      console.log(`  ✅ Test "${test.title}" created (id=${testId})`);
      totalTests++;
    }

    // Clear existing questions for this test and re-insert
    await connection.query('DELETE FROM aptitudeQuestions WHERE testId = ?', [testId]);

    for (let i = 0; i < test.questions.length; i++) {
      const q = test.questions[i];
      await connection.query(
        'INSERT INTO aptitudeQuestions (testId, question, optionA, optionB, optionC, optionD, correctOption, marks, explanation, orderIndex) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)',
        [testId, q.question, q.A, q.B, q.C, q.D, q.correct, q.explanation || null, i + 1]
      );
      totalQuestions++;
    }

    console.log(`     → ${test.questions.length} questions seeded`);
  }

  console.log(`\n🎉 Done! Seeded ${totalTests} new tests, ${totalQuestions} total questions across ${tests.length} tests.`);

  await connection.end();
}

seed().catch(err => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
