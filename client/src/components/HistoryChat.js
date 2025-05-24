import React, { useEffect, useState } from 'react';

const HistoryChat = ({ userId, onSelectConversation }) => {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/conversations/${userId}`)
      .then(res => res.json())
      .then(data => setConversations(data));
  }, [userId]);

  return (
    <div style={{ padding: '20px' }}>
      <h3>Chat History</h3>
      <ul>
        {conversations.map(conv => (
          <li key={conv.conversation_id} style={{ marginBottom: '10px' }}>
            <button onClick={() => onSelectConversation(conv.conversation_id)}>
              Conversation ID: {conv.conversation_id} | Start: {conv.start_time} | Messages: {conv.Messages?.length || 0}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistoryChat;