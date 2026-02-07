// Theme toggle
const themeToggle = document.querySelector('.theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const icon = themeToggle.querySelector('i');
    icon.classList.toggle('ri-sun-line');
    icon.classList.toggle('ri-moon-line');
    
    // Update charts color scheme based on theme
    updateChartsTheme(document.body.classList.contains('dark-theme'));
});

const lightThemeColors = {
    primary: '#7c3aed',
    secondary: '#8b5cf6',
    tertiary: '#06b6d4',
    grid: '#e2e8f0'
};

const darkThemeColors = {
    primary: '#a78bfa',
    secondary: '#8b5cf6',
    tertiary: '#22d3ee',
    grid: '#1e293b'
};

// Initialize after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // AI Chat Panel Toggle
    const aiChatIcon = document.getElementById('aiChatIcon');
    const aiChatPanel = document.getElementById('aiChatPanel');

    aiChatIcon.addEventListener('click', () => {
        aiChatPanel.classList.toggle('active');
    });

    // Close chat panel when clicking outside
    document.addEventListener('click', (e) => {
        if (!aiChatPanel.contains(e.target) && !aiChatIcon.contains(e.target)) {
            aiChatPanel.classList.remove('active');
        }
    });
});

class CodeAssistantAI {
    constructor() {
        this.chatPanel = document.getElementById('aiChatPanel');
        this.chatIcon = document.getElementById('aiChatIcon');
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.sendButton = document.getElementById('sendMessage');
        
        this.isOpen = false;
        
        // Initialize only once
        this.initialize();
    }

    initialize() {
        // Basic click handler for the icon
        this.chatIcon.addEventListener('click', () => {
            this.toggleChat();
        });

        // Chat input handlers
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // Handle clicks outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && 
                !this.chatPanel.contains(e.target) && 
                !this.chatIcon.contains(e.target)) {
                this.closeChat();
            }
        });

        this.addWelcomeMessage();
    }

    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        this.chatPanel.classList.add('active');
        this.isOpen = true;
        this.chatInput.focus();
    }

    closeChat() {
        this.chatPanel.classList.remove('active');
        this.isOpen = false;
    }

    addWelcomeMessage() {
        const welcomeMessage = `
            <div class="message ai-message">
                <div class="message-content">
                    <p>🌟💻 Hello! I’m Sowmiya ✨,</p><p>your coding partner 🤝. Let’s turn those bugs into features 🏆!</p>
                </div>
            </div>
        `;
        this.chatMessages.innerHTML = welcomeMessage;
    }

    sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        // Add user message
        this.addMessage('user', message);
        this.chatInput.value = '';

        // Simulate AI response (replace with actual AI integration)
        this.simulateTyping();
    }

    addMessage(type, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const avatar = type === 'user' 
            ? `<img src="https://ui-avatars.com/api/?name=Sowmiya&background=random" alt="User">`
            : `<i class="ri-robot-line"></i>`;

        messageDiv.innerHTML = `
            <div class="message-avatar">
                ${avatar}
            </div>
            <div class="message-bubble">
                <div class="message-content">
                    <p>${content}</p>
                </div>
                <div class="message-time">${time}</div>
            </div>
        `;
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    simulateTyping() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message ai-message typing';
        loadingDiv.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
        this.chatMessages.appendChild(loadingDiv);
        this.scrollToBottom();

        // Simulate AI thinking time
        setTimeout(() => {
            this.chatMessages.removeChild(loadingDiv);
            this.addMessage('ai', this.getAIResponse());
        }, 1500);
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    getAIResponse() {
        // Replace with actual AI integration
        const responses = [
            "I'd be happy to help you with that! Could you provide more details?",
            "Here's a suggestion for your code...",
            "Let me explain how this works...",
            "That's a great question! Here's what you need to know..."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
}

// Single initialization point
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        window.aiAssistant = new CodeAssistantAI();
    });
}

// Material Filtering
document.addEventListener('DOMContentLoaded', function() {
    const filterPills = document.querySelectorAll('.filter-pill');
    const materials = document.querySelectorAll('.content-card');

    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            // Remove active class from all pills
            filterPills.forEach(p => p.classList.remove('active'));
            // Add active class to clicked pill
            pill.classList.add('active');

            const filterValue = pill.getAttribute('data-filter');

            materials.forEach(material => {
                if (filterValue === 'all' || material.getAttribute('data-type') === filterValue) {
                    material.style.display = 'block';
                    // Add animation
                    material.style.opacity = '0';
                    material.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        material.style.opacity = '1';
                        material.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    material.style.display = 'none';
                }
            });
        });
    });
});

// Tab Navigation
document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.nav-tab');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab + 'Section').classList.add('active');
        });
    });

    // Practice Mode Functionality
    const practiceButtons = document.querySelectorAll('.practice-btn');
    const practiceInterface = document.querySelector('.practice-interface');
    const mainContent = document.querySelector('#practiceSection');
    const exitPractice = document.querySelector('.exit-btn');

    practiceButtons.forEach(button => {
        button.addEventListener('click', () => {
            mainContent.style.display = 'none';
            practiceInterface.style.display = 'block';
            startPracticeSession(button.closest('.topic-item').querySelector('span').textContent);
        });
    });

    exitPractice?.addEventListener('click', () => {
        mainContent.style.display = 'block';
        practiceInterface.style.display = 'none';
        stopPracticeSession();
    });

    // Timer Functionality
    let timerInterval;
    function startTimer(duration) {
        let timer = duration;
        const timerDisplay = document.querySelector('.timer');
        
        timerInterval = setInterval(() => {
            const minutes = Math.floor(timer / 60);
            const seconds = timer % 60;
            
            timerDisplay.textContent = `Time Left: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            
            if (--timer < 0) {
                clearInterval(timerInterval);
                endPracticeSession();
            }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    // Practice Session Management
    function startPracticeSession(topic) {
        // Reset interface
        document.querySelector('.question-info h3').textContent = 'Question 1 of 20';
        startTimer(1800); // 30 minutes
        loadQuestion(1);
    }

    function stopPracticeSession() {
        stopTimer();
    }

    function endPracticeSession() {
        stopTimer();
        showPracticeSummary();
    }

    // Question Navigation
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const submitBtn = document.querySelector('.submit-btn');

    let currentQuestion = 1;
    const totalQuestions = 20;

    prevBtn?.addEventListener('click', () => {
        if (currentQuestion > 1) {
            currentQuestion--;
            loadQuestion(currentQuestion);
        }
    });

    nextBtn?.addEventListener('click', () => {
        if (currentQuestion < totalQuestions) {
            currentQuestion++;
            loadQuestion(currentQuestion);
        }
    });

    submitBtn?.addEventListener('click', () => {
        endPracticeSession();
    });

    function loadQuestion(questionNumber) {
        document.querySelector('.question-info h3').textContent = `Question ${questionNumber} of ${totalQuestions}`;
        // Here you would load the actual question content
        const questionContent = document.querySelector('.question-content');
        const answerOptions = document.querySelector('.answer-options');
        
        // Example question template
        questionContent.innerHTML = `
            <h4>Question ${questionNumber}</h4>
            <p>This is a sample question for the practice session.</p>
        `;

        answerOptions.innerHTML = `
            <div class="option-item">
                <input type="radio" name="answer" id="option1">
                <label for="option1">Option 1</label>
            </div>
            <div class="option-item">
                <input type="radio" name="answer" id="option2">
                <label for="option2">Option 2</label>
            </div>
            <div class="option-item">
                <input type="radio" name="answer" id="option3">
                <label for="option3">Option 3</label>
            </div>
            <div class="option-item">
                <input type="radio" name="answer" id="option4">
                <label for="option4">Option 4</label>
            </div>
        `;

        updateNavigation();
    }

    function updateNavigation() {
        prevBtn.disabled = currentQuestion === 1;
        nextBtn.disabled = currentQuestion === totalQuestions;
        document.querySelector('.question-nav').innerHTML = Array(totalQuestions)
            .fill(0)
            .map((_, i) => `
                <span class="nav-dot ${i + 1 === currentQuestion ? 'active' : ''}"></span>
            `)
            .join('');
    }
});

// View All Topics Functionality
document.addEventListener('DOMContentLoaded', function() {
    const viewAllButtons = document.querySelectorAll('.view-all-btn');
    
    viewAllButtons.forEach(button => {
        button.addEventListener('click', function() {
            const topicList = this.closest('.topic-list');
            topicList.classList.toggle('expanded');
            
            // Update button text
            if (topicList.classList.contains('expanded')) {
                this.innerHTML = 'Show Less <i class="ri-arrow-up-s-line"></i>';
            } else {
                this.innerHTML = 'View All Topics <i class="ri-arrow-down-s-line"></i>';
            }
        });
    });
});
