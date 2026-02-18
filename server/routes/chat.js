import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// ══════════════════════════════════════════════════════════════
// JUNNIYA — Sowberry Academy AI Chat Assistant
// Fully self-contained: no external API keys required.
// Uses intent detection, context tracking, DB-powered live stats,
// deep platform knowledge from actual routes, and rich responses.
// ══════════════════════════════════════════════════════════════

// ──────────────── SESSION MANAGEMENT ────────────────
const conversations = new Map();

setInterval(() => {
  const cutoff = Date.now() - 45 * 60 * 1000;
  for (const [key, conv] of conversations) {
    if (conv.lastAccess < cutoff) conversations.delete(key);
  }
}, 15 * 60 * 1000);

// ──────────────── INTENT DETECTION ENGINE ────────────────
const intentList = [
  { id: 'greeting', patterns: [/^(hi|hello|hey|hola|howdy|greetings|yo|sup|good\s*(morning|afternoon|evening|night)|what'?s\s*up)/i], priority: 10 },
  { id: 'farewell', patterns: [/^(bye|goodbye|see\s*you|cya|good\s*night|gn|take\s*care|later|adios|ciao)/i], priority: 10 },
  { id: 'thanks', patterns: [/\b(thank|thanks|thx|thankyou|ty|appreciate|grateful)\b/i], priority: 9 },
  { id: 'identity', patterns: [/who\s*(are|r)\s*you|your\s*name|what\s*(are|r)\s*you|introduce\s*yourself|about\s*you|tell\s*me\s*about\s*(yourself|you)/i], priority: 10 },
  { id: 'creator', patterns: [/who\s*(made|created|built|developed|designed)\s*you|who\s*is\s*your\s*(creator|developer|maker)|your\s*(creator|developer)/i], priority: 10 },
  { id: 'platform_overview', patterns: [/what\s*is\s*sowberry|about\s*sowberry|tell\s*me\s*about\s*(the\s*)?(platform|sowberry)|sowberry\s*academy|what\s*does\s*sowberry/i], priority: 8 },
  { id: 'platform_stats', patterns: [/how\s*many\s*(student|mentor|course|user|enroll)|total\s*(student|mentor|course|user)|platform\s*stat|show\s*(me\s*)?stats|dashboard\s*stat/i], priority: 8 },
  { id: 'capabilities', patterns: [/what\s*can\s*you\s*(do|help)|your\s*(capabilities|features|skills)|help\s*me|can\s*you\s*help/i], priority: 7 },
  { id: 'feat_courses', patterns: [/\b(course|enroll|unenroll|browse\s*course|my\s*course|learning\s*path)\b/i], priority: 6 },
  { id: 'feat_assignments', patterns: [/\b(assignment|submit\s*assignment|homework|submission)\b/i], priority: 6 },
  { id: 'feat_grades', patterns: [/\b(grade|marks?|score|gpa|result|my\s*grade)\b/i], priority: 6 },
  { id: 'feat_progress', patterns: [/\b(progress|track|my\s*progress|completion|certificate)\b/i], priority: 6 },
  { id: 'feat_coding', patterns: [/\b(coding\s*practice|code\s*editor|solve\s*problem|practice\s*code|coding\s*problem|run\s*code|execute\s*code)\b/i], priority: 7 },
  { id: 'feat_aptitude', patterns: [/\b(aptitude|aptitude\s*test|quiz|mcq|aptitude\s*exam|logical\s*reasoning|quantitative)\b/i], priority: 6 },
  { id: 'feat_games', patterns: [/\b(game|learning\s*game|play|gamif|challenge)\b/i], priority: 6 },
  { id: 'feat_doubts', patterns: [/\b(doubt|ask\s*(a\s*)?question|my\s*doubt|raise\s*doubt|clear\s*doubt)\b/i], priority: 6 },
  { id: 'feat_study_material', patterns: [/\b(study\s*material|resource|learning\s*resource|notes|pdf|material)\b/i], priority: 6 },
  { id: 'feat_events', patterns: [/\b(event|webinar|workshop|seminar|register\s*event|upcoming\s*event)\b/i], priority: 6 },
  { id: 'feat_discussions', patterns: [/\b(discussion|forum|discuss|community|conversation)\b/i], priority: 6 },
  { id: 'feat_profile', patterns: [/\b(profile|account|my\s*profile|update\s*profile|edit\s*profile|profile\s*image|avatar|photo)\b/i], priority: 6 },
  { id: 'feat_notifications', patterns: [/\b(notification|alert|notify|bell)\b/i], priority: 5 },
  { id: 'mentor_features', patterns: [/\b(mentor|mentoring|as\s*a\s*mentor|mentor\s*(dashboard|feature|role))\b/i], priority: 7 },
  { id: 'mentor_create_course', patterns: [/\b(create\s*(a\s*)?course|add\s*(a\s*)?course|new\s*course|publish\s*course)\b/i], priority: 7 },
  { id: 'mentor_assignments', patterns: [/\b(create\s*assignment|add\s*assignment|grade\s*submission|grading)\b/i], priority: 7 },
  { id: 'mentor_problems', patterns: [/\b(create\s*problem|add\s*problem|coding\s*problem\s*(management|create))\b/i], priority: 7 },
  { id: 'admin_features', patterns: [/\b(admin|administrator|admin\s*(dashboard|panel|feature)|manage\s*(student|mentor|user))\b/i], priority: 7 },
  { id: 'admin_analytics', patterns: [/\b(analytics|performance|report|system\s*report|stat)\b/i], priority: 5 },
  { id: 'admin_settings', patterns: [/\b(setting|system\s*setting|configuration|config)\b/i], priority: 5 },
  { id: 'auth', patterns: [/\b(login|sign\s*in|sign\s*up|register|registration|forgot\s*password|reset\s*password|otp|verify|verification|authentication|log\s*out|sign\s*out)\b/i], priority: 6 },
  { id: 'theme', patterns: [/\b(theme|dark\s*mode|light\s*mode|dark\s*theme|toggle\s*theme|switch\s*theme|night\s*mode)\b/i], priority: 6 },
  { id: 'prog_array', patterns: [/\bwhat\s*(is|are)\s*(an?\s*)?(array)/i], priority: 8 },
  { id: 'prog_string', patterns: [/\bwhat\s*(is|are)\s*(a\s*)?(string)/i], priority: 8 },
  { id: 'prog_function', patterns: [/\bwhat\s*(is|are)\s*(a\s*)?(function|method)/i], priority: 8 },
  { id: 'prog_loop', patterns: [/\bwhat\s*(is|are)\s*(a\s*)?(loop|for\s*loop|while\s*loop|iteration)/i], priority: 8 },
  { id: 'prog_recursion', patterns: [/\bwhat\s*(is)?\s*(recursion|recursive)/i], priority: 8 },
  { id: 'prog_class', patterns: [/\bwhat\s*(is|are)\s*(a\s*)?(class|object|oop)/i], priority: 8 },
  { id: 'prog_stack', patterns: [/\bwhat\s*(is|are)\s*(a\s*)?(stack)\b/i], priority: 8 },
  { id: 'prog_queue', patterns: [/\bwhat\s*(is|are)\s*(a\s*)?(queue)\b/i], priority: 8 },
  { id: 'prog_tree', patterns: [/\bwhat\s*(is|are)\s*(a\s*)?(tree|binary\s*tree|bst|b\s*tree)/i], priority: 8 },
  { id: 'prog_graph', patterns: [/\bwhat\s*(is|are)\s*(a\s*)?(graph)\b/i], priority: 8 },
  { id: 'prog_linked_list', patterns: [/\bwhat\s*(is|are)\s*(a\s*)?(linked\s*list)/i], priority: 8 },
  { id: 'prog_hash', patterns: [/\bwhat\s*(is|are)\s*(a\s*)?(hash\s*(map|table|set)|hashing|dictionary)/i], priority: 8 },
  { id: 'prog_sorting', patterns: [/\bwhat\s*(is|are)\s*(a\s*)?(sort|sorting|bubble\s*sort|merge\s*sort|quick\s*sort|insertion\s*sort|selection\s*sort)\b/i], priority: 8 },
  { id: 'prog_searching', patterns: [/\bwhat\s*(is|are)\s*(a\s*)?(search|searching|binary\s*search|linear\s*search)\b/i], priority: 8 },
  { id: 'prog_pointer', patterns: [/\bwhat\s*(is|are)\s*(a\s*)?(pointer|reference|memory\s*address)/i], priority: 8 },
  { id: 'prog_variable', patterns: [/\bwhat\s*(is|are)\s*(a\s*)?(variable|constant|let|var|const)\b/i], priority: 8 },
  { id: 'prog_algorithm', patterns: [/\bwhat\s*(is|are)\s*(an?\s*)?(algorithm|algo)\b/i], priority: 8 },
  { id: 'prog_ds', patterns: [/\bwhat\s*(is|are)\s*(a\s*)?(data\s*structure)/i], priority: 8 },
  { id: 'prog_general', patterns: [/\b(explain|how\s*does|how\s*to|difference\s*between|compare)\b.*\b(code|program|language|python|java|javascript|c\+\+|html|css|react|node|sql|api|backend|frontend|algorithm|recursion|loop|array|string|function|variable|class|object|inheritance|polymorphism|encapsulation|abstraction|stack|queue|tree|graph|linked\s*list|hash|sort|search|pointer|database|framework|library|git|debug|compile|runtime|syntax|semantic|paradigm|oop|functional|imperative|declarative)\b/i], priority: 5 },
  { id: 'study_tips', patterns: [/\b(study\s*tip|how\s*to\s*study|learn\s*better|study\s*strateg|productivity|focus|concentrate|exam\s*prep|prepare\s*for\s*exam|memorize|memory\s*technique|revision|time\s*management)\b/i], priority: 6 },
  { id: 'aptitude_tips', patterns: [/\b(aptitude\s*tip|prepare\s*(for\s*)?aptitude|aptitude\s*strateg|crack\s*aptitude|aptitude\s*prep)\b/i], priority: 7 },
  { id: 'coding_tips', patterns: [/\b(coding\s*tip|improve\s*(my\s*)?(coding|programming)|how\s*to\s*(code|program)\s*better|become\s*(a\s*)?(better\s*)?(coder|programmer|developer)|dsa\s*tip|competitive\s*programming)\b/i], priority: 7 },
  { id: 'interview_tips', patterns: [/\b(interview|placement|job\s*prep|career|resume|cv|intern|internship)\b/i], priority: 5 },
  { id: 'motivation', patterns: [/\b(motivat|inspire|discouraged|can'?t\s*do|give\s*up|frustrated|stressed|anxious|nervous|fail|hopeless|depressed|sad|overwhelm|burnout|tired\s*of\s*studying|bored|lazy|procrastinat)\b/i], priority: 6 },
  { id: 'math_help', patterns: [/\b(math|mathematics|calculus|algebra|geometry|trigonometry|probability|statistics|permutation|combination|factorial|logarithm|integral|derivative|matrix|vector|equation|quadratic|polynomial|fraction|percentage|ratio|proportion)\b/i], priority: 4 },
  { id: 'science_help', patterns: [/\b(physics|chemistry|biology|science|newton|thermodynamic|optics|electron|proton|neutron|atom|molecule|cell|dna|rna|gravity|force|velocity|acceleration|momentum|energy|wave|frequency|electromagnetic|periodic\s*table|organic\s*chemistry|quantum)\b/i], priority: 4 },
  { id: 'humor', patterns: [/\b(joke|funny|tell\s*me\s*(a\s*)?joke|make\s*me\s*laugh|humor|fun\s*fact)\b/i], priority: 5 },
  { id: 'compliment', patterns: [/\b(you'?re?\s*(great|awesome|amazing|smart|helpful|best|good|wonderful|fantastic|brilliant)|love\s*you|nice\s*work|well\s*done|good\s*(job|work|bot))\b/i], priority: 6 },
  { id: 'insult', patterns: [/\b(stupid|dumb|idiot|useless|worst|bad\s*bot|trash|garbage|hate\s*you|suck|terrible)\b/i], priority: 6 },
];

function detectIntent(message) {
  const msg = message.toLowerCase().trim();
  let bestMatch = null;
  let bestPriority = -1;
  for (const intent of intentList) {
    for (const pattern of intent.patterns) {
      if (pattern.test(msg) && intent.priority > bestPriority) {
        bestMatch = intent.id;
        bestPriority = intent.priority;
      }
    }
  }
  return bestMatch || 'general';
}

function detectFollowUp(message, history) {
  const msg = message.toLowerCase().trim();
  if (history.length < 2) return null;
  const lastAssistant = [...history].reverse().find(m => m.role === 'assistant');
  if (!lastAssistant) return null;
  if (/\b(more|detail|elaborate|explain\s*more|go\s*on|continue|tell\s*me\s*more|expand|deeper)\b/i.test(msg)) return 'follow_up_more';
  if (/^(yes|yep|yeah|yea|sure|ok|okay|alright|please|go\s*ahead|do\s*it)$/i.test(msg)) return 'follow_up_affirm';
  return null;
}

// ──────────────── LIVE DATABASE QUERIES ────────────────
async function getPlatformStats() {
  try {
    const queries = [
      pool.query("SELECT COUNT(*) as count FROM users WHERE role = 'student'"),
      pool.query("SELECT COUNT(*) as count FROM users WHERE role = 'mentor'"),
      pool.query("SELECT COUNT(*) as count FROM courses"),
      pool.query("SELECT COUNT(*) as count FROM courseEnrollments"),
      pool.query("SELECT COUNT(*) as count FROM assignments"),
      pool.query("SELECT COUNT(*) as count FROM codingProblems"),
      pool.query("SELECT COUNT(*) as count FROM aptitudeTests"),
      pool.query("SELECT COUNT(*) as count FROM events"),
    ];
    const results = await Promise.all(queries);
    return {
      students: results[0][0][0].count,
      mentors: results[1][0][0].count,
      courses: results[2][0][0].count,
      enrollments: results[3][0][0].count,
      assignments: results[4][0][0].count,
      problems: results[5][0][0].count,
      tests: results[6][0][0].count,
      events: results[7][0][0].count,
    };
  } catch { return null; }
}

async function getAvailableCourses() {
  try {
    const [courses] = await pool.query(`
      SELECT c.title, c.category, c.difficulty, c.duration, u.fullName as mentorName
      FROM courses c JOIN users u ON c.mentorId = u.id
      WHERE c.isPublished = 1 ORDER BY c.rating DESC LIMIT 8
    `);
    return courses;
  } catch { return []; }
}

async function getUpcomingEvents() {
  try {
    const [events] = await pool.query(`
      SELECT title, eventType, eventDate, venue FROM events
      WHERE eventDate >= NOW() ORDER BY eventDate ASC LIMIT 5
    `);
    return events;
  } catch { return []; }
}

async function getRecentDiscussions() {
  try {
    const [discussions] = await pool.query(`
      SELECT d.title, d.category, u.fullName as author
      FROM discussions d JOIN users u ON d.userId = u.id
      ORDER BY d.createdAt DESC LIMIT 5
    `);
    return discussions;
  } catch { return []; }
}

// ──────────────── RESPONSE GENERATORS ────────────────
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const responses = {
  greeting: () => pick([
    "Hello! 👋 I'm **Junniya**, your Sowberry Academy AI assistant. How can I help you today?\n\nI can help with:\n- 📚 Platform features & navigation\n- 💻 Programming concepts & coding\n- 🧠 Study tips & exam prep\n- 🌟 Motivation & guidance",
    "Hey there! 🌟 I'm **Junniya** — your learning companion at Sowberry Academy! What would you like to explore today?",
    "Hi! 😊 Welcome! I'm **Junniya**, here to help you with anything about the platform, coding, studies, or just a friendly chat. What's on your mind?",
    "Good to see you! 👋 I'm **Junniya**, the Sowberry AI assistant. Whether you need help with courses, coding, or need some study tips — I'm all yours!",
  ]),

  farewell: () => pick([
    "Goodbye! 👋 Keep learning, keep growing. I'm here whenever you need me! 🌱✨",
    "See you later! 😊 Remember — every day is a chance to learn something new. Take care! 🌟",
    "Bye! 👋 Wishing you a productive day ahead. Come back anytime you need help! 🌱",
  ]),

  thanks: () => pick([
    "You're welcome! 😊 Happy to help! Don't hesitate to ask anything else.",
    "Glad I could help! 🌟 That's what I'm here for. Keep those questions coming!",
    "Anytime! 😊 If you have more questions, I'm just a message away. Happy learning! 🌱",
    "My pleasure! ✨ Helping you learn is what makes me happy. Ask me anything!",
  ]),

  identity: () => "I'm **Junniya** 🌱 — the AI assistant built right into Sowberry Academy!\n\n**What I can do:**\n- 🧭 Guide you through every platform feature\n- 💻 Explain programming concepts with code examples\n- 📊 Show live platform statistics from the database\n- 🧠 Share study tips, exam strategies, and interview prep\n- 📚 List available courses, events, and materials\n- 🔥 Provide motivation when you need it\n- 🎯 Help with aptitude and coding preparation\n\nI was built by the **Sowberry development team** to be your always-available study companion. I don't need any external APIs — everything runs right here on the platform! 😊",

  creator: () => "I was created by the **Sowberry Academy development team**! 🌱\n\nThey built me to be your all-in-one learning companion — helping students, mentors, and admins navigate the platform and get the most out of their academic journey.\n\nI live entirely within the Sowberry platform — no external services needed! 💪",

  platform_overview: () => "🌱 **Sowberry Academy** is a comprehensive online learning platform built for students, mentors, and administrators.\n\n**For Students:**\n- 📚 Enroll in courses with structured subjects & topics\n- 📝 Complete assignments and get graded\n- 💻 Practice coding with a built-in code editor (15+ languages!)\n- 🧠 Take aptitude tests with timed quizzes\n- 🎮 Learn through interactive games & challenges\n- 📖 Access study materials and resources\n- ❓ Ask doubts and get mentor responses\n- 📊 Track grades, progress & earn certificates\n\n**For Mentors:**\n- 📚 Create full courses (subjects → topics → content)\n- 📝 Create & grade assignments\n- 💻 Build coding problems for practice\n- 🧠 Design aptitude tests with questions\n- 📅 Organize events & moderate discussions\n- ❓ Respond to student doubts\n\n**For Admins:**\n- 👥 Manage all students & mentors\n- 📊 Performance analytics & system reports\n- ⚙️ Platform settings & content management\n- 📬 Handle contact messages & profile requests\n\nIt also features **dark/light themes**, a **responsive design**, and me — **Junniya**! 😄",

  platform_stats: async () => {
    const stats = await getPlatformStats();
    if (!stats) return "I couldn't fetch live stats right now, but the platform is running great! Try again in a moment. 📊";
    return `📊 **Sowberry Academy — Live Stats:**\n\n| Metric | Count |\n|--------|-------|\n| 👨‍🎓 Students | **${stats.students}** |\n| 👨‍🏫 Mentors | **${stats.mentors}** |\n| 📚 Courses | **${stats.courses}** |\n| 📝 Enrollments | **${stats.enrollments}** |\n| ✏️ Assignments | **${stats.assignments}** |\n| 💻 Coding Problems | **${stats.problems}** |\n| 🧠 Aptitude Tests | **${stats.tests}** |\n| 📅 Events | **${stats.events}** |\n\n*These are live numbers from the database!* 🌱`;
  },

  capabilities: () => "Here's everything I can help you with! 🎯\n\n**🧭 Platform Navigation**\n- Explain how any feature works (courses, assignments, coding, aptitude, doubts, etc.)\n- Guide students, mentors, and admins through their dashboards\n\n**📊 Live Data**\n- Show real-time platform statistics from the database\n- List available courses, upcoming events, recent discussions\n\n**💻 Programming Help**\n- Explain data structures: arrays, stacks, queues, trees, graphs, linked lists, hash maps\n- Explain algorithms: sorting, searching, recursion, dynamic programming\n- Cover concepts: OOP, functions, loops, variables, pointers\n- Provide code examples in Python, Java, JavaScript, C++ & more\n\n**🧠 Study & Exam Prep**\n- Study tips & productivity strategies\n- Aptitude test preparation techniques\n- Interview & placement guidance\n\n**🌟 Motivation**\n- Encouragement when you're feeling stuck\n- Inspirational quotes & growth mindset tips\n\nJust ask me anything! 😊",

  feat_courses: async () => {
    const courses = await getAvailableCourses();
    let courseList = '';
    if (courses.length > 0) {
      courseList = '\n\n**📋 Currently Available Courses:**\n' + courses.map((c, i) => `${i + 1}. **${c.title}** — ${c.category || 'General'} • ${c.difficulty || 'All levels'} • by ${c.mentorName}`).join('\n');
    }
    return `📚 **Courses on Sowberry:**\n\n**How it works:**\n1. Go to **My Courses** from your student dashboard\n2. Click **Browse Courses** to see all available courses\n3. Click **Enroll** on any course you like\n4. Each course is organized into **Subjects → Topics → Content** (videos, PDFs, text)\n5. Mark topics as complete to track your progress\n6. When you reach 100% — you earn a **Certificate!** 🎓\n\n**Key features:**\n- View course materials organized by unit/subject\n- Track your completion percentage\n- Unenroll anytime if the course isn't for you\n- Your mentor can see your progress${courseList}\n\nWant to know about a specific course?`;
  },

  feat_assignments: () => "📝 **Assignments on Sowberry:**\n\n**For Students:**\n1. Go to **My Assignments** from the sidebar\n2. You'll see all assignments from your enrolled courses\n3. Each assignment has a **title, description, due date, and max marks**\n4. Click **Submit** to upload your work (text/code/link)\n5. Your mentor will review and grade it\n6. Check grades in the **My Grades** section\n\n**For Mentors:**\n1. Go to **Assignments** from the dashboard\n2. Create new assignments with title, description, deadline & marks\n3. Link assignments to specific courses\n4. View all submissions and grade them with feedback\n5. Students receive their scores immediately after grading\n\n**Tips:**\n- ⏰ Submit before the deadline!\n- 📝 Write clear, well-structured answers\n- 💬 If confused, use the **Doubts** section to ask questions\n\nNeed help with a specific assignment?",

  feat_grades: () => "📊 **Grades & Scoring:**\n\n**Where to find grades:**\n- Go to **My Grades** in the sidebar\n\n**What's tracked:**\n- 📝 Assignment scores (graded by mentors)\n- 🧠 Aptitude test scores (auto-graded)\n- 💻 Coding submissions (pass/fail for problems)\n- 📚 Course completion percentage\n\n**How grading works:**\n- Mentors grade assignments on a scale you can see\n- Aptitude tests are auto-scored with detailed results\n- Course grades combine assignment scores + completion\n\n**Certificates:**\n- Complete 100% of a course to earn a **downloadable certificate** 🎓\n- Certificates include your name, course, date, and completion details\n\nKeep working hard — every point matters! 💪",

  feat_progress: () => "📈 **Progress Tracking:**\n\n**My Progress** page shows you:\n- 📚 **Course Progress** — Completion % for each enrolled course\n- 📝 **Assignment Stats** — Submitted vs pending vs graded\n- 🧠 **Aptitude Performance** — Average scores across tests\n- 💻 **Coding Stats** — Problems attempted, solved, languages used\n- 🎮 **Game Unlocks** — Challenges completed\n\n**How to improve:**\n1. Complete all topics in your courses\n2. Submit assignments on time\n3. Practice coding daily\n4. Take aptitude tests regularly\n5. Engage in discussions\n\n**Certificates** 🎓 are awarded automatically when you complete a course 100%!\n\nYou're doing great — keep going! 🌟",

  feat_coding: () => "💻 **Coding Practice on Sowberry:**\n\n**Two main tools:**\n\n**1. Coding Practice (Problem Solving)**\n- Browse problems by difficulty (Easy/Medium/Hard)\n- Filter by category and tags\n- Each problem has a description, sample inputs/outputs\n- Submit your solution and it gets evaluated\n- Track your solve history\n\n**2. Code Editor (Free Coding)**\n- Full-featured code editor with syntax highlighting\n- Supports **15+ languages**: Python, JavaScript, Java, C++, C, Go, Rust, TypeScript, PHP, Ruby, Bash, Perl, Lua, R, Kotlin, Dart, Swift, Scala\n- Write code, provide input, and **run it instantly**\n- Code execution happens on the server with a 15-second timeout\n- Great for testing snippets and experimenting\n\n**Tips for improvement:**\n- Start with Easy problems and work your way up\n- Understand the problem fully before coding\n- Write pseudocode first\n- Test with edge cases\n- Practice at least 2-3 problems daily\n\nWant me to explain any programming concept? 🧑‍💻",

  feat_aptitude: () => "🧠 **Aptitude Tests on Sowberry:**\n\n**How it works:**\n1. Go to **Aptitude Tests** from the sidebar\n2. Browse available tests created by mentors/admins\n3. Click **Start Test** to begin\n4. Each test has:\n   - A **time limit** (countdown timer)\n   - **Multiple choice questions** with 4 options\n   - Some questions may have different marks\n5. Submit when done (or auto-submits when time's up)\n6. See your **detailed results** immediately:\n   - Total score & percentage\n   - Correct/wrong/unanswered breakdown\n   - Question-wise analysis\n\n**Preparation Tips:**\n- 📖 Practice logical reasoning patterns\n- 🔢 Brush up on quantitative aptitude formulas\n- ⏱️ Time yourself — 1-2 min per question max\n- ❌ Eliminate obviously wrong answers first\n- 📝 Read questions carefully — don't rush!\n- 🔄 Take tests multiple times to improve\n\nWant specific aptitude preparation strategies? Just ask! 📊",

  feat_games: () => "🎮 **Learning Games on Sowberry:**\n\n**What are they?**\nInteractive coding challenges disguised as fun games! They test your programming skills through creative problem-solving.\n\n**How it works:**\n1. Go to **Learning Games** from the sidebar\n2. Browse available challenges\n3. Each game has a theme, difficulty level, and coding task\n4. Write your solution in the code editor\n5. Submit to validate — the server tests your code\n6. Unlock new challenges as you complete them! 🔓\n\n**Why play?**\n- 🧩 Makes learning programming fun\n- 🏆 Achievement-based progression\n- 💡 Creative problem-solving practice\n- 🔥 Builds coding confidence\n\nThe best way to learn is when you're having fun! 🌟",

  feat_doubts: () => "❓ **Doubts System on Sowberry:**\n\n**For Students:**\n1. Go to **My Doubts** from the sidebar\n2. Click **New Doubt** to create one\n3. Add a clear **title** and detailed **description**\n4. Optionally select a course/subject\n5. Mentors will see your doubt and reply\n6. You can add follow-up replies\n7. Once resolved, the doubt gets marked as **Resolved** ✅\n\n**For Mentors:**\n1. Go to **Student Doubts** from the dashboard\n2. See all open doubts from your students\n3. Click on any doubt to view details\n4. Reply with helpful answers\n5. The first mentor to reply gets auto-assigned\n6. Resolve doubts when the student is satisfied\n\n**Tips for better responses:**\n- 📝 Be specific in your doubt title\n- 🖼️ Include code snippets or examples\n- 🔍 Search existing doubts first — your question might already be answered!\n\nDon't be shy — asking questions is how you learn! 📖",

  feat_study_material: () => "📖 **Study Materials:**\n\n**What's available:**\n- PDFs, documents, links, and text resources\n- Organized by course and subject\n- Uploaded by mentors and admins\n\n**How to access:**\n1. Go to **Study Material** from the sidebar\n2. Browse or search by course/category\n3. Click to download or view materials\n\n**Course Materials:**\n- Each course also has its own content (videos, PDFs, text) inside the course viewer\n- Access via **My Courses → Course Viewer**\n\nHappy studying! 📚",

  feat_events: async () => {
    const events = await getUpcomingEvents();
    let eventList = '';
    if (events.length > 0) {
      eventList = '\n\n**📋 Upcoming Events:**\n' + events.map((e, i) => {
        const date = e.eventDate ? new Date(e.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'TBD';
        return `${i + 1}. **${e.title}** — ${e.eventType || 'Event'} • ${date}${e.venue ? ' • ' + e.venue : ''}`;
      }).join('\n');
    }
    return `📅 **Events on Sowberry:**\n\n**How it works:**\n1. Go to **Events** to see all upcoming events\n2. Events include webinars, workshops, hackathons, seminars, and more\n3. Click **Register** to sign up for an event\n4. Event details include date, time, venue, and description\n\n**For Admins/Mentors:**\n- Create events with title, description, type, date, venue, and capacity\n- Track registrations\n- Update or delete events${eventList}\n\nStay active and participate! Events are great for networking and learning. 🌟`;
  },

  feat_discussions: async () => {
    const discussions = await getRecentDiscussions();
    let discList = '';
    if (discussions.length > 0) {
      discList = '\n\n**💬 Recent Discussions:**\n' + discussions.map((d, i) => `${i + 1}. **${d.title}** — ${d.category || 'General'} by ${d.author}`).join('\n');
    }
    return `💬 **Discussions on Sowberry:**\n\n**What is it?**\nA community forum where students and mentors can have conversations, share knowledge, and collaborate.\n\n**How to participate:**\n1. Browse discussions from the **Discussion** section\n2. Read topics that interest you\n3. Reply with your thoughts or answers\n4. Mentors/admins can create new discussion topics\n\n**Categories may include:**\n- General, Academic, Coding, Career, Off-topic, and more${discList}\n\nSharing knowledge helps everyone grow! 🌱`;
  },

  feat_profile: () => "👤 **Profile Management:**\n\n**How to access:**\n- Click your **avatar/name** in the top-right header\n- Select **My Profile**\n\n**What you can update:**\n- Full name, phone, college, department, year\n- Roll number, gender, date of birth, address\n- Bio & social links (GitHub, LinkedIn, HackerRank, LeetCode)\n- Profile image — upload a photo!\n\n**Important notes:**\n- 🔒 For students, some profile changes require **admin approval** (profile requests system)\n- Your request goes to admin → they approve/reject → changes apply\n- You can track your pending requests\n- Password can be changed separately\n\n**Theme:**\n- Toggle **dark/light mode** using the sun/moon icon in the header\n\nKeep your profile updated! 📋",

  feat_notifications: () => "🔔 **Notifications:**\n\n- Admins see notifications for new registrations, submissions, and messages\n- Click the **bell icon** in the header to view\n- Mark all as read with one click\n- Notifications are auto-generated for important events\n\nStay on top of what's happening! 📫",

  mentor_features: () => "👨‍🏫 **Mentor Role on Sowberry:**\n\n**Dashboard shows:**\n- Total courses you've created\n- Students enrolled in your courses\n- Assignments created & pending submissions\n- Events & average course completion rate\n\n**What mentors can do:**\n\n📚 **Courses** — Full CRUD management:\n- Create courses with title, description, category, difficulty\n- Add subjects (units) → topics within subjects → content (video/PDF/text)\n- Publish courses for students to enroll\n\n📝 **Assignments** — Create, edit, delete, and grade:\n- Set deadlines and max marks\n- View student submissions\n- Grade with scores and feedback\n\n💻 **Problem Solving** — Create coding problems:\n- Set difficulty, description, sample I/O, test cases\n- Students practice and submit solutions\n\n🧠 **Aptitude Tests** — Design tests:\n- Add questions with 4 options and correct answer\n- Set time limits and marks per question\n\n📅 **Events** — Organize events and workshops\n💬 **Discussions** — Start and moderate discussions\n❓ **Doubts** — Reply to student doubts\n📊 **Progress** — Track student performance\n\nMentors are the backbone of learning! 🌟",

  mentor_create_course: () => "📚 **Creating a Course (Mentor/Admin):**\n\n**Step-by-step:**\n\n1. **Go to Courses** in your dashboard\n2. Click **Create Course**\n3. Fill in:\n   - **Title** — Clear, descriptive name\n   - **Description** — What students will learn\n   - **Category** — e.g., Web Development, DSA, AI/ML\n   - **Difficulty** — Beginner / Intermediate / Advanced\n   - **Duration** — Estimated time to complete\n   - **Image URL** — Optional cover image\n4. **Add Subjects** (Units):\n   - Each subject is a major section of the course\n   - Add a title and description for each\n5. **Add Topics** within each subject:\n   - These are individual lessons/chapters\n6. **Add Content**:\n   - Type: Video (YouTube URL), PDF (URL), or Text (rich content)\n   - Organized within subjects\n7. **Publish** the course\n\n**Best practices:**\n- 📝 Write clear descriptions\n- 📐 Structure content logically\n- 🎬 Mix content types (video + text + resources)\n- 📊 Start with fundamentals, build up complexity\n\nYour courses shape students' futures! 🌱",

  mentor_assignments: () => "📝 **Managing Assignments (Mentor):**\n\n**Creating:**\n1. Go to **Assignments** → **Create New**\n2. Set: Title, Description, Course, Due Date, Max Marks\n3. Students will see it in their **My Assignments**\n\n**Grading:**\n1. View submissions for each assignment\n2. Read student's submitted work\n3. Enter a score and optional feedback\n4. The student sees the grade immediately in **My Grades**\n\n**Tips for good assignments:**\n- ✅ Be clear about requirements\n- ⏰ Give reasonable deadlines\n- 📝 Provide rubrics or marking criteria\n- 💬 Give constructive feedback when grading\n\nGreat assignments drive great learning! 📚",

  mentor_problems: () => "💻 **Managing Coding Problems (Mentor/Admin):**\n\n**Creating a problem:**\n1. Go to **Problem Solving** → **Create Problem**\n2. Fill in:\n   - **Title** and **Description**\n   - **Difficulty** — Easy / Medium / Hard\n   - **Category** — Arrays, Strings, DP, etc.\n   - **Sample Input/Output** — For students to understand\n   - **Test Cases** — For validation\n   - **Tags** — For filtering\n3. Students can attempt problems in the **Coding Practice** section\n\n**The code execution engine supports:**\nPython, JavaScript, Java, C++, C, Go, Rust, TypeScript, PHP, Ruby, Bash, Perl, Lua, R, Kotlin, Dart, Swift, Scala\n\nWell-crafted problems build real skills! 🧑‍💻",

  admin_features: () => "🛡️ **Admin Dashboard & Features:**\n\n**Dashboard Overview:**\n- Total students, mentors, courses, enrollments\n- Average completion rates\n- Pending verifications & contact messages\n- Monthly enrollment trends\n- Recent activity logs\n\n**Management:**\n- 👨‍🎓 **Students** — View, create, edit, delete students\n- 👨‍🏫 **Mentors** — Full mentor management\n- 📚 **Courses** — Approve/reject, full CRUD, manage content\n- 📝 **Assignments** — View and manage all assignments\n- 💻 **Problem Solving** — Create & manage coding problems\n- 🧠 **Aptitude Tests** — Create & manage tests\n- 📅 **Events** — Create & manage events\n- 💬 **Discussions** — Moderate discussions\n- ❓ **Doubts** — View all student doubts\n- 📊 **Analytics** — Performance, trends, charts\n- 📈 **Reports** — System-wide reports\n- 📬 **Contact Messages** — Handle inquiries\n- 📋 **Profile Requests** — Approve/reject student profile changes\n- ⚙️ **Settings** — Platform configuration\n- 🔔 **Notifications** — Track activities\n\nAdmins keep the platform running smoothly! ⚙️",

  admin_analytics: () => "📊 **Performance Analytics & Reports:**\n\n**Analytics page shows:**\n- 📈 Course enrollment trends over time\n- 📊 Student performance distribution\n- 🏆 Top performing students\n- 📚 Most popular courses\n- 💻 Coding problem completion rates\n- 🧠 Average aptitude scores\n- 📝 Assignment submission rates\n\n**System Reports include:**\n- User summaries (students, mentors, admins)\n- Course statistics & completion data\n- Active vs inactive users\n- Contact messages & support analytics\n- Overall platform health metrics\n\nData-driven decisions make the platform better! 📈",

  admin_settings: () => "⚙️ **Platform Settings (Admin):**\n\n- Configure platform-wide settings\n- Manage system notifications\n- View and search uploaded profile images\n- Download bulk profile data\n- Configure email/OTP settings (SMTP)\n\nAccessible from **Settings** in the admin sidebar.",

  auth: () => "🔐 **Authentication on Sowberry:**\n\n**Registration:**\n1. Go to the **Auth page** (`/auth`)\n2. Switch to **Register** tab\n3. Fill in: email, username, full name, password\n4. Optional: phone, college, department, year, roll number, social links\n5. After registration, receive an **OTP** for email verification\n6. Default role is **Student**\n\n**Login:**\n1. Enter your **username** and **password**\n2. You'll be redirected to your role-specific dashboard\n3. Token is stored for persistent sessions\n\n**Forgot Password:**\n1. Click **Forgot Password** on the login page\n2. Enter your email\n3. Receive an OTP\n4. Verify OTP → set a new password\n\n**Security:**\n- Passwords are hashed with **bcrypt**\n- JWT tokens for authentication\n- Role-based access control (admin, mentor, student)\n- Sessions expire after 7 days\n\nKeep your credentials safe! 🔒",

  theme: () => "🎨 **Theme Toggle:**\n\n- Click the **sun/moon icon** in the top header bar\n- Switches between **light mode** (warm cream) and **dark mode** (deep dark)\n- Your preference is saved in the browser\n- The dark theme uses a warm, elegant palette with gold/sand accents\n- Works across all pages — dashboard, courses, coding editor, etc.\n\nDark mode FTW! 🌙",

  prog_array: () => "📦 **Array**\n\nA collection of elements stored at contiguous memory locations, accessible by index.\n\n```python\n# Python\nnums = [10, 20, 30, 40, 50]\nprint(nums[0])   # 10\nprint(nums[-1])  # 50\nnums.append(60)  # [10, 20, 30, 40, 50, 60]\n```\n\n```javascript\n// JavaScript\nconst arr = [1, 2, 3, 4, 5];\narr.push(6);        // [1,2,3,4,5,6]\narr.filter(x => x > 3); // [4,5,6]\n```\n\n**Key characteristics:**\n- **Fixed size** in many languages (dynamic in Python/JS)\n- **O(1)** access by index\n- **O(n)** insert/delete in middle\n- Great for sequential data storage\n\n**Common operations:** traverse, insert, delete, search, sort, reverse\n\nWant to know about specific array algorithms? 🤓",

  prog_string: () => "📝 **String**\n\nA sequence of characters used to represent text.\n\n```python\n# Python\nname = \"Sowberry Academy\"\nprint(name[0:8])       # 'Sowberry'\nprint(name.lower())    # 'sowberry academy'\nprint(name.split(' ')) # ['Sowberry', 'Academy']\nprint(len(name))       # 16\n```\n\n```java\n// Java\nString s = \"Hello\";\ns.charAt(0);     // 'H'\ns.length();      // 5\ns.substring(1);  // \"ello\"\ns.equals(\"Hello\"); // true\n```\n\n**Key points:**\n- **Immutable** in Python, Java, JavaScript (new string created on modification)\n- **Mutable** in C/C++ (char arrays)\n- Rich built-in methods: split, join, replace, find, strip, format\n\n**Common problems:** palindrome, anagram, substring search, reverse, pattern matching\n\nStrings are everywhere in programming! 💡",

  prog_function: () => "⚙️ **Function / Method**\n\nA reusable block of code that performs a specific task.\n\n```python\n# Python\ndef greet(name, greeting=\"Hello\"):\n    \"\"\"Returns a personalized greeting\"\"\"\n    return f\"{greeting}, {name}!\"\n\nprint(greet(\"Junniya\"))  # Hello, Junniya!\n```\n\n```javascript\n// JavaScript\nconst add = (a, b) => a + b;\nfunction factorial(n) {\n  return n <= 1 ? 1 : n * factorial(n - 1);\n}\n```\n\n**Key concepts:**\n- **Parameters** — inputs the function receives\n- **Return value** — output the function produces\n- **Scope** — variables inside a function are local\n- **Pure functions** — same input → same output, no side effects\n- **Higher-order functions** — functions that take/return functions\n\n**Benefits:** Code reuse, modularity, readability, testing\n\nFunctions are the building blocks of programming! 🧱",

  prog_loop: () => "🔄 **Loops**\n\nRepeat a block of code until a condition is met.\n\n```python\n# For loop\nfor i in range(5):\n    print(i)  # 0, 1, 2, 3, 4\n\n# While loop\ncount = 0\nwhile count < 3:\n    print(count)\n    count += 1\n\n# Loop with list\nfruits = ['apple', 'banana', 'cherry']\nfor fruit in fruits:\n    print(fruit)\n```\n\n```javascript\n// JavaScript\nfor (let i = 0; i < 5; i++) {\n  console.log(i);\n}\n\n// For...of\nfor (const item of [1, 2, 3]) {\n  console.log(item);\n}\n```\n\n**Types:**\n- `for` — known iterations\n- `while` — condition-based\n- `do-while` — runs at least once\n- `for-each` / `for-of` — iterate collections\n\n**Watch out:** Infinite loops! Always ensure the condition eventually becomes false. 🛑",

  prog_recursion: () => "🌀 **Recursion**\n\nA function that calls itself to solve smaller subproblems.\n\n```python\n# Factorial\ndef factorial(n):\n    if n <= 1:        # Base case\n        return 1\n    return n * factorial(n - 1)  # Recursive call\n\n# Fibonacci\ndef fib(n):\n    if n <= 1: return n\n    return fib(n-1) + fib(n-2)\n\n# Binary Search (recursive)\ndef binary_search(arr, target, low, high):\n    if low > high: return -1\n    mid = (low + high) // 2\n    if arr[mid] == target: return mid\n    elif arr[mid] < target: return binary_search(arr, target, mid+1, high)\n    else: return binary_search(arr, target, low, mid-1)\n```\n\n**Key rules:**\n1. **Base case** — stops the recursion (ESSENTIAL!)\n2. **Recursive case** — function calls itself with a smaller problem\n3. **Progress** — each call must move toward the base case\n\n**Common uses:** Tree traversal, divide & conquer, backtracking, dynamic programming\n\n**Stack overflow** happens when there's no proper base case! 💥",

  prog_class: () => "🏗️ **Class & OOP (Object-Oriented Programming)**\n\nA class is a blueprint for creating objects with data (attributes) and behavior (methods).\n\n```python\nclass Student:\n    def __init__(self, name, grade):\n        self.name = name\n        self.grade = grade\n    \n    def introduce(self):\n        return f\"Hi, I'm {self.name} with grade {self.grade}\"\n    \n    def is_passing(self):\n        return self.grade >= 50\n\ns1 = Student(\"Aarav\", 85)\nprint(s1.introduce())\n```\n\n**4 Pillars of OOP:**\n1. **Encapsulation** — Bundle data + methods together\n2. **Inheritance** — Child classes inherit from parent classes\n3. **Polymorphism** — Same method name, different behavior\n4. **Abstraction** — Hide complex details, show essentials\n\nOOP makes code organized, reusable, and maintainable! 🎯",

  prog_stack: () => "📚 **Stack (LIFO — Last In, First Out)**\n\nThink of a stack of plates — you add and remove from the top.\n\n```python\nstack = []\nstack.append(1)   # push\nstack.append(2)\nstack.append(3)   # stack: [1, 2, 3]\ntop = stack.pop()  # 3 (removed from top)\npeek = stack[-1]   # 2 (view top without removing)\n```\n\n**Operations:**\n- `push(x)` — Add to top → O(1)\n- `pop()` — Remove from top → O(1)\n- `peek()` — View top → O(1)\n- `isEmpty()` — Check if empty → O(1)\n\n**Real-world uses:**\n- Function call stack\n- Undo/Redo in editors\n- Browser back button\n- Expression evaluation & parsing\n- Balanced parentheses checking\n\nStacks are fundamental! 🏗️",

  prog_queue: () => "🚶 **Queue (FIFO — First In, First Out)**\n\nLike a line at a store — first person in line gets served first.\n\n```python\nfrom collections import deque\nq = deque()\nq.append(1)      # enqueue\nq.append(2)\nq.append(3)      # queue: [1, 2, 3]\nfront = q.popleft()  # 1 (removed from front)\n```\n\n**Operations:**\n- `enqueue(x)` — Add to back → O(1)\n- `dequeue()` — Remove from front → O(1)\n- `front()` — View front → O(1)\n\n**Variants:** Priority Queue, Circular Queue, Deque\n\n**Uses:** BFS traversal, task scheduling, print queue, CPU scheduling\n\nQueues keep things orderly! 📋",

  prog_tree: () => "🌳 **Tree (Data Structure)**\n\nA hierarchical structure with nodes connected by edges.\n\n```python\nclass TreeNode:\n    def __init__(self, val):\n        self.val = val\n        self.left = None\n        self.right = None\n\ndef insert(root, val):\n    if not root: return TreeNode(val)\n    if val < root.val:\n        root.left = insert(root.left, val)\n    else:\n        root.right = insert(root.right, val)\n    return root\n\ndef inorder(root):\n    if root:\n        inorder(root.left)\n        print(root.val, end=' ')\n        inorder(root.right)\n```\n\n**Types:** Binary Tree, BST, AVL, Red-Black, B-Tree, Trie, Heap\n\n**Traversals:** Inorder, Preorder, Postorder, Level-order (BFS)\n\n**Uses:** File systems, databases, DOM in HTML, autocomplete 🌲",

  prog_graph: () => "🕸️ **Graph**\n\nA collection of nodes (vertices) connected by edges.\n\n```python\ngraph = {\n    'A': ['B', 'C'],\n    'B': ['A', 'D'],\n    'C': ['A', 'D'],\n    'D': ['B', 'C']\n}\n\nfrom collections import deque\ndef bfs(graph, start):\n    visited = set([start])\n    queue = deque([start])\n    while queue:\n        node = queue.popleft()\n        print(node, end=' ')\n        for neighbor in graph[node]:\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append(neighbor)\n```\n\n**Types:** Directed/Undirected, Weighted/Unweighted, Cyclic/Acyclic\n\n**Algorithms:** BFS, DFS, Dijkstra's, Bellman-Ford, Kruskal's, Prim's, Topological Sort\n\n**Uses:** Social networks, maps/navigation, internet routing 🗺️",

  prog_linked_list: () => "🔗 **Linked List**\n\nA linear data structure where elements (nodes) are connected via pointers.\n\n```python\nclass Node:\n    def __init__(self, val):\n        self.val = val\n        self.next = None\n\nclass LinkedList:\n    def __init__(self):\n        self.head = None\n    \n    def append(self, val):\n        new_node = Node(val)\n        if not self.head:\n            self.head = new_node\n            return\n        curr = self.head\n        while curr.next:\n            curr = curr.next\n        curr.next = new_node\n    \n    def display(self):\n        curr = self.head\n        while curr:\n            print(curr.val, end=' -> ')\n            curr = curr.next\n        print('None')\n```\n\n**Types:** Singly, Doubly, Circular\n\n**vs Array:** Dynamic size, O(1) insert at head, but O(n) access by index\n\n**Common problems:** Reverse, detect cycle, find middle, merge sorted lists 🔗",

  prog_hash: () => "🗂️ **Hash Map / Hash Table / Dictionary**\n\nStores key-value pairs with near-O(1) lookup.\n\n```python\nstudent = {'name': 'Aarav', 'grade': 85, 'course': 'DSA'}\nprint(student['name'])     # Aarav\nstudent['age'] = 20\n'grade' in student         # True (O(1) lookup!)\n\ndef count_chars(s):\n    freq = {}\n    for c in s:\n        freq[c] = freq.get(c, 0) + 1\n    return freq\n```\n\n**How it works:** Hash function converts key → index → stores value at that index\n\n**Collision handling:** Chaining (linked lists) or Open Addressing\n\n**Uses:** Caching, indexing, counting, deduplication, databases 💡",

  prog_sorting: () => "📊 **Sorting Algorithms**\n\n| Algorithm | Best | Average | Worst | Space | Stable |\n|-----------|------|---------|-------|-------|--------|\n| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) | Yes |\n| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) | No |\n| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) | Yes |\n| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |\n| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | No |\n\n```python\ndef quicksort(arr):\n    if len(arr) <= 1: return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    mid = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quicksort(left) + mid + quicksort(right)\n```\n\n**Rule of thumb:** Use Merge Sort for stability, Quick Sort for speed! 🚀",

  prog_searching: () => "🔍 **Searching Algorithms**\n\n**1. Linear Search — O(n)**\n```python\ndef linear_search(arr, target):\n    for i, val in enumerate(arr):\n        if val == target: return i\n    return -1\n```\n\n**2. Binary Search — O(log n)** *(requires sorted array)*\n```python\ndef binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target: return mid\n        elif arr[mid] < target: low = mid + 1\n        else: high = mid - 1\n    return -1\n```\n\n**When to use what:**\n- **Linear** — Small or unsorted arrays\n- **Binary** — Large sorted arrays/lists\n- **Hash lookup** — O(1) when using hash maps\n\nBinary search is one of the most important algorithms to master! 🎯",

  prog_pointer: () => "📍 **Pointers & References**\n\nA pointer stores the **memory address** of another variable.\n\n```c\n// C/C++\nint x = 10;\nint *ptr = &x;    // ptr holds address of x\nprintf(\"%d\", *ptr); // 10 (dereferencing)\n*ptr = 20;         // x is now 20\n```\n\n**Key concepts:**\n- `&x` — Address of x\n- `*ptr` — Value at address (dereference)\n- `NULL` / `nullptr` — Points to nothing\n\n**In Python/Java/JS:**\n- No explicit pointers, but variables are **references** to objects\n- Mutable objects are passed by reference\n- Immutable objects behave like pass by value\n\nPointers give you power — use them carefully! ⚡",

  prog_variable: () => "📦 **Variables & Constants**\n\nVariables store data values that can change during program execution.\n\n```python\n# Python (dynamically typed)\nname = \"Junniya\"\nage = 2\npi = 3.14159\nis_ai = True\n```\n\n```javascript\n// JavaScript\nlet count = 0;      // can change\nconst PI = 3.14;    // constant (cannot reassign)\nvar old = 'legacy'; // avoid using var\n```\n\n**Types:** Primitive (int, float, string, boolean) & Reference (arrays, objects)\n\n**Scope:** Local (inside function/block) & Global (accessible everywhere)\n\n**Best practice:** Use `const` by default, `let` when you need to reassign. 📝",

  prog_algorithm: () => "⚡ **Algorithm**\n\nA step-by-step procedure to solve a problem.\n\n**Properties:**\n1. **Input** — Zero or more inputs\n2. **Output** — At least one output\n3. **Definiteness** — Each step is clear\n4. **Finiteness** — Terminates after finite steps\n5. **Effectiveness** — Each step is feasible\n\n**Categories:**\n- 🔍 Searching — Linear, Binary search\n- 📊 Sorting — Bubble, Merge, Quick sort\n- 🌀 Recursion — Factorial, Fibonacci\n- 🎯 Greedy — Activity selection, coin change\n- 📐 Divide & Conquer — Merge sort, binary search\n- 💡 Dynamic Programming — Knapsack, LCS, LIS\n- 🕸️ Graph — BFS, DFS, Dijkstra\n- 🔙 Backtracking — N-Queens, Sudoku\n\n**Big-O:** O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ)\n\nAlgorithms are the heart of computer science! 💻",

  prog_ds: () => "🗃️ **Data Structures**\n\nWays to organize, store, and manage data efficiently.\n\n**Linear:** Array, Linked List, Stack, Queue\n**Non-linear:** Tree, Graph\n**Hash-based:** Hash Map, Hash Set\n\n| Need | Use |\n|------|-----|\n| Fast lookup | Hash Map |\n| Ordered data | BST / Sorted Array |\n| LIFO access | Stack |\n| FIFO access | Queue |\n| Hierarchy | Tree |\n| Connections | Graph |\n\nMastering data structures is the key to efficient programming! 🔑",

  prog_general: (msg) => {
    if (/python/i.test(msg)) return "🐍 **Python** is a high-level, interpreted language known for readability.\n\n```python\ndata = [1, 2, 3, 4, 5]\nsquared = [x**2 for x in data]\nprint(squared)  # [1, 4, 9, 16, 25]\n```\n\nPython is available in the **Code Editor** on Sowberry! 💻";
    if (/java\b/i.test(msg)) return "☕ **Java** is a strongly-typed, compiled, OOP language on the JVM.\n\n```java\npublic class Hello {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, Sowberry!\");\n    }\n}\n```\n\nJava is available in the **Code Editor** on Sowberry! ☕";
    if (/javascript|js\b/i.test(msg)) return "⚡ **JavaScript** is the language of the web.\n\n```javascript\nconst greet = (name) => `Hello, ${name}!`;\nconst nums = [1, 2, 3].map(x => x * 2);\nconsole.log(nums); // [2, 4, 6]\n```\n\nFun fact: Sowberry's backend runs on **Node.js with Express**! 🌐";
    if (/c\+\+|cpp/i.test(msg)) return "⚡ **C++** is a powerful compiled language for systems & competitive programming.\n\n```cpp\n#include <iostream>\nusing namespace std;\nint main() {\n    cout << \"Hello from C++!\" << endl;\n    return 0;\n}\n```\n\nC++ is available in the **Code Editor** on Sowberry! 🏎️";
    if (/html|css/i.test(msg)) return "🌐 **HTML & CSS** — the building blocks of the web.\n\n```html\n<h1 style=\"color: #c96442;\">Hello Sowberry!</h1>\n```\n\nSowberry's frontend uses **React.js** with **Tailwind CSS**! 🎨";
    if (/react/i.test(msg)) return "⚛️ **React.js** — a JavaScript library for building UIs.\n\n```jsx\nconst Counter = () => {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;\n};\n```\n\nFun fact: **Sowberry is built with React!** ⚛️";
    if (/node|express|backend/i.test(msg)) return "🟢 **Node.js** runs JavaScript on the server. **Express.js** is the most popular framework.\n\n```javascript\nimport express from 'express';\nconst app = express();\napp.get('/api/hello', (req, res) => res.json({ message: 'Hello!' }));\napp.listen(5000);\n```\n\n**Sowberry's backend** is built with Node.js + Express + MySQL! 🌐";
    if (/sql|database/i.test(msg)) return "🗃️ **SQL** interacts with relational databases.\n\n```sql\nSELECT * FROM users WHERE role = 'student';\nSELECT courseId, COUNT(*) as total\nFROM courseEnrollments GROUP BY courseId;\n```\n\n**Sowberry uses MySQL** with tables for users, courses, assignments, enrollments & more! 🗄️";
    if (/git/i.test(msg)) return "📦 **Git** is a version control system.\n\n```bash\ngit init\ngit add .\ngit commit -m \"msg\"\ngit push origin main\ngit branch feature\ngit merge feature\n```\n\nSowberry's code is managed on **GitHub**! 🐙";
    return "💻 Great programming topic! I cover:\n- Languages: Python, Java, JavaScript, C++ & more\n- Data Structures: Arrays, Lists, Stacks, Queues, Trees, Graphs\n- Algorithms: Sorting, Searching, Recursion, DP\n- Web: HTML, CSS, React, Node.js, SQL\n- Tools: Git, debugging, best practices\n\nWhat specific concept would you like me to explain? 🤓";
  },

  study_tips: () => "📖 **Study Tips from Junniya:**\n\n**🧠 Techniques that actually work:**\n\n1. **Pomodoro Technique** 🍅 — Study 25 min → 5 min break → repeat\n2. **Active Recall** 🔄 — Close the book and try to recall what you learned\n3. **Spaced Repetition** 📅 — Review at increasing intervals (1, 3, 7, 14 days)\n4. **Feynman Technique** 🎓 — Explain the concept as if teaching a child\n5. **Interleaving** 🔀 — Mix different topics in one session\n\n**⚡ Productivity boosters:**\n- 🚫 Remove distractions (phone on silent)\n- 💧 Stay hydrated & eat well\n- 😴 Get 7-8 hours of sleep\n- 🏃 Exercise regularly\n- 📝 Take notes by hand\n- 🎵 Lo-fi music can help concentration\n\nRemember: **Consistency > Intensity**. Study a little daily beats cramming! 🌟",

  aptitude_tips: () => "🧠 **Aptitude Test Preparation Tips:**\n\n**📊 Quantitative:**\n- Master formulas (percentage, ratio, time-speed-distance)\n- Practice mental math daily\n- Learn shortcut methods\n\n**🧩 Logical Reasoning:**\n- Practice puzzles: Sudoku, seating arrangements\n- Draw diagrams for complex problems\n- Look for patterns in series questions\n\n**⏱️ Test-taking Strategy:**\n1. Skim all questions first\n2. Easy first — answer what you know immediately\n3. Eliminate obviously wrong options\n4. Don't spend 5 min on one question\n5. Review if time permits\n\nPractice on Sowberry's **Aptitude Tests** section! 📊",

  coding_tips: () => "💻 **Coding & DSA Improvement Tips:**\n\n**📈 Learning path:**\n```\nArrays → Strings → Linked Lists → Stacks & Queues\n → Trees → Graphs → Recursion → Dynamic Programming\n```\n\n**🎯 Daily practice:**\n- Solve **2-3 problems** daily on Sowberry's Coding Practice\n- Start with Easy → Medium → Hard\n- Don't look at solutions for at least 30 minutes\n- After solving, optimize your solution\n\n**🧪 Problem-solving approach:**\n1. **Read** the problem 2-3 times\n2. **Identify** the pattern/data structure\n3. **Pseudocode** your approach\n4. **Code** the solution\n5. **Test** with edge cases\n6. **Optimize** if needed\n\n**🏆 Patterns to master:**\n- Two Pointers, Sliding Window\n- Binary Search variants\n- BFS/DFS traversal\n- Dynamic Programming\n\nUse Sowberry's **Code Editor** to practice! 🔥",

  interview_tips: () => "🎯 **Interview & Placement Preparation:**\n\n**💻 Technical:**\n- Master DSA (200+ coding problems)\n- System design basics\n- Know your language inside-out\n- OOP concepts\n\n**📝 Resume:**\n- Keep it 1 page (for freshers)\n- Highlight projects with tech stack\n- Include coding profiles (GitHub, LeetCode)\n- Quantify achievements\n\n**🗣️ Interview Day:**\n1. Think aloud — explain your approach\n2. Ask clarifying questions\n3. Start with brute force, then optimize\n4. Write clean code with meaningful names\n5. Test your code with examples\n6. Handle edge cases\n\n**📌 HR Round:**\n- Research the company\n- Prepare \"Tell me about yourself\" (60 sec)\n- Use STAR format for behavioral questions\n\nYou've got this! 💪🔥",

  motivation: () => pick([
    "💪 **You've absolutely got this!**\n\nEvery expert was once a beginner. The fact that you're here, learning — that already sets you apart.\n\n- 🌱 Growth happens outside your comfort zone\n- 📈 Progress isn't always visible, but it's happening\n- 🧠 Your brain builds new connections when you struggle\n- 🏆 Every problem you solve makes the next one easier\n\n*\"The only way to do great work is to love what you do.\"* — Steve Jobs\n\nTake a deep breath. You're doing better than you think. 🌟",
    "🌟 **Don't you dare give up!**\n\nStruggling? That means you're learning.\n\n**What to do right now:**\n1. Take a 5-minute break 🧘\n2. Break the problem into smaller pieces\n3. Write down what you DO understand\n4. Ask for help — use the **Doubts** section!\n5. Come back with fresh eyes\n\n*\"It does not matter how slowly you go, as long as you don't stop.\"* — Confucius 🔥",
    "🔥 **Believe in the process!**\n\n- 🌊 Even the ocean was once a single drop of rain\n- 💎 Diamonds form under pressure\n\n**Your daily affirmation:**\n- I am capable of learning anything I set my mind to\n- Every mistake is a lesson\n- My pace doesn't define my ability\n\n*\"Success is not final, failure is not fatal: it is the courage to continue that counts.\"* — Churchill 💪✨",
    "🫂 **It's okay to feel overwhelmed.**\n\n**Quick reset routine:**\n1. 🧘 Close your eyes for 30 seconds\n2. 💧 Drink some water\n3. 📝 Write down your 1 most important task\n4. ⏱️ Set a 25-min timer (Pomodoro)\n5. 🔨 Just start — even if it's imperfect\n\nYou don't have to figure it all out today. Just take the next small step. 🌱",
  ]),

  math_help: (msg) => {
    if (/percentage|percent/i.test(msg)) return "📊 **Percentage:**\n\n**Formula:** Percentage = (Part / Whole) × 100\n\n**Examples:**\n- 45 out of 60 = (45/60) × 100 = **75%**\n- 20% of 250 = (20/100) × 250 = **50**\n- Increase 80 by 15% = 80 × 1.15 = **92**";
    if (/factorial/i.test(msg)) return "🔢 **Factorial (n!)**\n\nn! = n × (n-1) × ... × 1\n\n**Examples:** 5! = 120, 0! = 1, 10! = 3,628,800\n\n```python\ndef factorial(n):\n    if n <= 1: return 1\n    return n * factorial(n-1)\n```";
    if (/probability/i.test(msg)) return "🎲 **Probability:**\n\nP(Event) = Favorable outcomes / Total outcomes\n\n**Rules:**\n- P(A or B) = P(A) + P(B) - P(A and B)\n- P(A and B) = P(A) × P(B) if independent\n- P(not A) = 1 - P(A)\n\n**Example:** Rolling a die, P(even) = 3/6 = 0.5";
    return "🔢 **Math Help:**\n\nI can help with percentages, ratios, algebra, probability, statistics, permutations, combinations, logarithms, trigonometry basics and more.\n\nAsk me a specific math topic! 📐";
  },

  science_help: (msg) => {
    if (/newton|force|motion/i.test(msg)) return "🍎 **Newton's Laws:**\n\n**1st (Inertia):** An object stays at rest or in motion unless acted upon by a force.\n**2nd:** F = ma\n**3rd:** Every action has an equal and opposite reaction.\n\n🚀 Rockets: push gas down → gas pushes rocket up!";
    return "🔬 **Science Help:**\n\nI can discuss Physics, Chemistry, and Biology concepts.\n\nAsk me about a specific topic! 🧪";
  },

  humor: () => pick([
    "😄 **Why do programmers prefer dark mode?**\nBecause light attracts bugs! 🐛",
    "😄 **A SQL query walks into a bar, sees two tables, and asks:**\n\"Can I JOIN you?\" 🍺",
    "😄 **How many programmers does it take to change a light bulb?**\nNone — that's a hardware problem! 💡",
    "😄 **There are only 10 types of people in the world:**\nThose who understand binary, and those who don't. 💻",
    "😄 **Why was the JavaScript developer sad?**\nBecause he didn't Node how to Express himself. 🟢",
  ]),

  compliment: () => pick([
    "Aww, thank you! 😊 That really warms my circuits! I'm here to be the best assistant I can be! 🌱✨",
    "You're too kind! 🌟 Knowing I'm helpful makes me want to help even more!",
    "Thank you so much! 😊 I love being part of your learning journey at Sowberry Academy! 🚀",
  ]),

  insult: () => pick([
    "I understand you might be frustrated — that's okay! 😊 I'm always trying to improve. How can I help you better?\n\nSometimes rephrasing your question helps me give a better answer! 💡",
    "I hear you! 😅 I may not be perfect, but I'm here to help. Try asking about specific topics — coding, courses, study tips — and I'll give it my best shot! 🌱",
  ]),

  follow_up_more: (msg, history) => {
    return "Great question! Here's some additional detail:\n\n" + pick([
      "Would you like me to:\n- 📖 Provide more code examples?\n- 🔍 Explain a specific concept in more depth?\n- 💡 Share practical use cases?\n- 🎯 Give practice problems?\n\nJust tell me what angle interests you! 🤓",
      "I'd love to dive deeper! I can provide:\n\n1. **More examples** — Different languages or scenarios\n2. **Edge cases** — What to watch out for\n3. **Practice problems** — To test your understanding\n4. **Related topics** — What to learn next\n\nWhat sounds good? 📚",
    ]);
  },

  follow_up_affirm: () => "Great! 👍 " + pick([
    "What specific area would you like to explore further?",
    "Tell me what topic interests you or what help you need!",
    "Let's do this! What would you like to learn about?",
  ]),

  general: (msg) => {
    const m = msg.toLowerCase();
    if (/how\s*(are|r)\s*you|how'?s\s*it\s*going/i.test(m)) return pick([
      "I'm doing great, thanks for asking! 😊 I'm always energized and ready to help. What can I assist you with?",
      "I'm wonderful! 🌟 Running at full capacity. How can I help you today?",
    ]);
    if (/who\s*(created|made|owns)\s*sowberry/i.test(m)) return "🌱 **Sowberry Academy** was created by a passionate development team dedicated to accessible education. I'm **Junniya**, the AI assistant they built to help everyone on the platform. 😊";
    if (/weather|time|date|news/i.test(m)) return "I'm focused on helping you with **Sowberry Academy** and your learning journey! 😊\n\nBut I can help with: 📚 Platform features, 💻 Programming, 🧠 Study tips, 🌟 Career guidance";
    if (/\b(ai|artificial\s*intelligence|machine\s*learning|deep\s*learning|neural\s*network|chatgpt|gpt|chatbot|llm)\b/i.test(m)) return "🤖 **AI & ML** is fascinating!\n\n- **AI** — Machines simulating human intelligence\n- **Machine Learning** — AI that learns from data\n- **Deep Learning** — ML with neural networks\n- **NLP** — AI understanding human language\n\nI'm **Junniya**, a custom AI built for Sowberry — running self-contained with no external APIs! 🧠";
    return pick([
      "That's an interesting question! 🤔 I'm great at:\n\n- 📚 **Platform help** — Every Sowberry feature explained\n- 💻 **Programming** — Concepts, code examples, 15+ languages\n- 🧠 **Study tips** — Proven learning techniques\n- 📊 **Live stats** — Real-time data from the database\n- 🎯 **Career prep** — Interview tips, resume advice\n- 🌟 **Motivation** — When you need a boost\n\nTry asking me about any of these! 😊",
      "I appreciate the question! 😊 I'm most helpful with:\n\n🧭 *\"How do I enroll in courses?\"*\n💻 *\"Explain binary search\"*\n🧠 *\"How to study effectively?\"*\n📊 *\"How many students are on the platform?\"*\n🎯 *\"Interview tips\"*\n\nFeel free to ask in any of these areas!",
    ]);
  },
};

// ──────────────── MAIN RESPONSE GENERATOR ────────────────
async function generateResponse(message, history) {
  const msg = message.trim();
  const followUp = detectFollowUp(msg, history);
  if (followUp && responses[followUp]) {
    const handler = responses[followUp];
    return typeof handler === 'function' ? await handler(msg, history) : handler;
  }
  const intent = detectIntent(msg);
  const handler = responses[intent];
  if (!handler) return await responses.general(msg);
  if (typeof handler === 'function') return await handler(msg, history);
  return handler;
}

// ──────────────── CHAT ENDPOINT ────────────────
router.post('/message', async (req, res) => {
  try {
    const { message, sessionId, userRole, userName } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required.' });
    }
    const sid = sessionId || `junniya_${Date.now()}`;
    if (!conversations.has(sid)) {
      conversations.set(sid, { messages: [], lastAccess: Date.now(), userRole, userName });
    }
    const conv = conversations.get(sid);
    conv.lastAccess = Date.now();
    if (userRole) conv.userRole = userRole;
    if (userName) conv.userName = userName;
    conv.messages.push({ role: 'user', content: message.trim() });
    if (conv.messages.length > 30) conv.messages = conv.messages.slice(-30);

    const reply = await generateResponse(message.trim(), conv.messages);
    conv.messages.push({ role: 'assistant', content: reply });

    res.json({ success: true, reply, sessionId: sid });
  } catch (error) {
    console.error('Junniya chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong.',
      reply: "Oops! I had a small hiccup. 😅 Please try again — I'm ready!"
    });
  }
});

// Clear conversation
router.delete('/clear/:sessionId', (req, res) => {
  conversations.delete(req.params.sessionId);
  res.json({ success: true, message: 'Conversation cleared.' });
});

export default router;
