const User = require('../models/User');

const registerUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Create a new user
    const newUser = await User.create({ username, password, email });

    res.status(201).json({ message: 'User registered successfully!', user: newUser });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user.' });
  }
};

module.exports = {
  registerUser
};