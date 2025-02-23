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
