import React, { useState, useRef, useEffect } from 'react';  // Changed to explicitly import hooks
import { FaMicrophone, FaPlay, FaStop } from 'react-icons/fa';
import { GoogleGenerativeAI } from "@google/generative-ai";
import './ChatInterface.css';

const ChatInterface = () => {
  const [isLoading, setIsLoading] = React.useState(false); 
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);

  const recognition = useRef(null);
  const synthesis = useRef(window.speechSynthesis);
  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      recognition.current.lang = 'en-US';

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

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const newMessage = {
      text: inputText,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText(''); // Clear input after sending

    try {
      const response = await getResponse(inputText);
      const aiMessage = {
        text: response,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting response:', error);
      // Consider adding a user-friendly error message to the messages state
      setMessages(prev => [...prev, {
        text: "I'm having trouble processing your request. Please try again.",
        sender: 'ai',
        timestamp: new Date().toISOString(),
      }]);

    } finally {
      setIsLoading(false);
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

  const getResponse = async (text) => {
    try {
      setIsLoading(true);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });  // Changed method name and model

      const result = await model.generateContent({
        contents: [
          {
            role: "model",
            parts: [{ text: `You are an English tutor. 
              
Format your analysis with one point per line, like this:

"Today" is an adverb of time.

"I" is the subject pronoun.

"wanna" is an informal contraction of "want to".

"go" is the main verb.

"to coffee store" is an adverbial phrase of place.

Please analyze the grammar using quotation marks instead of asterisks.
Use double line breaks between each point for clarity.

Keep your responses concise and complete:
1. Prioritize essential grammar points
2. Use short, clear explanations
3. If response might exceed limit, focus on main points only
4. Ensure sentences are complete

After your analysis, add two line breaks and then:

Would you like to:
- Practice using this grammar point?
- Learn more about [related topic]?
- See examples of similar sentences?

Choose one option or ask another question!
If the user's message contains "show me examples" or similar requests, provide 3-4 example sentences using the same grammar structure. 

`
}]
          },
          {
            role: "user",
            parts: [{ text }]
          }
        ],
        generationConfig: {
          maxOutputTokens: 200,
          temperature: 0.4
        }
      });

      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error:', error);
      return "I apologize, but I'm having trouble. Could you try again?";
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="chat-container">
      <div className="app-title">
        English Teaching Assistant
      </div>
      {!isSpeechSupported && (
        <div className="warning">Speech recognition is not supported in your browser.</div>
      )}
      <div className="messages-container">
        {messages.map((message, index) => (
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
        ))}
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

