# Chat Widget Integration Guide

## 🚀 **3 Ways to Integrate Chat Widget**

### **Option 1: Simple Embed Script (Recommended)**
Perfect for any website - just add one script tag!

#### **Step 1: Copy Files**
```bash
# Copy these files to your website:
- embed.js
- images/dr-rameshwar.jpg (optional - for custom avatar)
```

#### **Step 2: Add to HTML**
```html
<!DOCTYPE html>
<html>
<head>
    <title>Your Website</title>
</head>
<body>
    <!-- Your website content -->
    
    <!-- Chat Widget - Add this before closing </body> tag -->
    <script src="embed.js"></script>
</body>
</html>
```

#### **Step 3: Configure**
Edit `embed.js` and update these values:
```javascript
const config = {
    apiUrl: 'https://your-n8n-webhook-url.com/webhook/chat',
    firebaseConfig: {
        apiKey: "your-firebase-api-key",
        authDomain: "your-project.firebaseapp.com",
        databaseURL: "https://your-project-default-rtdb.firebaseio.com",
        projectId: "your-project",
        storageBucket: "your-project.appspot.com",
        messagingSenderId: "123456789",
        appId: "your-app-id"
    }
};
```

---

### **Option 2: React Component (For React Apps)**
If you're using React, you can use the existing components directly.

#### **Step 1: Copy Components**
```bash
src/
  components/
    ChatWidget.js
    ChatMessage.js
  styles/
    ChatWidget.css
```

#### **Step 2: Install Dependencies**
```bash
npm install firebase
```

#### **Step 3: Import in Your App**
```javascript
import ChatWidget from './components/ChatWidget';
import './styles/ChatWidget.css';

function App() {
  return (
    <div className="App">
      {/* Your app content */}
      <ChatWidget />
    </div>
  );
}
```

---

### **Option 3: WordPress Plugin**
For WordPress websites.

#### **Step 1: Create Plugin File**
Create `chat-widget-plugin.php`:
```php
<?php
/*
Plugin Name: Dr Rameshwar Chat Widget
Description: AI Assistant Chat Widget
Version: 1.0
*/

function add_chat_widget() {
    ?>
    <script src="<?php echo plugin_dir_url(__FILE__); ?>embed.js"></script>
    <?php
}
add_action('wp_footer', 'add_chat_widget');
?>
```

#### **Step 2: Upload Files**
- Upload plugin file to `/wp-content/plugins/chat-widget/`
- Upload `embed.js` to same folder
- Activate plugin in WordPress admin

---

## 🎨 **Customization Options**

### **Change Colors**
Edit CSS in `embed.js`:
```css
.chat-bubble {
    background: #your-color; /* Floating button color */
}

.chat-header {
    background: #your-color; /* Header color */
}

.message.user .message-bubble {
    background: #your-color; /* User message color */
}
```

### **Change Avatar**
Replace `/images/dr-rameshwar.jpg` with your image:
```javascript
<img src="/your-avatar.jpg" alt="Your Name" class="bot-avatar">
```

### **Change Title**
```javascript
<h3>Your Custom Title</h3>
```

### **Change Position**
```css
#chat-widget-container {
    bottom: 20px;    /* Distance from bottom */
    right: 20px;     /* Distance from right */
    left: 20px;      /* For left side */
}
```

---

## 🔧 **Advanced Configuration**

### **Custom Webhook URL**
```javascript
const config = {
    apiUrl: 'https://your-custom-webhook.com/chat',
    // ... other config
};
```

### **Custom Firebase Path**
```javascript
// In Firebase listener
const messageRef = ref(db, `CustomPath/${sessionId}`);
```

### **Add Custom Styling**
```css
/* Add to your website's CSS */
#chat-widget-container .chat-window {
    border: 2px solid #your-color;
    box-shadow: 0 0 20px rgba(0,0,0,0.3);
}
```

---

## 📱 **Mobile Responsiveness**

The widget automatically adapts to mobile:
- **Desktop**: 350px wide, floating window
- **Mobile**: Full screen, optimized layout

### **Custom Mobile Behavior**
```css
@media (max-width: 768px) {
    .chat-window {
        width: 100vw;
        height: 100vh;
        border-radius: 0;
    }
}
```

---

## 🚀 **Deployment Examples**

### **Static Website (GitHub Pages, Netlify)**
1. Upload `embed.js` to your website
2. Add script tag to HTML
3. Configure webhook URL
4. Deploy!

### **WordPress**
1. Create plugin file
2. Upload to `/wp-content/plugins/`
3. Activate plugin
4. Done!

### **React/Vue/Angular**
1. Copy components to your project
2. Install Firebase: `npm install firebase`
3. Import and use components
4. Build and deploy

### **Shopify**
1. Add script to theme's `theme.liquid`
2. Upload `embed.js` to assets folder
3. Configure webhook URL

---

## 🔍 **Testing**

### **Local Testing**
1. Open `embed-example.html` in browser
2. Test chat functionality
3. Check console for errors

### **Production Testing**
1. Deploy to your website
2. Test on different devices
3. Verify webhook integration
4. Check Firebase connection

---

## 🛠️ **Troubleshooting**

### **Widget Not Appearing**
- Check if script is loaded: `console.log('Chat Widget loaded')`
- Verify file path is correct
- Check browser console for errors

### **Messages Not Sending**
- Verify webhook URL is correct
- Check CORS settings on your server
- Test webhook with Postman/curl

### **Firebase Not Working**
- Verify Firebase config
- Check database rules
- Ensure Firebase project is active

### **Styling Issues**
- Check CSS conflicts with your website
- Use browser dev tools to debug
- Try adding `!important` to styles

---

## 📞 **Support**

For issues or customization requests:
1. Check browser console for errors
2. Verify all configuration values
3. Test with `embed-example.html` first
4. Contact for advanced customization

---

## 🎯 **Quick Start Checklist**

- [ ] Copy `embed.js` to your website
- [ ] Add script tag to HTML
- [ ] Update webhook URL in config
- [ ] Update Firebase config
- [ ] Test locally
- [ ] Deploy to production
- [ ] Test on mobile
- [ ] Verify all functionality works

**That's it! Your chat widget is now integrated! 🎉**
