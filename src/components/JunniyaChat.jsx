import { useState, useEffect, useRef, useCallback } from 'react';
import { chatApi } from '../utils/api';
import './JunniyaChat.css';

// ──────────────── SIMPLE MARKDOWN RENDERER ────────────────
const renderMarkdown = (text) => {
  if (!text) return '';
  let html = text
    // Code blocks
    .replace(/```(\w*)\n?([\s\S]*?)```/g, '<pre class="junniya-code-block"><code>$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="junniya-inline-code">$1</code>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Headers
    .replace(/^### (.+)$/gm, '<h4 class="junniya-h4">$1</h4>')
    .replace(/^## (.+)$/gm, '<h3 class="junniya-h3">$1</h3>')
    .replace(/^# (.+)$/gm, '<h2 class="junniya-h2">$1</h2>')
    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>');
  
  return `<p>${html}</p>`;
};

// ──────────────── TYPING INDICATOR ────────────────
const TypingIndicator = () => (
  <div className="junniya-typing">
    <div className="junniya-typing-dot"></div>
    <div className="junniya-typing-dot"></div>
    <div className="junniya-typing-dot"></div>
  </div>
);

// ──────────────── SINGLE MESSAGE ────────────────
const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';
  
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
        {isUser ? (
          <p>{message.content}</p>
        ) : (
          <div 
            className="junniya-markdown"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
          />
        )}
      </div>
    </div>
  );
};

// ──────────────── SUGGESTED PROMPTS ────────────────
const suggestions = [
  { icon: '�', text: 'Show me platform stats' },
  { icon: '📚', text: 'How do I enroll in courses?' },
  { icon: '💻', text: 'Explain arrays with code' },
  { icon: '🧠', text: 'Give me study tips' },
];

// ──────────────── MAIN COMPONENT ────────────────
const JunniyaChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [hasUnread, setHasUnread] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatBodyRef = useRef(null);

  // Initialize session
  useEffect(() => {
    const stored = localStorage.getItem('junniya_session');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setSessionId(data.sessionId);
        setMessages(data.messages || []);
      } catch {
        const newId = `junniya_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        setSessionId(newId);
      }
    } else {
      const newId = `junniya_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      setSessionId(newId);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (sessionId) {
      localStorage.setItem('junniya_session', JSON.stringify({ sessionId, messages }));
    }
  }, [messages, sessionId]);

  // Auto scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = useCallback(async (text) => {
    const msgText = text || input.trim();
    if (!msgText || isLoading) return;

    setInput('');
    setIsLoading(true);

    const userMsg = { role: 'user', content: msgText, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);

    try {
      const res = await chatApi.sendMessage({ message: msgText, sessionId });
      
      if (res.success) {
        if (res.sessionId) setSessionId(res.sessionId);
        const aiMsg = { role: 'assistant', content: res.reply, timestamp: Date.now() };
        setMessages(prev => [...prev, aiMsg]);
        if (!isOpen) setHasUnread(true);
      } else {
        const errorMsg = { role: 'assistant', content: res.reply || "Sorry, I couldn't process that. Please try again! 😊", timestamp: Date.now() };
        setMessages(prev => [...prev, errorMsg]);
      }
    } catch {
      const errorMsg = { role: 'assistant', content: "Oops! I'm having trouble connecting right now. Please check your connection and try again! 🔄", timestamp: Date.now() };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, sessionId, isOpen]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = async () => {
    if (sessionId) {
      try { await chatApi.clearChat(sessionId); } catch {}
    }
    const newId = `junniya_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    setSessionId(newId);
    setMessages([]);
    localStorage.removeItem('junniya_session');
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setHasUnread(false);
  };

  return (
    <>
      {/* ─── Chat Panel ─── */}
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
              <span className="junniya-header-sub">Sowberry AI Assistant</span>
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
              <p className="junniya-welcome-text">Your Sowberry Academy AI assistant. Ask me anything about courses, coding, study tips, or the platform!</p>
              <div className="junniya-suggestions">
                {suggestions.map((s, i) => (
                  <button 
                    key={i} 
                    className="junniya-suggestion-chip"
                    onClick={() => sendMessage(s.text)}
                  >
                    <span className="junniya-suggestion-icon">{s.icon}</span>
                    <span>{s.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <ChatMessage key={i} message={msg} />
              ))}
              {isLoading && (
                <div className="junniya-message junniya-message-ai">
                  <div className="junniya-avatar">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L13.09 8.26L18 6L15.74 10.91L22 12L15.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L8.26 13.09L2 12L8.26 10.91L6 6L10.91 8.26L12 2Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className="junniya-bubble junniya-bubble-ai">
                    <TypingIndicator />
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="junniya-footer">
          <div className="junniya-input-wrap">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Junniya..."
              className="junniya-input"
              rows={1}
              disabled={isLoading}
            />
            <button 
              onClick={() => sendMessage()} 
              disabled={!input.trim() || isLoading}
              className="junniya-send-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
          <p className="junniya-disclaimer">Junniya can make mistakes. Verify important info.</p>
        </div>
      </div>

      {/* ─── Floating Trigger Button ─── */}
      <button 
        className={`junniya-fab ${isOpen ? 'junniya-fab-hidden' : ''}`}
        onClick={toggleChat}
        title="Chat with Junniya"
      >
        {hasUnread && <span className="junniya-fab-badge"></span>}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L13.09 8.26L18 6L15.74 10.91L22 12L15.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L8.26 13.09L2 12L8.26 10.91L6 6L10.91 8.26L12 2Z" fill="currentColor"/>
        </svg>
      </button>
    </>
  );
};

export default JunniyaChat;
