import express from 'express';

const router = express.Router();

// ──────────────── JUNNIYA AI CHAT ────────────────
// Sowberry's AI Assistant powered by Google Gemini API
// Falls back to intelligent built-in responses when no API key is configured

const SYSTEM_PROMPT = `You are Junniya, the official AI assistant of Sowberry Academy — an innovative online learning platform for students, mentors, and administrators.

Your personality:
- Warm, helpful, and encouraging
- Professional yet friendly — like a knowledgeable senior student helping out
- You use clear, concise language
- You love helping people learn and grow

Your knowledge about Sowberry Academy:
- Sowberry is an academy platform with Students, Mentors, and Admin roles
- Students can: enroll in courses, complete assignments, take aptitude tests, practice coding, play learning games, track progress, view grades, ask doubts, study materials, and earn certificates
- Mentors can: create courses with subjects/topics/content, create assignments, manage problems for coding practice, create aptitude tests, manage events, moderate discussions, respond to student doubts, track student progress
- Admins can: manage all users (students & mentors), oversee courses, view analytics/reports, manage system settings, handle contact messages, approve profile update requests, manage all content (problem solving, aptitude, events, discussions)
- The platform supports dark/light themes
- Features include: Dashboard, My Courses, Assignments, Doubts, Grades, Progress tracking, Coding Practice with Code Editor, Aptitude Tests, Study Materials, Learning Games, Events, Discussions, Certificates, and Profile management

Your capabilities:
- Answer questions about the Sowberry platform and its features
- Help students with study tips, learning strategies, and general academic guidance
- Explain programming concepts, algorithms, data structures
- Help with math, science, and general knowledge
- Provide motivation and encouragement
- Guide users on how to use platform features
- Help with aptitude test preparation tips
- Assist with coding problem approaches (without giving direct solutions)

Rules:
- Always introduce yourself as Junniya when asked who you are
- Never pretend to be a human
- If you don't know something specific about a user's account, suggest they check the relevant section of the platform
- Keep responses concise but thorough
- Use markdown formatting for better readability (bold, lists, code blocks, etc.)
- Be encouraging and positive
- For coding questions, guide the thought process rather than giving full solutions directly
- You were created by the Sowberry development team`;

// Conversation history storage (in-memory, per session)
const conversations = new Map();

// Clean up old conversations every 30 minutes
setInterval(() => {
  const thirtyMinutesAgo = Date.now() - 30 * 60 * 1000;
  for (const [key, conv] of conversations) {
    if (conv.lastAccess < thirtyMinutesAgo) {
      conversations.delete(key);
    }
  }
}, 30 * 60 * 1000);

// ──────────────── GEMINI API INTEGRATION ────────────────
async function callGeminiAPI(messages, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  
  // Build Gemini-compatible message format
  const contents = [];
  
  // Add conversation history
  for (const msg of messages) {
    contents.push({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    });
  }

  const body = {
    contents,
    systemInstruction: {
      parts: [{ text: SYSTEM_PROMPT }]
    },
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 2048,
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ]
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  
  if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
    return data.candidates[0].content.parts[0].text;
  }
  
  throw new Error('No response from Gemini API');
}

// ──────────────── INTELLIGENT FALLBACK ────────────────
function getIntelligentResponse(message) {
  const msg = message.toLowerCase().trim();
  
  // Greetings
  if (/^(hi|hello|hey|good morning|good afternoon|good evening|howdy|greetings|yo|sup)/i.test(msg)) {
    const greetings = [
      "Hello! 👋 I'm **Junniya**, your Sowberry Academy AI assistant. How can I help you today?",
      "Hey there! 🌟 I'm **Junniya** from Sowberry Academy. What would you like to know or learn about?",
      "Hi! 😊 Welcome to Sowberry Academy! I'm **Junniya**, ready to assist you. What's on your mind?",
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  // Who are you
  if (/who are you|what are you|your name|introduce yourself|about you/i.test(msg)) {
    return "I'm **Junniya** 🌱 — the AI assistant built into Sowberry Academy! I'm here to help you navigate the platform, answer your learning questions, provide study tips, explain programming concepts, and guide you through your academic journey. Think of me as your always-available study companion! 😊";
  }

  // Platform features
  if (/how (to|do i)|where (can|do)|what (can|is)|feature|platform|sowberry/i.test(msg)) {
    if (/course|enroll|learn/i.test(msg)) {
      return "📚 **Courses on Sowberry:**\n\n- Go to **My Courses** to see your enrolled courses\n- Browse available courses and click **Enroll** to join\n- Each course has **subjects**, **topics**, and **content** organized in units\n- Track your progress as you complete topics\n- Earn **certificates** when you complete a course!\n\nNeed help with anything specific about courses?";
    }
    if (/assignment/i.test(msg)) {
      return "📝 **Assignments:**\n\n- View all your assignments in **My Assignments**\n- Each assignment has a deadline and instructions\n- Submit your work before the due date\n- Your mentor will grade your submission\n- Check grades in the **My Grades** section\n\nAnything else about assignments?";
    }
    if (/code|coding|programming|editor/i.test(msg)) {
      return "💻 **Coding Practice:**\n\n- Head to **Coding Practice** for problem solving\n- Use the **Code Editor** to write and test code\n- Problems range from easy to hard difficulty\n- Supports multiple programming languages\n- Practice regularly to improve your skills!\n\nWant coding tips or help with a concept?";
    }
    if (/aptitude|test|quiz/i.test(msg)) {
      return "🧠 **Aptitude Tests:**\n\n- Go to **Aptitude Tests** to see available tests\n- Each test has a time limit — manage your time wisely\n- Questions cover logical reasoning, quantitative aptitude & more\n- View detailed results after submission\n- Practice regularly for improvement!\n\n**Tips:** Read questions carefully, eliminate wrong options first, and manage your time!";
    }
    if (/game|learning game/i.test(msg)) {
      return "🎮 **Learning Games:**\n\n- Visit **Learning Games** for fun, educational challenges\n- Games help reinforce concepts through interactive play\n- Complete challenges to unlock new levels\n- A great way to learn while having fun!\n\nLearning should be enjoyable! 🌟";
    }
    if (/doubt|question|ask/i.test(msg)) {
      return "❓ **Doubts System:**\n\n- Go to **My Doubts** to ask questions\n- Create a new doubt with a clear title and description\n- Your mentors will respond to help you\n- You can also reply back for follow-up questions\n- Doubts get marked as resolved once answered\n\nDon't hesitate to ask questions — that's how you learn! 📖";
    }
    if (/grade|mark|score/i.test(msg)) {
      return "📊 **Grades & Progress:**\n\n- View grades in **My Grades** section\n- Track overall progress in **My Progress**\n- See assignment scores, test results, and course completion\n- Certificates are awarded for completed courses!\n\nKeep up the great work! 💪";
    }
    if (/profile|account|setting/i.test(msg)) {
      return "👤 **Profile Management:**\n\n- Click your avatar in the top-right to access **Profile**\n- Update your personal information\n- Profile changes may need admin approval\n- Switch between dark/light themes using the theme toggle\n\nKeep your profile up to date! 📋";
    }
    // General platform
    return "🌱 **Sowberry Academy Features:**\n\n- 📚 **Courses** — Enroll, learn, track progress, earn certificates\n- 📝 **Assignments** — Complete and get graded\n- 💻 **Coding Practice** — Solve problems with our code editor\n- 🧠 **Aptitude Tests** — Test your logical & quantitative skills\n- 📖 **Study Materials** — Access learning resources\n- 🎮 **Learning Games** — Fun educational challenges\n- ❓ **Doubts** — Ask questions to mentors\n- 📊 **Grades & Progress** — Track your performance\n\nWhat would you like to explore?";
  }

  // Study tips
  if (/study tip|how to study|learn better|study strateg|productivity|focus/i.test(msg)) {
    return "📖 **Study Tips from Junniya:**\n\n1. **Pomodoro Technique** — Study for 25 min, break for 5 min\n2. **Active Recall** — Test yourself instead of re-reading\n3. **Spaced Repetition** — Review material at increasing intervals\n4. **Teach Others** — Explaining concepts deepens understanding\n5. **Break Big Tasks** — Divide large topics into small chunks\n6. **Stay Hydrated** — Your brain needs water to function well!\n7. **Get Enough Sleep** — Memory consolidation happens during sleep\n8. **Practice Daily** — Consistency beats cramming every time\n\nRemember: **Progress, not perfection!** 🌟";
  }

  // Programming concepts
  if (/what is (a |an )?(array|string|variable|function|loop|class|object|algorithm|data structure|recursion|pointer|stack|queue|tree|graph|linked list|hash|sort|search)/i.test(msg)) {
    const concepts = {
      'array': "📦 **Array** — A collection of elements stored in contiguous memory locations, accessed by index. Think of it like numbered boxes in a row!\n\n```\nint arr[] = {1, 2, 3, 4, 5};\n// arr[0] = 1, arr[2] = 3\n```\n\n**Key:** Fixed size, O(1) access by index, O(n) insert/delete.",
      'string': "📝 **String** — A sequence of characters. In most languages, strings are either arrays of characters or immutable objects.\n\n```python\nname = \"Sowberry\"\nprint(name[0])  # 'S'\n```\n\n**Key:** Immutable in many languages, substring operations, concatenation.",
      'function': "⚙️ **Function** — A reusable block of code that performs a specific task. Functions take inputs (parameters) and can return outputs.\n\n```python\ndef greet(name):\n    return f\"Hello, {name}!\"\n```\n\n**Key:** Code reuse, modularity, abstraction!",
      'loop': "🔄 **Loop** — A control structure that repeats code until a condition is met.\n\n**Types:** `for`, `while`, `do-while`\n\n```python\nfor i in range(5):\n    print(i)  # 0,1,2,3,4\n```\n\n**Watch out for:** Infinite loops! Always ensure your condition will eventually be false.",
      'recursion': "🌀 **Recursion** — When a function calls itself to solve smaller subproblems.\n\n```python\ndef factorial(n):\n    if n <= 1: return 1  # base case\n    return n * factorial(n-1)\n```\n\n**Key:** Always have a **base case** to stop recursion! Think: divide the problem into smaller identical problems.",
      'class': "🏗️ **Class** — A blueprint for creating objects. It defines properties (data) and methods (behavior).\n\n```python\nclass Student:\n    def __init__(self, name):\n        self.name = name\n    def greet(self):\n        return f\"Hi, I'm {self.name}\"\n```\n\n**Key:** Encapsulation, inheritance, polymorphism!",
      'stack': "📚 **Stack** — LIFO (Last In, First Out) data structure. Think of a stack of plates!\n\n**Operations:** push (add top), pop (remove top), peek (view top)\n\n**Uses:** Function call stack, undo operations, expression evaluation",
      'queue': "🚶 **Queue** — FIFO (First In, First Out) data structure. Like a line at a store!\n\n**Operations:** enqueue (add back), dequeue (remove front)\n\n**Uses:** BFS, task scheduling, print queue",
    };
    
    for (const [key, response] of Object.entries(concepts)) {
      if (msg.includes(key)) return response;
    }
  }

  // Motivation
  if (/motivat|inspire|discouraged|can't do|give up|frustrated|stressed|anxious|nervous|fail/i.test(msg)) {
    const motivations = [
      "💪 **You've got this!** Every expert was once a beginner. The fact that you're here, learning, already puts you ahead. Take it one step at a time, and remember — progress isn't always linear, but every effort counts!\n\n*\"The only way to do great work is to love what you do.\"* — Steve Jobs",
      "🌟 **Don't give up!** Struggling with something means you're growing. It's completely normal to feel frustrated — that's your brain building new neural pathways! Take a break, come back fresh, and tackle it again.\n\n*\"It does not matter how slowly you go, as long as you don't stop.\"* — Confucius",
      "🔥 **Believe in yourself!** Every challenge you face is making you stronger. You wouldn't be here if you weren't capable. Break the problem down, ask for help when needed, and keep moving forward!\n\n*\"Success is not final, failure is not fatal: it is the courage to continue that counts.\"* — Winston Churchill"
    ];
    return motivations[Math.floor(Math.random() * motivations.length)];
  }

  // Thank you
  if (/thank|thanks|thx|appreciate/i.test(msg)) {
    return "You're welcome! 😊 I'm always here to help. Don't hesitate to ask anything else — that's what I'm here for! Happy learning! 🌱";
  }

  // Bye
  if (/^(bye|goodbye|see you|cya|good night|gn|take care)/i.test(msg)) {
    return "Goodbye! 👋 Have a wonderful time! Remember, I'm here whenever you need help. Keep learning, keep growing! 🌱✨";
  }

  // Default response
  const defaults = [
    "That's an interesting question! 🤔 While I'd love to give you the most accurate answer, let me share what I can help with:\n\n- 📚 Platform navigation & features\n- 💻 Programming concepts & coding help\n- 🧠 Study tips & learning strategies\n- 📊 Academic guidance\n- 🌟 Motivation & encouragement\n\nCould you rephrase your question, or let me know which area you'd like help with?",
    "Great question! 💡 I'm here to help with Sowberry Academy features, programming concepts, study tips, and general academic guidance. Could you tell me more about what you're looking for? I'll do my best to assist you!",
    "I appreciate you reaching out! 😊 I can help with:\n\n- Questions about the Sowberry platform\n- Programming & CS concepts\n- Study techniques & tips\n- General academic queries\n\nFeel free to ask me anything in these areas!"
  ];
  return defaults[Math.floor(Math.random() * defaults.length)];
}

// ──────────────── CHAT ENDPOINT ────────────────
router.post('/message', async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required.' });
    }

    const sid = sessionId || `session_${Date.now()}`;
    
    // Get or create conversation
    if (!conversations.has(sid)) {
      conversations.set(sid, { messages: [], lastAccess: Date.now() });
    }
    const conv = conversations.get(sid);
    conv.lastAccess = Date.now();

    // Add user message
    conv.messages.push({ role: 'user', content: message.trim() });

    // Keep only last 20 messages for context
    if (conv.messages.length > 20) {
      conv.messages = conv.messages.slice(-20);
    }

    let reply;
    const geminiKey = process.env.GEMINI_API_KEY;

    if (geminiKey) {
      try {
        reply = await callGeminiAPI(conv.messages, geminiKey);
      } catch (err) {
        console.error('Gemini API failed, using fallback:', err.message);
        reply = getIntelligentResponse(message.trim());
      }
    } else {
      reply = getIntelligentResponse(message.trim());
    }

    // Add assistant reply to history
    conv.messages.push({ role: 'assistant', content: reply });

    res.json({
      success: true,
      reply,
      sessionId: sid
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
      reply: "I'm having a moment! 😅 Please try again in a bit."
    });
  }
});

// Clear conversation
router.delete('/clear/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  conversations.delete(sessionId);
  res.json({ success: true, message: 'Conversation cleared.' });
});

export default router;
