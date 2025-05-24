import React, { useState } from 'react';
import ChatInterface from './ChatInterface';

const AuthForm = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [email, setEmail] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isRegistering) {
      if (password !== rePassword) {
        alert('Passwords do not match!');
        return;
      }
      // Registration logic
      try {
        const response = await fetch('http://localhost:5000/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password, email })
        });
        const result = await response.json();
        alert(result.message);
        setIsRegistering(false); // Switch back to login after registration
      } catch (error) {
        console.error('Error:', error);
        alert('Registration failed.');
      }
    } else {
      // Login logic
      try {
        const response = await fetch('http://localhost:5000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
        });
        const result = await response.json();
        if (result.success) {
          setUserId(result.userId); // Make sure your backend returns userId on login
          console.log('Logged in userId:', result.userId); // Log userId to console
          setIsAuthenticated(true);
        } else {
          alert('Login failed.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Login failed.');
      }
    }
  };

  if (isAuthenticated) {
    return <ChatInterface userId={userId} />;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form onSubmit={handleSubmit} style={{ width: '300px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ textAlign: 'center' }}>{isRegistering ? 'Register' : 'Login'}</h2>
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ width: '100%', marginBottom: '10px' }} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', marginBottom: '10px' }} />
        </label>
        <br />
        {isRegistering && (
          <>
            <label>
              Re-enter Password:
              <input type="password" value={rePassword} onChange={(e) => setRePassword(e.target.value)} required style={{ width: '100%', marginBottom: '10px' }} />
            </label>
            <br />
            <label>
              Email:
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', marginBottom: '10px' }} />
            </label>
            <br />
          </>
        )}
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {isRegistering ? 'Register' : 'Login'}
        </button>
        <br />
        <small style={{ display: 'block', textAlign: 'center', marginTop: '10px' }}>
          {isRegistering ? (
            <span onClick={() => setIsRegistering(false)} style={{ cursor: 'pointer', color: 'blue' }}>Already have an account? Login</span>
          ) : (
            <span onClick={() => setIsRegistering(true)} style={{ cursor: 'pointer', color: 'blue' }}>If you don't have an account, please Register</span>
          )}
        </small>
      </form>
    </div>
  );
};

export default AuthForm;