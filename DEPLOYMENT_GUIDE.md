# 🚀 GitHub Pages Deployment Guide

## ✅ GitHub Pages Setup Complete!

Your project is now ready for GitHub Pages deployment. Here's how to deploy:

## 📋 Step-by-Step Deployment

### 1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit with GitHub Pages setup"
git push origin main
```

### 2. **Deploy to GitHub Pages**
```bash
npm run deploy
```

This command will:
- Build your React app (`npm run build`)
- Deploy to `gh-pages` branch
- Make your site live at: `https://sonu0421.github.io/appointment-ai-widget`

### 3. **Verify Deployment**
- Go to your GitHub repository
- Click on "Settings" tab
- Scroll to "Pages" section
- You should see: "Your site is published at https://sonu0421.github.io/appointment-ai-widget"

## 🔧 What Was Added

### **package.json Updates:**
```json
{
  "homepage": "https://sonu0421.github.io/appointment-ai-widget",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  },
  "devDependencies": {
    "gh-pages": "^6.3.0"
  }
}
```

### **New Commands Available:**
```bash
npm run deploy    # Deploy to GitHub Pages
npm run build     # Build for production
npm start         # Start development server
```

## 🌐 Your Live URLs

After deployment, your chat widget will be available at:

- **Main Site**: `https://sonu0421.github.io/appointment-ai-widget`
- **Embed Script**: `https://sonu0421.github.io/appointment-ai-widget/embed.js`
- **Example Page**: `https://sonu0421.github.io/appointment-ai-widget/embed-example.html`

## 🔄 Future Updates

To update your deployed site:

1. **Make changes** to your code
2. **Commit changes**:
   ```bash
   git add .
   git commit -m "Update chat widget"
   git push origin main
   ```
3. **Deploy updates**:
   ```bash
   npm run deploy
   ```

## 📱 Testing Your Deployment

### **Test the Main Site:**
1. Visit: `https://sonu0421.github.io/appointment-ai-widget`
2. Click the chat widget button
3. Send a test message
4. Verify Firebase integration works

### **Test the Embed Script:**
1. Create a test HTML file:
   ```html
   <!DOCTYPE html>
   <html>
   <head>
       <title>Test Chat Widget</title>
   </head>
   <body>
       <h1>Test Page</h1>
       <script src="https://sonu0421.github.io/appointment-ai-widget/embed.js"></script>
   </body>
   </html>
   ```
2. Open in browser
3. Verify chat widget appears

## 🛠️ Troubleshooting

### **Deployment Fails:**
```bash
# Clear build cache
rm -rf build
npm run build
npm run deploy
```

### **Site Not Loading:**
- Check GitHub repository settings
- Verify "Pages" section shows your site URL
- Wait 5-10 minutes for GitHub to process

### **Chat Widget Not Working:**
- Check browser console for errors
- Verify Firebase configuration
- Test webhook URLs

## 🎯 Next Steps

1. **Deploy now**: `npm run deploy`
2. **Test your live site**
3. **Share the embed script** with others
4. **Update README.md** with your live URL

## 📞 Support

If you encounter any issues:
- Check GitHub repository settings
- Verify all files are committed
- Test locally first: `npm start`

---

**Your chat widget is ready for the world! 🌍**
