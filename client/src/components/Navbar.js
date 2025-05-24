import React from 'react';

const Navbar = ({ onHome, onHistory, onChat, activePage }) => (
  <nav style={{ padding: '10px', background: '#eee', marginBottom: '20px', display: 'flex', gap: '10px' }}>
    <button
      onClick={onHome}
      style={{
        backgroundColor: activePage === 'home' ? '#007bff' : '',
        color: activePage === 'home' ? '#fff' : '',
        border: 'none',
        borderRadius: '4px',
        padding: '8px 16px',
        cursor: 'pointer'
      }}
    >
      Home
    </button>
    <button
      onClick={onHistory}
      style={{
        backgroundColor: activePage === 'history' ? '#007bff' : '',
        color: activePage === 'history' ? '#fff' : '',
        border: 'none',
        borderRadius: '4px',
        padding: '8px 16px',
        cursor: 'pointer'
      }}
    >
      History Chat
    </button>
    <button
      onClick={onChat}
      style={{
        backgroundColor: activePage === 'chat' ? '#007bff' : '',
        color: activePage === 'chat' ? '#fff' : '',
        border: 'none',
        borderRadius: '4px',
        padding: '8px 16px',
        cursor: 'pointer'
      }}
    >
      Chat with Gemini
    </button>
  </nav>
);

export default Navbar;