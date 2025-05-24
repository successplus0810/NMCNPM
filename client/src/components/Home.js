import React from 'react';

const Home = ({ onHistory, onChat }) => (
  <div style={{ textAlign: 'center', marginTop: '50px' }}>
    <h2>Welcome!</h2>
    <button onClick={onHistory} style={{ margin: '10px', padding: '10px 20px' }}>History Chat</button>
    <button onClick={onChat} style={{ margin: '10px', padding: '10px 20px' }}>Chat with Gemini</button>
  </div>
);

export default Home;