const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Get all messages for a conversation
router.get('/:conversationId', async (req, res) => {
  const { conversationId } = req.params;
  try {
    const messages = await Message.findAll({
      where: { conversation_id: conversationId },
      order: [['timestamp', 'ASC']]
    });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages.' });
  }
});

// Create a new message in a conversation
router.post('/', async (req, res) => {
  const { conversation_id, sender, content } = req.body;
  try {
    const newMessage = await Message.create({
      conversation_id,
      sender,
      content
    });
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Failed to create message.' });
  }
});

module.exports = router;