const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Assuming you have a User model

// Registration endpoint
router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  try {
    // Create a new user
    const newUser = await User.create({ username, password, email });
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user.' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Find the user by username
    const user = await User.findOne({ where: { username } });
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
    // If credentials are valid
    res.json({
      success: true,
      userId: user.user_id, // Make sure this is the correct field from your DB
      message: "Login successful"
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Invalid credentials"
    });
  }
}); // <-- This closes the router.post

module.exports = router;