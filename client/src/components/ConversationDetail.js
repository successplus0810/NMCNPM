import React, { useEffect, useState } from 'react';

const ConversationDetail = ({ conversationId, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [conversationInfo, setConversationInfo] = useState(null);

  useEffect(() => {
    // Fetch conversation info (start_time, end_time)
    fetch(`http://localhost:5000/api/conversations/${conversationId}/info`)
      .then(res => res.json())
      .then(data => setConversationInfo(data));

    // Fetch messages
    fetch(`http://localhost:5000/api/messages/${conversationId}`)
      .then(res => res.json())
      .then(data => setMessages(data));
  }, [conversationId]);

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={onBack}>Back to History</button>
      <h3>
        Conversation {conversationId}
        {conversationInfo && (
          <> - {conversationInfo.start_time} - {conversationInfo.end_time || 'Ongoing'}</>
        )}
      </h3>
      <div className="messages-container">
        {messages.map((msg, idx) => (
          <div
            key={msg.message_id}
            className={`message ${msg.sender}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '10px'
            }}
          >
            <div
              style={{
                background: msg.sender === 'user' ? '#DCF8C6' : '#F1F0F0',
                borderRadius: '10px',
                padding: '8px 12px',
                maxWidth: '60%',
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              <b>{msg.sender === 'user' ? 'You' : 'Gemini'}:</b> {msg.content}
            </div>
            <span style={{ fontSize: '0.8em', color: '#888', marginTop: '2px' }}>
              {new Date(msg.timestamp).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationDetail;