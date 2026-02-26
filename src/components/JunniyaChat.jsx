import { useState, useEffect, useRef, useCallback } from 'react';
import { authApi, studentApi, adminApi, mentorApi, publicApi } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './JunniyaChat.css';

// ══════════════════════════════════════════════════════════════
// JUNNIYA — Sowberry Academy AI Assistant (Frontend-Only)
// All intelligence + API calls run entirely in the browser.
// Uses existing api.js endpoints for real actions.
// ══════════════════════════════════════════════════════════════

// ──────────────── MARKDOWN RENDERER WITH TABLE & LIST SUPPORT ────────────────
const renderMarkdown = (text) => {
  if (!text) return '';
  const codeBlocks = [];
  let processed = text.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => {
    codeBlocks.push(`<pre class="junniya-code-block"><code>${code}</code></pre>`);
    return `%%CODEBLOCK_${codeBlocks.length - 1}%%`;
  });
  processed = processed.replace(
    /(?:^|\n)(\|.+\|)\n(\|[\s:|-]+\|)\n((?:\|.+\|(?:\n|$))+)/gm,
    (match, headerRow, separatorRow, bodyRows) => {
      const headers = headerRow.split('|').filter(c => c.trim() !== '').map(c => c.trim());
      const rows = bodyRows.trim().split('\n').map(row =>
        row.split('|').filter(c => c.trim() !== '').map(c => c.trim())
      );
      let table = '<div class="junniya-table-wrap"><table class="junniya-table"><thead><tr>';
      headers.forEach(h => { table += `<th>${h}</th>`; });
      table += '</tr></thead><tbody>';
      rows.forEach(r => { table += '<tr>'; r.forEach(c => { table += `<td>${c}</td>`; }); table += '</tr>'; });
      table += '</tbody></table></div>';
      return table;
    }
  );
  processed = processed.replace(/(?:^|\n)((?:- .+(?:\n|$))+)/gm, (match, listBlock) => {
    const items = listBlock.trim().split('\n').map(l => l.replace(/^- /, '').trim());
    return '<ul class="junniya-list">' + items.map(i => `<li>${i}</li>`).join('') + '</ul>';
  });
  processed = processed.replace(/(?:^|\n)((?:\d+\. .+(?:\n|$))+)/gm, (match, listBlock) => {
    const items = listBlock.trim().split('\n').map(l => l.replace(/^\d+\.\s/, '').trim());
    return '<ol class="junniya-list junniya-list-ol">' + items.map(i => `<li>${i}</li>`).join('') + '</ol>';
  });
  processed = processed.replace(/^---$/gm, '<hr class="junniya-hr"/>');
  processed = processed.replace(/`([^`]+)`/g, '<code class="junniya-inline-code">$1</code>');
  processed = processed.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  processed = processed.replace(/\*(.+?)\*/g, '<em>$1</em>');
  processed = processed.replace(/^### (.+)$/gm, '<h4 class="junniya-h4">$1</h4>');
  processed = processed.replace(/^## (.+)$/gm, '<h3 class="junniya-h3">$1</h3>');
  processed = processed.replace(/^# (.+)$/gm, '<h2 class="junniya-h2">$1</h2>');
  processed = processed.replace(/\n\n/g, '</p><p>');
  processed = processed.replace(/\n/g, '<br/>');
  codeBlocks.forEach((block, i) => { processed = processed.replace(`%%CODEBLOCK_${i}%%`, block); });
  return `<p>${processed}</p>`;
};

// ──────────────── TYPING INDICATOR ────────────────
const TypingIndicator = () => (
  <div className="junniya-typing">
    <div className="junniya-typing-dot"></div>
    <div className="junniya-typing-dot"></div>
    <div className="junniya-typing-dot"></div>
  </div>
);

// ──────────────── STREAMING TEXT HOOK ────────────────
const useStreamingText = (fullText, isStreaming, speed = 18) => {
  const [displayed, setDisplayed] = useState(fullText || '');
  const [done, setDone] = useState(!isStreaming);
  useEffect(() => {
    if (!isStreaming || !fullText) { setDisplayed(fullText || ''); setDone(true); return; }
    setDisplayed(''); setDone(false);
    let idx = 0;
    const words = fullText.split(/(?<=\s)/);
    const timer = setInterval(() => {
      idx++;
      setDisplayed(words.slice(0, idx).join(''));
      if (idx >= words.length) { clearInterval(timer); setDone(true); }
    }, speed);
    return () => clearInterval(timer);
  }, [fullText, isStreaming, speed]);
  return { displayed, done };
};

// ──────────────── SINGLE MESSAGE ────────────────
const ChatMessage = ({ message, isStreaming = false, onStreamDone }) => {
  const isUser = message.role === 'user';
  const { displayed, done } = useStreamingText(message.content, !isUser && isStreaming, 18);
  useEffect(() => { if (done && isStreaming && onStreamDone) onStreamDone(); }, [done, isStreaming, onStreamDone]);
  return (
    <div className={`junniya-message ${isUser ? 'junniya-message-user' : 'junniya-message-ai'}`}>
      {!isUser && (
        <div className="junniya-avatar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L13.09 8.26L18 6L15.74 10.91L22 12L15.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L8.26 13.09L2 12L8.26 10.91L6 6L10.91 8.26L12 2Z" fill="currentColor"/>
          </svg>
        </div>
      )}
      <div className={`junniya-bubble ${isUser ? 'junniya-bubble-user' : 'junniya-bubble-ai'}`}>
        {isUser ? <p>{message.content}</p> : (
          <div className="junniya-markdown">
            <div dangerouslySetInnerHTML={{ __html: renderMarkdown(displayed) }} />
            {!done && <span className="junniya-cursor">▍</span>}
          </div>
        )}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// INTENT DETECTION ENGINE (60+ patterns)
// ══════════════════════════════════════════════════════════════
const intentList = [
  { id: 'greeting', p: [/^(hi|hello|hey|hola|howdy|greetings|yo|sup|good\s*(morning|afternoon|evening|night)|what'?s\s*up)/i], pr: 10 },
  { id: 'farewell', p: [/^(bye|goodbye|see\s*you|cya|good\s*night|gn|take\s*care|later|adios|ciao)/i], pr: 10 },
  { id: 'thanks', p: [/\b(thank|thanks|thx|thankyou|ty|appreciate|grateful)\b/i], pr: 9 },
  { id: 'identity', p: [/who\s*(are|r)\s*you|your\s*name|what\s*(are|r)\s*you|introduce\s*yourself|about\s*you/i], pr: 10 },
  { id: 'creator', p: [/who\s*(made|created|built|developed)\s*you|your\s*(creator|developer)/i], pr: 10 },
  { id: 'platform_overview', p: [/what\s*is\s*sowberry|about\s*sowberry|tell\s*me\s*about\s*(the\s*)?(platform|sowberry)/i], pr: 8 },
  { id: 'cancel_flow', p: [/^(cancel|exit|stop|quit|nevermind|never\s*mind|go\s*back|abort)$/i], pr: 11 },
  // ── Auth Actions ──
  { id: 'do_login', p: [/\b(login|sign\s*in|log\s*in)\b/i], pr: 9 },
  { id: 'do_register', p: [/\b(register|sign\s*up|create\s*(an?\s*)?account|join\s*sowberry)\b/i], pr: 9 },
  { id: 'do_forgot_password', p: [/\b(forgot\s*password|reset\s*password|lost\s*password|can'?t\s*(log\s*)?in)\b/i], pr: 9 },
  { id: 'do_logout', p: [/\b(log\s*out|sign\s*out|logout)\b/i], pr: 9 },
  // ── Student Data Actions ──
  { id: 'do_enroll', p: [/\b(enroll\s*(me|in)?|join\s*(a\s*)?course|take\s*(a\s*)?course|register\s*for\s*(a\s*)?course)\b/i], pr: 9 },
  { id: 'do_my_courses', p: [/\b(my\s*course|what\s*am\s*i\s*(enrolled|learning|studying)|show\s*my\s*course|enrolled\s*course)\b/i], pr: 8 },
  { id: 'do_my_grades', p: [/\b(my\s*grade|my\s*score|my\s*mark|how\s*am\s*i\s*doing|my\s*performance|show\s*my\s*grade)\b/i], pr: 8 },
  { id: 'do_my_assignments', p: [/\b(my\s*assignment|pending\s*assignment|show\s*my\s*assignment)\b/i], pr: 8 },
  { id: 'do_my_progress', p: [/\b(my\s*progress|show\s*my\s*progress|track\s*progress|completion|certificate)\b/i], pr: 8 },
  { id: 'do_my_doubts', p: [/\b(my\s*doubt|show\s*my\s*doubt|ask\s*(a\s*)?doubt|raise\s*doubt)\b/i], pr: 8 },
  { id: 'do_browse_courses', p: [/\b(browse\s*course|available\s*course|all\s*course|list\s*course|show\s*course)\b/i], pr: 8 },
  { id: 'do_events', p: [/\b(event|upcoming\s*event|show\s*event|webinar|workshop)\b/i], pr: 7 },
  { id: 'do_study_materials', p: [/\b(study\s*material|resource|learning\s*resource|notes|material)\b/i], pr: 7 },
  { id: 'do_discussions', p: [/\b(discussion|forum|discuss|community)\b/i], pr: 7 },
  { id: 'do_aptitude', p: [/\b(aptitude\s*test|quiz|mcq|aptitude\s*exam|take\s*test)\b/i], pr: 7 },
  { id: 'do_coding', p: [/\b(coding\s*practice|coding\s*problem|practice\s*code|solve\s*problem)\b/i], pr: 7 },
  { id: 'do_dashboard', p: [/\b(dashboard|my\s*dashboard|show\s*dashboard|overview)\b/i], pr: 7 },
  { id: 'do_profile', p: [/\b(my\s*profile|show\s*profile|view\s*profile|account)\b/i], pr: 7 },
  { id: 'platform_stats', p: [/how\s*many\s*(student|mentor|course|user)|total\s*(student|mentor|course)|platform\s*stat|show\s*(me\s*)?stats|dashboard\s*stat/i], pr: 8 },
  { id: 'capabilities', p: [/what\s*can\s*you\s*(do|help)|your\s*(capabilities|features)|help\s*me|can\s*you\s*help/i], pr: 7 },
  // ── Feature Info ──
  { id: 'feat_courses', p: [/\b(course|learning\s*path|how\s*(do|to)\s*(i\s*)?(enroll|learn))\b/i], pr: 6 },
  { id: 'feat_assignments', p: [/\b(assignment|submit\s*assignment|homework)\b/i], pr: 6 },
  { id: 'feat_grades', p: [/\b(grade|marks?|score|gpa|result)\b/i], pr: 6 },
  { id: 'feat_coding', p: [/\b(code\s*editor|run\s*code|execute\s*code)\b/i], pr: 7 },
  { id: 'feat_games', p: [/\b(game|learning\s*game|play|challenge)\b/i], pr: 6 },
  { id: 'feat_doubts', p: [/\b(doubt|clear\s*doubt)\b/i], pr: 6 },
  { id: 'feat_notifications', p: [/\b(notification|alert|notify|bell)\b/i], pr: 5 },
  { id: 'mentor_features', p: [/\b(mentor|mentoring|as\s*a\s*mentor|mentor\s*(dashboard|feature))\b/i], pr: 7 },
  { id: 'admin_features', p: [/\b(admin|administrator|admin\s*(dashboard|panel)|manage\s*(student|mentor|user))\b/i], pr: 7 },
  { id: 'auth_info', p: [/\b(authentication|otp|verify|verification|how\s*to\s*login|how\s*to\s*register)\b/i], pr: 6 },
  { id: 'theme', p: [/\b(theme|dark\s*mode|light\s*mode|toggle\s*theme|switch\s*theme|night\s*mode)\b/i], pr: 6 },
  // ── Programming Topics ──
  { id: 'prog_array', p: [/\bwhat\s*(is|are)\s*(an?\s*)?(array)/i], pr: 8 },
  { id: 'prog_string', p: [/\bwhat\s*(is|are)\s*(a\s*)?(string)/i], pr: 8 },
  { id: 'prog_function', p: [/\bwhat\s*(is|are)\s*(a\s*)?(function|method)/i], pr: 8 },
  { id: 'prog_loop', p: [/\bwhat\s*(is|are)\s*(a\s*)?(loop|for\s*loop|while\s*loop)/i], pr: 8 },
  { id: 'prog_recursion', p: [/\bwhat\s*(is)?\s*(recursion|recursive)/i], pr: 8 },
  { id: 'prog_class', p: [/\bwhat\s*(is|are)\s*(a\s*)?(class|object|oop)/i], pr: 8 },
  { id: 'prog_stack', p: [/\bwhat\s*(is|are)\s*(a\s*)?(stack)\b/i], pr: 8 },
  { id: 'prog_queue', p: [/\bwhat\s*(is|are)\s*(a\s*)?(queue)\b/i], pr: 8 },
  { id: 'prog_tree', p: [/\bwhat\s*(is|are)\s*(a\s*)?(tree|binary\s*tree|bst)/i], pr: 8 },
  { id: 'prog_graph', p: [/\bwhat\s*(is|are)\s*(a\s*)?(graph)\b/i], pr: 8 },
  { id: 'prog_linked_list', p: [/\bwhat\s*(is|are)\s*(a\s*)?(linked\s*list)/i], pr: 8 },
  { id: 'prog_hash', p: [/\bwhat\s*(is|are)\s*(a\s*)?(hash\s*(map|table|set)|hashing|dictionary)/i], pr: 8 },
  { id: 'prog_sorting', p: [/\bwhat\s*(is|are)\s*(a\s*)?(sort|sorting|bubble\s*sort|merge\s*sort|quick\s*sort)\b/i], pr: 8 },
  { id: 'prog_searching', p: [/\bwhat\s*(is|are)\s*(a\s*)?(search|searching|binary\s*search|linear\s*search)\b/i], pr: 8 },
  { id: 'prog_variable', p: [/\bwhat\s*(is|are)\s*(a\s*)?(variable|constant|let|var|const)\b/i], pr: 8 },
  { id: 'prog_algorithm', p: [/\bwhat\s*(is|are)\s*(an?\s*)?(algorithm|algo)\b/i], pr: 8 },
  { id: 'prog_ds', p: [/\bwhat\s*(is|are)\s*(a\s*)?(data\s*structure)/i], pr: 8 },
  { id: 'prog_general', p: [/\b(explain|how\s*does|how\s*to|difference\s*between|compare)\b.*\b(code|program|python|java|javascript|c\+\+|html|css|react|node|sql|api|algorithm|recursion|loop|array|string|function)\b/i], pr: 5 },
  // ── Tips & Motivation ──
  { id: 'study_tips', p: [/\b(study\s*tip|how\s*to\s*study|learn\s*better|productivity|focus|exam\s*prep|time\s*management)\b/i], pr: 6 },
  { id: 'coding_tips', p: [/\b(coding\s*tip|improve\s*(my\s*)?(coding|programming)|dsa\s*tip|competitive\s*programming)\b/i], pr: 7 },
  { id: 'interview_tips', p: [/\b(interview|placement|job\s*prep|career|resume|intern)\b/i], pr: 5 },
  { id: 'motivation', p: [/\b(motivat|inspire|discouraged|can'?t\s*do|give\s*up|frustrated|stressed|fail|overwhelm|burnout)\b/i], pr: 6 },
  { id: 'humor', p: [/\b(joke|funny|tell\s*me\s*(a\s*)?joke|make\s*me\s*laugh|fun\s*fact)\b/i], pr: 5 },
  { id: 'compliment', p: [/\b(you'?re?\s*(great|awesome|amazing|smart|helpful|best)|love\s*you|good\s*(job|work|bot))\b/i], pr: 6 },
];

function detectIntent(message) {
  const msg = message.toLowerCase().trim();
  let best = null, bestPr = -1;
  for (const intent of intentList) {
    for (const pattern of intent.p) {
      if (pattern.test(msg) && intent.pr > bestPr) { best = intent.id; bestPr = intent.pr; }
    }
  }
  return best || 'general';
}

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ══════════════════════════════════════════════════════════════
// STATIC RESPONSES (no API call needed)
// ══════════════════════════════════════════════════════════════
const staticResponses = {
  greeting: () => pick([
    "Hello! 👋 I'm **Junniya**, your Sowberry Academy AI assistant. How can I help you today?\n\nI can:\n- 🔐 **Log you in** or **register** you\n- 📚 **Enroll** you in courses\n- 📊 Show your **grades, progress, assignments**\n- 💻 Explain **programming concepts**\n- 🧠 Share **study tips**",
    "Hey there! 🌟 I'm **Junniya**! I can actually **do things** for you — login, enroll in courses, check your grades, and more. Just ask!",
    "Hi! 😊 I'm **Junniya**. I'm not just a chatbot — I can log you in, show your courses, grades, and more. What do you need?",
  ]),
  farewell: () => pick(["Goodbye! 👋 Keep learning, keep growing! 🌱✨", "See you later! 😊 Come back anytime! 🌟", "Bye! 👋 Happy learning! 🌱"]),
  thanks: () => pick(["You're welcome! 😊 Happy to help!", "Glad I could help! 🌟", "Anytime! 😊 Ask me anything! 🌱"]),
  identity: () => "I'm **Junniya** 🌱 — the AI assistant built into Sowberry Academy!\n\n**I can actually perform actions for you:**\n- 🔐 Log you in / Register / Reset password\n- 📚 Enroll you in courses / Show enrolled courses\n- 📊 Fetch your grades, assignments, progress\n- 📅 Show events, study materials, discussions\n- 🧠 Aptitude tests, coding problems\n- 💻 Explain programming concepts with code\n- 🌟 Study tips, career guidance, motivation\n\nJust tell me what you need! 😊",
  creator: () => "I was created by the **Sowberry Academy development team**! 🌱 I live entirely within the platform — using the same APIs as the rest of the app! 💪",
  platform_overview: () => "🌱 **Sowberry Academy** is a comprehensive online learning platform.\n\n**For Students:** 📚 Courses, 📝 Assignments, 💻 Code Editor (15+ languages), 🧠 Aptitude Tests, 🎮 Learning Games, ❓ Doubts, 📊 Progress & Certificates\n\n**For Mentors:** 📚 Create courses, 📝 Grade assignments, 💻 Build coding problems, 🧠 Design aptitude tests, 📅 Events\n\n**For Admins:** 👥 Manage users, 📊 Analytics, ⚙️ Settings\n\nI can help you with any of these — just ask! 😊",
  capabilities: () => "Here's what I can **do** for you! 🎯\n\n**🔐 Account Actions**\n- Login, Register, Reset Password, Logout\n\n**📚 Course Actions**\n- Browse courses, Enroll, View my courses\n\n**📊 Data Fetching**\n- My grades, assignments, progress, dashboard\n- Events, study materials, discussions, doubts\n- Platform stats (admin/student)\n- Aptitude tests, coding problems\n\n**💻 Knowledge**\n- Programming concepts (arrays, trees, sorting...)\n- Study tips, coding tips, interview prep\n- Platform feature guides\n\nJust say it and I'll do it! 😊",
  auth_info: () => "🔐 **I can handle auth right here!**\n\n- Type **login** to sign in\n- Type **register** to create an account\n- Type **forgot password** to reset\n- Type **logout** to sign out\n\nNo need to navigate anywhere! 😊",
  theme: () => "🎨 **Theme Toggle:**\n\nClick the **sun/moon icon** in the top header to switch between light and dark mode. Your preference is saved! 🌙",
  feat_courses: () => "📚 **Courses on Sowberry:**\n\n1. Go to **My Courses** from the sidebar\n2. **Browse Courses** to see all available ones\n3. **Enroll** in any course\n4. Each course has **Subjects → Topics → Content**\n5. Complete 100% to earn a **Certificate** 🎓\n\n💡 Or just type **enroll** and I'll handle it for you!",
  feat_assignments: () => "📝 **Assignments:**\n\n- View from **My Assignments** in sidebar\n- Submit before the deadline!\n- Mentors grade and provide feedback\n- Check **My Grades** for scores\n\n💡 Type **my assignments** to see yours!",
  feat_grades: () => "📊 **Grades:**\n\n- Assignment scores (graded by mentors)\n- Aptitude test scores (auto-graded)\n- Coding submissions (pass/fail)\n\n💡 Type **my grades** to see them right here!",
  feat_coding: () => "💻 **Coding on Sowberry:**\n\n- **Coding Practice** — solve problems by difficulty\n- **Code Editor** — supports 15+ languages\n- Write, test, and run code instantly!\n\n💡 Type **coding problems** to browse them!",
  feat_games: () => "🎮 **Learning Games:** Interactive coding challenges! Complete them to unlock more. Go to **Learning Games** in sidebar.",
  feat_doubts: () => "❓ **Doubts:** Create doubts, get mentor responses. Type **my doubts** to see yours!",
  feat_notifications: () => "🔔 Click the **bell icon** in the header to view notifications.",
  mentor_features: () => "👨‍🏫 **Mentor Features:** Create courses, assignments, coding problems, aptitude tests, events, discussions. Grade student work and track progress.",
  admin_features: () => "🛡️ **Admin Features:** Manage students & mentors, courses, analytics, reports, settings, notifications, contact messages, profile requests.",
  // ── Programming Topics ──
  prog_array: () => "📦 **Array** — A collection of elements at contiguous memory locations.\n\n```python\nnums = [10, 20, 30, 40, 50]\nprint(nums[0])   # 10\nnums.append(60)\n```\n\n```javascript\nconst arr = [1, 2, 3];\narr.push(4);\narr.filter(x => x > 2); // [3, 4]\n```\n\n**O(1)** access by index, **O(n)** insert/delete in middle.",
  prog_string: () => "📝 **String** — A sequence of characters.\n\n```python\nname = \"Sowberry\"\nprint(name.upper())  # SOWBERRY\nprint(len(name))     # 8\n```\n\nImmutable in Python/Java/JS. Common problems: palindrome, anagram, substring.",
  prog_function: () => "⚙️ **Function** — A reusable block of code.\n\n```python\ndef greet(name):\n    return f\"Hello, {name}!\"\n```\n\n```javascript\nconst add = (a, b) => a + b;\n```\n\nKey concepts: parameters, return, scope, pure functions.",
  prog_loop: () => "🔄 **Loops** — Repeat code until a condition is met.\n\n```python\nfor i in range(5):\n    print(i)\n\nwhile count < 3:\n    count += 1\n```\n\nTypes: `for`, `while`, `do-while`, `for-of`.",
  prog_recursion: () => "🌀 **Recursion** — A function calling itself.\n\n```python\ndef factorial(n):\n    if n <= 1: return 1\n    return n * factorial(n - 1)\n```\n\nAlways have a **base case**! Used in trees, divide & conquer, DP.",
  prog_class: () => "🏗️ **OOP** — Classes are blueprints for objects.\n\n```python\nclass Student:\n    def __init__(self, name):\n        self.name = name\n```\n\n4 pillars: Encapsulation, Inheritance, Polymorphism, Abstraction.",
  prog_stack: () => "📚 **Stack (LIFO)** — push/pop from top.\n\n```python\nstack = []\nstack.append(1)\nstack.pop()  # 1\n```\n\nUses: call stack, undo, parentheses matching.",
  prog_queue: () => "🚶 **Queue (FIFO)** — enqueue back, dequeue front.\n\n```python\nfrom collections import deque\nq = deque()\nq.append(1)\nq.popleft()  # 1\n```\n\nUses: BFS, scheduling, print queue.",
  prog_tree: () => "🌳 **Tree** — Hierarchical structure with nodes.\n\n```python\nclass TreeNode:\n    def __init__(self, val):\n        self.val = val\n        self.left = self.right = None\n```\n\nTypes: BST, AVL, Heap. Traversals: Inorder, Preorder, Postorder.",
  prog_graph: () => "🕸️ **Graph** — Vertices connected by edges.\n\n```python\ngraph = {'A': ['B','C'], 'B': ['A','D']}\n```\n\nAlgorithms: BFS, DFS, Dijkstra. Uses: social networks, maps.",
  prog_linked_list: () => "🔗 **Linked List** — Nodes connected by pointers.\n\n```python\nclass Node:\n    def __init__(self, val):\n        self.val = val\n        self.next = None\n```\n\nTypes: Singly, Doubly, Circular. O(1) insert at head.",
  prog_hash: () => "🗂️ **Hash Map** — Key-value pairs with O(1) lookup.\n\n```python\nstudent = {'name': 'Aarav', 'grade': 85}\nprint(student['name'])\n```\n\nUses: caching, counting, indexing.",
  prog_sorting: () => "📊 **Sorting Algorithms**\n\n| Algorithm | Average | Space |\n|-----------|---------|-------|\n| Bubble Sort | O(n²) | O(1) |\n| Merge Sort | O(n log n) | O(n) |\n| Quick Sort | O(n log n) | O(log n) |\n\n```python\ndef quicksort(arr):\n    if len(arr) <= 1: return arr\n    pivot = arr[len(arr)//2]\n    return quicksort([x for x in arr if x<pivot]) + [x for x in arr if x==pivot] + quicksort([x for x in arr if x>pivot])\n```",
  prog_searching: () => "🔍 **Searching:**\n\n**Linear O(n):**\n```python\ndef linear(arr, t):\n    for i,v in enumerate(arr):\n        if v==t: return i\n```\n\n**Binary O(log n):** (sorted array)\n```python\ndef binary(arr, t):\n    lo,hi = 0, len(arr)-1\n    while lo<=hi:\n        mid=(lo+hi)//2\n        if arr[mid]==t: return mid\n        elif arr[mid]<t: lo=mid+1\n        else: hi=mid-1\n```",
  prog_variable: () => "📦 **Variables** store values.\n\n```javascript\nlet count = 0;   // can change\nconst PI = 3.14; // constant\n```\n\n```python\nname = \"Junniya\"\nage = 2\n```\n\nUse `const` by default, `let` when needed.",
  prog_algorithm: () => "⚡ **Algorithm** — step-by-step procedure.\n\nCategories: Searching, Sorting, Recursion, Greedy, DP, Graph, Backtracking.\n\n**Big-O:** O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ)",
  prog_ds: () => "🗃️ **Data Structures:**\n\n| Need | Use |\n|------|-----|\n| Fast lookup | Hash Map |\n| LIFO | Stack |\n| FIFO | Queue |\n| Hierarchy | Tree |\n| Connections | Graph |",
  prog_general: (msg) => {
    if (/python/i.test(msg)) return "🐍 **Python** — readable, interpreted.\n```python\ndata = [1,2,3,4,5]\nsquared = [x**2 for x in data]\n```";
    if (/java\b/i.test(msg)) return "☕ **Java** — strongly typed, compiled.\n```java\npublic class Hello {\n    public static void main(String[] args) {\n        System.out.println(\"Hello!\");\n    }\n}\n```";
    if (/javascript|js\b/i.test(msg)) return "⚡ **JavaScript** — language of the web.\n```javascript\nconst greet = (name) => `Hello, ${name}!`;\n```";
    return "💻 I cover: Python, Java, JavaScript, C++, DSA, Web, SQL, Git & more. Ask about a specific topic!";
  },
  // ── Tips & Motivation ──
  study_tips: () => "📖 **Study Tips:**\n\n1. **Pomodoro** 🍅 — 25 min study + 5 min break\n2. **Active Recall** 🔄 — Close book, try to recall\n3. **Spaced Repetition** 📅 — Review at intervals\n4. **Feynman Technique** 🎓 — Teach it simply\n\nConsistency > Intensity! 🌟",
  coding_tips: () => "💻 **Coding Tips:**\n\nPath: Arrays → Strings → Lists → Stacks → Trees → Graphs → DP\n\n1. Solve 2-3 problems daily\n2. Start Easy → Medium → Hard\n3. Don't peek at solutions for 30 min\n4. Test with edge cases\n\n💡 Type **coding problems** to practice!",
  interview_tips: () => "🎯 **Interview Prep:**\n\n- Master DSA (200+ problems)\n- Know your language well\n- Think aloud during interviews\n- STAR format for behavioral Qs\n- 1-page resume, highlight projects\n\nYou've got this! 💪",
  motivation: () => pick([
    "💪 **You've got this!** Every expert was once a beginner. The fact that you're learning already sets you apart! 🌟",
    "🌟 **Don't give up!** Struggling means you're learning. Take a 5-min break, then come back stronger! 🔥",
    "🔥 **Believe in the process!** Your pace doesn't define your ability. Just take the next step. 🌱",
  ]),
  humor: () => pick([
    "😄 **Why do programmers prefer dark mode?** Because light attracts bugs! 🐛",
    "😄 **A SQL query walks into a bar, sees two tables, asks:** \"Can I JOIN you?\" 🍺",
    "😄 **How many programmers to change a light bulb?** None — that's a hardware problem! 💡",
  ]),
  compliment: () => pick(["Aww, thank you! 😊 Happy to help! 🌱✨", "You're too kind! 🌟", "Thanks! 😊 I love being part of your learning journey! 🚀"]),
};

// ──────────────── SUGGESTED PROMPTS ────────────────
const defaultSuggestions = [
  { icon: '🔐', text: 'Login' },
  { icon: '📝', text: 'Register' },
  { icon: '📚', text: 'Enroll in a course' },
  { icon: '📊', text: 'Show me platform stats' },
];

const loggedInSuggestions = [
  { icon: '📚', text: 'My courses' },
  { icon: '📊', text: 'My grades' },
  { icon: '📈', text: 'My progress' },
  { icon: '📚', text: 'Enroll in a course' },
];

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════
const JunniyaChat = () => {
  const { user, login: authLogin, logout: authLogout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [streamingIdx, setStreamingIdx] = useState(-1);
  const [inputType, setInputType] = useState('text');
  const [activeFlow, setActiveFlow] = useState(null);
  const flowRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatBodyRef = useRef(null);

  // Keep flowRef in sync
  useEffect(() => { flowRef.current = activeFlow; }, [activeFlow]);

  // Initialize from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('junniya_session');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setMessages(data.messages || []);
      } catch { /* ignore */ }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('junniya_session', JSON.stringify({ messages }));
  }, [messages]);

  // Auto scroll
  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  // ──── ADD AI MESSAGE ────
  const addAiMessage = useCallback((content) => {
    const aiMsg = { role: 'assistant', content, timestamp: Date.now() };
    setMessages(prev => {
      setStreamingIdx(prev.length);
      return [...prev, aiMsg];
    });
  }, []);

  // ══════════════════════════════════════════════════════════════
  // FLOW HANDLERS — multi-step interactive flows using real APIs
  // ══════════════════════════════════════════════════════════════
  const handleFlowInput = useCallback(async (text) => {
    const flow = flowRef.current;
    if (!flow) return null;

    // ── LOGIN FLOW ──
    if (flow.type === 'login') {
      if (flow.step === 'username') {
        setActiveFlow({ ...flow, step: 'password', data: { ...flow.data, username: text } });
        setInputType('password');
        return "Now enter your **password** 🔒:";
      }
      if (flow.step === 'password') {
        setInputType('text');
        try {
          const res = await authApi.login({ username: flow.data.username, password: text });
          setActiveFlow(null);
          if (res.success) {
            const u = res.user;
            setTimeout(() => authLogin(res.token, u), 2000);
            return `✅ **Login successful!** Welcome back, **${u.fullName || u.username}**! 🎉\n\nRedirecting to your **${u.role}** dashboard...`;
          }
          return `❌ **Login failed:** ${res.message || 'Invalid credentials.'}\n\nType **login** to try again.`;
        } catch (err) {
          setActiveFlow(null);
          return `❌ **Login failed:** ${err?.response?.data?.message || 'Something went wrong.'}\n\nType **login** to try again.`;
        }
      }
    }

    // ── REGISTER FLOW ──
    if (flow.type === 'register') {
      if (flow.step === 'email') {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) return "⚠️ That doesn't look valid. Please enter a **valid email**:";
        setActiveFlow({ ...flow, step: 'username', data: { ...flow.data, email: text } });
        return "Choose a **username** (letters, numbers, underscores):";
      }
      if (flow.step === 'username') {
        if (text.length < 3) return "⚠️ Username must be at least **3 characters**. Try again:";
        setActiveFlow({ ...flow, step: 'fullName', data: { ...flow.data, username: text } });
        return "What's your **full name**? 📝";
      }
      if (flow.step === 'fullName') {
        if (text.length < 2) return "⚠️ Please enter a valid **full name**:";
        setActiveFlow({ ...flow, step: 'password', data: { ...flow.data, fullName: text } });
        setInputType('password');
        return "Create a **password** (at least 6 characters) 🔒:";
      }
      if (flow.step === 'password') {
        if (text.length < 6) return "⚠️ Password must be at least **6 characters**:";
        setInputType('text');
        try {
          const res = await authApi.register({
            email: flow.data.email,
            username: flow.data.username,
            fullName: flow.data.fullName,
            password: text,
          });
          setActiveFlow(null);
          if (res.success) {
            const u = res.user;
            setTimeout(() => authLogin(res.token, u), 2000);
            return `✅ **Registration successful!** Welcome, **${u.fullName || u.username}**! 🎉\n\nRedirecting to your dashboard...`;
          }
          return `❌ **Registration failed:** ${res.message}\n\nType **register** to try again.`;
        } catch (err) {
          setActiveFlow(null);
          return `❌ **Registration failed:** ${err?.response?.data?.message || 'Something went wrong.'}\n\nType **register** to try again.`;
        }
      }
    }

    // ── FORGOT PASSWORD FLOW ──
    if (flow.type === 'forgot_password') {
      if (flow.step === 'email') {
        try {
          const res = await authApi.forgotPassword({ email: text });
          if (res.success) {
            setActiveFlow({ ...flow, step: 'otp', data: { ...flow.data, email: text } });
            return `📧 OTP sent to **${text}**!\n\nPlease enter the **6-digit OTP**:`;
          }
          setActiveFlow(null);
          return `❌ ${res.message || 'No account found.'}\n\nType **forgot password** to try again.`;
        } catch (err) {
          setActiveFlow(null);
          return `❌ ${err?.response?.data?.message || 'Something went wrong.'}\n\nType **forgot password** to try again.`;
        }
      }
      if (flow.step === 'otp') {
        try {
          const res = await authApi.verifyOtp({ email: flow.data.email, otp: text });
          if (res.success) {
            setActiveFlow({ ...flow, step: 'new_password', data: { ...flow.data, otp: text } });
            setInputType('password');
            return "✅ OTP verified! Enter your **new password** (at least 6 chars) 🔒:";
          }
          setActiveFlow(null);
          return `❌ ${res.message || 'Invalid OTP.'}\n\nType **forgot password** to retry.`;
        } catch (err) {
          setActiveFlow(null);
          return `❌ ${err?.response?.data?.message || 'Something went wrong.'}`;
        }
      }
      if (flow.step === 'new_password') {
        if (text.length < 6) return "⚠️ Password must be at least **6 characters**:";
        setInputType('text');
        try {
          const res = await authApi.resetPassword({
            email: flow.data.email,
            otp: flow.data.otp,
            newPassword: text,
          });
          setActiveFlow(null);
          if (res.success) return "✅ **Password reset successful!** 🎉\n\nType **login** to sign in with your new password!";
          return `❌ ${res.message}\n\nType **forgot password** to retry.`;
        } catch (err) {
          setActiveFlow(null);
          return `❌ ${err?.response?.data?.message || 'Something went wrong.'}`;
        }
      }
    }

    // ── ENROLL FLOW ──
    if (flow.type === 'enroll') {
      if (flow.step === 'select') {
        const num = parseInt(text);
        if (isNaN(num) || num < 1 || num > flow.data.courses.length) {
          return `⚠️ Enter a number between **1** and **${flow.data.courses.length}**:`;
        }
        const course = flow.data.courses[num - 1];
        try {
          const res = await studentApi.enrollCourse(course.id);
          setActiveFlow(null);
          if (res.success) return `✅ **Enrolled successfully!** You're now in **${course.title}**! 🎉\n\nGo to **My Courses** to start learning! 📚`;
          return `❌ ${res.message || 'Enrollment failed.'}\n\nType **enroll** to try again.`;
        } catch (err) {
          setActiveFlow(null);
          return `❌ ${err?.response?.data?.message || 'Something went wrong.'}`;
        }
      }
    }

    // ── CREATE DOUBT FLOW ──
    if (flow.type === 'create_doubt') {
      if (flow.step === 'title') {
        setActiveFlow({ ...flow, step: 'description', data: { ...flow.data, title: text } });
        return "Now describe your doubt in **detail** 📝:";
      }
      if (flow.step === 'description') {
        try {
          const res = await studentApi.createDoubt({ title: flow.data.title, description: text });
          setActiveFlow(null);
          if (res.success) return "✅ **Doubt submitted!** A mentor will respond soon. 🎓";
          return `❌ ${res.message || 'Failed to submit.'}\n\nType **ask a doubt** to try again.`;
        } catch (err) {
          setActiveFlow(null);
          return `❌ ${err?.response?.data?.message || 'Something went wrong.'}`;
        }
      }
    }

    return null;
  }, [authLogin]);

  // ══════════════════════════════════════════════════════════════
  // INTENT → API ACTION HANDLERS
  // ══════════════════════════════════════════════════════════════
  const handleIntent = useCallback(async (intent, msg) => {
    // ── Cancel ──
    if (intent === 'cancel_flow') {
      if (flowRef.current) {
        setActiveFlow(null);
        setInputType('text');
        return "✅ **Cancelled.** How else can I help? 😊";
      }
      return "There's nothing to cancel! How can I help? 😊";
    }

    // ══ AUTH ACTIONS ══
    if (intent === 'do_login') {
      if (user) return `You're already logged in as **${user.fullName || user.username}** (${user.role})! 😊\n\nType **logout** to switch accounts.`;
      setActiveFlow({ type: 'login', step: 'username', data: {} });
      return "🔐 **Let's log you in!**\n\nPlease enter your **username**:\n\n_Type **cancel** to go back._";
    }
    if (intent === 'do_register') {
      if (user) return `You're already logged in, **${user.fullName || user.username}**! Type **logout** to switch.`;
      setActiveFlow({ type: 'register', step: 'email', data: {} });
      return "📝 **Let's create your account!**\n\nPlease enter your **email address**:\n\n_Type **cancel** to go back._";
    }
    if (intent === 'do_forgot_password') {
      setActiveFlow({ type: 'forgot_password', step: 'email', data: {} });
      return "🔑 **Password Reset**\n\nEnter the **email** linked to your account:\n\n_Type **cancel** to go back._";
    }
    if (intent === 'do_logout') {
      if (!user) return "You're not logged in. Type **login** to sign in! 🔐";
      setTimeout(() => authLogout(), 1500);
      return "👋 **Logged out successfully!** You've been signed out.";
    }

    // ══ STUDENT DATA ACTIONS (require auth) ══
    if (intent === 'do_enroll') {
      if (!user) return "🔒 You need to be **logged in** first. Type **login**!";
      if (user.role !== 'student') return `📚 Only **students** can enroll. You're a **${user.role}**.`;
      try {
        const res = await studentApi.browseCourses();
        const courses = res.courses || res.data || [];
        if (!courses.length) return "📚 No courses available right now, or you're already enrolled in all of them! 🎓";
        const list = courses.slice(0, 10).map((c, i) =>
          `**${i + 1}.** ${c.title} — ${c.category || 'General'} • ${c.difficulty || 'All levels'}`
        ).join('\n');
        setActiveFlow({ type: 'enroll', step: 'select', data: { courses: courses.slice(0, 10) } });
        return `📚 **Available Courses:**\n\n${list}\n\nEnter the **number** to enroll:\n\n_Type **cancel** to go back._`;
      } catch { return "❌ Couldn't fetch courses. Please try again."; }
    }

    if (intent === 'do_my_courses') {
      if (!user) return "🔒 Please **login** first to see your courses.";
      try {
        const res = await studentApi.getCourses();
        const courses = res.courses || res.data || [];
        if (!courses.length) return "📚 You haven't enrolled in any courses yet!\n\nType **enroll** to browse and join courses. 🌱";
        const list = courses.map((c, i) =>
          `**${i + 1}. ${c.title}**\n   ${c.category || 'General'} • Progress: ${c.progress || 0}%`
        ).join('\n\n');
        return `📚 **Your Courses (${courses.length}):**\n\n${list}\n\nKeep learning! 🌟`;
      } catch { return "❌ Couldn't fetch your courses. Please try again."; }
    }

    if (intent === 'do_my_grades') {
      if (!user) return "🔒 Please **login** first to see your grades.";
      try {
        const res = await studentApi.getGrades();
        const grades = res.grades || res.data || [];
        if (!grades.length) return "📊 No graded assignments yet! Submit assignments and check back. 📝";
        let table = '| Assignment | Course | Score |\n|------------|--------|-------|\n';
        grades.slice(0, 10).forEach(g => {
          table += `| ${g.assignmentTitle || g.title || 'N/A'} | ${g.courseTitle || g.course || 'N/A'} | ${g.score ?? '-'}/${g.maxMarks ?? '-'} |\n`;
        });
        return `📊 **Your Grades:**\n\n${table}\nKeep it up! 💪`;
      } catch { return "❌ Couldn't fetch grades. Please try again."; }
    }

    if (intent === 'do_my_assignments') {
      if (!user) return "🔒 Please **login** first.";
      try {
        const res = await studentApi.getAssignments();
        const assignments = res.assignments || res.data || [];
        if (!assignments.length) return "📝 No assignments yet! Check back after enrolling in courses.";
        const list = assignments.slice(0, 10).map((a, i) => {
          const status = a.submittedAt ? '✅ Submitted' : '⏳ Pending';
          return `**${i + 1}. ${a.title}** — ${status}\n   Due: ${a.dueDate ? new Date(a.dueDate).toLocaleDateString() : 'No deadline'}`;
        }).join('\n\n');
        return `📝 **Your Assignments (${assignments.length}):**\n\n${list}`;
      } catch { return "❌ Couldn't fetch assignments. Please try again."; }
    }

    if (intent === 'do_my_progress') {
      if (!user) return "🔒 Please **login** first.";
      try {
        const res = await studentApi.getProgress();
        const p = res.progress || res.data || res;
        let reply = "📈 **Your Progress:**\n\n";
        if (p.coursesEnrolled !== undefined) reply += `- 📚 Courses enrolled: **${p.coursesEnrolled}**\n`;
        if (p.coursesCompleted !== undefined) reply += `- 🎓 Courses completed: **${p.coursesCompleted}**\n`;
        if (p.assignmentsSubmitted !== undefined) reply += `- 📝 Assignments submitted: **${p.assignmentsSubmitted}**\n`;
        if (p.problemsSolved !== undefined) reply += `- 💻 Problems solved: **${p.problemsSolved}**\n`;
        if (p.aptitudeAttempts !== undefined) reply += `- 🧠 Aptitude tests taken: **${p.aptitudeAttempts}**\n`;
        return reply + "\nKeep going! 🌟";
      } catch { return "❌ Couldn't fetch progress. Please try again."; }
    }

    if (intent === 'do_my_doubts') {
      if (!user) return "🔒 Please **login** first.";
      if (/ask\s*(a\s*)?doubt|raise\s*doubt/i.test(msg)) {
        setActiveFlow({ type: 'create_doubt', step: 'title', data: {} });
        return "❓ **Ask a Doubt**\n\nEnter a **title** for your doubt:\n\n_Type **cancel** to go back._";
      }
      try {
        const res = await studentApi.getDoubts();
        const doubts = res.doubts || res.data || [];
        if (!doubts.length) return "❓ No doubts yet!\n\nWant to **ask a doubt**? Just type: **ask a doubt**";
        const list = doubts.slice(0, 8).map((d, i) =>
          `**${i + 1}. ${d.title}** — ${d.status || 'Open'}`
        ).join('\n');
        return `❓ **Your Doubts (${doubts.length}):**\n\n${list}\n\nType **ask a doubt** to create a new one!`;
      } catch { return "❌ Couldn't fetch doubts. Please try again."; }
    }

    if (intent === 'do_browse_courses') {
      try {
        const res = user && user.role === 'student'
          ? await studentApi.browseCourses()
          : await publicApi.getCourses();
        const courses = res.courses || res.data || [];
        if (!courses.length) return "📚 No courses available right now.";
        const list = courses.slice(0, 10).map((c, i) =>
          `**${i + 1}. ${c.title}** — ${c.category || 'General'} • ${c.difficulty || 'All levels'}`
        ).join('\n');
        return `📚 **Available Courses (${courses.length > 10 ? '10/' + courses.length : courses.length}):**\n\n${list}\n\n${user ? "Type **enroll** to join one!" : "Type **login** first, then **enroll**!"}`;
      } catch { return "❌ Couldn't fetch courses. Please try again."; }
    }

    if (intent === 'do_events') {
      if (!user) return "🔒 Please **login** to view events.";
      try {
        const res = await studentApi.getEvents();
        const events = res.events || res.data || [];
        if (!events.length) return "📅 No upcoming events right now. Check back later!";
        const list = events.slice(0, 8).map((e, i) => {
          const date = e.eventDate ? new Date(e.eventDate).toLocaleDateString() : 'TBD';
          return `**${i + 1}. ${e.title}** — ${e.eventType || 'Event'} • ${date}`;
        }).join('\n');
        return `📅 **Events:**\n\n${list}`;
      } catch { return "❌ Couldn't fetch events. Please try again."; }
    }

    if (intent === 'do_study_materials') {
      if (!user) return "🔒 Please **login** to access study materials.";
      try {
        const res = await studentApi.getStudyMaterials();
        const materials = res.materials || res.data || [];
        if (!materials.length) return "📖 No study materials available yet.";
        const list = materials.slice(0, 8).map((m, i) =>
          `**${i + 1}. ${m.title}** — ${m.type || 'Resource'}`
        ).join('\n');
        return `📖 **Study Materials:**\n\n${list}`;
      } catch { return "❌ Couldn't fetch materials. Please try again."; }
    }

    if (intent === 'do_discussions') {
      if (!user) return "🔒 Please **login** to view discussions.";
      try {
        const res = await studentApi.getDiscussions();
        const discussions = res.discussions || res.data || [];
        if (!discussions.length) return "💬 No discussions yet.";
        const list = discussions.slice(0, 8).map((d, i) =>
          `**${i + 1}. ${d.title}** — ${d.category || 'General'}`
        ).join('\n');
        return `💬 **Discussions:**\n\n${list}`;
      } catch { return "❌ Couldn't fetch discussions."; }
    }

    if (intent === 'do_aptitude') {
      if (!user) return "🔒 Please **login** to view aptitude tests.";
      try {
        const res = await studentApi.getAptitudeTests();
        const tests = res.tests || res.data || [];
        if (!tests.length) return "🧠 No aptitude tests available right now.";
        const list = tests.slice(0, 8).map((t, i) =>
          `**${i + 1}. ${t.title}** — ${t.totalQuestions || '?'} questions • ${t.duration || '?'} min`
        ).join('\n');
        return `🧠 **Aptitude Tests:**\n\n${list}\n\nGo to **Aptitude Tests** in sidebar to start one!`;
      } catch { return "❌ Couldn't fetch aptitude tests."; }
    }

    if (intent === 'do_coding') {
      if (!user) return "🔒 Please **login** to view coding problems.";
      try {
        const res = await studentApi.getCodingProblems();
        const problems = res.problems || res.data || [];
        if (!problems.length) return "💻 No coding problems available right now.";
        const list = problems.slice(0, 8).map((p, i) =>
          `**${i + 1}. ${p.title}** — ${p.difficulty || 'Medium'}`
        ).join('\n');
        return `💻 **Coding Problems:**\n\n${list}\n\nGo to **Coding Practice** in sidebar to solve them!`;
      } catch { return "❌ Couldn't fetch coding problems."; }
    }

    if (intent === 'do_dashboard') {
      if (!user) return "🔒 Please **login** to see your dashboard.";
      try {
        const api = user.role === 'admin' ? adminApi : user.role === 'mentor' ? mentorApi : studentApi;
        const res = await api.getDashboard();
        let reply = `📊 **${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard:**\n\n`;
        const data = res.dashboard || res.data || res;
        for (const [key, val] of Object.entries(data)) {
          if (['success', 'message'].includes(key)) continue;
          if (typeof val === 'number' || typeof val === 'string') {
            const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
            reply += `- **${label}:** ${val}\n`;
          }
        }
        return reply || "📊 Dashboard loaded! Check the sidebar for details.";
      } catch { return "❌ Couldn't load dashboard."; }
    }

    if (intent === 'do_profile') {
      if (!user) return "🔒 Please **login** to view your profile.";
      try {
        const res = await authApi.getMe();
        const u = res.user || res.data || res;
        let reply = "👤 **Your Profile:**\n\n";
        if (u.fullName) reply += `- **Name:** ${u.fullName}\n`;
        if (u.email) reply += `- **Email:** ${u.email}\n`;
        if (u.username) reply += `- **Username:** ${u.username}\n`;
        if (u.role) reply += `- **Role:** ${u.role}\n`;
        if (u.college) reply += `- **College:** ${u.college}\n`;
        if (u.department) reply += `- **Department:** ${u.department}\n`;
        if (u.year) reply += `- **Year:** ${u.year}\n`;
        return reply;
      } catch { return "❌ Couldn't fetch profile."; }
    }

    if (intent === 'platform_stats') {
      if (!user) return "🔒 Please **login** to see platform stats.";
      try {
        const api = user.role === 'admin' ? adminApi : studentApi;
        const res = await api.getDashboard();
        const data = res.dashboard || res.data || res;
        let table = '| Metric | Count |\n|--------|-------|\n';
        for (const [key, val] of Object.entries(data)) {
          if (['success', 'message'].includes(key) || typeof val !== 'number') continue;
          const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
          table += `| ${label} | **${val}** |\n`;
        }
        return `📊 **Platform Stats:**\n\n${table}\n*Live data from the platform!* 🌱`;
      } catch { return "❌ Couldn't fetch stats."; }
    }

    // ── STATIC RESPONSES (no API call) ──
    const handler = staticResponses[intent];
    if (handler) return typeof handler === 'function' ? handler(msg) : handler;

    // ── GENERAL FALLBACK ──
    return pick([
      "I can help with:\n\n- 🔐 **login** / **register** / **logout**\n- 📚 **enroll** / **my courses** / **browse courses**\n- 📊 **my grades** / **my progress** / **my assignments**\n- ❓ **my doubts** / **ask a doubt**\n- 📅 **events** / **study materials** / **discussions**\n- 💻 **coding problems** / **aptitude tests**\n- 🧠 Programming concepts, study tips, interview prep\n\nJust ask! 😊",
      "Not sure I understood that. Try:\n- **login** or **register** for account actions\n- **my courses** or **enroll** for courses\n- **my grades** or **my progress** for tracking\n- Or ask me about programming, study tips, etc! 💡",
    ]);
  }, [user, authLogin, authLogout]);

  // ══════════════════════════════════════════════════════════════
  // SEND MESSAGE
  // ══════════════════════════════════════════════════════════════
  const sendMessage = useCallback(async (text) => {
    const msgText = text || input.trim();
    if (!msgText || isLoading) return;

    const displayContent = inputType === 'password' ? '••••••••' : msgText;
    setInput('');
    setIsLoading(true);

    const userMsg = { role: 'user', content: displayContent, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);

    try {
      let reply;

      // Check if there's an active flow
      if (flowRef.current) {
        if (/^(cancel|exit|stop|quit|nevermind|go\s*back|abort)$/i.test(msgText)) {
          setActiveFlow(null);
          setInputType('text');
          reply = "✅ **Cancelled.** How else can I help? 😊";
        } else {
          reply = await handleFlowInput(msgText);
        }
      }

      // If no flow reply, detect intent
      if (!reply) {
        const intent = detectIntent(msgText);
        reply = await handleIntent(intent, msgText);
      }

      addAiMessage(reply);
      if (!isOpen) setHasUnread(true);
    } catch {
      addAiMessage("Oops! Something went wrong. Please try again! 🔄");
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, isOpen, inputType, handleFlowInput, handleIntent, addAiMessage]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const clearChat = () => {
    setMessages([]);
    setActiveFlow(null);
    setInputType('text');
    localStorage.removeItem('junniya_session');
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setHasUnread(false);
  };

  // ══════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════
  return (
    <>
      <div className={`junniya-panel ${isOpen ? 'junniya-panel-open' : ''}`}>
        {/* Header */}
        <div className="junniya-header">
          <div className="junniya-header-left">
            <div className="junniya-header-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L13.09 8.26L18 6L15.74 10.91L22 12L15.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L8.26 13.09L2 12L8.26 10.91L6 6L10.91 8.26L12 2Z" fill="currentColor"/>
              </svg>
            </div>
            <div>
              <h3 className="junniya-header-title">Junniya</h3>
              <span className="junniya-header-sub">
                {user ? `${user.fullName || user.username} • ${user.role}` : 'Sowberry AI Assistant'}
              </span>
            </div>
          </div>
          <div className="junniya-header-actions">
            <button onClick={clearChat} className="junniya-header-btn" title="New Chat">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </button>
            <button onClick={toggleChat} className="junniya-header-btn" title="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18"/><path d="M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="junniya-body" ref={chatBodyRef}>
          {messages.length === 0 ? (
            <div className="junniya-welcome">
              <div className="junniya-welcome-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L13.09 8.26L18 6L15.74 10.91L22 12L15.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L8.26 13.09L2 12L8.26 10.91L6 6L10.91 8.26L12 2Z" fill="currentColor"/>
                </svg>
              </div>
              <h3 className="junniya-welcome-title">Hi, I'm Junniya! 🌱</h3>
              <p className="junniya-welcome-text">
                {user
                  ? `Welcome back, ${user.fullName || user.username}! I can show your courses, grades, progress & more.`
                  : 'I can log you in, register you, enroll in courses, show grades & more — all right here!'}
              </p>
              <div className="junniya-suggestions">
                {(user ? loggedInSuggestions : defaultSuggestions).map((s, i) => (
                  <button key={i} className="junniya-suggestion-chip" onClick={() => sendMessage(s.text)}>
                    <span className="junniya-suggestion-icon">{s.icon}</span>
                    <span>{s.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <ChatMessage key={i} message={msg} isStreaming={i === streamingIdx} onStreamDone={() => setStreamingIdx(-1)} />
              ))}
              {isLoading && (
                <div className="junniya-message junniya-message-ai">
                  <div className="junniya-avatar">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L13.09 8.26L18 6L15.74 10.91L22 12L15.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L8.26 13.09L2 12L8.26 10.91L6 6L10.91 8.26L12 2Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className="junniya-bubble junniya-bubble-ai"><TypingIndicator /></div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="junniya-footer">
          <div className="junniya-input-wrap">
            {inputType === 'password' ? (
              <input ref={inputRef} type="password" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Enter password..." className="junniya-input junniya-input-password" disabled={isLoading} autoComplete="off" />
            ) : (
              <textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Message Junniya..." className="junniya-input" rows={1} disabled={isLoading} />
            )}
            <button onClick={() => sendMessage()} disabled={!input.trim() || isLoading} className="junniya-send-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
          <p className="junniya-disclaimer">Junniya can make mistakes. Verify important info.</p>
        </div>
      </div>

      {/* FAB */}
      <button className={`junniya-fab ${isOpen ? 'junniya-fab-hidden' : ''}`} onClick={toggleChat} title="Chat with Junniya">
        {hasUnread && <span className="junniya-fab-badge"></span>}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L13.09 8.26L18 6L15.74 10.91L22 12L15.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L8.26 13.09L2 12L8.26 10.91L6 6L10.91 8.26L12 2Z" fill="currentColor"/>
        </svg>
      </button>
    </>
  );
};

export default JunniyaChat;
