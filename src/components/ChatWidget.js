import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, onChildAdded } from 'firebase/database';
import ChatMessage from './ChatMessage';
import '../styles/ChatWidget.css';

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwZaE1mxthNNoBROjjIff8-DmqRF05Bvg",
  authDomain: "appoinment-f51c1.firebaseapp.com",
  databaseURL: "https://appoinment-f51c1-default-rtdb.firebaseio.com",
  projectId: "appoinment-f51c1",
  storageBucket: "appoinment-f51c1.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop"
};

// n8n Webhook URL
const N8N_WEBHOOK_URL = "https://dr-rameshwar-appointment-gahmdwcjg2gjdwbh.centralindia-01.azurewebsites.net/webhook/8dfdf952-bc16-44c1-b436-709a0e94d524/chat";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isWaitingForFirebase, setIsWaitingForFirebase] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [firebaseStatus, setFirebaseStatus] = useState('connected');
  const messagesEndRef = useRef(null);
  const sessionIdRef = useRef(null);
  const existingMessagesLoaded = useRef(false);
  const processedMessageIds = useRef(new Set());

  // Generate or retrieve session ID
  const getSessionId = () => {
    if (!sessionIdRef.current) {
      // Check if session ID exists in localStorage
      const storedSessionId = localStorage.getItem('sessionId');
      if (storedSessionId) {
        sessionIdRef.current = storedSessionId;
        console.log('Retrieved existing session ID:', storedSessionId);
      } else {
        // Generate new session ID only if none exists
        const timestamp = Date.now().toString(36);
        const randomPart1 = Math.random().toString(36).substring(2, 15);
        const randomPart2 = Math.random().toString(36).substring(2, 15);
        const newSessionId = timestamp + randomPart1 + randomPart2;
        
        sessionIdRef.current = newSessionId;
        localStorage.setItem('sessionId', newSessionId);
        console.log('Generated new session ID:', newSessionId);
      }
    }
    return sessionIdRef.current;
  };

  // Initialize session ID on component mount
  useEffect(() => {
    // Check if this is a page refresh (not a new tab)
    const isPageRefresh = performance.navigation.type === 1;
    
    if (isPageRefresh) {
      // Clear session ID on page refresh
      sessionIdRef.current = null;
      localStorage.removeItem('sessionId');
      console.log('Page refresh detected - clearing session ID');
    }
    
    // Get or generate session ID when component mounts
    const sessionId = getSessionId();
    console.log('Component mounted with session ID:', sessionId);
  }, []);

  // Initialize chat with bot greeting
  useEffect(() => {
    const initialMessages = [
      {
        id: 1,
        sender: 'bot',
        text: 'Namaste! 🙏 Main Dr. Rameshwar ka AI Assistant hoon\nHow can I help you today? 🤖',
        timestamp: new Date()
      }
    ];
    setMessages(initialMessages);
  }, []);

  // Set up Firebase listener
  useEffect(() => {
    const sessionId = getSessionId();
    if (!sessionId) {
      console.log('No session ID found, skipping Firebase listener');
      return;
    }

    try {
      const messageRef = ref(db, `User/${sessionId}`);
      console.log('Setting up Firebase listener for path:', `User/${sessionId}`);
      
      // Use only onChildAdded to prevent duplicates
      const unsubscribe = onChildAdded(messageRef, (snapshot) => {
        const messageData = snapshot.val();
        const messageId = snapshot.key;
        console.log('🆕 New Firebase message received:', messageData);
        
        // Check if message already processed to prevent duplicates
        if (processedMessageIds.current.has(messageId)) {
          console.log('⚠️ Message already processed, skipping:', messageId);
          return;
        }
        
        if (messageData && messageData.text) {
          // Mark message as processed
          processedMessageIds.current.add(messageId);
          
          // Handle timestamp properly to avoid "Invalid Date"
          let timestamp = new Date();
          if (messageData.time) {
            console.log('📅 Firebase timestamp received:', messageData.time, 'Type:', typeof messageData.time);
            // Try to parse the timestamp, fallback to current time if invalid
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
          setIsWaitingForFirebase(false);
          setIsLoading(false);
        }
      }, (error) => {
        console.error('🚨 Firebase listener error:', error);
        setFirebaseStatus('error');
        addMessageToChat({
          sender: 'bot',
          text: '⚠️ Connection lost. Please check your network.',
          timestamp: new Date()
        });
      });

      // Set up connection status monitoring
      setFirebaseStatus('connected');
      
      return () => {
        unsubscribe();
        setFirebaseStatus('disconnected');
      };
    } catch (error) {
      console.error('Firebase connection error:', error);
      setFirebaseStatus('error');
      addMessageToChat({
        sender: 'bot',
        text: '⚠️ Connection lost. Please check your network.',
        timestamp: new Date()
      });
    }
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Keep input focused after messages change
  useEffect(() => {
    if (isOpen) {
      const input = document.querySelector('.chat-input input');
      if (input && !input.disabled) {
        setTimeout(() => input.focus(), 100);
      }
    }
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessageToChat = (message) => {
    const newMessage = {
      id: Date.now() + Math.random(),
      ...message,
      timestamp: message.timestamp || new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      sender: 'user',
      text: text.trim(),
      timestamp: new Date()
    };

    addMessageToChat(userMessage);
    setInputValue('');
    setIsLoading(true);

    try {
      const sessionId = getSessionId();
      const payload = [{
        sessionId: sessionId,
        action: "sendMessage",
        chatInput: text.trim()
      }];

      console.log('Sending to n8n:', payload);

      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('n8n Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const textResponse = await response.text();
        console.log('n8n Text Response:', textResponse);
        data = { message: textResponse };
      }
      
      console.log('n8n Response:', data);
      
      // Handle different response formats from n8n
      let botMessage = null;
      
      if (data && data.reply) {
        botMessage = data.reply;
      } else if (data && data.output) {
        botMessage = data.output;
      } else if (data && data.text) {
        botMessage = data.text;
      } else if (data && data.response) {
        botMessage = data.response;
      } else if (typeof data === 'string') {
        botMessage = data;
      } else if (Array.isArray(data) && data.length > 0) {
        const firstItem = data[0];
        if (firstItem.reply) {
          botMessage = firstItem.reply;
        } else if (firstItem.message) {
          botMessage = firstItem.message;
        } else if (firstItem.text) {
          botMessage = firstItem.text;
        } else if (typeof firstItem === 'string') {
          botMessage = firstItem;
        }
      }
      
      if (botMessage) {
        addMessageToChat({
          sender: 'bot',
          text: botMessage,
          timestamp: new Date()
        });
        
        // Check if this is a payment link message
        if (botMessage.includes('payment') || botMessage.includes('razorpay') || botMessage.includes('pay')) {
          console.log('💳 Payment link detected, waiting for Firebase response...');
          setIsWaitingForFirebase(true);
          
          // Set timeout to stop loading after 30 seconds
          setTimeout(() => {
            if (isWaitingForFirebase) {
              console.log('⏰ Timeout reached, stopping loading...');
              setIsWaitingForFirebase(false);
              setIsLoading(false);
            }
          }, 30000);
        }
      } else {
        addMessageToChat({
          sender: 'bot',
          text: `Response received: ${JSON.stringify(data)}`,
          timestamp: new Date()
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      addMessageToChat({
        sender: 'bot',
        text: '⚠️ Connection issue, please try again.',
        timestamp: new Date()
      });
      setConnectionStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    sendMessage(inputValue);
    // Keep input focused after sending
    requestAnimationFrame(() => {
      const input = e.target.querySelector('input');
      if (input) {
        input.focus();
        input.click();
      }
    });
  };

  const handleQuickReply = (text) => {
    sendMessage(text);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Test Firebase connection
  const testFirebaseConnection = () => {
    const sessionId = getSessionId();
    console.log('🧪 Testing Firebase connection...');
    console.log('Session ID:', sessionId);
    console.log('Firebase config:', firebaseConfig);
    console.log('Database:', db);
    
    const testRef = ref(db, `User/${sessionId}/test`);
    console.log('Test reference:', testRef);
  };

  return (
    <div className="chat-widget">
      {/* Floating Chat Bubble */}
      <div className="chat-bubble" onClick={toggleChat}>
        <div className="chat-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Chat Window */}
      <div className={`chat-window ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="chat-header">
          <div className="header-content">
            <div className="bot-avatar">
              <img 
                src={process.env.PUBLIC_URL + "https://github.com/sonu0421/appointment-ai-widget/blob/main/public/images/dr-rameshwar.jpg"} 
                alt="Dr. Rameshwar Kumar" 
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  console.log('Header avatar image failed to load:', e.target.src);
                  // Fallback to a default avatar if image not found
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="white"/>
                    </svg>
                  `;
                }}
                onLoad={() => {
                  console.log('Header avatar image loaded successfully');
                }}
              />
            </div>
            <div className="header-text">
              <h3>Dr Rameshwar Kumar AI Assistant</h3>
            </div>
          </div>
          <button className="close-btn" onClick={toggleChat}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="white"/>
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="messages-container">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {/* Quick Reply Buttons (only show for first bot message) */}
          {messages.length === 1 && (
            <div className="quick-replies">
              <button 
                className="quick-reply-btn"
                onClick={() => handleQuickReply('I Want Appointment')}
              >
                I Want Appointment
              </button>
              <button 
                className="quick-reply-btn"
                onClick={() => handleQuickReply('Mujhe Appointment Book Chahiye')}
              >
                Mujhe Appointment Book Chahiye
              </button>
            </div>
          )}

          {(isLoading || isWaitingForFirebase) && (
            <div className="message bot">
              <div className="message-bubble">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                {isWaitingForFirebase && (
                  <div style={{fontSize: '12px', opacity: 0.7, marginTop: '4px'}}>
                    Processing...
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form className="chat-input" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Send a message..."
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !inputValue.trim()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor"/>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWidget;
