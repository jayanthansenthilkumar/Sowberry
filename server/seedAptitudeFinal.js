
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const TOTAL_QUESTIONS_PER_SET = 26; 

// ----------------------------------------------------------------------------
// Improved Pools (Expanded)
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

// ----------------------------------------------------------------------------
// Generators
// ----------------------------------------------------------------------------

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
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sowberry',
  });

  console.log('Cleaning up previous generated sets...');
  
  await connection.query("DELETE FROM aptitudeTests WHERE title LIKE 'Quantitative Practice Set%'");
  await connection.query("DELETE FROM aptitudeTests WHERE title LIKE 'Logical Reasoning Set%'");
  await connection.query("DELETE FROM aptitudeTests WHERE title LIKE 'Verbal Ability Set%'");
  await connection.query("DELETE FROM aptitudeTests WHERE title LIKE 'Technical Computer Science Set%'");

  console.log('🧠 Seeding 20 sets (EXPANDED CONCEPTS)...');

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
