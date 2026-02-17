import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const TOTAL_QUESTIONS_PER_SET = 26;

// ----------------------------------------------------------------------------
// Aptitude Pools & Generators
// ----------------------------------------------------------------------------

const verbalPool = [
    { q: "Synonym of 'Abundant'?", A: "Scarce", B: "Plentiful", C: "Empty", D: "Rare", c: "B", e: "Abundant means plentiful." },
    { q: "Antonym of 'Brave'?", A: "Cowardly", B: "Strong", C: "Bold", D: "Heroic", c: "A", e: "Opposite of brave is cowardly." },
    { q: "Choose correct spelling:", A: "Recieve", B: "Receive", C: "Riceive", D: "Receve", c: "B", e: "Receive." },
    { q: "Past tense of 'Run'?", A: "Runner", B: "Ran", C: "Runned", D: "Running", c: "B", e: "Ran." },
    { q: "'Piece of cake' means:", A: "Tasty", B: "Hard", C: "Easy", D: "Dessert", c: "C", e: "Easy task." },
    { q: "Synonym of 'Happy'?", A: "Sad", B: "Joyful", C: "Angry", D: "Tired", c: "B", e: "Joyful." },
    { q: "Antonym of 'Fast'?", A: "Quick", B: "Slow", C: "Rapid", D: "Swift", c: "B", e: "Slow." },
    { q: "One who writes books?", A: "Author", B: "Reader", C: "Editor", D: "Publisher", c: "A", e: "Author." },
    { q: "Plural of 'Child'?", A: "Childs", B: "Children", C: "Childrens", D: "Childes", c: "B", e: "Children." },
    { q: "'Break a leg' means:", A: "Get hurt", B: "Good luck", C: "Dance", D: "Fall down", c: "B", e: "Good luck." },
    { q: "Meaning of 'Once in a blue moon'?", A: "Frequently", B: "Rarely", C: "Daily", D: "Monthly", c: "B", e: "Very rarely." },
    { q: "To 'Spill the beans' means to?", A: "Cook", B: "Reveal secret", C: "Drop food", D: "Plant seeds", c: "B", e: "Reveal a secret." },
    { q: "One who loves books?", A: "Bibliophile", B: "Anglophile", C: "Technophile", D: "Pedophile", c: "A", e: "Bibliophile." },
    { q: "Correct spelling:", A: "Neccessary", B: "Necessary", C: "Necesary", D: "Neccesary", c: "B", e: "Necessary." }
];

const technicalPool = [
    { q: "What is HTML?", A: "Protocol", B: "Language", C: "Hardware", D: "OS", c: "B", e: "HyperText Markup Language." },
    { q: "RAM stands for?", A: "Read Access Memory", B: "Random Access Memory", C: "Run All Memory", D: "Read All Memory", c: "B", e: "Random Access Memory." },
    { q: "CPU controls?", A: "All input, output and processing", B: "Only memory", C: "Only power", D: "Only network", c: "A", e: "Central Processing Unit." },
    { q: "1 Byte = ?", A: "4 bits", B: "8 bits", C: "16 bits", D: "32 bits", c: "B", e: "8 bits." },
    { q: "HTTPS uses which port?", A: "80", B: "443", C: "21", D: "25", c: "B", e: "443." },
    { q: "Which is a loop?", A: "If-Else", B: "For", C: "Switch", D: "Break", c: "B", e: "For loop." },
    { q: "Array index starts at?", A: "1", B: "0", C: "-1", D: "2", c: "B", e: "Usually 0." },
    { q: "Extension of Java file?", A: ".js", B: ".java", C: ".txt", D: ".class", c: "B", e: ".java." },
    { q: "Google Chrome is a?", A: "Search Engine", B: "Browser", C: "Server", D: "OS", c: "B", e: "Browser." },
    { q: "SQL: Select * FROM Users WHERE...?", A: "Update", B: "Condition", C: "Delete", D: "Insert", c: "B", e: "WHERE clause requires a condition." },
    { q: "Data Structure: LIFO?", A: "Queue", B: "Stack", C: "Tree", D: "Graph", c: "B", e: "Stack is Last In First Out." },
    { q: "Binary Search Complexity?", A: "O(n)", B: "O(log n)", C: "O(1)", D: "O(n^2)", c: "B", e: "O(log n)." }
];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateMathQuestion() {
  const types = ['percentage', 'ratio', 'arithmetic', 'interest', 'time_work', 'speed_distance', 'probability', 'profit_loss'];
  const selectedType = types[getRandomInt(0, types.length - 1)];

  let q, a, b, c, d, correct, explanation;

  switch (selectedType) {
    case 'percentage': {
      const x = getRandomInt(10, 90); 
      const y = getRandomInt(100, 1000);
      const ans = Math.round((x / 100) * y);
      q = `What is ${x}% of ${y} (approx)?`;
      correct = 'A';
      a = ans; b = ans + 20; c = ans - 20; d = ans * 2;
      explanation = `${x}% of ${y} = ${ans}`;
      break;
    }
    case 'ratio': {
      const ratioA = getRandomInt(1, 5);
      const ratioB = getRandomInt(1, 5);
      const factor = getRandomInt(10, 50);
      const total = (ratioA + ratioB) * factor;
      const ans = ratioA * factor;
      q = `Ratio A:B is ${ratioA}:${ratioB}. Total ${total}. Find A.`;
      correct = 'B';
      a = ans - 5; b = ans; c = ans + 5; d = total;
      explanation = `A = ${ratioA}/(${ratioA}+${ratioB}) * ${total} = ${ans}`;
      break;
    }
    case 'arithmetic': {
      const n1 = getRandomInt(11, 99);
      const n2 = getRandomInt(11, 99);
      const ans = n1 + n2; 
      q = `Sum of ${n1} and ${n2}?`;
      correct = 'C';
      a = ans - 10; b = ans + 10; c = ans; d = ans + 100;
      explanation = `${n1} + ${n2} = ${ans}`;
      break;
    }
    case 'interest': {
        const P = getRandomInt(1000, 5000);
        const R = getRandomInt(2, 5);
        const T = getRandomInt(1, 3);
        const SI = (P * R * T) / 100;
        q = `SI on ${P} at ${R}% for ${T} yrs?`;
        correct = 'A';
        a = SI; b = SI + 50; c = SI - 50; d = SI + 100;
        explanation = `SI = ${SI}`;
        break;
    }
    case 'time_work': {
        const d1 = getRandomInt(6, 12);
        const d2 = d1 * 2; 
        const val = (d1 * d2) / (d1 + d2);
        q = `A does work in ${d1}d, B in ${d2}d. Together?`;
        correct = 'D';
        a = Math.floor(val)+1; b = Math.floor(val)-1; c = Math.floor(val)+2; d = val.toFixed(1);
        explanation = `${val.toFixed(1)} days`;
        break;
    }
    case 'speed_distance': {
        const s = getRandomInt(40, 80);
        const t = getRandomInt(2, 4);
        const dist = s * t;
        q = `Speed ${s} km/h, Time ${t} hr. Dist?`;
        correct = 'B';
        a = dist - 10; b = dist; c = dist + 10; d = dist + 20;
        explanation = `${dist} km`;
        break;
    }
    case 'probability': {
        const red = getRandomInt(2, 5);
        const blue = getRandomInt(2, 5);
        const total = red + blue;
        // P(Red)
        q = `Bag has ${red} Red, ${blue} Blue balls. Prob of picking Red?`;
        correct = 'A';
        const num = red; const den = total;
        a = `${num}/${den}`; b = `${blue}/${den}`; c = `1/${total}`; d = `1/2`;
        explanation = `Total balls = ${total}. Red balls = ${red}. P(Red) = ${red}/${total}.`;
        break;
    }
    case 'profit_loss': {
        const cp = getRandomInt(100, 500);
        const profitP = getRandomInt(10, 25);
        const sp = cp + (cp * profitP / 100);
        q = `CP = ${cp}, Profit = ${profitP}%. Find SP.`;
        correct = 'C';
        a = sp - 10; b = sp + 10; c = sp; d = sp + 20;
        explanation = `SP = CP + Profit = ${cp} + ${cp*profitP/100} = ${sp}`;
        break;
    }
  }
  return { q, A: String(a), B: String(b), C: String(c), D: String(d), correct, explanation };
}

function generateLogicQuestion() {
    const types = ['series_add', 'series_mult', 'directions', 'calendar'];
    const type = types[getRandomInt(0, types.length - 1)];
    let q, a, b, c, d, correct, explanation;
    
    if (type === 'series_add') {
        const start = getRandomInt(1, 10);
        const inc = getRandomInt(2, 5);
        const s = [start, start+inc, start+inc*2, start+inc*3];
        const next = start+inc*4;
        q = `Series: ${s.join(', ')}, ?`;
        correct = 'A';
        a = next; b = next+1; c = next+2; d = next-1;
        explanation = `+${inc}`;
    } else if (type === 'series_mult') {
        const start = getRandomInt(2, 4);
        const next = start*16;
        const s2 = [start, start*2, start*4, start*8];
        q = `Series: ${s2.join(', ')}, ?`;
        correct = 'B';
        a = next-2; b = next; c = next+2; d = next+4;
        explanation = `x2`;
    } else if (type === 'directions') {
        q = "A man walks 5km North, then 5km South. Where is he from start?";
        correct = 'C';
        a = "10km North"; b = "5km North"; c = "At start"; d = "5km South";
        explanation = "Went up 5, came down 5. Back to origin.";
    } else if (type === 'calendar') {
        q = "If today is Monday, what day is after 7 days?";
        correct = 'A';
        a = "Monday"; b = "Tuesday"; c = "Sunday"; d = "Wednesday";
        explanation = "Week repeats every 7 days.";
    }
    return { q, A: String(a), B: String(b), C: String(c), D: String(d), correct, explanation };
}

// ----------------------------------------------------------------------------
// Main Seed Function
// ----------------------------------------------------------------------------

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'sowberry',
  });

  console.log('🚀 Starting Combined Seed (Courses + Aptitude)...');

  try {
      await seedAptitude(connection);
      await seedCourses(connection);
      await seedCodingProblems(connection);
  } catch (err) {
      console.error('❌ Error during seeding:', err);
  } finally {
      await connection.end();
      process.exit(0);
  }
}

async function seedAptitude(connection) {
    console.log('\n--- Seeding Aptitude Tests ---');
    console.log('Cleaning up previous generated sets...');
  
    await connection.query("DELETE FROM aptitudeTests WHERE title LIKE 'Quantitative Practice Set%'");
    await connection.query("DELETE FROM aptitudeTests WHERE title LIKE 'Logical Reasoning Set%'");
    await connection.query("DELETE FROM aptitudeTests WHERE title LIKE 'Verbal Ability Set%'");
    await connection.query("DELETE FROM aptitudeTests WHERE title LIKE 'Technical Computer Science Set%'");

    console.log('🧠 Seeding 20 sets (Expanded Concepts)...');

    const [mentors] = await connection.query(`SELECT id FROM users WHERE role = 'mentor' ORDER BY id LIMIT 1`);
    if (!mentors.length) { console.error('No mentor found for aptitude'); return; }
    const mentorId = mentors[0].id;

    const setsToCreate = [];

    // 1. Quantitative (5 sets)
    for(let i=1; i<=5; i++) setsToCreate.push({ title: `Quantitative Practice Set ${i}`, category: 'Quantitative', difficulty: 'Medium', type: 'math' });
    // 2. Logical (5 sets)
    for(let i=1; i<=5; i++) setsToCreate.push({ title: `Logical Reasoning Set ${i}`, category: 'Logical', difficulty: 'Medium', type: 'logic' });
    // 3. Verbal (5 sets)
    for(let i=1; i<=5; i++) setsToCreate.push({ title: `Verbal Ability Set ${i}`, category: 'Verbal', difficulty: 'Easy', type: 'verbal' });
    // 4. Technical (5 sets)
    for(let i=1; i<=5; i++) setsToCreate.push({ title: `Technical Computer Science Set ${i}`, category: 'Technical', difficulty: 'Hard', type: 'tech' });

    for (const set of setsToCreate) {
        const [res] = await connection.query(
            'INSERT INTO aptitudeTests (mentorId, title, description, category, difficulty, icon, duration, totalQuestions, totalMarks, isPublished) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)',
            [mentorId, set.title, `Generated ${set.category} Questions`, set.category, set.difficulty, 'ri-book-line', 30, TOTAL_QUESTIONS_PER_SET, TOTAL_QUESTIONS_PER_SET]
        );
        const testId = res.insertId;
        
        let shuffledVerbal = [...verbalPool].sort(() => 0.5 - Math.random());
        let shuffledTech = [...technicalPool].sort(() => 0.5 - Math.random());

        for(let qIdx=0; qIdx < TOTAL_QUESTIONS_PER_SET; qIdx++) {
            let qData;
            if (set.type === 'math') {
                qData = generateMathQuestion();
            } else if (set.type === 'logic') {
                qData = generateLogicQuestion();
            } else if (set.type === 'verbal') {
                const raw = shuffledVerbal[qIdx % shuffledVerbal.length];
                qData = { q: raw.q, A: raw.A, B: raw.B, C: raw.C, D: raw.D, correct: raw.c, explanation: raw.e };
            } else if (set.type === 'tech') {
                const raw = shuffledTech[qIdx % shuffledTech.length];
                qData = { q: raw.q, A: raw.A, B: raw.B, C: raw.C, D: raw.D, correct: raw.c, explanation: raw.e };
            }
            
            await connection.query(
                'INSERT INTO aptitudeQuestions (testId, question, optionA, optionB, optionC, optionD, correctOption, marks, explanation, orderIndex) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)',
                [testId, qData.q, qData.A, qData.B, qData.C, qData.D, qData.correct, qData.explanation, qIdx+1]
            );
        }
        console.log(`  Created: ${set.title}`);
    }
}

async function seedCourses(connection) {
  console.log('🌱 Seeding more courses & content...\n');

  // Get mentor IDs
  const [mentors] = await connection.query(`SELECT id FROM users WHERE role = 'mentor' ORDER BY id LIMIT 3`);
  if (mentors.length === 0) {
    console.error('❌ No mentors found. Run dbSetup.js first.');
    process.exit(1);
  }
  const m1 = mentors[0].id, m2 = mentors[1 % mentors.length].id, m3 = mentors[2 % mentors.length].id;

  // ═══════════════════════ COURSES ═══════════════════════
  const courses = [
    { title: 'Python Programming Mastery', code: 'PY101', desc: 'Complete Python course from basics to advanced — variables, loops, OOP, file handling, modules, and real-world projects.', dur: '10 weeks', mentor: m1, cat: 'Programming', type: 'theory', diff: 'beginner', sem: '1' },
    { title: 'Data Structures & Algorithms', code: 'DSA301', desc: 'Master arrays, linked lists, stacks, queues, trees, graphs, sorting, searching, and dynamic programming.', dur: '14 weeks', mentor: m1, cat: 'Data Structures', type: 'theory', diff: 'intermediate', sem: '3' },
    { title: 'React & Modern Frontend', code: 'FE201', desc: 'Build modern web applications with React, hooks, state management, routing, and API integration.', dur: '8 weeks', mentor: m2, cat: 'Web Development', type: 'practical', diff: 'intermediate', sem: '4' },
    { title: 'Database Management Systems', code: 'DB201', desc: 'Learn relational database design, SQL, normalization, transactions, indexing, and NoSQL basics.', dur: '12 weeks', mentor: m2, cat: 'Database', type: 'theory', diff: 'intermediate', sem: '3' },
    { title: 'Machine Learning Fundamentals', code: 'ML301', desc: 'Supervised and unsupervised learning, regression, classification, clustering, neural networks, and model evaluation.', dur: '16 weeks', mentor: m3, cat: 'Machine Learning', type: 'theory', diff: 'advanced', sem: '5' },
    { title: 'Node.js & Express Backend', code: 'BE301', desc: 'Build RESTful APIs with Node.js, Express, middleware, authentication, database integration, and deployment.', dur: '10 weeks', mentor: m1, cat: 'Web Development', type: 'lab', diff: 'intermediate', sem: '4' },
    { title: 'Java Object-Oriented Programming', code: 'JV201', desc: 'Java fundamentals, OOP concepts — classes, inheritance, polymorphism, interfaces, generics, and collections.', dur: '12 weeks', mentor: m3, cat: 'Programming', type: 'theory', diff: 'beginner', sem: '2' },
    { title: 'Software Engineering Practices', code: 'SE401', desc: 'SDLC, Agile, Git workflows, testing, CI/CD, code review, design patterns, and project management.', dur: '10 weeks', mentor: m2, cat: 'Software Engineering', type: 'theory', diff: 'intermediate', sem: '5' },
    { title: 'Computer Networks', code: 'CN301', desc: 'OSI model, TCP/IP, routing, switching, DNS, HTTP, network security, and socket programming.', dur: '12 weeks', mentor: m3, cat: 'Networking', type: 'theory', diff: 'intermediate', sem: '4' },
    { title: 'Operating Systems Concepts', code: 'OS301', desc: 'Process management, scheduling, memory management, file systems, deadlocks, and virtual memory.', dur: '12 weeks', mentor: m1, cat: 'Systems', type: 'theory', diff: 'intermediate', sem: '4' },
  ];

  const courseIds = {};

  for (const c of courses) {
    const [existing] = await connection.query('SELECT id FROM courses WHERE courseCode = ?', [c.code]);
    if (existing.length > 0) {
      courseIds[c.code] = existing[0].id;
      console.log(`  ⏩ ${c.code} already exists (id=${existing[0].id})`);
      continue;
    }
    const [result] = await connection.query(
      `INSERT INTO courses (title, courseCode, description, duration, mentorId, category, courseType, difficulty, semester, isPublished, status, rating)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 'active', ?)`,
      [c.title, c.code, c.desc, c.dur, c.mentor, c.cat, c.type, c.diff, c.sem, (Math.random() * 1.5 + 3.5).toFixed(1)]
    );
    courseIds[c.code] = result.insertId;
    console.log(`  ✅ ${c.code} - ${c.title} (id=${result.insertId})`);
  }

  // Also grab any existing courses (DS201, MK101, DG301, CS401, CY201)
  const [allCourses] = await connection.query('SELECT id, courseCode, mentorId FROM courses');
  for (const c of allCourses) {
    if (c.courseCode && !courseIds[c.courseCode]) courseIds[c.courseCode] = c.id;
  }
  // Map existing course mentor ids
  const courseMentorMap = {};
  for (const c of allCourses) { courseMentorMap[c.courseCode] = c.mentorId; }

  // ═══════════════════════ SUBJECTS + TOPICS + CONTENT ═══════════════════════
  const courseData = {
    PY101: {
      mentor: m1,
      subjects: [
        {
          title: 'Python Basics', code: 'U1',
          topics: ['Introduction to Python', 'Variables & Data Types', 'Operators & Expressions', 'Input & Output', 'Type Casting'],
          content: [
            { title: 'Getting Started with Python', type: 'video', data: 'https://www.youtube.com/watch?v=kqtD5dpn9C8' },
            { title: 'Python Variables & Types', type: 'text', data: 'Python is dynamically typed. You dont need to declare variable types.\n\nCommon types:\n- int: 42\n- float: 3.14\n- str: "hello"\n- bool: True/False\n- list: [1,2,3]\n- dict: {"key": "value"}\n- tuple: (1,2,3)\n\nExample:\nname = "Alice"\nage = 25\npi = 3.14159\nis_student = True' },
          ]
        },
        {
          title: 'Control Flow', code: 'U2',
          topics: ['If-Else Statements', 'For Loops', 'While Loops', 'Break & Continue', 'Nested Loops'],
          content: [
            { title: 'Control Flow in Python', type: 'video', data: 'https://www.youtube.com/watch?v=Zp5MuPOtsSY' },
            { title: 'Loop Examples', type: 'text', data: '# For loop\nfor i in range(5):\n    print(i)  # 0, 1, 2, 3, 4\n\n# While loop\ncount = 0\nwhile count < 5:\n    print(count)\n    count += 1\n\n# List comprehension\nsquares = [x**2 for x in range(10)]\n\n# Nested loop\nfor i in range(3):\n    for j in range(3):\n        print(f"({i},{j})", end=" ")' },
          ]
        },
        {
          title: 'Functions & Modules', code: 'U3',
          topics: ['Defining Functions', 'Parameters & Return', 'Lambda Functions', 'Built-in Functions', 'Importing Modules'],
          content: [
            { title: 'Functions Tutorial', type: 'video', data: 'https://www.youtube.com/watch?v=9Os0o3wzS_I' },
            { title: 'Function Reference', type: 'text', data: '# Basic function\ndef greet(name):\n    return f"Hello, {name}!"\n\n# Default parameters\ndef power(base, exp=2):\n    return base ** exp\n\n# *args and **kwargs\ndef flexible(*args, **kwargs):\n    print(args)    # tuple\n    print(kwargs)  # dict\n\n# Lambda\nsquare = lambda x: x ** 2\n\n# Map & Filter\nnums = [1,2,3,4,5]\nevens = list(filter(lambda x: x%2==0, nums))\ndoubled = list(map(lambda x: x*2, nums))' },
          ]
        },
        {
          title: 'OOP in Python', code: 'U4',
          topics: ['Classes & Objects', 'Constructors', 'Inheritance', 'Polymorphism', 'Encapsulation'],
          content: [
            { title: 'OOP Concepts', type: 'video', data: 'https://www.youtube.com/watch?v=JeznW_7DlB0' },
            { title: 'OOP Code Examples', type: 'text', data: 'class Animal:\n    def __init__(self, name, species):\n        self.name = name\n        self.species = species\n    \n    def speak(self):\n        return "..."\n\nclass Dog(Animal):\n    def __init__(self, name, breed):\n        super().__init__(name, "Canine")\n        self.breed = breed\n    \n    def speak(self):\n        return "Woof!"\n\n# Usage\ndog = Dog("Buddy", "Labrador")\nprint(dog.speak())  # Woof!\nprint(dog.species)  # Canine' },
          ]
        },
        {
          title: 'File Handling & Error Handling', code: 'U5',
          topics: ['Reading Files', 'Writing Files', 'Try-Except', 'Custom Exceptions', 'Context Managers'],
          content: [
            { title: 'File Handling Guide', type: 'text', data: '# Reading a file\nwith open("data.txt", "r") as f:\n    content = f.read()\n    # or line by line:\n    # for line in f:\n    #     print(line.strip())\n\n# Writing a file\nwith open("output.txt", "w") as f:\n    f.write("Hello World\\n")\n\n# Error handling\ntry:\n    result = 10 / 0\nexcept ZeroDivisionError as e:\n    print(f"Error: {e}")\nexcept Exception as e:\n    print(f"Unexpected: {e}")\nfinally:\n    print("Done")' },
          ]
        },
      ]
    },
    DSA301: {
      mentor: m1,
      subjects: [
        {
          title: 'Arrays & Strings', code: 'U1',
          topics: ['Array Operations', 'Two Pointer Technique', 'Sliding Window', 'String Manipulation', 'Hashing'],
          content: [
            { title: 'Arrays & Strings Overview', type: 'video', data: 'https://www.youtube.com/watch?v=HdFG8L1sajw' },
            { title: 'Key Patterns', type: 'text', data: 'TWO POINTER TECHNIQUE\n======================\nUsed when array is sorted or when comparing elements.\n\nExample: Two Sum (sorted array)\ndef twoSum(arr, target):\n    left, right = 0, len(arr) - 1\n    while left < right:\n        s = arr[left] + arr[right]\n        if s == target: return [left, right]\n        elif s < target: left += 1\n        else: right -= 1\n\nSLIDING WINDOW\n==============\nUsed for subarray/substring problems.\n\nExample: Max sum subarray of size k\ndef maxSum(arr, k):\n    window = sum(arr[:k])\n    best = window\n    for i in range(k, len(arr)):\n        window += arr[i] - arr[i-k]\n        best = max(best, window)\n    return best' },
          ]
        },
        {
          title: 'Linked Lists', code: 'U2',
          topics: ['Singly Linked List', 'Doubly Linked List', 'Circular Linked List', 'Reversal', 'Cycle Detection'],
          content: [
            { title: 'Linked Lists Explained', type: 'video', data: 'https://www.youtube.com/watch?v=njTh_OwMljA' },
            { title: 'Linked List Implementation', type: 'text', data: 'class Node:\n    def __init__(self, data):\n        self.data = data\n        self.next = None\n\nclass LinkedList:\n    def __init__(self):\n        self.head = None\n    \n    def append(self, data):\n        new_node = Node(data)\n        if not self.head:\n            self.head = new_node\n            return\n        curr = self.head\n        while curr.next:\n            curr = curr.next\n        curr.next = new_node\n    \n    def reverse(self):\n        prev = None\n        curr = self.head\n        while curr:\n            next_temp = curr.next\n            curr.next = prev\n            prev = curr\n            curr = next_temp\n        self.head = prev' },
          ]
        },
        {
          title: 'Stacks & Queues', code: 'U3',
          topics: ['Stack Operations', 'Queue Operations', 'Expression Evaluation', 'BFS using Queue', 'Monotonic Stack'],
          content: [
            { title: 'Stacks & Queues Tutorial', type: 'video', data: 'https://www.youtube.com/watch?v=wjI1WNcIntg' },
          ]
        },
        {
          title: 'Trees & Graphs', code: 'U4',
          topics: ['Binary Trees', 'BST Operations', 'Tree Traversals', 'Graph Representation', 'BFS & DFS'],
          content: [
            { title: 'Trees & Graphs Visual Guide', type: 'video', data: 'https://www.youtube.com/watch?v=oSWTXtMglKE' },
            { title: 'Tree & Graph Concepts', type: 'text', data: 'BINARY SEARCH TREE (BST)\n========================\nLeft child < Parent < Right child\n\nInsertion: O(log n) average\nSearch: O(log n) average\nDeletion: O(log n) average\n\nTraversals:\n- Inorder (L, Root, R): Sorted order\n- Preorder (Root, L, R): Copy tree\n- Postorder (L, R, Root): Delete tree\n- Level order: BFS with queue\n\nGRAPH REPRESENTATION\n====================\nAdjacency List: Space O(V+E)\n  graph = {0: [1,2], 1: [0,3], ...}\n\nAdjacency Matrix: Space O(V²)\n  matrix[i][j] = 1 if edge exists\n\nBFS: Queue-based, level by level\nDFS: Stack/recursion, depth first' },
          ]
        },
        {
          title: 'Sorting & Searching', code: 'U5',
          topics: ['Bubble Sort', 'Merge Sort', 'Quick Sort', 'Binary Search', 'Counting Sort'],
          content: [
            { title: 'Sorting Algorithms Comparison', type: 'video', data: 'https://www.youtube.com/watch?v=kPRA0W1kECg' },
          ]
        },
      ]
    },
    FE201: {
      mentor: m2,
      subjects: [
        {
          title: 'React Fundamentals', code: 'U1',
          topics: ['JSX & Components', 'Props & State', 'Event Handling', 'Conditional Rendering', 'Lists & Keys'],
          content: [
            { title: 'React in 100 Seconds', type: 'video', data: 'https://www.youtube.com/watch?v=Tn6-PIqc4UM' },
            { title: 'React Basics', type: 'text', data: 'REACT COMPONENT\n================\nfunction Greeting({ name }) {\n  return <h1>Hello, {name}!</h1>;\n}\n\nSTATE WITH HOOKS\n=================\nconst [count, setCount] = useState(0);\n\nreturn (\n  <div>\n    <p>Count: {count}</p>\n    <button onClick={() => setCount(count + 1)}>\n      Increment\n    </button>\n  </div>\n);' },
          ]
        },
        {
          title: 'React Hooks Deep Dive', code: 'U2',
          topics: ['useState', 'useEffect', 'useRef', 'useMemo & useCallback', 'Custom Hooks'],
          content: [
            { title: 'React Hooks Explained', type: 'video', data: 'https://www.youtube.com/watch?v=TNhaISOUy6Q' },
            { title: 'Hooks Cheat Sheet', type: 'text', data: 'useState — State management\nconst [value, setValue] = useState(initial);\n\nuseEffect — Side effects\nuseEffect(() => {\n  // runs after render\n  return () => { /* cleanup */ };\n}, [dependencies]);\n\nuseRef — Mutable ref / DOM access\nconst ref = useRef(null);\n<input ref={ref} />\n\nuseMemo — Memoize expensive computation\nconst result = useMemo(() => expensiveFn(a, b), [a, b]);\n\nuseCallback — Memoize function reference\nconst handler = useCallback(() => { ... }, [deps]);' },
          ]
        },
        {
          title: 'Routing & State Management', code: 'U3',
          topics: ['React Router', 'Context API', 'useReducer', 'Global State Patterns', 'Route Guards'],
          content: [
            { title: 'React Router v6 Tutorial', type: 'video', data: 'https://www.youtube.com/watch?v=Ul3y1LXxzdU' },
          ]
        },
        {
          title: 'API Integration & Forms', code: 'U4',
          topics: ['Fetch & Axios', 'Loading States', 'Error Handling', 'Form Validation', 'File Uploads'],
          content: [
            { title: 'API Calls in React', type: 'text', data: 'FETCHING DATA\n==============\nconst [data, setData] = useState(null);\nconst [loading, setLoading] = useState(true);\n\nuseEffect(() => {\n  fetch("/api/items")\n    .then(res => res.json())\n    .then(json => {\n      setData(json);\n      setLoading(false);\n    })\n    .catch(err => console.error(err));\n}, []);\n\nFORM HANDLING\n=============\nconst [form, setForm] = useState({ name: "", email: "" });\n\nconst handleChange = (e) => {\n  setForm({ ...form, [e.target.name]: e.target.value });\n};\n\nconst handleSubmit = async (e) => {\n  e.preventDefault();\n  await fetch("/api/submit", {\n    method: "POST",\n    headers: { "Content-Type": "application/json" },\n    body: JSON.stringify(form)\n  });\n};' },
          ]
        },
      ]
    },
    DB201: {
      mentor: m2,
      subjects: [
        {
          title: 'Relational Database Design', code: 'U1',
          topics: ['ER Diagrams', 'Normalization (1NF-3NF)', 'Primary & Foreign Keys', 'Relationships', 'Schema Design'],
          content: [
            { title: 'Database Design Tutorial', type: 'video', data: 'https://www.youtube.com/watch?v=ztHopE5Wnpc' },
            { title: 'Normalization Guide', type: 'text', data: 'DATABASE NORMALIZATION\n======================\n\n1NF: No repeating groups, atomic values\n  ✗ courses = "Math, Science"  \n  ✓ Separate rows for each course\n\n2NF: 1NF + No partial dependencies\n  Every non-key attribute depends on the WHOLE primary key\n\n3NF: 2NF + No transitive dependencies\n  Non-key attributes depend ONLY on the primary key\n\nBCNF: For every dependency X→Y, X is a superkey\n\nExample:\nStudents(id PK, name, email)\nCourses(id PK, title, dept)\nEnrollments(studentId FK, courseId FK, grade)' },
          ]
        },
        {
          title: 'SQL Fundamentals', code: 'U2',
          topics: ['SELECT Queries', 'JOIN Operations', 'GROUP BY & HAVING', 'Subqueries', 'INSERT/UPDATE/DELETE'],
          content: [
            { title: 'SQL in 1 Hour', type: 'video', data: 'https://www.youtube.com/watch?v=HXV3zeQKqGY' },
            { title: 'SQL Cheat Sheet', type: 'text', data: '-- SELECT\nSELECT name, email FROM users WHERE age > 18 ORDER BY name;\n\n-- JOIN\nSELECT u.name, c.title\nFROM users u\nJOIN enrollments e ON u.id = e.student_id\nJOIN courses c ON e.course_id = c.id;\n\n-- GROUP BY\nSELECT dept, COUNT(*) as total, AVG(salary) as avg_sal\nFROM employees\nGROUP BY dept\nHAVING COUNT(*) > 5;\n\n-- Subquery\nSELECT * FROM employees\nWHERE salary > (SELECT AVG(salary) FROM employees);' },
          ]
        },
        {
          title: 'Transactions & Indexing', code: 'U3',
          topics: ['ACID Properties', 'Transaction Control', 'Locking', 'B-Tree Indexes', 'Query Optimization'],
          content: [
            { title: 'Transactions & ACID', type: 'text', data: 'ACID PROPERTIES\n================\nAtomicity: All or nothing\nConsistency: Valid state to valid state\nIsolation: Concurrent transactions don\'t interfere\nDurability: Committed data persists\n\nTRANSACTION CONTROL\n===================\nSTART TRANSACTION;\n  UPDATE accounts SET balance = balance - 100 WHERE id = 1;\n  UPDATE accounts SET balance = balance + 100 WHERE id = 2;\nCOMMIT;\n-- or ROLLBACK; on error\n\nINDEXING\n========\nCREATE INDEX idx_email ON users(email);\n-- B-Tree index: O(log n) lookups\n-- Speeds up: WHERE, JOIN, ORDER BY\n-- Slows down: INSERT, UPDATE, DELETE' },
          ]
        },
      ]
    },
    ML301: {
      mentor: m3,
      subjects: [
        {
          title: 'Introduction to ML', code: 'U1',
          topics: ['What is Machine Learning?', 'Types of ML', 'Data Preprocessing', 'Feature Engineering', 'Train/Test Split'],
          content: [
            { title: 'ML Crash Course', type: 'video', data: 'https://www.youtube.com/watch?v=ukzFI9rgwfU' },
            { title: 'ML Overview', type: 'text', data: 'TYPES OF MACHINE LEARNING\n=========================\n\n1. Supervised Learning\n   - Labeled data: input → output\n   - Classification: spam/not spam\n   - Regression: predict house price\n\n2. Unsupervised Learning\n   - Unlabeled data: find patterns\n   - Clustering: customer segments\n   - Dimensionality Reduction: PCA\n\n3. Reinforcement Learning\n   - Agent learns by reward/penalty\n   - Games, robotics, self-driving\n\nWORKFLOW\n========\n1. Collect Data\n2. Clean & Preprocess\n3. Feature Engineering\n4. Train Model\n5. Evaluate (accuracy, precision, recall)\n6. Tune Hyperparameters\n7. Deploy' },
          ]
        },
        {
          title: 'Supervised Learning', code: 'U2',
          topics: ['Linear Regression', 'Logistic Regression', 'Decision Trees', 'Random Forest', 'SVM'],
          content: [
            { title: 'Linear Regression Explained', type: 'video', data: 'https://www.youtube.com/watch?v=nk2CQITm_eo' },
          ]
        },
        {
          title: 'Unsupervised Learning', code: 'U3',
          topics: ['K-Means Clustering', 'Hierarchical Clustering', 'PCA', 'DBSCAN', 'Association Rules'],
          content: [
            { title: 'Clustering Algorithms', type: 'text', data: 'K-MEANS CLUSTERING\n==================\n1. Choose K centroids randomly\n2. Assign each point to nearest centroid\n3. Recalculate centroids as mean of cluster\n4. Repeat until convergence\n\nfrom sklearn.cluster import KMeans\n\nkmeans = KMeans(n_clusters=3)\nkmeans.fit(X)\nlabels = kmeans.predict(X)\ncenters = kmeans.cluster_centers_\n\nChoosing K: Elbow Method\n- Plot inertia (within-cluster sum of squares)\n- Look for "elbow" bend point' },
          ]
        },
        {
          title: 'Neural Networks', code: 'U4',
          topics: ['Perceptron', 'Activation Functions', 'Backpropagation', 'CNN Basics', 'Overfitting & Regularization'],
          content: [
            { title: 'Neural Networks Intro', type: 'video', data: 'https://www.youtube.com/watch?v=aircAruvnKk' },
          ]
        },
      ]
    },
    BE301: {
      mentor: m1,
      subjects: [
        {
          title: 'Node.js Fundamentals', code: 'U1',
          topics: ['Node.js Architecture', 'Modules & NPM', 'File System', 'Event Loop', 'Streams'],
          content: [
            { title: 'Node.js Tutorial', type: 'video', data: 'https://www.youtube.com/watch?v=TlB_eWDSMt4' },
          ]
        },
        {
          title: 'Express.js & REST APIs', code: 'U2',
          topics: ['Express Setup', 'Routes & Middleware', 'Request/Response', 'Error Handling', 'CORS'],
          content: [
            { title: 'Express REST API Guide', type: 'text', data: 'import express from "express";\nconst app = express();\n\napp.use(express.json());\n\n// GET all items\napp.get("/api/items", (req, res) => {\n  res.json({ items: [] });\n});\n\n// POST create item\napp.post("/api/items", (req, res) => {\n  const { name, price } = req.body;\n  // validate, save to DB\n  res.status(201).json({ id: 1, name, price });\n});\n\n// Error middleware\napp.use((err, req, res, next) => {\n  console.error(err.stack);\n  res.status(500).json({ error: "Server error" });\n});\n\napp.listen(5000, () => console.log("Running on :5000"));' },
          ]
        },
        {
          title: 'Authentication & Security', code: 'U3',
          topics: ['JWT Tokens', 'Password Hashing', 'Session Management', 'Rate Limiting', 'Input Validation'],
          content: [
            { title: 'JWT Authentication', type: 'text', data: 'JSON WEB TOKENS (JWT)\n=====================\n\nimport jwt from "jsonwebtoken";\nimport bcrypt from "bcryptjs";\n\n// Register\nconst hash = await bcrypt.hash(password, 10);\n// Save hash to DB\n\n// Login\nconst valid = await bcrypt.compare(password, hash);\nif (valid) {\n  const token = jwt.sign(\n    { userId: user.id, role: user.role },\n    process.env.JWT_SECRET,\n    { expiresIn: "24h" }\n  );\n  res.json({ token });\n}\n\n// Middleware\nfunction authenticate(req, res, next) {\n  const token = req.headers.authorization?.split(" ")[1];\n  const decoded = jwt.verify(token, process.env.JWT_SECRET);\n  req.user = decoded;\n  next();\n}' },
          ]
        },
      ]
    },
    JV201: {
      mentor: m3,
      subjects: [
        {
          title: 'Java Basics', code: 'U1',
          topics: ['JDK Setup', 'Variables & Types', 'Control Structures', 'Arrays', 'Methods'],
          content: [
            { title: 'Java Introduction', type: 'video', data: 'https://www.youtube.com/watch?v=eIrMbAQSU34' },
            { title: 'Java Syntax Guide', type: 'text', data: 'public class Main {\n    public static void main(String[] args) {\n        // Variables\n        int age = 25;\n        String name = "Alice";\n        double gpa = 3.85;\n        boolean isActive = true;\n        \n        // Array\n        int[] numbers = {1, 2, 3, 4, 5};\n        \n        // For loop\n        for (int i = 0; i < numbers.length; i++) {\n            System.out.println(numbers[i]);\n        }\n        \n        // Enhanced for\n        for (int num : numbers) {\n            System.out.println(num);\n        }\n        \n        // Method call\n        int result = add(10, 20);\n    }\n    \n    static int add(int a, int b) {\n        return a + b;\n    }\n}' },
          ]
        },
        {
          title: 'OOP Concepts', code: 'U2',
          topics: ['Classes & Objects', 'Constructors', 'Inheritance', 'Polymorphism', 'Abstract Classes & Interfaces'],
          content: [
            { title: 'Java OOP', type: 'text', data: '// Class definition\npublic class Animal {\n    protected String name;\n    \n    public Animal(String name) {\n        this.name = name;\n    }\n    \n    public void speak() {\n        System.out.println("...");\n    }\n}\n\n// Inheritance\npublic class Dog extends Animal {\n    private String breed;\n    \n    public Dog(String name, String breed) {\n        super(name);\n        this.breed = breed;\n    }\n    \n    @Override\n    public void speak() {\n        System.out.println("Woof!");\n    }\n}\n\n// Interface\npublic interface Drawable {\n    void draw();\n}\n\npublic class Circle implements Drawable {\n    public void draw() { ... }\n}' },
          ]
        },
        {
          title: 'Collections & Generics', code: 'U3',
          topics: ['ArrayList', 'HashMap', 'LinkedList', 'Generics', 'Iterators'],
          content: [
            { title: 'Java Collections', type: 'video', data: 'https://www.youtube.com/watch?v=viTainYq5B4' },
          ]
        },
      ]
    },
    SE401: {
      mentor: m2,
      subjects: [
        {
          title: 'SDLC & Agile', code: 'U1',
          topics: ['Waterfall Model', 'Agile Methodology', 'Scrum Framework', 'Sprint Planning', 'User Stories'],
          content: [
            { title: 'Agile & Scrum Overview', type: 'text', data: 'AGILE PRINCIPLES\n=================\n- Individuals and interactions over processes\n- Working software over documentation\n- Customer collaboration over contracts\n- Responding to change over following a plan\n\nSCRUM FRAMEWORK\n===============\nRoles: Product Owner, Scrum Master, Dev Team\nArtifacts: Product Backlog, Sprint Backlog, Increment\nCeremonies:\n  1. Sprint Planning (what to build)\n  2. Daily Standup (15 min sync)\n  3. Sprint Review (demo)\n  4. Sprint Retrospective (improve)\n\nSprint: 1-4 week iteration\nVelocity: Story points completed per sprint' },
          ]
        },
        {
          title: 'Version Control & CI/CD', code: 'U2',
          topics: ['Git Basics', 'Branching Strategies', 'Pull Requests', 'CI/CD Pipelines', 'Automated Testing'],
          content: [
            { title: 'Git & GitHub Guide', type: 'text', data: 'GIT ESSENTIALS\n===============\ngit init              # Initialize repo\ngit add .             # Stage all files\ngit commit -m "msg"   # Commit\ngit branch feature    # Create branch\ngit checkout feature  # Switch branch\ngit merge feature     # Merge into current\ngit push origin main  # Push to remote\n\nBRANCHING STRATEGY\n==================\nmain ← develop ← feature/xxx\n              ← bugfix/xxx\n              ← hotfix/xxx\n\nCI/CD PIPELINE\n==============\n1. Developer pushes code\n2. CI server pulls & builds\n3. Run automated tests\n4. Static code analysis\n5. Deploy to staging\n6. Manual approval\n7. Deploy to production' },
          ]
        },
        {
          title: 'Design Patterns', code: 'U3',
          topics: ['Singleton', 'Factory', 'Observer', 'Strategy', 'MVC Pattern'],
          content: [
            { title: 'Design Patterns Tutorial', type: 'video', data: 'https://www.youtube.com/watch?v=v9ejT8FO-7I' },
          ]
        },
      ]
    },
    CN301: {
      mentor: m3,
      subjects: [
        {
          title: 'Network Models', code: 'U1',
          topics: ['OSI 7 Layers', 'TCP/IP Model', 'Protocols Overview', 'Network Devices', 'IP Addressing'],
          content: [
            { title: 'Networking Fundamentals', type: 'video', data: 'https://www.youtube.com/watch?v=3QhU9jd03a0' },
            { title: 'OSI Model Reference', type: 'text', data: 'OSI 7 LAYERS\n=============\n7. Application  - HTTP, FTP, SMTP, DNS\n6. Presentation - SSL/TLS, encryption, compression\n5. Session      - Session management, authentication\n4. Transport    - TCP (reliable), UDP (fast)\n3. Network      - IP, routing, ICMP\n2. Data Link    - MAC, Ethernet, switches\n1. Physical     - Cables, signals, hubs\n\nTCP vs UDP\n==========\nTCP: Connection-oriented, reliable, ordered\n     Used for: HTTP, email, file transfer\n\nUDP: Connectionless, fast, no guarantee\n     Used for: streaming, gaming, DNS\n\nIP ADDRESSING (IPv4)\n====================\nFormat: 192.168.1.100\nClasses: A (1-126), B (128-191), C (192-223)\nSubnet: 255.255.255.0 = /24 = 254 hosts' },
          ]
        },
        {
          title: 'Application Layer Protocols', code: 'U2',
          topics: ['HTTP/HTTPS', 'DNS', 'SMTP & POP3', 'FTP', 'WebSocket'],
          content: [
            { title: 'HTTP Protocol Explained', type: 'text', data: 'HTTP METHODS\n=============\nGET    - Retrieve resource\nPOST   - Create resource\nPUT    - Update resource (full)\nPATCH  - Update resource (partial)\nDELETE - Remove resource\n\nSTATUS CODES\n============\n200 OK\n201 Created\n301 Moved Permanently\n400 Bad Request\n401 Unauthorized\n403 Forbidden\n404 Not Found\n500 Internal Server Error\n\nHTTPS = HTTP + TLS\n- Encrypts data in transit\n- Certificate-based authentication\n- Prevents man-in-the-middle attacks' },
          ]
        },
      ]
    },
    OS301: {
      mentor: m1,
      subjects: [
        {
          title: 'Process Management', code: 'U1',
          topics: ['Process vs Thread', 'Process States', 'Context Switching', 'IPC Mechanisms', 'Multithreading'],
          content: [
            { title: 'Processes & Threads', type: 'video', data: 'https://www.youtube.com/watch?v=exbKr6fnoUw' },
            { title: 'Process Management Notes', type: 'text', data: 'PROCESS STATES\n===============\nNew → Ready → Running → Waiting → Ready → Terminated\n\nPROCESS vs THREAD\n==================\nProcess: Independent, separate memory, heavy\nThread: Shares memory with parent, lightweight\n\nCONTEXT SWITCH\n===============\n- Save state of current process (PCB)\n- Load state of next process\n- Overhead: ~1-10 microseconds\n\nIPC (Inter-Process Communication)\n==================================\n1. Pipes (unidirectional)\n2. Message Queues\n3. Shared Memory\n4. Sockets\n5. Signals' },
          ]
        },
        {
          title: 'CPU Scheduling', code: 'U2',
          topics: ['FCFS', 'SJF', 'Round Robin', 'Priority Scheduling', 'Multilevel Queue'],
          content: [
            { title: 'CPU Scheduling Algorithms', type: 'text', data: 'SCHEDULING ALGORITHMS\n=====================\n\nFCFS (First Come First Serve)\n- Non-preemptive, simple\n- Convoy effect problem\n\nSJF (Shortest Job First)\n- Optimal average waiting time\n- Starvation possible\n\nRound Robin\n- Time quantum (e.g., 4ms)\n- Preemptive, fair\n- Higher context switch overhead\n\nPriority Scheduling\n- Each process has priority number\n- Can cause starvation\n- Solution: Aging\n\nMultilevel Queue\n- Separate queues for different types\n- System > Interactive > Batch' },
          ]
        },
        {
          title: 'Memory Management', code: 'U3',
          topics: ['Paging', 'Segmentation', 'Virtual Memory', 'Page Replacement', 'Thrashing'],
          content: [
            { title: 'Virtual Memory & Paging', type: 'video', data: 'https://www.youtube.com/watch?v=sJCtpPQDJYw' },
          ]
        },
      ]
    },
    // ═══════════ EXISTING COURSES (add subjects/topics/content) ═══════════
    DS201: {
      mentor: m1,
      subjects: [
        {
          title: 'Statistics & Probability', code: 'U1',
          topics: ['Descriptive Statistics', 'Probability Basics', 'Distributions', 'Hypothesis Testing', 'Correlation'],
          content: [
            { title: 'Statistics for Data Science', type: 'video', data: 'https://www.youtube.com/watch?v=xxpc-HPKN28' },
            { title: 'Statistics Fundamentals', type: 'text', data: 'DESCRIPTIVE STATISTICS\n======================\nMean: Average of all values\nMedian: Middle value when sorted\nMode: Most frequent value\nStd Dev: Spread of data around mean\n\nPROBABILITY\n===========\nP(A) = favorable outcomes / total outcomes\nP(A ∪ B) = P(A) + P(B) - P(A ∩ B)\nP(A|B) = P(A ∩ B) / P(B)  [Bayes theorem]\n\nDISTRIBUTIONS\n==============\nNormal: Bell curve, 68-95-99.7 rule\nBinomial: n trials, p probability\nPoisson: Events in fixed interval' },
          ]
        },
        {
          title: 'Python for Data Science', code: 'U2',
          topics: ['NumPy Arrays', 'Pandas DataFrames', 'Data Cleaning', 'Matplotlib', 'Seaborn'],
          content: [
            { title: 'Pandas Tutorial', type: 'video', data: 'https://www.youtube.com/watch?v=vmEHCJofslg' },
            { title: 'Pandas Cheat Sheet', type: 'text', data: 'import pandas as pd\nimport numpy as np\n\n# Read data\ndf = pd.read_csv("data.csv")\n\n# Explore\ndf.head()          # First 5 rows\ndf.info()          # Column types\ndf.describe()      # Statistics\ndf.shape           # (rows, cols)\n\n# Select\ndf["column"]       # Single column\ndf[["col1","col2"]]# Multiple columns\ndf[df["age"] > 25] # Filter rows\n\n# Clean\ndf.dropna()        # Remove NaN rows\ndf.fillna(0)       # Fill NaN with 0\ndf.duplicated()    # Find duplicates\n\n# Group\ndf.groupby("dept")["salary"].mean()\n\n# Plot\ndf["salary"].hist()\ndf.plot(kind="scatter", x="age", y="salary")' },
          ]
        },
        {
          title: 'Data Visualization', code: 'U3',
          topics: ['Chart Types', 'Matplotlib Advanced', 'Interactive Plots', 'Dashboard Design', 'Storytelling with Data'],
          content: [
            { title: 'Data Visualization Guide', type: 'text', data: 'CHART TYPES\n============\nBar Chart: Compare categories\nLine Chart: Trends over time\nScatter Plot: Relationships\nHistogram: Distribution\nBox Plot: Spread & outliers\nHeatmap: Correlation matrix\nPie Chart: Proportions (use sparingly)\n\nimport matplotlib.pyplot as plt\n\nfig, ax = plt.subplots(figsize=(10, 6))\nax.bar(categories, values, color="steelblue")\nax.set_title("Sales by Category")\nax.set_xlabel("Category")\nax.set_ylabel("Sales ($)")\nplt.tight_layout()\nplt.show()' },
          ]
        },
        {
          title: 'Machine Learning Basics', code: 'U4',
          topics: ['Supervised Learning', 'Linear Regression', 'Classification', 'Model Evaluation', 'Scikit-learn'],
          content: [
            { title: 'ML with Scikit-learn', type: 'video', data: 'https://www.youtube.com/watch?v=pqNCD_5r0IU' },
          ]
        },
      ]
    },
    MK101: {
      mentor: m2,
      subjects: [
        {
          title: 'SEO & Content Marketing', code: 'U1',
          topics: ['Keyword Research', 'On-Page SEO', 'Content Strategy', 'Blog Marketing', 'SEO Tools'],
          content: [
            { title: 'SEO Fundamentals', type: 'video', data: 'https://www.youtube.com/watch?v=DvwS7cV9GmQ' },
            { title: 'SEO Checklist', type: 'text', data: 'SEO CHECKLIST\n==============\n\nON-PAGE SEO\n- Title tag (50-60 chars, keyword first)\n- Meta description (150-160 chars)\n- H1, H2, H3 tags with keywords\n- Internal linking\n- Image alt tags\n- URL structure (/topic-keyword)\n- Mobile-friendly design\n- Page speed < 3 seconds\n\nCONTENT STRATEGY\n- Research keywords (Google Keyword Planner)\n- Create pillar content + clusters\n- E-A-T: Expertise, Authority, Trust\n- Update content regularly\n- 1500+ words for competitive topics\n\nTOOLS\n- Google Search Console\n- Google Analytics\n- Ahrefs / SEMrush\n- Yoast SEO (WordPress)' },
          ]
        },
        {
          title: 'Social Media Marketing', code: 'U2',
          topics: ['Platform Strategy', 'Content Calendar', 'Engagement Tactics', 'Influencer Marketing', 'Analytics'],
          content: [
            { title: 'Social Media Strategy', type: 'text', data: 'PLATFORM OVERVIEW\n==================\nInstagram: Visual, 18-34 age, Reels perform well\nLinkedIn: B2B, professional content, articles\nTwitter/X: News, conversations, threads\nYouTube: Long-form video, tutorials, SEO\nTikTok: Short-form, Gen Z, trending audio\n\nCONTENT MIX\n============\n80% Value (educate, entertain, inspire)\n20% Promotional\n\nENGAGEMENT FORMULA\n===================\n1. Hook (first 3 seconds)\n2. Value (teach something)\n3. CTA (comment, share, follow)\n\nKEY METRICS\n===========\n- Reach & Impressions\n- Engagement Rate = (likes+comments+shares)/reach\n- Click-through Rate (CTR)\n- Conversion Rate\n- Follower Growth Rate' },
          ]
        },
        {
          title: 'Email Marketing & Analytics', code: 'U3',
          topics: ['Email Campaigns', 'Automation', 'A/B Testing', 'Google Analytics', 'ROI Measurement'],
          content: [
            { title: 'Email Marketing Guide', type: 'text', data: 'EMAIL MARKETING BEST PRACTICES\n================================\n\nSUBJECT LINES\n- Keep under 50 characters\n- Personalize with {first_name}\n- Create urgency or curiosity\n- A/B test different versions\n\nEMAIL STRUCTURE\n- Clear header with logo\n- Single CTA per email\n- Mobile-responsive design\n- Unsubscribe link (legally required)\n\nAUTOMATION SEQUENCES\n- Welcome series (3-5 emails)\n- Abandoned cart recovery\n- Re-engagement campaigns\n- Drip campaigns for nurturing\n\nKEY METRICS\n- Open Rate: 15-25% is good\n- Click Rate: 2-5% is good\n- Unsubscribe Rate: < 0.5%\n- Conversion Rate: Track per campaign' },
          ]
        },
      ]
    },
    DG301: {
      mentor: m2,
      subjects: [
        {
          title: 'Design Principles', code: 'U1',
          topics: ['Color Theory', 'Typography', 'Layout & Grid', 'Visual Hierarchy', 'Gestalt Principles'],
          content: [
            { title: 'UI Design Fundamentals', type: 'video', data: 'https://www.youtube.com/watch?v=_Hp_dI0DzY4' },
            { title: 'Design Principles Reference', type: 'text', data: 'COLOR THEORY\n=============\nPrimary: Red, Blue, Yellow\nComplementary: Opposite on color wheel\nAnalogous: Adjacent on color wheel\n60-30-10 Rule: Primary-Secondary-Accent\n\nTYPOGRAPHY\n===========\n- Heading: Bold, larger, sans-serif\n- Body: Regular, 16px minimum, readable\n- Line height: 1.5-1.8x font size\n- Max 2-3 font families per project\n\nVISUAL HIERARCHY\n=================\n1. Size: Larger = more important\n2. Color: Bright/contrast = attention\n3. Position: Top-left first (F-pattern)\n4. Whitespace: Isolation = emphasis\n5. Alignment: Consistency = order\n\nGESTALT PRINCIPLES\n===================\n- Proximity: Close items = related\n- Similarity: Same style = grouped\n- Closure: Mind completes shapes\n- Continuity: Eye follows paths' },
          ]
        },
        {
          title: 'UX Research & Wireframing', code: 'U2',
          topics: ['User Personas', 'User Journey Maps', 'Wireframing', 'Prototyping', 'Usability Testing'],
          content: [
            { title: 'UX Research Methods', type: 'text', data: 'USER RESEARCH METHODS\n=====================\n\nQUANTITATIVE\n- Surveys (Google Forms, Typeform)\n- Analytics (heatmaps, click tracking)\n- A/B Testing\n\nQUALITATIVE\n- User Interviews (5-8 users)\n- Usability Testing (think-aloud protocol)\n- Card Sorting (information architecture)\n\nUSER PERSONA TEMPLATE\n=====================\nName: Sarah, 28, Marketing Manager\nGoals: Save time, automate reports\nFrustrations: Complex interfaces, slow loading\nTech: MacBook, iPhone, Chrome\nQuote: "I need data at a glance"\n\nWIREFRAMING TOOLS\n=================\n- Figma (free, collaborative)\n- Sketch (Mac only)\n- Adobe XD\n- Balsamiq (low-fidelity)' },
          ]
        },
        {
          title: 'UI Design Tools & Systems', code: 'U3',
          topics: ['Figma Basics', 'Components & Variants', 'Design Systems', 'Responsive Design', 'Handoff to Developers'],
          content: [
            { title: 'Figma Crash Course', type: 'video', data: 'https://www.youtube.com/watch?v=FTFaQWZBqQ8' },
          ]
        },
      ]
    },
    CS401: {
      mentor: m3,
      subjects: [
        {
          title: 'React Native Fundamentals', code: 'U1',
          topics: ['Environment Setup', 'Core Components', 'Styling & Flexbox', 'Navigation', 'Platform-Specific Code'],
          content: [
            { title: 'React Native Tutorial', type: 'video', data: 'https://www.youtube.com/watch?v=0-S5a0eXPoc' },
            { title: 'React Native Basics', type: 'text', data: 'CORE COMPONENTS\n=================\nimport { View, Text, Image, ScrollView, TextInput, TouchableOpacity } from "react-native";\n\nexport default function App() {\n  return (\n    <View style={styles.container}>\n      <Text style={styles.title}>Hello React Native!</Text>\n      <TouchableOpacity style={styles.button}>\n        <Text>Press Me</Text>\n      </TouchableOpacity>\n    </View>\n  );\n}\n\nconst styles = StyleSheet.create({\n  container: {\n    flex: 1,\n    justifyContent: "center",\n    alignItems: "center",\n    backgroundColor: "#fff",\n  },\n  title: {\n    fontSize: 24,\n    fontWeight: "bold",\n  },\n  button: {\n    backgroundColor: "#007AFF",\n    padding: 12,\n    borderRadius: 8,\n  },\n});' },
          ]
        },
        {
          title: 'State & API Integration', code: 'U2',
          topics: ['useState & useEffect', 'Fetching Data', 'AsyncStorage', 'Context API', 'Redux Toolkit'],
          content: [
            { title: 'React Native API & State', type: 'text', data: 'FETCHING DATA\n==============\nconst [users, setUsers] = useState([]);\nconst [loading, setLoading] = useState(true);\n\nuseEffect(() => {\n  fetch("https://jsonplaceholder.typicode.com/users")\n    .then(r => r.json())\n    .then(data => { setUsers(data); setLoading(false); });\n}, []);\n\nFLATLIST\n========\nimport { FlatList } from "react-native";\n\n<FlatList\n  data={users}\n  keyExtractor={item => item.id.toString()}\n  renderItem={({ item }) => (\n    <View><Text>{item.name}</Text></View>\n  )}\n/>\n\nASYNC STORAGE\n=============\nimport AsyncStorage from "@react-native-async-storage/async-storage";\nawait AsyncStorage.setItem("token", "abc123");\nconst token = await AsyncStorage.getItem("token");' },
          ]
        },
        {
          title: 'Publishing & Deployment', code: 'U3',
          topics: ['App Icons & Splash Screen', 'Build for iOS', 'Build for Android', 'App Store Submission', 'OTA Updates'],
          content: [
            { title: 'Publishing Your App', type: 'video', data: 'https://www.youtube.com/watch?v=LE4Mgkrf7Sk' },
          ]
        },
      ]
    },
    CY201: {
      mentor: m3,
      subjects: [
        {
          title: 'Security Fundamentals', code: 'U1',
          topics: ['CIA Triad', 'Types of Threats', 'Attack Vectors', 'Security Policies', 'Risk Assessment'],
          content: [
            { title: 'Cybersecurity Introduction', type: 'video', data: 'https://www.youtube.com/watch?v=inWWhr5tnEA' },
            { title: 'Security Concepts', type: 'text', data: 'CIA TRIAD\n=========\nConfidentiality: Only authorized access\nIntegrity: Data is accurate and unmodified\nAvailability: Systems accessible when needed\n\nCOMMON THREATS\n==============\n- Malware (viruses, ransomware, trojans)\n- Phishing (fake emails/websites)\n- SQL Injection (malicious SQL input)\n- XSS (Cross-Site Scripting)\n- DDoS (Distributed Denial of Service)\n- Man-in-the-Middle (intercepting comms)\n- Social Engineering (human manipulation)\n\nSECURITY LAYERS\n===============\n1. Physical: Locks, cameras, badges\n2. Network: Firewalls, IDS/IPS, VPN\n3. Application: Input validation, auth\n4. Data: Encryption, backups\n5. User: Training, strong passwords, MFA' },
          ]
        },
        {
          title: 'Network Security', code: 'U2',
          topics: ['Firewalls', 'VPN', 'IDS/IPS', 'SSL/TLS', 'Network Monitoring'],
          content: [
            { title: 'Network Security Guide', type: 'text', data: 'FIREWALLS\n=========\n- Packet Filter: IP/port rules\n- Stateful: Tracks connections\n- Application Layer: Deep inspection\n- Next-Gen (NGFW): ML-based detection\n\nVPN (Virtual Private Network)\n==============================\n- Encrypts traffic between endpoints\n- Types: Site-to-Site, Remote Access\n- Protocols: OpenVPN, WireGuard, IPSec\n\nSSL/TLS HANDSHAKE\n==================\n1. Client Hello (supported ciphers)\n2. Server Hello (chosen cipher + cert)\n3. Key Exchange (asymmetric)\n4. Session Keys (symmetric)\n5. Encrypted communication begins\n\nIDS vs IPS\n==========\nIDS: Detects & alerts (passive)\nIPS: Detects & blocks (active)' },
          ]
        },
        {
          title: 'Web Application Security', code: 'U3',
          topics: ['OWASP Top 10', 'SQL Injection Prevention', 'XSS Prevention', 'CSRF Protection', 'Security Headers'],
          content: [
            { title: 'OWASP Top 10 Explained', type: 'video', data: 'https://www.youtube.com/watch?v=rWHniC8FOzc' },
            { title: 'Web Security Practices', type: 'text', data: 'SQL INJECTION PREVENTION\n=========================\n// BAD - vulnerable\nquery = "SELECT * FROM users WHERE id = " + userId;\n\n// GOOD - parameterized\ndb.query("SELECT * FROM users WHERE id = ?", [userId]);\n\nXSS PREVENTION\n===============\n1. Escape output: &lt; &gt; &amp;\n2. Use Content-Security-Policy header\n3. Set HttpOnly cookies\n4. Sanitize user input (DOMPurify)\n\nCSRF PROTECTION\n================\n1. CSRF tokens in forms\n2. SameSite cookie attribute\n3. Check Origin/Referer headers\n\nSECURITY HEADERS\n=================\nX-Content-Type-Options: nosniff\nX-Frame-Options: DENY\nStrict-Transport-Security: max-age=31536000\nContent-Security-Policy: default-src self' },
          ]
        },
      ]
    },
  };

  // ═══════════════════ INSERT SUBJECTS, TOPICS & CONTENT ═══════════════════
  // Also update existing CS101 (Web Dev) with more content
  const [cs101] = await connection.query("SELECT id, mentorId FROM courses WHERE courseCode = 'CS101'");
  if (cs101.length > 0) {
    const cid = cs101[0].id, mid = cs101[0].mentorId;
    // Check if JS subject already exists
    const [existingJS] = await connection.query("SELECT id FROM courseSubjects WHERE courseId = ? AND title LIKE '%JavaScript%'", [cid]);
    if (existingJS.length === 0) {
      // Add more subjects to existing Web Dev course
      const [jsSubject] = await connection.query(
        "INSERT INTO courseSubjects (courseId, title, code, description, sortOrder) VALUES (?, 'JavaScript Essentials', 'U4', 'DOM manipulation, events, and async JS', 4)",
        [cid]
      );
      await connection.query("INSERT INTO courseTopics (subjectId, title, sortOrder) VALUES (?, 'DOM Manipulation', 1), (?, 'Event Listeners', 2), (?, 'Fetch API & Promises', 3), (?, 'Async/Await', 4)", [jsSubject.insertId, jsSubject.insertId, jsSubject.insertId, jsSubject.insertId]);
      await connection.query(
        "INSERT INTO courseContent (courseId, subjectId, title, description, contentType, contentData, sortOrder, status, uploadedBy) VALUES (?, ?, 'JavaScript DOM Tutorial', 'Learn to manipulate HTML elements with JavaScript', 'video', 'https://www.youtube.com/watch?v=y17RuWkWdn8', 1, 'active', ?)",
        [cid, jsSubject.insertId, mid]
      );
      await connection.query(
        "INSERT INTO courseContent (courseId, subjectId, title, description, contentType, contentData, sortOrder, status, uploadedBy) VALUES (?, ?, 'Async JavaScript Guide', 'Promises, async/await, and API calls', 'text', 'PROMISES\\n========\\nfetch(\"https://api.example.com/data\")\\n  .then(res => res.json())\\n  .then(data => console.log(data))\\n  .catch(err => console.error(err));\\n\\nASYNC/AWAIT\\n===========\\nasync function getData() {\\n  try {\\n    const res = await fetch(url);\\n    const data = await res.json();\\n    return data;\\n  } catch (err) {\\n    console.error(err);\\n  }\\n}', 2, 'active', ?)",
        [cid, jsSubject.insertId, mid]
      );

      const [reactSubject] = await connection.query(
        "INSERT INTO courseSubjects (courseId, title, code, description, sortOrder) VALUES (?, 'React Framework', 'U5', 'Building modern UIs with React', 5)",
        [cid]
      );
      await connection.query("INSERT INTO courseTopics (subjectId, title, sortOrder) VALUES (?, 'React Components', 1), (?, 'State & Props', 2), (?, 'useEffect Hook', 3)", [reactSubject.insertId, reactSubject.insertId, reactSubject.insertId]);
      await connection.query(
        "INSERT INTO courseContent (courseId, subjectId, title, description, contentType, contentData, sortOrder, status, uploadedBy) VALUES (?, ?, 'React Crash Course', 'Full React tutorial for beginners', 'video', 'https://www.youtube.com/watch?v=w7ejDZ8SWv8', 1, 'active', ?)",
        [cid, reactSubject.insertId, mid]
      );
      console.log(`  ✅ Added more content to CS101`);
    }
  }

  for (const [code, data] of Object.entries(courseData)) {
    const courseId = courseIds[code];
    if (!courseId) { console.log(`  ⏩ ${code} not found, skipping`); continue; }

    // Use actual mentor from courses table if available
    const mentorId = courseMentorMap[code] || data.mentor;

    // Check if subjects already exist
    const [existingSubs] = await connection.query('SELECT COUNT(*) as cnt FROM courseSubjects WHERE courseId = ?', [courseId]);
    if (existingSubs[0].cnt > 0) { console.log(`  ⏩ ${code} already has subjects`); continue; }

    for (const [si, sub] of data.subjects.entries()) {
      const [subResult] = await connection.query(
        'INSERT INTO courseSubjects (courseId, title, code, description, sortOrder) VALUES (?, ?, ?, ?, ?)',
        [courseId, sub.title, sub.code, `Unit ${si + 1}: ${sub.title}`, si + 1]
      );
      const subId = subResult.insertId;

      // Insert topics
      for (const [ti, topicTitle] of sub.topics.entries()) {
        await connection.query(
          'INSERT INTO courseTopics (subjectId, title, sortOrder) VALUES (?, ?, ?)',
          [subId, topicTitle, ti + 1]
        );
      }

      // Insert content
      for (const [ci, content] of (sub.content || []).entries()) {
        await connection.query(
          'INSERT INTO courseContent (courseId, subjectId, title, description, contentType, contentData, sortOrder, status, uploadedBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [courseId, subId, content.title, content.title, content.type, content.data, ci + 1, 'active', mentorId]
        );
      }
    }
    console.log(`  ✅ ${code} - subjects, topics & content seeded`);
  }

  // ═══════════════════ ENROLL STUDENTS IN NEW COURSES ═══════════════════
  const [studentRows] = await connection.query(`SELECT id FROM users WHERE role = 'student'`);
  const [newCourses] = await connection.query(`SELECT id FROM courses WHERE courseCode IN ('PY101','DSA301','FE201','DB201','ML301')`);

  if (studentRows.length > 0 && newCourses.length > 0) {
    for (const student of studentRows) {
      // Enroll in 2-3 of the new courses
      const shuffled = [...newCourses].sort(() => Math.random() - 0.5).slice(0, 2 + Math.floor(Math.random() * 2));
      for (const course of shuffled) {
        try {
          await connection.query(
            "INSERT IGNORE INTO courseEnrollments (courseId, studentId, completionPercentage, status, completedTopics) VALUES (?, ?, ?, 'active', '[]')",
            [course.id, student.id, Math.floor(Math.random() * 60)]
          );
        } catch {}
      }
    }
    console.log(`  ✅ Students enrolled in new courses`);
  }

  console.log('\n🎉 Course seeding complete!');
  console.log(`   ${Object.keys(courseData).length} new courses with subjects, topics & content`);
  console.log('   Existing courses updated with more content');
}

// ═══════════════════════════════════════════════════════════════════
//  SEED 45 CODING PROBLEMS
// ═══════════════════════════════════════════════════════════════════
async function seedCodingProblems(connection) {
  console.log('\n--- Seeding Coding Problems (45) ---');

  const [mentors] = await connection.query(`SELECT id FROM users WHERE role = 'mentor' ORDER BY id LIMIT 1`);
  if (!mentors.length) { console.error('No mentor found for coding problems'); return; }
  const mid = mentors[0].id;

  // Delete old seeded problems (keep any manually created ones with id < 100)
  await connection.query("DELETE FROM codingProblems WHERE title LIKE '%(Seeded)%'");

  const problems = [
    // ═══ EASY (15) ═══
    {
      title: 'Two Sum (Seeded)', difficulty: 'easy', category: 'Arrays',
      description: 'Given an array of integers and a target, return the indices of two numbers that add up to the target.',
      inputFormat: 'Array of integers and a target integer', outputFormat: 'Array of two indices',
      constraints: '2 ≤ arr.length ≤ 10⁴', sampleInput: '[2,7,11,15]\\n9', sampleOutput: '[0,1]',
      testCases: [{"input":"[2,7,11,15]\\n9","output":"[0,1]"},{"input":"[3,2,4]\\n6","output":"[1,2]"}]
    },
    {
      title: 'Palindrome Check (Seeded)', difficulty: 'easy', category: 'Strings',
      description: 'Determine if a given string is a palindrome (reads the same forwards and backwards).',
      inputFormat: 'A string', outputFormat: 'true or false',
      constraints: '1 ≤ s.length ≤ 10⁵', sampleInput: 'racecar', sampleOutput: 'true',
      testCases: [{"input":"racecar","output":"true"},{"input":"hello","output":"false"}]
    },
    {
      title: 'Reverse Array (Seeded)', difficulty: 'easy', category: 'Arrays',
      description: 'Reverse an array of integers in-place and return it.',
      inputFormat: 'Array of integers', outputFormat: 'Reversed array',
      constraints: '1 ≤ arr.length ≤ 10⁴', sampleInput: '[1,2,3,4,5]', sampleOutput: '[5,4,3,2,1]',
      testCases: [{"input":"[1,2,3,4,5]","output":"[5,4,3,2,1]"},{"input":"[10,20]","output":"[20,10]"}]
    },
    {
      title: 'Count Vowels (Seeded)', difficulty: 'easy', category: 'Strings',
      description: 'Count the number of vowels (a, e, i, o, u) in a given string (case-insensitive).',
      inputFormat: 'A string', outputFormat: 'Integer count',
      constraints: '1 ≤ s.length ≤ 10⁴', sampleInput: 'Hello World', sampleOutput: '3',
      testCases: [{"input":"Hello World","output":"3"},{"input":"aeiou","output":"5"}]
    },
    {
      title: 'Find Maximum (Seeded)', difficulty: 'easy', category: 'Arrays',
      description: 'Find and return the maximum element in an array of integers.',
      inputFormat: 'Array of integers', outputFormat: 'Maximum integer',
      constraints: '1 ≤ arr.length ≤ 10⁴', sampleInput: '[3,7,2,9,1]', sampleOutput: '9',
      testCases: [{"input":"[3,7,2,9,1]","output":"9"},{"input":"[-5,-1,-8]","output":"-1"}]
    },
    {
      title: 'Factorial (Seeded)', difficulty: 'easy', category: 'Math',
      description: 'Calculate the factorial of a non-negative integer n (n!).',
      inputFormat: 'Non-negative integer n', outputFormat: 'n!',
      constraints: '0 ≤ n ≤ 20', sampleInput: '5', sampleOutput: '120',
      testCases: [{"input":"5","output":"120"},{"input":"0","output":"1"},{"input":"10","output":"3628800"}]
    },
    {
      title: 'Fibonacci Number (Seeded)', difficulty: 'easy', category: 'Math',
      description: 'Return the nth Fibonacci number (0-indexed). F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2).',
      inputFormat: 'Integer n', outputFormat: 'F(n)',
      constraints: '0 ≤ n ≤ 30', sampleInput: '6', sampleOutput: '8',
      testCases: [{"input":"6","output":"8"},{"input":"0","output":"0"},{"input":"10","output":"55"}]
    },
    {
      title: 'Sum of Digits (Seeded)', difficulty: 'easy', category: 'Math',
      description: 'Calculate the sum of all digits of a positive integer.',
      inputFormat: 'Positive integer', outputFormat: 'Sum of digits',
      constraints: '1 ≤ n ≤ 10⁹', sampleInput: '1234', sampleOutput: '10',
      testCases: [{"input":"1234","output":"10"},{"input":"999","output":"27"}]
    },
    {
      title: 'FizzBuzz (Seeded)', difficulty: 'easy', category: 'Math',
      description: 'For a given number n, print "Fizz" if divisible by 3, "Buzz" if by 5, "FizzBuzz" if by both, else the number.',
      inputFormat: 'Integer n', outputFormat: 'String result',
      constraints: '1 ≤ n ≤ 100', sampleInput: '15', sampleOutput: 'FizzBuzz',
      testCases: [{"input":"15","output":"FizzBuzz"},{"input":"7","output":"7"},{"input":"9","output":"Fizz"}]
    },
    {
      title: 'Remove Duplicates (Seeded)', difficulty: 'easy', category: 'Arrays',
      description: 'Remove duplicate values from a sorted array and return the unique elements.',
      inputFormat: 'Sorted array of integers', outputFormat: 'Array of unique integers',
      constraints: '1 ≤ arr.length ≤ 10⁴', sampleInput: '[1,1,2,2,3]', sampleOutput: '[1,2,3]',
      testCases: [{"input":"[1,1,2,2,3]","output":"[1,2,3]"},{"input":"[5,5,5]","output":"[5]"}]
    },
    {
      title: 'Count Occurrences (Seeded)', difficulty: 'easy', category: 'Arrays',
      description: 'Count how many times a target value appears in an array.',
      inputFormat: 'Array and target integer', outputFormat: 'Count',
      constraints: '1 ≤ arr.length ≤ 10⁴', sampleInput: '[1,2,3,2,2,4]\\n2', sampleOutput: '3',
      testCases: [{"input":"[1,2,3,2,2,4]\\n2","output":"3"},{"input":"[5,5,5]\\n5","output":"3"}]
    },
    {
      title: 'Capitalize First Letter (Seeded)', difficulty: 'easy', category: 'Strings',
      description: 'Capitalize the first letter of each word in a sentence.',
      inputFormat: 'A string sentence', outputFormat: 'Capitalized sentence',
      constraints: '1 ≤ s.length ≤ 10³', sampleInput: 'hello world', sampleOutput: 'Hello World',
      testCases: [{"input":"hello world","output":"Hello World"},{"input":"javaScript is fun","output":"JavaScript Is Fun"}]
    },
    {
      title: 'Check Prime (Seeded)', difficulty: 'easy', category: 'Math',
      description: 'Determine if a given number is a prime number.',
      inputFormat: 'Positive integer', outputFormat: 'true or false',
      constraints: '2 ≤ n ≤ 10⁶', sampleInput: '17', sampleOutput: 'true',
      testCases: [{"input":"17","output":"true"},{"input":"4","output":"false"},{"input":"2","output":"true"}]
    },
    {
      title: 'Merge Two Arrays (Seeded)', difficulty: 'easy', category: 'Arrays',
      description: 'Merge two sorted arrays into one sorted array.',
      inputFormat: 'Two sorted arrays', outputFormat: 'One merged sorted array',
      constraints: 'Arrays length ≤ 10⁴', sampleInput: '[1,3,5]\\n[2,4,6]', sampleOutput: '[1,2,3,4,5,6]',
      testCases: [{"input":"[1,3,5]\\n[2,4,6]","output":"[1,2,3,4,5,6]"},{"input":"[1]\\n[2,3]","output":"[1,2,3]"}]
    },
    {
      title: 'String Reverse (Seeded)', difficulty: 'easy', category: 'Strings',
      description: 'Reverse a string without using built-in reverse methods.',
      inputFormat: 'A string', outputFormat: 'Reversed string',
      constraints: '1 ≤ s.length ≤ 10⁴', sampleInput: 'algorithm', sampleOutput: 'mhtirogla',
      testCases: [{"input":"algorithm","output":"mhtirogla"},{"input":"hello","output":"olleh"}]
    },

    // ═══ MEDIUM (15) ═══
    {
      title: 'Binary Search (Seeded)', difficulty: 'medium', category: 'Searching',
      description: 'Implement binary search on a sorted array. Return the index of the target or -1.',
      inputFormat: 'Sorted array and target', outputFormat: 'Index or -1',
      constraints: '1 ≤ arr.length ≤ 10⁵', sampleInput: '[1,3,5,7,9]\\n5', sampleOutput: '2',
      testCases: [{"input":"[1,3,5,7,9]\\n5","output":"2"},{"input":"[1,3,5,7,9]\\n4","output":"-1"}]
    },
    {
      title: 'Valid Parentheses (Seeded)', difficulty: 'medium', category: 'Stack',
      description: 'Check if a string of brackets ()[]\\{\\} is valid — every open bracket is closed in order.',
      inputFormat: 'String of brackets', outputFormat: 'true or false',
      constraints: '1 ≤ s.length ≤ 10⁴', sampleInput: '({[]})', sampleOutput: 'true',
      testCases: [{"input":"({[]})","output":"true"},{"input":"([)]","output":"false"}]
    },
    {
      title: 'Rotate Array (Seeded)', difficulty: 'medium', category: 'Arrays',
      description: 'Rotate an array to the right by k steps.',
      inputFormat: 'Array and integer k', outputFormat: 'Rotated array',
      constraints: '1 ≤ arr.length ≤ 10⁵', sampleInput: '[1,2,3,4,5]\\n2', sampleOutput: '[4,5,1,2,3]',
      testCases: [{"input":"[1,2,3,4,5]\\n2","output":"[4,5,1,2,3]"},{"input":"[1,2,3]\\n1","output":"[3,1,2]"}]
    },
    {
      title: 'Anagram Check (Seeded)', difficulty: 'medium', category: 'Strings',
      description: 'Determine if two strings are anagrams of each other (same characters, different order).',
      inputFormat: 'Two strings', outputFormat: 'true or false',
      constraints: '1 ≤ length ≤ 10⁴', sampleInput: 'listen\\nsilent', sampleOutput: 'true',
      testCases: [{"input":"listen\\nsilent","output":"true"},{"input":"hello\\nworld","output":"false"}]
    },
    {
      title: 'GCD of Two Numbers (Seeded)', difficulty: 'medium', category: 'Math',
      description: 'Find the Greatest Common Divisor of two positive integers using Euclid\'s algorithm.',
      inputFormat: 'Two positive integers', outputFormat: 'GCD',
      constraints: '1 ≤ a, b ≤ 10⁹', sampleInput: '48\\n18', sampleOutput: '6',
      testCases: [{"input":"48\\n18","output":"6"},{"input":"100\\n75","output":"25"}]
    },
    {
      title: 'Matrix Transpose (Seeded)', difficulty: 'medium', category: 'Arrays',
      description: 'Return the transpose of a given m×n matrix.',
      inputFormat: '2D array (matrix)', outputFormat: 'Transposed matrix',
      constraints: '1 ≤ m,n ≤ 100', sampleInput: '[[1,2,3],[4,5,6]]', sampleOutput: '[[1,4],[2,5],[3,6]]',
      testCases: [{"input":"[[1,2,3],[4,5,6]]","output":"[[1,4],[2,5],[3,6]]"}]
    },
    {
      title: 'Power Function (Seeded)', difficulty: 'medium', category: 'Recursion',
      description: 'Implement pow(base, exponent) without using built-in power functions.',
      inputFormat: 'Base and exponent integers', outputFormat: 'Result',
      constraints: '-10 ≤ base ≤ 10, 0 ≤ exp ≤ 20', sampleInput: '2\\n10', sampleOutput: '1024',
      testCases: [{"input":"2\\n10","output":"1024"},{"input":"3\\n4","output":"81"}]
    },
    {
      title: 'Flatten Nested Array (Seeded)', difficulty: 'medium', category: 'Arrays',
      description: 'Flatten a nested array into a single-level array.',
      inputFormat: 'Nested array', outputFormat: 'Flat array',
      constraints: 'Depth ≤ 5', sampleInput: '[1,[2,[3,4],5]]', sampleOutput: '[1,2,3,4,5]',
      testCases: [{"input":"[1,[2,[3,4],5]]","output":"[1,2,3,4,5]"},{"input":"[[1,2],[3,[4]]]","output":"[1,2,3,4]"}]
    },
    {
      title: 'Find Missing Number (Seeded)', difficulty: 'medium', category: 'Arrays',
      description: 'Given an array containing n distinct numbers from 0 to n, find the missing one.',
      inputFormat: 'Array of n distinct integers [0..n]', outputFormat: 'Missing number',
      constraints: '1 ≤ n ≤ 10⁴', sampleInput: '[3,0,1]', sampleOutput: '2',
      testCases: [{"input":"[3,0,1]","output":"2"},{"input":"[0,1,2,4]","output":"3"}]
    },
    {
      title: 'Product Except Self (Seeded)', difficulty: 'medium', category: 'Arrays',
      description: 'Return an array where each element is the product of all other elements (no division).',
      inputFormat: 'Array of integers', outputFormat: 'Array of products',
      constraints: '2 ≤ arr.length ≤ 10⁴', sampleInput: '[1,2,3,4]', sampleOutput: '[24,12,8,6]',
      testCases: [{"input":"[1,2,3,4]","output":"[24,12,8,6]"},{"input":"[2,3]","output":"[3,2]"}]
    },
    {
      title: 'String Compression (Seeded)', difficulty: 'medium', category: 'Strings',
      description: 'Compress a string using counts of repeated characters. Return original if compressed is not shorter.',
      inputFormat: 'A string', outputFormat: 'Compressed string or original',
      constraints: '1 ≤ s.length ≤ 10⁴', sampleInput: 'aabcccccaaa', sampleOutput: 'a2b1c5a3',
      testCases: [{"input":"aabcccccaaa","output":"a2b1c5a3"},{"input":"abc","output":"abc"}]
    },
    {
      title: 'Spiral Matrix (Seeded)', difficulty: 'medium', category: 'Arrays',
      description: 'Return all elements of an m×n matrix in spiral order.',
      inputFormat: '2D matrix', outputFormat: 'Array in spiral order',
      constraints: '1 ≤ m,n ≤ 10', sampleInput: '[[1,2,3],[4,5,6],[7,8,9]]', sampleOutput: '[1,2,3,6,9,8,7,4,5]',
      testCases: [{"input":"[[1,2,3],[4,5,6],[7,8,9]]","output":"[1,2,3,6,9,8,7,4,5]"}]
    },
    {
      title: 'Longest Substring Without Repeats (Seeded)', difficulty: 'medium', category: 'Strings',
      description: 'Find the length of the longest substring without repeating characters.',
      inputFormat: 'A string', outputFormat: 'Integer length',
      constraints: '0 ≤ s.length ≤ 5×10⁴', sampleInput: 'abcabcbb', sampleOutput: '3',
      testCases: [{"input":"abcabcbb","output":"3"},{"input":"bbbbb","output":"1"}]
    },
    {
      title: 'Kadane Maximum Subarray (Seeded)', difficulty: 'medium', category: 'Arrays',
      description: 'Find the contiguous subarray with the largest sum (Kadane\'s algorithm).',
      inputFormat: 'Array of integers', outputFormat: 'Maximum subarray sum',
      constraints: '1 ≤ arr.length ≤ 10⁵', sampleInput: '[-2,1,-3,4,-1,2,1,-5,4]', sampleOutput: '6',
      testCases: [{"input":"[-2,1,-3,4,-1,2,1,-5,4]","output":"6"},{"input":"[1]","output":"1"}]
    },
    {
      title: 'Integer to Roman (Seeded)', difficulty: 'medium', category: 'Math',
      description: 'Convert an integer to its Roman numeral representation.',
      inputFormat: 'Integer (1 to 3999)', outputFormat: 'Roman numeral string',
      constraints: '1 ≤ num ≤ 3999', sampleInput: '1994', sampleOutput: 'MCMXCIV',
      testCases: [{"input":"1994","output":"MCMXCIV"},{"input":"58","output":"LVIII"}]
    },

    // ═══ HARD (15) ═══
    {
      title: 'Longest Common Subsequence (Seeded)', difficulty: 'hard', category: 'Dynamic Programming',
      description: 'Find the length of the longest common subsequence of two strings.',
      inputFormat: 'Two strings', outputFormat: 'LCS length',
      constraints: '1 ≤ length ≤ 10³', sampleInput: 'abcde\\nace', sampleOutput: '3',
      testCases: [{"input":"abcde\\nace","output":"3"},{"input":"abc\\ndef","output":"0"}]
    },
    {
      title: '0/1 Knapsack Problem (Seeded)', difficulty: 'hard', category: 'Dynamic Programming',
      description: 'Given items with weights and values, maximise total value without exceeding capacity.',
      inputFormat: 'capacity, weights[], values[]', outputFormat: 'Maximum value',
      constraints: 'n ≤ 100, W ≤ 10⁴', sampleInput: '50\\n[10,20,30]\\n[60,100,120]', sampleOutput: '220',
      testCases: [{"input":"50\\n[10,20,30]\\n[60,100,120]","output":"220"}]
    },
    {
      title: 'N-Queens Validator (Seeded)', difficulty: 'hard', category: 'Backtracking',
      description: 'Given an n×n board, validate if queens placement is valid (no two queens attack each other).',
      inputFormat: 'Array of column positions per row', outputFormat: 'true or false',
      constraints: '1 ≤ n ≤ 15', sampleInput: '[1,3,0,2]', sampleOutput: 'true',
      testCases: [{"input":"[1,3,0,2]","output":"true"},{"input":"[0,1,2,3]","output":"false"}]
    },
    {
      title: 'Merge Intervals (Seeded)', difficulty: 'hard', category: 'Arrays',
      description: 'Given a collection of intervals, merge all overlapping intervals.',
      inputFormat: 'Array of [start, end] intervals', outputFormat: 'Merged intervals',
      constraints: '1 ≤ intervals.length ≤ 10⁴', sampleInput: '[[1,3],[2,6],[8,10],[15,18]]', sampleOutput: '[[1,6],[8,10],[15,18]]',
      testCases: [{"input":"[[1,3],[2,6],[8,10],[15,18]]","output":"[[1,6],[8,10],[15,18]]"}]
    },
    {
      title: 'Longest Increasing Subsequence (Seeded)', difficulty: 'hard', category: 'Dynamic Programming',
      description: 'Find the length of the longest strictly increasing subsequence.',
      inputFormat: 'Array of integers', outputFormat: 'LIS length',
      constraints: '1 ≤ arr.length ≤ 2500', sampleInput: '[10,9,2,5,3,7,101,18]', sampleOutput: '4',
      testCases: [{"input":"[10,9,2,5,3,7,101,18]","output":"4"},{"input":"[0,1,0,3,2,3]","output":"4"}]
    },
    {
      title: 'Edit Distance (Seeded)', difficulty: 'hard', category: 'Dynamic Programming',
      description: 'Find the minimum number of operations (insert, delete, replace) to convert one string to another.',
      inputFormat: 'Two strings', outputFormat: 'Minimum operations',
      constraints: '0 ≤ length ≤ 500', sampleInput: 'horse\\nros', sampleOutput: '3',
      testCases: [{"input":"horse\\nros","output":"3"},{"input":"intention\\nexecution","output":"5"}]
    },
    {
      title: 'Coin Change (Min Coins) (Seeded)', difficulty: 'hard', category: 'Dynamic Programming',
      description: 'Find the fewest number of coins needed to make up a given amount.',
      inputFormat: 'Coins array and amount', outputFormat: 'Minimum coins or -1',
      constraints: '1 ≤ coins.length ≤ 12', sampleInput: '[1,5,10,25]\\n30', sampleOutput: '2',
      testCases: [{"input":"[1,5,10,25]\\n30","output":"2"},{"input":"[2]\\n3","output":"-1"}]
    },
    {
      title: 'Trie Implementation (Seeded)', difficulty: 'hard', category: 'Trees',
      description: 'Implement a Trie with insert, search, and startsWith methods.',
      inputFormat: 'Array of operations', outputFormat: 'Array of results',
      constraints: 'Words length ≤ 200', sampleInput: 'insert(apple)\\nsearch(apple)\\nstartsWith(app)', sampleOutput: 'true\\ntrue',
      testCases: [{"input":"insert(apple)\\nsearch(apple)","output":"true"},{"input":"insert(apple)\\nsearch(app)","output":"false"}]
    },
    {
      title: 'Graph BFS Shortest Path (Seeded)', difficulty: 'hard', category: 'Graphs',
      description: 'Find the shortest path between two nodes in an unweighted graph using BFS.',
      inputFormat: 'Adjacency list, start, end', outputFormat: 'Shortest path length',
      constraints: 'Nodes ≤ 10⁴', sampleInput: '{0:[1,2],1:[0,3],2:[0,3],3:[1,2]}\\n0\\n3', sampleOutput: '2',
      testCases: [{"input":"{0:[1,2],1:[0,3],2:[0,3],3:[1,2]}\\n0\\n3","output":"2"}]
    },
    {
      title: 'Dijkstra Shortest Path (Seeded)', difficulty: 'hard', category: 'Graphs',
      description: 'Implement Dijkstra\'s algorithm to find shortest distances from source to all nodes.',
      inputFormat: 'n, edges [[from,to,weight]], source', outputFormat: 'Array of shortest distances',
      constraints: 'Nodes ≤ 10³', sampleInput: '4\\n[[0,1,4],[0,2,1],[2,1,2],[1,3,1],[2,3,5]]\\n0', sampleOutput: '[0,3,1,4]',
      testCases: [{"input":"4\\n[[0,1,4],[0,2,1],[2,1,2],[1,3,1],[2,3,5]]\\n0","output":"[0,3,1,4]"}]
    },
    {
      title: 'Topological Sort (Seeded)', difficulty: 'hard', category: 'Graphs',
      description: 'Return a valid topological ordering of a directed acyclic graph.',
      inputFormat: 'n nodes, edges [[from, to]]', outputFormat: 'Array of nodes in topological order',
      constraints: 'n ≤ 10⁴', sampleInput: '4\\n[[0,1],[0,2],[1,3],[2,3]]', sampleOutput: '[0,2,1,3]',
      testCases: [{"input":"4\\n[[0,1],[0,2],[1,3],[2,3]]","output":"[0,1,2,3] or [0,2,1,3]"}]
    },
    {
      title: 'Minimum Spanning Tree (Seeded)', difficulty: 'hard', category: 'Graphs',
      description: 'Find the total weight of the minimum spanning tree of a weighted undirected graph.',
      inputFormat: 'n nodes, edges [[u,v,weight]]', outputFormat: 'Total MST weight',
      constraints: 'n ≤ 10³', sampleInput: '4\\n[[0,1,10],[0,2,6],[0,3,5],[1,3,15],[2,3,4]]', sampleOutput: '19',
      testCases: [{"input":"4\\n[[0,1,10],[0,2,6],[0,3,5],[1,3,15],[2,3,4]]","output":"19"}]
    },
    {
      title: 'Rod Cutting (Seeded)', difficulty: 'hard', category: 'Dynamic Programming',
      description: 'Given a rod of length n and price list, determine the maximum revenue from cutting.',
      inputFormat: 'Prices array, rod length n', outputFormat: 'Maximum revenue',
      constraints: 'n ≤ 100', sampleInput: '[1,5,8,9,10,17,17,20]\\n8', sampleOutput: '22',
      testCases: [{"input":"[1,5,8,9,10,17,17,20]\\n8","output":"22"}]
    },
    {
      title: 'Matrix Chain Multiplication (Seeded)', difficulty: 'hard', category: 'Dynamic Programming',
      description: 'Find the minimum number of scalar multiplications needed to multiply a chain of matrices.',
      inputFormat: 'Array of matrix dimensions', outputFormat: 'Minimum multiplications',
      constraints: 'n ≤ 100', sampleInput: '[10,20,30,40,30]', sampleOutput: '30000',
      testCases: [{"input":"[10,20,30,40,30]","output":"30000"},{"input":"[40,20,30,10,30]","output":"26000"}]
    },
    {
      title: 'Word Break (Seeded)', difficulty: 'hard', category: 'Dynamic Programming',
      description: 'Given a string and a dictionary, determine if the string can be segmented into dictionary words.',
      inputFormat: 'String and array of dictionary words', outputFormat: 'true or false',
      constraints: '1 ≤ s.length ≤ 300', sampleInput: 'leetcode\\n[leet,code]', sampleOutput: 'true',
      testCases: [{"input":"leetcode\\n[leet,code]","output":"true"},{"input":"catsandog\\n[cats,dog,sand,and,cat]","output":"false"}]
    }
  ];

  for (const p of problems) {
    await connection.query(
      `INSERT INTO codingProblems (mentorId, title, description, difficulty, category, inputFormat, outputFormat, \`constraints\`, sampleInput, sampleOutput, testCases) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [mid, p.title, p.description, p.difficulty, p.category, p.inputFormat, p.outputFormat, p.constraints, p.sampleInput, p.sampleOutput, JSON.stringify(p.testCases)]
    );
  }

  console.log(`  ✅ Seeded ${problems.length} coding problems (Easy: 15, Medium: 15, Hard: 15)`);
}


seed().catch(err => {
  console.error(' Seed failed:', err.message);
  console.error(err.stack);
  process.exit(1);
});
