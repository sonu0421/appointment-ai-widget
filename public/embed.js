// Chat Widget Embed Script
(function() {
  'use strict';
  
  // Configuration
  const config = {
    apiUrl: 'https://dr-rameshwar-appointment-gahmdwcjg2gjdwbh.centralindia-01.azurewebsites.net/webhook/8dfdf952-bc16-44c1-b436-709a0e94d524/chat',
    firebaseConfig: {
      apiKey: "AIzaSyDwZaE1mxthNNoBROjjIff8-DmqRF05Bvg",
      authDomain: "appoinment-f51c1.firebaseapp.com",
      databaseURL: "https://appoinment-f51c1-default-rtdb.firebaseio.com",
      projectId: "appoinment-f51c1",
      storageBucket: "appoinment-f51c1.appspot.com",
      messagingSenderId: "123456789012",
      appId: "1:123456789012:web:abcdefghijklmnop"
    }
  };

  // Check if already loaded
  if (window.ChatWidgetLoaded) {
    console.log('Chat Widget already loaded');
    return;
  }
  window.ChatWidgetLoaded = true;

  // Determine asset base URL from this script location so images load on any host
  const scriptEl = document.currentScript || (function(){
    const scripts = document.getElementsByTagName('script');
    for (let i = scripts.length - 1; i >= 0; i--) {
      const s = scripts[i];
      if (s.src && s.src.indexOf('embed.js') !== -1) return s;
    }
    return null;
  })();
  const ASSET_BASE = scriptEl ? (new URL(scriptEl.src).origin + new URL(scriptEl.src).pathname.replace(/[^/]+$/, '')) : '';

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
              <img src="${ASSET_BASE}images/dr-rameshwar.jpg" alt="Dr Rameshwar Kumar" class="bot-avatar" onerror="this.style.display='none'">
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
      
      #chat-widget-container .chat-widget {
        position: relative;
      }
      
      #chat-widget-container .chat-bubble {
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
      
      #chat-widget-container .chat-bubble:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 16px rgba(0, 122, 255, 0.4);
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      
      #chat-widget-container .chat-window {
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
      
      #chat-widget-container .chat-window.open {
        display: flex;
      }
      
      #chat-widget-container .chat-header {
        background: #007AFF;
        color: white;
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      
      #chat-widget-container .header-content {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      
      #chat-widget-container .bot-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
      }
      
      #chat-widget-container .header-info h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }
      
      #chat-widget-container .close-btn {
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
      
      #chat-widget-container .messages-container {
        flex: 1;
        padding: 16px;
        overflow-y: auto;
        background: #f8f9fa;
      }
      
      #chat-widget-container .message {
        margin-bottom: 12px;
        display: flex;
        align-items: flex-end;
        gap: 8px;
      }
      
      #chat-widget-container .message.user {
        justify-content: flex-end;
      }
      
      #chat-widget-container .message.bot {
        justify-content: flex-start;
      }
      
      #chat-widget-container .message-bubble {
        max-width: 80%;
        padding: 12px 16px;
        border-radius: 18px;
        position: relative;
      }
      
      #chat-widget-container .message.user .message-bubble {
        background: #007AFF;
        color: white;
        border-bottom-right-radius: 4px;
      }
      
      #chat-widget-container .message.bot .message-bubble {
        background: #F1F1F1;
        color: #333;
        border-bottom-left-radius: 4px;
      }
      
      #chat-widget-container .message-text {
        font-size: 14px;
        line-height: 1.4;
        word-wrap: break-word;
      }
      
      #chat-widget-container .message-time {
        font-size: 11px;
        opacity: 0.7;
        margin-top: 4px;
      }
      
      #chat-widget-container .typing-indicator {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 16px;
        background: #f8f9fa;
      }
      
      #chat-widget-container .typing-indicator span {
        width: 8px;
        height: 12px;
        background: #007AFF;
        border-radius: 4px;
        animation: typing 1.4s infinite ease-in-out;
      }
      
      #chat-widget-container .typing-indicator span:nth-child(2) {
        animation-delay: 0.2s;
      }
      
      #chat-widget-container .typing-indicator span:nth-child(3) {
        animation-delay: 0.4s;
      }
      
      @keyframes typing {
        0%, 60%, 100% { transform: scaleY(0.4); }
        30% { transform: scaleY(1); }
      }
      
      #chat-widget-container .chat-input {
        display: flex;
        padding: 16px;
        background: white;
        border-top: 1px solid #e9ecef;
      }
      
      #chat-widget-container .chat-input input {
        flex: 1;
        border: 1px solid #ddd;
        border-radius: 20px;
        padding: 12px 16px;
        font-size: 14px;
        outline: none;
        transition: border-color 0.2s;
      }
      
      #chat-widget-container .chat-input input:focus {
        border-color: #007AFF;
      }
      
      #chat-widget-container .send-btn {
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
      
      #chat-widget-container .send-btn:hover {
        background: #0056b3;
      }
      
      #chat-widget-container .send-btn:disabled {
        background: #ccc;
        cursor: not-allowed;
      }
      
      /* Mobile responsive */
      @media (max-width: 768px) {
        #chat-widget-container .chat-window {
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
          <div class="message-time">${msg.timestamp && !isNaN(msg.timestamp.getTime()) 
            ? msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
            : new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
          }</div>
        </div>
      </div>
    `).join('');
  };

  // Format message text (make links clickable and handle formatting)
  const formatMessageText = (text) => {
    // Function to clean URL by removing trailing punctuation
    const cleanUrl = (url) => {
      return url.replace(/[.,!?]+$/, '');
    };
    
    // Function to format confirmation messages with better structure
    const formatConfirmationMessage = (text) => {
      return text
        .replace(/✅ Payment Received Successfully!/, '✅ <strong>Payment Received Successfully!</strong><br><br>')
        .replace(/Hello\s+([A-Za-z\s]+)👋,/, 'Hello <strong>$1</strong>👋,<br>')
        .replace(/Your online consultation with Dr\. Rameshwer is confirmed\./, 'Your online consultation with <strong>Dr. Rameshwer</strong> is confirmed.')
        .replace(/🗓 Date & Time:/, '<br>🗓 <strong>Date & Time:</strong>')
        .replace(/🔗🔗 Zoom Link:/, '<br>🔗 <strong>Zoom Link:</strong>')
        .replace(/🔗 Zoom Link:/, '<br>🔗 <strong>Zoom Link:</strong>');
    };
    
    // Apply confirmation message formatting
    let formattedText = formatConfirmationMessage(text);
    
    // Make URLs clickable with proper cleaning
    const urlRegex = /(https?:\/\/[^\s]+?)(?=\s|$)/g;
    formattedText = formattedText.replace(urlRegex, (match) => {
      const cleanLink = cleanUrl(match);
      return `<a href="${cleanLink}" target="_blank" style="color: #007AFF; text-decoration: underline; word-break: break-all;">${cleanLink}</a>`;
    });
    
    // Convert line breaks to HTML
    formattedText = formattedText.replace(/\n/g, '<br>');
    
    return formattedText;
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
        body: JSON.stringify([
          {
            sessionId: getSessionId(),
            action: 'sendMessage',
            chatInput: text.trim()
          }
        ])
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
    try {
      // Initialize Firebase
      if (typeof firebase !== 'undefined') {
        // Use the same config as defined at the top
        firebase.initializeApp(config.firebaseConfig);
        const database = firebase.database();
        
        // Set up Firebase listener
        const sessionId = getSessionId();
        if (sessionId) {
          const messageRef = database.ref(`User/${sessionId}`);
          console.log('Setting up Firebase listener for path:', `User/${sessionId}`);
          
          messageRef.on('child_added', (snapshot) => {
            const messageData = snapshot.val();
            const messageId = snapshot.key;
            console.log('🆕 New Firebase message received:', messageData);
            
            if (messageData && messageData.text) {
              // Handle timestamp properly to avoid "Invalid Date"
              let timestamp = new Date();
              if (messageData.time) {
                console.log('📅 Firebase timestamp received:', messageData.time, 'Type:', typeof messageData.time);
                const parsedTime = new Date(messageData.time);
                console.log('📅 Parsed timestamp:', parsedTime, 'Valid:', !isNaN(parsedTime.getTime()));
                if (!isNaN(parsedTime.getTime())) {
                  timestamp = parsedTime;
                } else {
                  console.log('⚠️ Invalid timestamp from Firebase, using current time');
                }
              } else {
                console.log('📅 No timestamp in Firebase message, using current time');
              }
              
              const newMessage = {
                id: messageId,
                sender: messageData.from || 'bot',
                text: messageData.text,
                timestamp: timestamp
              };
              
              console.log('➕ Adding new message to chat:', newMessage);
              addMessageToChat(newMessage);
              
              // Stop loading when Firebase message arrives
              console.log('✅ Firebase response received, stopping loading...');
              isWaitingForFirebase = false;
              isLoading = false;
              document.getElementById('typingIndicator').style.display = 'none';
            }
          }, (error) => {
            console.error('🚨 Firebase listener error:', error);
            addMessageToChat({
              sender: 'bot',
              text: '⚠️ Connection lost. Please check your network.',
              timestamp: new Date()
            });
          });
        }
      } else {
        console.warn('Firebase SDK not loaded');
      }
    } catch (error) {
      console.error('Firebase initialization error:', error);
    }
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
