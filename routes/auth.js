const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const users = require('../models/user');

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY || 'secret';

// Sign Up Route
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Please provide all required fields!'});
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const newUser = { username, password: hashedPassword };
    users.push(newUser);

    res.status(201).json({ message: 'User signed up successfully' });
});

// Login Route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = users.find((u) => u.username === username);
    if(!user) {
        return res.status(404).json({ message: 'User not found!' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials!'});
    }

    //Generate token
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1hr' });
    res.status(200).json({ message: 'Login successful!', token });
});

module.exports = router;