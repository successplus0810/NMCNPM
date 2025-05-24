const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const Message = require('../models/Message'); // Add this line

// Create a new conversation
router.post('/', async (req, res) => {
  const { userId } = req.body; // Ensure userId is extracted from the request body

  // Log the request body to verify userId
  console.log('Request Body:', req.body);

  // Check if userId is provided
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    const newConversation = await Conversation.create({ user_id: userId });
    res.status(201).json({ conversation_id: newConversation.conversation_id });
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ error: 'Failed to create conversation.' });
  }
});

// Get all conversations for a user (with messages)
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const conversations = await Conversation.findAll({
      where: { user_id: userId },
      include: [{ model: Message }]
    });
    res.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations.' });
  }
});

// End a conversation (update end_time)
router.put('/:conversationId/end', async (req, res) => {
  const { conversationId } = req.params;
  try {
    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    conversation.end_time = new Date();
    await conversation.save();
    res.json({ message: 'Conversation ended', conversation });
  } catch (error) {
    console.error('Error ending conversation:', error);
    res.status(500).json({ error: 'Failed to end conversation.' });
  }
});

module.exports = router;