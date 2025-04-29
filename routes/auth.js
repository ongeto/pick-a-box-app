const { User } = require('../models');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY || 'secret';

// Sign Up Route
router.post('/signup', async (req, res) => {
    try {
        console.log('Request received:', req.body); // Log the incoming request

        const { username, password, phone } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Please provide all required fields!' });
        }

        console.log('Starting password hashing...');
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log('Saving user to database...');
        const newUser = await User.create({
            username,
            password: hashedPassword,
            phone,
        });

        console.log('User saved successfully:', newUser);
        res.status(201).json({ message: 'User signed up successfully!', user: newUser });
    } catch (error) {
        console.error('Error during signup:', error); // Log the actual error
        res.status(500).json({ message: 'Internal Server Error', error });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        console.log('Login request received:', req.body); // Log incoming request

        const { username, password } = req.body;

        console.log('Looking for user in the database...');
        const user = await User.findOne({ where: { username } });
        if (!user) {
            console.log('User not found!');
            return res.status(404).json({ message: 'User not found!' });
        }

        console.log('Comparing passwords...');
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log('Invalid password!');
            return res.status(401).json({ message: 'Invalid credentials!' });
        }

        console.log('Generating token...');
        const token = jwt.sign({ username }, process.env.SECRET_KEY || 'secret', { expiresIn: '1h' });

        console.log('Login successful!');
        res.status(200).json({ message: 'Login successful!', token });
    } catch (error) {
        console.error('Error during login:', error); // Log the error
        res.status(500).json({ message: 'Internal Server Error', error });
    }
});

module.exports = router;