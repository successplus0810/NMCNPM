const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const getWordInfo = async (req, res) => {
  const { word } = req.query;
  try {
    if (!word) {
      return res.status(400).json({ error: 'Word query parameter is required.' });
    }
    const dictionaryResponse = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

    if (!dictionaryResponse.data || dictionaryResponse.data.length === 0) {
      return res.status(404).json({ error: `Word not found in dictionary: "${word}"` });
    }
    
    // Microsoft Translator API Call
    const translatorKey = process.env.AZURE_TRANSLATOR_KEY;
    const translatorRegion = process.env.AZURE_TRANSLATOR_REGION;
    const endpoint = "https://api.cognitive.microsofttranslator.com";

    if (!translatorKey || !translatorRegion) {
      console.error('Azure Translator environment variables not set.');
      return res.status(500).json({ error: 'Translator service is not configured on the server.' });
    }

    const translationResponse = await axios({
      baseURL: endpoint,
      url: '/translate',
      method: 'post',
      headers: {
        'Ocp-Apim-Subscription-Key': translatorKey,
        'Ocp-Apim-Subscription-Region': translatorRegion,
        'Content-type': 'application/json',
        'X-ClientTraceId': uuidv4().toString()
      },
      params: {
        'api-version': '3.0',
        'from': 'en',
        'to': 'vi'
      },
      data: [{
        'text': word
      }],
      responseType: 'json'
    });

    const translatedText = translationResponse.data[0]?.translations[0]?.text;
    if (!translatedText) {
      throw new Error('Translation not found in Azure response.');
    }

    res.json({
      meaning: dictionaryResponse.data[0].meanings,
      pronunciation: dictionaryResponse.data[0].phonetics,
      translation: translatedText
    });
  } catch (error) {
    if (axios.isAxiosError && error.response?.status === 401) {
        console.error('Azure authentication failed. Check your API key and region in the .env file.');
        return res.status(401).json({ error: 'Translator service authentication failed.' });
    }
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ error: `Word not found: "${word}"` });
    }
    console.error('Error fetching word info:', error);
    if (error.isAxiosError) {
      console.error('Axios error details:', error.response?.data);
    }
    res.status(500).json({ error: `Failed to fetch information for "${word}".` });
  }
};

module.exports = { getWordInfo };