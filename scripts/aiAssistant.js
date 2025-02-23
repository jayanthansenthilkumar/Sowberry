class CodeAssistantAI {
    constructor() {
        this.chatPanel = document.getElementById('aiChatPanel');
        this.chatIcon = document.getElementById('aiChatIcon');
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.sendButton = document.getElementById('sendMessage');
        
        // Fix toggle functionality
        this.isOpen = false;
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.setupEventListeners();
        this.addWelcomeMessage();
    }

    setupEventListeners() {
        // Enhanced toggle with stopPropagation
        this.chatIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleChat();
        });
        
        this.chatPanel.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Improved click outside handling
        document.addEventListener('click', this.handleClickOutside);

        // Send message on button click or Enter key
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    handleClickOutside(e) {
        if (this.isOpen && 
            !this.chatPanel.contains(e.target) && 
            !this.chatIcon.contains(e.target)) {
            this.closeChat();
        }
    }

    addWelcomeMessage() {
        const welcomeMessage = `
            <div class="message ai-message">
                <div class="message-content">
                    <p>👋 Hi! I'm your coding assistant. I can help you with:</p>
                    <ul>
                        <li>Code explanations</li>
                        <li>Debugging assistance</li>
                        <li>Best practices</li>
                        <li>Code optimization</li>
                    </ul>
                    <p>How can I help you today?</p>
                </div>
            </div>
        `;
        this.chatMessages.innerHTML = welcomeMessage;
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
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${content}</p>
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
