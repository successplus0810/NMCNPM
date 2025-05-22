const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const processMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
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

Choose one option or ask another question!` }]
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
    res.json({ message: response.text() });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Add this function
const getHistory = async (req, res) => {
  try {
    // For now, return empty array until we implement database
    res.json({ messages: [] });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  processMessage,
  getHistory  // Export both functions
};