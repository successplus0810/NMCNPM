const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

let lastSentence = ""; // Variable to store the last sentence

const processMessage = async (req, res) => {
  try {
    const { text } = req.body;

    // Store the current sentence
    lastSentence = text;

    // Check if the input is a simple greeting
    const greetings = ["hello", "hi", "hey", "good morning", "hello gemini"];
    if (greetings.includes(text.toLowerCase().trim())) {
      return res.json({ message: "Hello there! How can I help you today?" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent({
      contents: [
        {
          role: "model",
          parts: [{ text: `You are a friendly and helpful English tutor.

After exchanging greetings, or if the user's input is not a simple greeting but a question, a sentence for analysis, or a request for translation, then you can help with:
- Answering questions about English.
- Translating words or phrases between English and Vietnamese.
- Analyzing English grammar.

When analyzing grammar (and only when appropriate, not for simple greetings):
Please format your analysis with one point per line, like this:
"Today" is an adverb of time.

"I" is the subject pronoun.

"wanna" is an informal contraction of "want to".

"go" is the main verb.

"to coffee store" is an adverbial phrase of place.

Please use quotation marks for the words or phrases being analyzed.
Use double line breaks between each point for clarity.

Keep your responses concise and complete:
1. Prioritize essential grammar points.
2. Use short, clear explanations.
3. If a response might exceed the limit, focus on the main points only.
4. Ensure sentences are complete.

After your analysis or answering a question, you can suggest follow-up actions like:
- Practicing a grammar point.
- Learning more about a related topic.
- Seeing examples of similar sentences.

Use lastSentence is ${lastSentence} to response to the user is they want to analyze grammar or ask a question.

Feel free to ask clarifying questions if needed. Let's make learning English fun and effective!` }]
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

// Use lastSentence for automatic analysis when needed
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