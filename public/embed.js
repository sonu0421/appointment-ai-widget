// Chat Widget Embed Script
(function() {
  'use strict';
  
  // Configuration
  const config = {
    apiUrl: 'https://dr-rameshwar-appointment-gahmdwcjg2gjdwbh.centralindia-01.azurewebsites.net/webhook/8dfdf952-bc16-44c1-b436-709a0e94d524/chat',
    firebaseConfig: {
      apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      authDomain: "your-project.firebaseapp.com",
      databaseURL: "https://your-project-default-rtdb.firebaseio.com",
      projectId: "your-project",
      storageBucket: "your-project.appspot.com",
      messagingSenderId: "123456789",
      appId: "1:123456789:web:abcdef123456"
    }
  };

  // Check if already loaded
  if (window.ChatWidgetLoaded) {
    console.log('Chat Widget already loaded');
    return;
  }
  window.ChatWidgetLoaded = true;

  // Create widget container
  const createWidget = () => {
    const container = document.createElement('div');
    container.id = 'chat-widget-container';
    container.innerHTML = `
      <div id="chat-widget" class="chat-widget">
        <div class="chat-bubble" onclick="toggleChat()">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="currentColor"/>
          </svg>
        </div>
        <div class="chat-window" id="chatWindow">
          <div class="chat-header">
            <div class="header-content">
              <img src="/images/dr-rameshwar.jpg" alt="Dr Rameshwar Kumar" class="bot-avatar" onerror="this.style.display='none'">
              <div class="header-info">
                <h3>Dr Rameshwar Kumar AI Assistant</h3>
              </div>
            </div>
            <button class="close-btn" onclick="toggleChat()">×</button>
          </div>
          <div class="messages-container" id="messagesContainer">
            <div class="message bot">
              <div class="message-bubble">
                <div class="message-text">Hello! I'm Dr Rameshwar Kumar's AI Assistant. How can I help you today?</div>
                <div class="message-time">${new Date().toLocaleTimeString()}</div>
              </div>
            </div>
          </div>
          <div class="typing-indicator" id="typingIndicator" style="display: none;">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <form class="chat-input" onsubmit="handleSendMessage(event)">
            <input type="text" placeholder="Send a message..." id="messageInput" autocomplete="off">
            <button type="submit" class="send-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="currentColor"/>
              </svg>
            </button>
          </form>
        </div>
      </div>
    `;
    return container;
  };

  // Add CSS styles
  const addStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
      #chat-widget-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      
      .chat-widget {
        position: relative;
      }
      
      .chat-bubble {
        width: 60px;
        height: 60px;
        background: #007AFF;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
        color: white;
        animation: float 2s ease-in-out infinite;
        transition: all 0.3s ease;
      }
      
      .chat-bubble:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 16px rgba(0, 122, 255, 0.4);
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      
      .chat-window {
        position: absolute;
        bottom: 80px;
        right: 0;
        width: 350px;
        height: 500px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        display: none;
        flex-direction: column;
        overflow: hidden;
      }
      
      .chat-window.open {
        display: flex;
      }
      
      .chat-header {
        background: #007AFF;
        color: white;
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      
      .header-content {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      
      .bot-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
      }
      
      .header-info h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }
      
      .close-btn {
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .messages-container {
        flex: 1;
        padding: 16px;
        overflow-y: auto;
        background: #f8f9fa;
      }
      
      .message {
        margin-bottom: 12px;
        display: flex;
        align-items: flex-end;
        gap: 8px;
      }
      
      .message.user {
        justify-content: flex-end;
      }
      
      .message.bot {
        justify-content: flex-start;
      }
      
      .message-bubble {
        max-width: 80%;
        padding: 12px 16px;
        border-radius: 18px;
        position: relative;
      }
      
      .message.user .message-bubble {
        background: #007AFF;
        color: white;
        border-bottom-right-radius: 4px;
      }
      
      .message.bot .message-bubble {
        background: #F1F1F1;
        color: #333;
        border-bottom-left-radius: 4px;
      }
      
      .message-text {
        font-size: 14px;
        line-height: 1.4;
        word-wrap: break-word;
      }
      
      .message-time {
        font-size: 11px;
        opacity: 0.7;
        margin-top: 4px;
      }
      
      .typing-indicator {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 16px;
        background: #f8f9fa;
      }
      
      .typing-indicator span {
        width: 8px;
        height: 12px;
        background: #007AFF;
        border-radius: 4px;
        animation: typing 1.4s infinite ease-in-out;
      }
      
      .typing-indicator span:nth-child(2) {
        animation-delay: 0.2s;
      }
      
      .typing-indicator span:nth-child(3) {
        animation-delay: 0.4s;
      }
      
      @keyframes typing {
        0%, 60%, 100% { transform: scaleY(0.4); }
        30% { transform: scaleY(1); }
      }
      
      .chat-input {
        display: flex;
        padding: 16px;
        background: white;
        border-top: 1px solid #e9ecef;
      }
      
      .chat-input input {
        flex: 1;
        border: 1px solid #ddd;
        border-radius: 20px;
        padding: 12px 16px;
        font-size: 14px;
        outline: none;
        transition: border-color 0.2s;
      }
      
      .chat-input input:focus {
        border-color: #007AFF;
      }
      
      .send-btn {
        background: #007AFF;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        margin-left: 8px;
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s;
      }
      
      .send-btn:hover {
        background: #0056b3;
      }
      
      .send-btn:disabled {
        background: #ccc;
        cursor: not-allowed;
      }
      
      /* Mobile responsive */
      @media (max-width: 768px) {
        .chat-window {
          width: 100vw;
          height: 100vh;
          bottom: 0;
          right: 0;
          border-radius: 0;
        }
        
        #chat-widget-container {
          bottom: 0;
          right: 0;
        }
      }
    `;
    document.head.appendChild(style);
  };

  // Global functions
  window.toggleChat = function() {
    const chatWindow = document.getElementById('chatWindow');
    const isOpen = chatWindow.classList.contains('open');
    
    if (isOpen) {
      chatWindow.classList.remove('open');
    } else {
      chatWindow.classList.add('open');
      document.getElementById('messageInput').focus();
    }
  };

  window.handleSendMessage = function(e) {
    e.preventDefault();
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (message) {
      sendMessage(message);
      input.value = '';
    }
  };

  // Chat state
  let messages = [];
  let isLoading = false;
  let isWaitingForFirebase = false;
  let sessionId = null;

  // Generate session ID
  const generateSessionId = () => {
    return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  };

  // Get or create session ID
  const getSessionId = () => {
    if (!sessionId) {
      sessionId = localStorage.getItem('chatSessionId') || generateSessionId();
      localStorage.setItem('chatSessionId', sessionId);
    }
    return sessionId;
  };

  // Add message to chat
  const addMessageToChat = (message) => {
    messages.push(message);
    renderMessages();
    scrollToBottom();
  };

  // Render messages
  const renderMessages = () => {
    const container = document.getElementById('messagesContainer');
    container.innerHTML = messages.map(msg => `
      <div class="message ${msg.sender}">
        <div class="message-bubble">
          <div class="message-text">${formatMessageText(msg.text)}</div>
          <div class="message-time">${msg.timestamp.toLocaleTimeString()}</div>
        </div>
      </div>
    `).join('');
  };

  // Format message text (make links clickable)
  const formatMessageText = (text) => {
    // Make URLs clickable
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, '<a href="$1" target="_blank" style="color: #007AFF; text-decoration: underline;">$1</a>');
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    const container = document.getElementById('messagesContainer');
    container.scrollTop = container.scrollHeight;
  };

  // Send message
  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      sender: 'user',
      text: text,
      timestamp: new Date()
    };
    
    addMessageToChat(userMessage);
    
    // Show loading
    isLoading = true;
    isWaitingForFirebase = true;
    document.getElementById('typingIndicator').style.display = 'flex';
    
    try {
      const response = await fetch(config.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          sessionId: getSessionId()
        })
      });

      if (response.ok) {
        console.log('Message sent successfully');
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      addMessageToChat({
        sender: 'bot',
        text: 'Sorry, there was an error sending your message. Please try again.',
        timestamp: new Date()
      });
      isLoading = false;
      isWaitingForFirebase = false;
      document.getElementById('typingIndicator').style.display = 'none';
    }
  };

  // Initialize Firebase
  const initializeFirebase = () => {
    // Firebase will be initialized here
    console.log('Firebase integration ready');
  };

  // Initialize widget
  const init = () => {
    addStyles();
    const container = createWidget();
    document.body.appendChild(container);
    
    // Initialize Firebase and other functionality
    initializeFirebase();
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
