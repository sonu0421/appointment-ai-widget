# 💬 Dr Rameshwar Kumar AI Chat Widget

A modern, responsive chat widget with Firebase integration and real-time messaging capabilities. Built with React and designed for seamless integration into any website.

![Chat Widget Demo](https://img.shields.io/badge/Status-Live-brightgreen)
![React](https://img.shields.io/badge/React-18.0+-blue)
![Firebase](https://img.shields.io/badge/Firebase-Realtime%20Database-orange)
![License](https://img.shields.io/badge/License-MIT-green)

## 🚀 Live Demo

[View Live Demo](https://your-username.github.io/Chatbox) | [Integration Guide](#-integration-methods)

## ✨ Features

- 🤖 **AI Assistant Chat** - Intelligent responses with Dr Rameshwar Kumar's AI
- 🔥 **Firebase Integration** - Real-time message synchronization
- 📱 **Mobile Responsive** - Perfect on all devices
- 🎨 **Modern UI/UX** - Clean, professional design
- ⚡ **Fast Loading** - Optimized performance
- 🔗 **Easy Integration** - One script tag deployment
- 💳 **Payment Integration** - Razorpay payment link generation
- 🌐 **Multi-Platform** - Works on any website

## 🛠️ Tech Stack

- **Frontend**: React 18, JavaScript ES6+
- **Styling**: CSS3, Flexbox, Responsive Design
- **Database**: Firebase Realtime Database
- **Integration**: n8n Webhooks, Razorpay API
- **Deployment**: GitHub Pages, Netlify, Vercel

## 📦 Installation

### Option 1: Clone Repository
```bash
git clone https://github.com/sonu0421/appointment-ai-widget.git
cd Chatbox
npm install
npm start
```

### Option 2: Direct Integration
```html
<!-- Add to any website -->
<script src="https://github.com/sonu0421/appointment-ai-widget/embed.js"></script>
```

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/sonu0421/appointment-ai-widget.git
   cd Chatbox
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Update `src/components/ChatWidget.js` with your Firebase config
   - Update webhook URL in the same file

4. **Start development server**
   ```bash
   npm start
   ```

5. **Open browser**
   - Navigate to `http://localhost:3000`
   - Chat widget will appear in bottom-right corner

## ⚙️ Configuration

### Firebase Setup
```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### Webhook Configuration
```javascript
const N8N_WEBHOOK_URL = 'https://your-n8n-webhook-url.com/webhook/chat';
```

## 🌐 Integration Methods

### 1. Simple Embed Script (Recommended)
Perfect for any website - just add one script tag!

```html
<!DOCTYPE html>
<html>
<head>
    <title>Your Website</title>
</head>
<body>
    <!-- Your website content -->
    
    <!-- Chat Widget -->
    <script src="https://github.com/sonu0421/appointment-ai-widget/embed.js"></script>
</body>
</html>
```

### 2. React Component
For React applications:

```javascript
import ChatWidget from './components/ChatWidget';
import './styles/ChatWidget.css';

function App() {
  return (
    <div className="App">
      <ChatWidget />
    </div>
  );
}
```

### 3. WordPress Plugin
Create a plugin file:

```php
<?php
function add_chat_widget() {
    ?>
    <script src="https://your-username.github.io/Chatbox/embed.js"></script>
    <?php
}
add_action('wp_footer', 'add_chat_widget');
?>
```

## 🎨 Customization

### Change Colors
```css
.chat-bubble {
    background: #your-color; /* Floating button */
}

.chat-header {
    background: #your-color; /* Header */
}

.message.user .message-bubble {
    background: #your-color; /* User messages */
}
```

### Change Avatar
Replace the doctor's image in `public/images/dr-rameshwar.jpg` with your own.

### Change Position
```css
#chat-widget-container {
    bottom: 20px;    /* Distance from bottom */
    right: 20px;    /* Distance from right */
}
```

## 📱 Mobile Responsiveness

The widget automatically adapts:
- **Desktop**: 350px floating window
- **Mobile**: Full-screen chat experience
- **Tablet**: Optimized layout

## 🔧 API Integration

### n8n Webhook Format
```json
{
  "sessionId": "session_123456789",
  "action": "sendMessage",
  "chatInput": "User message here"
}
```

### Firebase Data Structure
```
User/
  └── {sessionId}/
      └── {messageId}/
          ├── from: "bot"
          ├── text: "Message content"
          └── time: "2024-01-01T12:00:00Z"
```

## 🚀 Deployment

### GitHub Pages
1. Push code to GitHub
2. Go to repository Settings
3. Scroll to Pages section
4. Select source branch
5. Your site will be live at `https://username.github.io/appointment-ai-widget`

### Netlify
1. Connect your GitHub repository
2. Build command: `npm run build`
3. Publish directory: `build`
4. Deploy automatically

### Vercel
1. Import GitHub repository
2. Framework: Create React App
3. Deploy with one click

## 🛠️ Development

### Project Structure
```
Chatbox/
├── public/
│   ├── index.html
│   ├── embed.js          # Standalone embed script
│   └── images/
│       └── dr-rameshwar.jpg
├── src/
│   ├── components/
│   │   ├── ChatWidget.js
│   │   └── ChatMessage.js
│   ├── styles/
│   │   └── ChatWidget.css
│   ├── App.js
│   └── index.js
├── package.json
└── README.md
```

### Available Scripts
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App
```

## 🔍 Troubleshooting

### Widget Not Appearing
- Check if script is loaded: `console.log('Chat Widget loaded')`
- Verify file path is correct
- Check browser console for errors

### Messages Not Sending
- Verify webhook URL is correct
- Check CORS settings on your server
- Test webhook with Postman/curl

### Firebase Not Working
- Verify Firebase configuration
- Check database rules
- Ensure Firebase project is active

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/sonu0421/appointment-ai-widget/issues)
- **Documentation**: [Integration Guide](INTEGRATION_GUIDE.md)
- **Email**: sonu.kmr102002@gmail.com

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Firebase for real-time database
- n8n for workflow automation
- Razorpay for payment integration

## 📊 Project Stats 

![GitHub stars](https://img.shields.io/github/stars/sonu0421/appointment-ai-widget)
![GitHub forks](https://img.shields.io/github/forks/sonu0421/appointment-ai-widget)
![GitHub issues](https://img.shields.io/github/issues/sonu0421/appointment-ai-widget)
![GitHub last commit](https://img.shields.io/github/last-commit/sonu0421/appointment-ai-widget)

---

<div align="center">
  <strong>Made with ❤️ by Sonu Kumar</strong>
</div>
