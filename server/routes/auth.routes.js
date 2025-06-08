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
    
    // Check if user exists and password is correct
    if (!user || user.password !== password) {
      // Use a more specific error message for debugging, but a general one for production
      console.log(`Login attempt failed for user: ${username}. Reason: User not found or password incorrect.`);
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
    
    // If credentials are valid
    console.log(`Login successful for user: ${username}`);
    res.json({
      success: true,
      userId: user.user_id, // Make sure this is the correct field from your DB
      message: "Login successful"
    });
  } catch (error) {
    // Log the actual error on the server for debugging
    console.error('An error occurred during login:', error);
    
    // Send a generic error message to the client
    res.status(500).json({
      success: false,
      message: "An internal server error occurred. Please try again later."
    });
  }
});

module.exports = router;