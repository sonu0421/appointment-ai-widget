import React from 'react';

const ChatMessage = ({ message }) => {
  // Function to render clickable links and formatted text in message text
  const renderMessageText = (text) => {
    // URL regex pattern
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    
    return text.split('\n').map((line, lineIndex) => {
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
                  return (
                    <a
                      key={partIndex}
                      href={part}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#007AFF',
                        textDecoration: 'underline',
                        wordBreak: 'break-all'
                      }}
                    >
                      {part}
                    </a>
                  );
                }
                
                // Handle bold text formatting
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
              return (
                <a
                  key={partIndex}
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#007AFF',
                    textDecoration: 'underline',
                    wordBreak: 'break-all'
                  }}
                >
                  {part}
                </a>
              );
            }
            
            // Handle bold text formatting
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
          {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
