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

  // Load Firebase SDK dynamically if not present
  const loadFirebaseSdk = () => new Promise((resolve, reject) => {
    if (typeof firebase !== 'undefined') { resolve(); return; }
    const appScript = document.createElement('script');
    appScript.src = 'https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js';
    appScript.async = true;
    appScript.onload = () => {
      const dbScript = document.createElement('script');
      dbScript.src = 'https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js';
      dbScript.async = true;
      dbScript.onload = () => resolve();
      dbScript.onerror = reject;
      document.head.appendChild(dbScript);
    };
    appScript.onerror = reject;
    document.head.appendChild(appScript);
  });

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
        <div class="chat-window" id="chatWindow" style="display: none;">
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
            <!-- Typing indicator (hidden by default) -->
            <div id="typingIndicator" class="message bot" style="display: none;">
              <div class="message-bubble">
                <div class="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div id="processingText" style="font-size: 12px; opacity: 0.7; margin-top: 4px; display: none;">Processing...</div>
              </div>
            </div>
          </div>
          <form class="chat-input" onsubmit="handleSendMessage(event)">
            <input type="text" placeholder="Send a message..." id="messageInput" autocomplete="off" enterkeyhint="send">
            <button type="submit" id="sendButton" class="send-btn">
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
        bottom: calc(20px + env(safe-area-inset-bottom, 0px));
        right: 20px;
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        isolation: isolate; /* prevent host stacking/context issues */
      }
      /* Scoped minimal reset to resist host page CSS */
      #chat-widget-container, #chat-widget-container * { box-sizing: border-box; }
      #chat-widget-container button { -webkit-appearance: none; appearance: none; font: inherit; }
      #chat-widget-container input { -webkit-appearance: none; appearance: none; font: inherit; }
      #chat-widget-container svg { width: 20px; height: 20px; }
      #chat-widget-container svg, #chat-widget-container svg path { fill: currentColor; }
      
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
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        display: none;
        flex-direction: column;
        transform: translateY(20px) scale(0.95);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        overflow: hidden;
        overscroll-behavior: contain;
        will-change: transform;
        backface-visibility: hidden;
        -webkit-overflow-scrolling: touch;
      }
      
      #chat-widget-container .chat-window.open {
        display: flex;
        transform: translateY(0) scale(1);
        opacity: 1;
        visibility: visible;
      }
      
      #chat-widget-container .chat-header {
        background: #007AFF;
        color: white;
        padding: 16px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: 16px 16px 0 0;
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
        background: #fff;
        display: flex;
        flex-direction: column;
        gap: 4px;
        align-items: stretch;
        overscroll-behavior: contain;
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
        min-width: 60px;
        padding: 10px 14px 4px 14px;
        border-radius: 20px;
        position: relative;
        word-wrap: break-word;
        display: inline-block;
        font-size: 14px;
        line-height: 1.3;
      }
      
      #chat-widget-container .message.user .message-bubble {
        background: #007AFF;
        color: white;
        border-bottom-right-radius: 4px;
        margin-left: auto;
        margin-right: 0;
        box-shadow: 0 2px 8px rgba(0, 122, 255, 0.3);
      }
      
      #chat-widget-container .message.bot .message-bubble {
        background: #F1F1F1;
        color: #333;
        border: 1px solid #E5E7EB;
        border-bottom-left-radius: 4px;
        margin-left: 0;
        margin-right: auto;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transition: all 0.2s ease;
      }
      
      #chat-widget-container .message-text {
        font-size: 14px;
        line-height: 1.4;
        word-wrap: break-word;
      }
      
      #chat-widget-container .message-time {
        font-size: 11px;
        opacity: 0.6;
        margin-top: 2px;
        text-align: right;
      }
      /* Quick replies */
      #chat-widget-container .quick-replies {
        display: flex;
        gap: 8px;
        margin: 8px 0 0 0;
        flex-wrap: wrap;
      }
      #chat-widget-container .quick-reply-btn {
        background: #F3F4F6;
        color: #111827;
        border: 1px solid #E5E7EB;
        border-radius: 9999px;
        padding: 6px 12px;
        font-size: 13px;
        cursor: pointer;
      }
      #chat-widget-container .quick-reply-btn:hover {
        background: #E5E7EB;
      }
      
      #chat-widget-container .typing-indicator {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 0 2px 0; /* visually centered in bubble */
        background: transparent; /* inherit bubble background */
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
        align-items: center;
        padding: 16px;
        padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
        background: #F9FAFB;
        border-top: 1px solid #E5E7EB;
        gap: 8px;
        box-sizing: border-box;
      }
      
      #chat-widget-container .chat-input input {
        flex: 1 1 auto;
        border: 1px solid #D1D5DB;
        border-radius: 20px;
        padding: 10px 16px;
        font-size: 14px;
        outline: none;
        transition: border-color 0.2s;
        min-height: 40px;
        min-width: 0; /* allow flexbox to shrink correctly */
        background: #fff;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
      }
      
      #chat-widget-container .chat-input input:focus {
        border-color: #8B5CF6;
        box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
      }

      #chat-widget-container .chat-input input::placeholder { color: #9CA3AF; }
      
      #chat-widget-container .send-btn {
        background: #007AFF;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        margin-left: 8px;
        color: white;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s, transform 0.1s ease;
        flex: 0 0 40px; /* don't shrink */
        min-width: 40px;
        min-height: 40px;
        box-shadow: 0 2px 8px rgba(0, 122, 255, 0.25);
      }
      #chat-widget-container .send-btn:active { transform: scale(0.96); }
      
      #chat-widget-container .send-btn:hover {
        background: #0056b3;
      }
      
      #chat-widget-container .send-btn:disabled {
        background: #ccc;
        cursor: not-allowed;
        color: #fff;
      }
      #chat-widget-container .send-btn svg,
      #chat-widget-container .send-btn svg path {
        fill: currentColor;
      }
      /* Stronger icon enforcement to survive host CSS resets */
      #chat-widget-container #sendButton { color: #fff !important; }
      #chat-widget-container #sendButton svg { display: block !important; width: 20px !important; height: 20px !important; }
      #chat-widget-container #sendButton svg path { fill: currentColor !important; stroke: none !important; }

      #chat-widget-container .send-btn svg {
        width: 20px;
        height: 20px;
      }
      
      /* Mobile responsive */
      @media (max-width: 768px) {
        #chat-widget-container .chat-window {
          position: fixed;
          top: auto; /* anchored via bottom offset handled by JS */
          left: 0;
          width: 100vw;
          height: 100dvh; /* dynamic viewport for mobile */
          max-height: 100dvh;
          bottom: 0;
          right: 0;
          border-radius: 0;
        }

        #chat-widget-container {
          bottom: 0;
          right: 0;
          left: 0;
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
      chatWindow.style.display = 'none';
      // Unlock body scroll when closing on mobile
      try {
        if (bodyScrollLocked) {
          document.documentElement.style.overflow = prevHtmlOverflow;
          document.body.style.overflow = prevBodyOverflow;
          document.body.style.position = prevBodyPosition || '';
          document.body.style.top = prevBodyTop || '';
          window.scrollTo(0, bodyScrollY);
          bodyScrollLocked = false;
        }
      } catch(_) {}
    } else {
      chatWindow.style.display = 'flex';
      chatWindow.classList.add('open');
      document.getElementById('messageInput').focus();
      // Lock body scroll when opening on mobile
      try {
        if (window.innerWidth <= 768 && !bodyScrollLocked) {
          bodyScrollY = window.scrollY || document.documentElement.scrollTop || 0;
          prevBodyOverflow = document.body.style.overflow;
          prevHtmlOverflow = document.documentElement.style.overflow;
          prevBodyPosition = document.body.style.position;
          prevBodyTop = document.body.style.top;
          document.documentElement.style.overflow = 'hidden';
          document.body.style.overflow = 'hidden';
          document.body.style.position = 'fixed';
          document.body.style.top = `-${bodyScrollY}px`;
          bodyScrollLocked = true;
        }
      } catch(_) {}
    }
  };

  window.handleSendMessage = function(e) {
    e.preventDefault();
    // Prevent duplicate sends while loading (mobile keyboard stays open)
    if (isLoading) return;
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (message) {
      sendMessage(message);
      input.value = '';
      // Keep input focused after sending
      requestAnimationFrame(() => {
        if (!input.disabled) {
          input.focus();
          input.click();
        }
      });
    }
  };

  // Chat state
  let messages = [];
  let isLoading = false;
  let isWaitingForFirebase = false;
  let sessionId = null;
  let quickRepliesRendered = false;
  const processedMessageIds = new Set();
  // Body scroll lock state for mobile
  let bodyScrollLocked = false;
  let prevBodyOverflow = '';
  let prevHtmlOverflow = '';
  let prevBodyPosition = '';
  let prevBodyTop = '';
  let bodyScrollY = 0;

  // Generate session ID
  const generateSessionId = () => {
    return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  };

  // Get or create session ID
  const getSessionId = () => {
    if (!sessionId) {
      sessionId = localStorage.getItem('sessionId') || generateSessionId();
      localStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  };

  // Reset session on full page refresh (match React behavior)
  try {
    const nav = (performance && performance.getEntriesByType) ? performance.getEntriesByType('navigation')[0] : null;
    const isRefresh = (performance && performance.navigation && performance.navigation.type === 1) || (nav && nav.type === 'reload');
    if (isRefresh) {
      localStorage.removeItem('sessionId');
      sessionId = null;
    }
  } catch (_) {}

  // Add message to chat
  const addMessageToChat = (message) => {
    messages.push(message);
    renderMessages();
    scrollToBottom();
  };

  // Render messages
  const renderMessages = () => {
    const container = document.getElementById('messagesContainer');
    const existingTyping = document.getElementById('typingIndicator');
    const html = messages.map(msg => `
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
    container.innerHTML = html + (shouldShowQuickReplies() ? quickRepliesMarkup() : '');
    // Ensure typing indicator exists and stays last child (not overwritten)
    let typingBlock = existingTyping;
    if (!typingBlock) {
      typingBlock = document.createElement('div');
      typingBlock.id = 'typingIndicator';
      typingBlock.className = 'message bot';
      typingBlock.style.display = 'none';
      typingBlock.innerHTML = `
        <div class="message-bubble">
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div id="processingText" style="font-size: 12px; opacity: 0.7; margin-top: 4px; display: none;">Processing...</div>
        </div>
      `;
    }
    container.appendChild(typingBlock);
  };

  // Quick replies same as React widget (only after first bot message)
  const shouldShowQuickReplies = () => {
    if (quickRepliesRendered) return false;
    return messages.length === 1 && messages[0].sender === 'bot';
  };
  const quickRepliesMarkup = () => {
    quickRepliesRendered = true;
    return `
      <div class="quick-replies">
        <button class="quick-reply-btn" onclick="window.__quickReply('I Want Appointment')">I Want Appointment</button>
        <button class="quick-reply-btn" onclick="window.__quickReply('Mujhe Appointment Book Chahiye')">Mujhe Appointment Book Chahiye</button>
      </div>
    `;
  };

  window.__quickReply = function(text){
    sendMessage(text);
  }

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
    // Show loading and typing UI
    setLoading(true);
    setProcessing(false);
    
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

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Parse response like React widget
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const textResponse = await response.text();
        data = { message: textResponse };
      }

      let botMessage = null;
      if (data && data.reply) botMessage = data.reply;
      else if (data && data.output) botMessage = data.output;
      else if (data && data.text) botMessage = data.text;
      else if (data && data.response) botMessage = data.response;
      else if (typeof data === 'string') botMessage = data;
      else if (Array.isArray(data) && data.length > 0) {
        const first = data[0];
        if (first.reply) botMessage = first.reply;
        else if (first.message) botMessage = first.message;
        else if (first.text) botMessage = first.text;
        else if (typeof first === 'string') botMessage = first;
      }

      if (botMessage) {
        addMessageToChat({ sender: 'bot', text: botMessage, timestamp: new Date() });
        // If payment flow, wait for Firebase reply
        if (/payment|razorpay|pay/i.test(botMessage)) {
          isWaitingForFirebase = true;
          setProcessing(true);
          // Safety timeout 30s
          setTimeout(() => {
            if (isWaitingForFirebase) {
              isWaitingForFirebase = false;
              setProcessing(false);
              setLoading(false);
            }
          }, 30000);
        } else {
          // Normal messages: stop loading now
          setProcessing(false);
          setLoading(false);
        }
      } else {
        addMessageToChat({ sender: 'bot', text: `Response received: ${JSON.stringify(data)}`, timestamp: new Date() });
        setProcessing(false);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      addMessageToChat({
        sender: 'bot',
        text: 'Sorry, there was an error sending your message. Please try again.',
        timestamp: new Date()
      });
      isWaitingForFirebase = false;
      setProcessing(false);
      setLoading(false);
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
            
            // Deduplicate Firebase messages
            if (processedMessageIds.has(messageId)) {
              console.log('⚠️ Message already processed, skipping:', messageId);
              return;
            }

            if (messageData && messageData.text) {
              processedMessageIds.add(messageId);
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
              setProcessing(false);
              setLoading(false);
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
    
    // Seed initial greeting so quick replies render like React
    try {
      messages = [];
      quickRepliesRendered = false;
      addMessageToChat({
        sender: 'bot',
        text: 'Namaste! 🙏 Main Dr. Rameshwar ka AI Assistant hoon\nHow can I help you today? 🤖',
        timestamp: new Date()
      });
    } catch(_) {}

    // Initialize Firebase and other functionality
    loadFirebaseSdk()
      .then(() => initializeFirebase())
      .catch((e) => {
        console.error('Failed to load Firebase SDK:', e);
      });

    // Initialize input/button state and interactions
    const input = document.getElementById('messageInput');
    const btn = document.getElementById('sendButton');
    if (btn && input) {
      btn.disabled = !input.value.trim();
      input.addEventListener('input', () => {
        if (!isLoading) {
          btn.disabled = !input.value.trim();
        }
      });
    }

    // Mobile keyboard handling: use visualViewport to keep input visible (mobile only)
    try {
      const chatWindow = document.getElementById('chatWindow');
      const messagesEl = document.getElementById('messagesContainer');
      const adjustForViewport = () => {
        const vv = window.visualViewport;
        const isMobile = () => window.innerWidth <= 768;
        if (chatWindow) {
          if (vv && isMobile()) {
            const height = Math.min(vv.height, window.innerHeight);
            chatWindow.style.height = height + 'px';
            chatWindow.style.maxHeight = height + 'px';
            // Anchor to bottom: move bottom to the visual viewport bottom
            const keyboardInset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
            chatWindow.style.bottom = keyboardInset + 'px';
            chatWindow.style.top = 'auto';
            chatWindow.style.left = '0px';
            chatWindow.style.right = '0px';
          } else {
            // Clear inline styles on desktop to use default CSS
            chatWindow.style.height = '';
            chatWindow.style.maxHeight = '';
            chatWindow.style.top = '';
            chatWindow.style.left = '';
            chatWindow.style.right = '';
            chatWindow.style.bottom = '';
          }
        }
        if (messagesEl) {
          messagesEl.scrollTop = messagesEl.scrollHeight;
        }
      };
      if (window.visualViewport) {
        // Only react on resize; scroll events during keyboard slide can cause jank
        window.visualViewport.addEventListener('resize', adjustForViewport);
      }
      // Also listen to window resize to toggle between mobile/desktop behavior
      window.addEventListener('resize', adjustForViewport);
      adjustForViewport();
      // Ensure input stays in view when focused and after send (desktop only to avoid page jump on mobile)
      const keepInputVisible = () => {
        setTimeout(() => {
          try {
            if (window.innerWidth > 768) {
              input.scrollIntoView({block: 'nearest', inline: 'nearest'});
            }
          } catch(_) {}
          if (messagesEl) messagesEl.scrollTop = messagesEl.scrollHeight;
        }, 100);
      };
      if (input) {
        input.addEventListener('focus', keepInputVisible);
      }
      // Also when chat opens
      const chatBubble = document.querySelector('#chat-widget .chat-bubble');
      if (chatBubble) {
        chatBubble.addEventListener('click', () => setTimeout(keepInputVisible, 200));
      }
    } catch (_) {}
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

// UI helpers
function setLoading(loading) {
  try {
    isLoading = loading;
    const ti = document.getElementById('typingIndicator');
    if (ti) ti.style.display = loading ? 'flex' : 'none';
    const input = document.getElementById('messageInput');
    const btn = document.getElementById('sendButton');
    // Keep input enabled so keyboard stays open on mobile
    if (btn) btn.disabled = loading || (input && !input.value.trim());
    if (!loading && input) {
      // Restore focus when loading ends
      setTimeout(() => { if (!input.disabled) input.focus(); }, 50);
    }
  } catch (_) {}
}

function setProcessing(waiting) {
  try {
    const p = document.getElementById('processingText');
    if (p) p.style.display = waiting ? 'block' : 'none';
  } catch (_) {}
}