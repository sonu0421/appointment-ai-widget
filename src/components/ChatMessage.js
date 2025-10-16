import React from 'react';

const ChatMessage = ({ message }) => {
  // Function to render clickable links and formatted text in message text
  const renderMessageText = (text) => {
    // URL regex pattern - smart handling of trailing periods
    const urlRegex = /(https?:\/\/[^\s]+?)(?=\s|$)/g;
    
    // Function to clean URL by removing trailing punctuation
    const cleanUrl = (url) => {
      // Remove trailing punctuation that's not part of URL
      return url.replace(/[.,!?]+$/, '');
    };
    
    // Function to format confirmation messages with better structure
    const formatConfirmationMessage = (text) => {
      // Add line breaks for better formatting
      return text
        .replace(/✅ Payment Received Successfully!/, '✅ **Payment Received Successfully!**\n\n')
        .replace(/Hello\s+([A-Za-z\s]+)👋,/, 'Hello **$1**👋,\n')
        .replace(/Your online consultation with Dr\. Rameshwer is confirmed\./, 'Your online consultation with **Dr. Rameshwer** is confirmed.')
        .replace(/🗓 Date & Time:/, '\n🗓 **Date & Time:**')
        .replace(/🔗🔗 Zoom Link:/, '\n🔗 **Zoom Link:**')
        .replace(/🔗 Zoom Link:/, '\n🔗 **Zoom Link:**');
    };
    
    // Apply confirmation message formatting
    const formattedText = formatConfirmationMessage(text);
    
    return formattedText.split('\n').map((line, lineIndex) => {
      // Handle bullet points (lines starting with • or *)
      const isBulletPoint = line.trim().startsWith('•') || (line.trim().startsWith('*') && !line.trim().startsWith('**'));
      
      if (isBulletPoint) {
        // Remove bullet point and format the content
        const cleanLine = line.replace(/^[•*]\s*/, '');
        
        return (
          <div key={lineIndex} style={{ marginBottom: '6px', display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ marginRight: '8px', marginTop: '2px', color: '#666' }}>•</span>
            <div style={{ flex: 1 }}>
              {cleanLine.split(urlRegex).map((part, partIndex) => {
                if (urlRegex.test(part)) {
                  const cleanPart = cleanUrl(part);
                  return (
                    <a
                      key={partIndex}
                      href={cleanPart}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#007AFF',
                        textDecoration: 'underline',
                        wordBreak: 'break-all'
                      }}
                    >
                      {cleanPart}
                    </a>
                  );
                }
                
                // Handle bold text formatting and special formatting
                if (part.includes('**')) {
                  return part.split(/(\*\*[^*]+\*\*)/g).map((boldPart, boldIndex) => {
                    if (boldPart.startsWith('**') && boldPart.endsWith('**')) {
                      return (
                        <strong key={boldIndex} style={{ fontWeight: 'bold' }}>
                          {boldPart.slice(2, -2)}
                        </strong>
                      );
                    }
                    return boldPart;
                  });
                }
                
                // Handle special formatting for confirmation messages
                if (part.includes('Hello') && part.includes('👋')) {
                  // Format: "Hello Name👋," -> "Hello **Name**👋,"
                  const formattedPart = part.replace(/Hello\s+([A-Za-z\s]+)👋/, 'Hello **$1**👋');
                  if (formattedPart !== part) {
                    return formattedPart.split(/(\*\*[^*]+\*\*)/g).map((boldPart, boldIndex) => {
                      if (boldPart.startsWith('**') && boldPart.endsWith('**')) {
                        return (
                          <strong key={boldIndex} style={{ fontWeight: 'bold' }}>
                            {boldPart.slice(2, -2)}
                          </strong>
                        );
                      }
                      return boldPart;
                    });
                  }
                }
                
                return part;
              })}
            </div>
          </div>
        );
      }
      
      // Handle regular lines with links and bold text
      return (
        <div key={lineIndex} style={{ marginBottom: '4px' }}>
          {line.split(urlRegex).map((part, partIndex) => {
            if (urlRegex.test(part)) {
              const cleanPart = cleanUrl(part);
              return (
                <a
                  key={partIndex}
                  href={cleanPart}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#007AFF',
                    textDecoration: 'underline',
                    wordBreak: 'break-all'
                  }}
                >
                  {cleanPart}
                </a>
              );
            }
            
            // Handle bold text formatting and special formatting
            if (part.includes('**')) {
              return part.split(/(\*\*[^*]+\*\*)/g).map((boldPart, boldIndex) => {
                if (boldPart.startsWith('**') && boldPart.endsWith('**')) {
                  return (
                    <strong key={boldIndex} style={{ fontWeight: 'bold' }}>
                      {boldPart.slice(2, -2)}
                    </strong>
                  );
                }
                return boldPart;
              });
            }
            
            // Handle special formatting for confirmation messages
            if (part.includes('Hello') && part.includes('👋')) {
              // Format: "Hello Name👋," -> "Hello **Name**👋,"
              const formattedPart = part.replace(/Hello\s+([A-Za-z\s]+)👋/, 'Hello **$1**👋');
              if (formattedPart !== part) {
                return formattedPart.split(/(\*\*[^*]+\*\*)/g).map((boldPart, boldIndex) => {
                  if (boldPart.startsWith('**') && boldPart.endsWith('**')) {
                    return (
                      <strong key={boldIndex} style={{ fontWeight: 'bold' }}>
                        {boldPart.slice(2, -2)}
                      </strong>
                    );
                  }
                  return boldPart;
                });
              }
            }
            
            return part;
          })}
        </div>
      );
    });
  };

  return (
    <div className={`message ${message.sender}`}>
      <div className="message-bubble">
        <div className="message-text">
          {renderMessageText(message.text)}
        </div>
        <div className="message-time">
          {message.timestamp && !isNaN(message.timestamp.getTime()) 
            ? message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
            : new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
          }
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
