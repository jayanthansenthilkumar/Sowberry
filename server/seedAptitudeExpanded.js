
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const TOTAL_QUESTIONS_PER_SET = 26; 

// ----------------------------------------------------------------------------
// Improved Pools (> 26 items each)
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
    { q: "Synonym of 'Angry'?", A: "Happy", B: "Furious", C: "Calm", D: "Joyful", c: "B", e: "Furious means very angry." },
    { q: "Antonym of 'Hot'?", A: "Cold", B: "Warm", C: "Boiling", D: "Day", c: "A", e: "Opposite of hot is cold." },
    { q: "Correct spelling:", A: "Definately", B: "Definitely", C: "Definitly", D: "Definetly", c: "B", e: "Definitely." },
    { q: "Past participle of 'Go'?", A: "Went", B: "Gone", C: "Goed", D: "Going", c: "B", e: "Go -> Went -> Gone." },
    { q: "'Bite the bullet' means:", A: "Eat metal", B: "Face diffculty", C: "Shoot", D: "Run away", c: "B", e: "Endure a painful situation." },
    { q: "Synonym of 'Beautiful'?", A: "Ugly", B: "Pretty", C: "Dark", D: "Old", c: "B", e: "Pretty." },
    { q: "Antonym of 'Love'?", A: "Like", B: "Hate", C: "Help", D: "Care", c: "B", e: "Hate." },
    { q: "Person who flies a plane?", A: "Driver", B: "Pilot", C: "Captain", D: "Sailor", c: "B", e: "Pilot." },
    { q: "Plural of 'Mouse'?", A: "Mouses", B: "Mice", C: "Mouse", D: "Meese", c: "B", e: "Mice." },
    { q: "'Call it a day' means:", A: "Stop working", B: "Start working", C: "Name a day", D: "Telephone", c: "A", e: "Stop working for the day." },
    { q: "Synonym of 'Intelligent'?", A: "Smart", B: "Dumb", C: "Slow", D: "Weak", c: "A", e: "Smart." },
    { q: "Antonym of 'Rich'?", A: "Wealthy", B: "Poor", C: "Strong", D: "Tall", c: "B", e: "Poor." },
    { q: "Correct spelling:", A: "Seperate", B: "Separate", C: "Seperat", D: "Saperate", c: "B", e: "Separate." },
    { q: "Comparison: As brave as a ...?", A: "Lion", B: "Mouse", C: "Dog", D: "Cat", c: "A", e: "Lion." },
    { q: "Homophone of 'Sea'?", A: "See", B: "Saw", C: "Seen", D: "Scene", c: "A", e: "See." },
    { q: "Synonym of 'Difficult'?", A: "Easy", B: "Hard", C: "Soft", D: "Simple", c: "B", e: "Hard." },
    { q: "Antonym of 'Start'?", A: "Begin", B: "Finish", C: "Go", D: "Run", c: "B", e: "Finish." },
    { q: "Capital of France?", A: "London", B: "Paris", C: "Rome", D: "Berlin", c: "B", e: "Paris." },
    { q: "Opposite of 'Create'?", A: "Make", B: "Destroy", C: "Build", D: "Form", c: "B", e: "Destroy." },
    { q: "Correct spelling:", A: "Accomodate", B: "Accommodate", C: "Acomodate", D: "Acommodate", c: "B", e: "Accommodate." }
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
    { q: "Keyboard is an?", A: "Input Device", B: "Output Device", C: "Storage", D: "Processing", c: "A", e: "Input." },
    { q: "Full form of IP?", A: "Internet Protocol", B: "Intranet Protocol", C: "Internal Protocol", D: "Input Protocol", c: "A", e: "Internet Protocol." },
    { q: "Which is not an OS?", A: "Windows", B: "Python", C: "Linux", D: "MacOS", c: "B", e: "Python is a language." },
    { q: "Binary for 5?", A: "100", B: "101", C: "110", D: "111", c: "B", e: "101." },
    { q: "Short cut for Copy?", A: "Ctrl+V", B: "Ctrl+C", C: "Ctrl+X", D: "Ctrl+P", c: "B", e: "Ctrl+C." },
    { q: "WWW stands for?", A: "World Wide Web", B: "World Web Wide", C: "Wide World Web", D: "Web World Wide", c: "A", e: "World Wide Web." },
    { q: "Who founded Microsoft?", A: "Jobs", B: "Gates", C: "Musk", D: "Bezos", c: "B", e: "Bill Gates." },
    { q: "SQL is for?", A: "Design", B: "Database", C: "Networking", D: "OS", c: "B", e: "Structured Query Language." },
    { q: " Smallest unit of data?", A: "Bit", B: "Byte", C: "KB", D: "MB", c: "A", e: "Bit." },
    { q: "1 KB = ?", A: "1000 Bytes", B: "1024 Bytes", C: "1024 Bits", D: "100 Bytes", c: "B", e: "1024 Bytes." },
    { q: "Python is?", A: "Compiled", B: "Interpreted", C: "Hardware", D: "Low-level", c: "B", e: "Interpreted language." },
    { q: "CSS stands for?", A: "Cascading Style Sheets", B: "Computer Style Sheets", C: "Creative Style Sheets", D: "Colorful Style Sheets", c: "A", e: "Cascading Style Sheets." },
    { q: "DOM stands for?", A: "Document Object Model", B: "Data Object Model", C: "Document Order Model", D: "Data Order Model", c: "A", e: "Document Object Model." },
    { q: "Which is a backend language?", A: "HTML", B: "Node.js", C: "CSS", D: "XML", c: "B", e: "Node.js (runtime)." },
    { q: "Git is for?", A: "Version Control", B: "Editing", C: "Testing", D: "Browsing", c: "A", e: "Version Control System." },
    { q: "Error 404 means?", A: "Server Error", B: "Not Found", C: "Forbidden", D: "Bad Request", c: "B", e: "Not Found." },
    { q: "JSON stands for?", A: "Java Standard Object Notation", B: "JavaScript Object Notation", C: "JavaScript Object Name", D: "Java Standard Object Name", c: "B", e: "JavaScript Object Notation." },
    { q: "React is a?", A: "Database", B: "Library", C: "OS", D: "Language", c: "B", e: "Library." },
    { q: "Vue is a?", A: "Framework", B: "Database", C: "OS", D: "Language", c: "A", e: "Framework." },
    { q: "Angular is by?", A: "Facebook", B: "Google", C: "Microsoft", D: "Apple", c: "B", e: "Google." },
    { q: "Linux mascot?", A: "Cat", B: "Penguin", C: "Dog", D: "Bird", c: "B", e: "Tux the Penguin." }
];

// ----------------------------------------------------------------------------
// Generators
// ----------------------------------------------------------------------------

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateMathQuestion() {
  const types = ['percentage', 'ratio', 'arithmetic', 'interest', 'time_work', 'speed_distance'];
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
      const ans = n1 + n2; // Changed to + for variety or * 
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
        // 1/d1 + 1/2d1 = 3/2d1 -> time = 2d1/3
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
  }
  return { q, A: String(a), B: String(b), C: String(c), D: String(d), correct, explanation };
}

function generateLogicQuestion() {
    const types = ['series_add', 'series_mult'];
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
    } else {
        const start = getRandomInt(2, 4);
        const mul = 2;
        const s = [start, start*mul, start*mul*2, start*mul*4]; // This logic is flawed, should be *2, *4? No, *2, *2
        // Correct: start, start*2, start*4, start*8
        const s2 = [start, start*2, start*4, start*8];
        const next = start*16;
        q = `Series: ${s2.join(', ')}, ?`;
        correct = 'B';
        a = next-2; b = next; c = next+2; d = next+4;
        explanation = `x2`;
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
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sowberry',
  });

  console.log('Cleaning up previous generated sets...');
  // Only delete the sets we created (Pattern 'Set %')
  // Be careful not to delete original ones if they match
  // The generator used 'Quantitative Practice Set %', 'Logical Reasoning Set %', etc.
  
  await connection.query("DELETE FROM aptitudeTests WHERE title LIKE 'Quantitative Practice Set%'");
  await connection.query("DELETE FROM aptitudeTests WHERE title LIKE 'Logical Reasoning Set%'");
  await connection.query("DELETE FROM aptitudeTests WHERE title LIKE 'Verbal Ability Set%'");
  await connection.query("DELETE FROM aptitudeTests WHERE title LIKE 'Technical Computer Science Set%'");

  console.log('🧠 Seeding 20 sets (REVISED)...');

  const [mentors] = await connection.query(`SELECT id FROM users WHERE role = 'mentor' ORDER BY id LIMIT 1`);
  if (!mentors.length) { console.error('No mentor found'); process.exit(1); }
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
      
      // Shuffle pools for V/T
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
      console.log(`Created: ${set.title}`);
  }

  console.log('✅ Done.');
  await connection.end();
}

seed().catch(console.error);
