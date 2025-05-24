import React from 'react';
import AuthForm from './components/AuthForm';
// import ChatInterface from './components/ChatInterface';

const App = () => {
  return (
    <div>
      <AuthForm />
      {/* Render ChatInterface conditionally based on authentication status */}
    </div>
  );
};

export default App;