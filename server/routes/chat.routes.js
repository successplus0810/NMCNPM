const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');

router.post('/message', chatController.processMessage);
router.get('/history', chatController.getHistory);

module.exports = router;