const API_URL = 'http://localhost:5000/api';

export const sendMessage = async (text) => {
  try {
    const response = await fetch(`${API_URL}/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getChatHistory = async () => {
  try {
    const response = await fetch(`${API_URL}/chat/history`);
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const fetchWordDetails = async (word) => {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (!response.ok) {
      throw new Error('Failed to fetch word details');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching word details:', error);
    return null;
  }
};