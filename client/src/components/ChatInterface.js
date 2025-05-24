import React, { useState, useRef, useEffect } from 'react';
import { FaMicrophone, FaPlay, FaStop } from 'react-icons/fa';
// Removed unused import: getChatHistory
import { sendMessage } from '../services/api';
import { initializeSpeechRecognition, initializeSpeechSynthesis } from '../utils/speechUtils';
import './ChatInterface.css';

const ChatInterface = ({ userId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const [conversationId, setConversationId] = useState(null);

  const recognition = useRef(null);
  const synthesis = useRef(initializeSpeechSynthesis());

  useEffect(() => {
    recognition.current = initializeSpeechRecognition();
    if (recognition.current) {
      recognition.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        setInputText(transcript);
      };

      recognition.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      setIsSpeechSupported(true);
    }
  }, []);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const newMessage = {
      text: inputText,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Save user message to backend
      if (conversationId) {
        await fetch('http://localhost:5000/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            conversation_id: conversationId,
            sender: 'user',
            content: inputText
          })
        });
      }

      const { message } = await sendMessage(inputText);

      const aiMessage = {
        text: message,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, aiMessage]);

      // Save AI message to backend
      if (conversationId) {
        await fetch('http://localhost:5000/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            conversation_id: conversationId,
            sender: 'ai',
            content: message
          })
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        text: "I'm having trouble processing your request. Please try again.",
        sender: 'ai',
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = () => {
    if (recognition.current) {
      recognition.current.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (recognition.current) {
      recognition.current.stop();
      setIsRecording(false);
    }
  };

  const playText = (text) => {
    if (synthesis.current) {
      setIsPlaying(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.onend = () => setIsPlaying(false);
      synthesis.current.speak(utterance);
    }
  };

  const startNewConversation = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });
      const result = await response.json();
      setConversationId(result.conversation_id);
      console.log('New conversation_id:', result.conversation_id); // Log the new conversation_id
      console.log('User ID:', userId); // (optional) Log userId if you want
    } catch (error) {
      console.error('Error starting new conversation:', error);
    }
  };

  const endConversation = async () => {
    if (!conversationId) return;
    try {
      const response = await fetch(`http://localhost:5000/api/conversations/${conversationId}/end`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        console.log('Conversation ended.');
        setConversationId(null); // Optionally reset conversationId
      } else {
        console.error('Failed to end conversation');
      }
    } catch (error) {
      console.error('Error ending conversation:', error);
    }
  };

  return (
    <div>
      <button onClick={startNewConversation}>Start New Conversation</button>
      <button onClick={endConversation} disabled={!conversationId}>End Conversation</button>
      {!isSpeechSupported && (
        <div className="warning">Speech recognition is not supported in your browser.</div>
      )}
      <div className="messages-container">
        {messages.map((message, index) => {
          return (
            <div key={index} className={`message ${message.sender}`}>
              <p>{message.text}</p>
              <button
                onClick={() => playText(message.text)}
                disabled={isPlaying}
                className="play-button"
              >
                {isPlaying ? <FaStop /> : <FaPlay />}
              </button>
            </div>
          );
        })}
      </div>

      <div className="input-container">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (inputText.trim() && !isLoading) {
                handleSend();
              }
            }
          }}
          placeholder="Type or speak your message..."
          disabled={isLoading}
        />
        <div className="button-group">
          <button
            className={`record-button ${isRecording ? 'recording' : ''}`}
            onClick={isRecording ? stopRecording : startRecording}
            disabled={!isSpeechSupported || isLoading}
          >
            <FaMicrophone />
          </button>
          <button
            className="send-button"
            onClick={handleSend}
            disabled={!inputText.trim() || isLoading}
          >
            {isLoading ? 'Thinking...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;

