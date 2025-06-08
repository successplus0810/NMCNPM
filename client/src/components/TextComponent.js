import React, { useState } from 'react';
import axios from 'axios';

const TextComponent = ({ text }) => {
  const [wordInfo, setWordInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleWordClick = async (word) => {
    setLoading(true);
    setWordInfo(null);
    const cleanedWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"").toLowerCase();

    try {
      if (!cleanedWord) {
        setLoading(false);
        return;
      }
      
      const response = await axios.get(`/api/vocabulary?word=${cleanedWord}`);
      setWordInfo(response.data);
    } catch (error) {
      console.error('Error fetching word info:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setWordInfo({ error: error.response.data.error });
      } else {
        setWordInfo({ error: `Request failed for "${cleanedWord}". Please check your network connection.` });
      }
    } finally {
      setLoading(false);
    }
  };

  const playAudio = (audioUrl) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(e => console.error("Error playing audio:", e));
    }
  };

  const renderText = () => {
    return text.split(/(\s+)/).map((word, index) => {
      if (word.trim() === '') {
        return <span key={index}>{word}</span>;
      }
      return (
        <span key={index} onClick={() => handleWordClick(word)} style={{ cursor: 'pointer', color: 'blue' }}>
          {word}
        </span>
      );
    });
  };

  return (
    <div>
      <p>{renderText()}</p>
      {loading && <p>Loading...</p>}
      {wordInfo && !loading && (
        <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px', borderRadius: '5px', position: 'relative' }}>
          <button 
            onClick={() => setWordInfo(null)}
            style={{ position: 'absolute', top: '5px', right: '10px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', padding: '0', lineHeight: '1' }}
            aria-label="Close"
          >
            &times;
          </button>
          <h4>Word Information:</h4>
          {wordInfo.error && <p style={{ color: 'red' }}>{wordInfo.error}</p>}
          {wordInfo.meaning && Array.isArray(wordInfo.meaning) && (
            <div>
              <strong>Meaning:</strong>
              {wordInfo.meaning.map((m, i) => (
                <div key={i} style={{ marginLeft: '10px' }}>
                  <p><em>{m.partOfSpeech}</em></p>
                  <ul>
                    {m.definitions.map((def, j) => (
                      <li key={j}>
                        {def.definition}
                        {def.example && <p style={{ color: '#555', fontStyle: 'italic', margin: '5px 0 0 10px' }}>Example: {def.example}</p>}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          {wordInfo.pronunciation && Array.isArray(wordInfo.pronunciation) && wordInfo.pronunciation.length > 0 &&
            (() => {
              const phoneticWithText = wordInfo.pronunciation.find(p => p.text);
              const phoneticWithAudio = wordInfo.pronunciation.find(p => p.audio);
              if (!phoneticWithText) return null;

              return (
                <div>
                  <strong>Pronunciation:</strong> {phoneticWithText.text}
                  {phoneticWithAudio && (
                    <button 
                      onClick={() => playAudio(phoneticWithAudio.audio)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: '10px', fontSize: '1.2rem' }}
                      aria-label="Play pronunciation"
                    >
                      🔊
                    </button>
                  )}
                </div>
              );
            })()
          }
          {wordInfo.translation && (
            <p><strong>Translation:</strong> {wordInfo.translation}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TextComponent;