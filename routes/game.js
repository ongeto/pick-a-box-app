const express = require('express');
const { User } = require('../models');
const { Transaction } = require('../models');
const router = express.Router();

// Constants for game configuration
const MAX_BOX_NUMBER = 7;
const WIN_PROBABILITY = 0.3;
const MIN_PRIZE = 100;
const MAX_PRIZE = 5000;

router.post('/play', async (req, res) => {
    try {
        const { userId, boxSelected } = req.body;

        // Validate user input
        if (
            !userId ||
            !boxSelected ||
            typeof boxSelected !== 'number' ||
            boxSelected < 1 ||
            boxSelected > MAX_BOX_NUMBER
        ) {
            return res.status(400).json({ message: 'Invalid box selection!' });
        }

        // Determine the game outcome
        const isWinner = Math.random() < WIN_PROBABILITY; // 30% chance to win
        const prizeAmount = isWinner
            ? Math.floor(Math.random() * (MAX_PRIZE - MIN_PRIZE + 1) + MIN_PRIZE)
            : 0; // Random prize

        // Save transaction to the database
        const newTransaction = await Transaction.create({
            userId,
            boxSelected,
            isWinner,
            prizeAmount,
        });

        // Send response to the user
        const message = isWinner
            ? `Congratulations! You won Ksh ${prizeAmount}.`
            : 'Sorry, better luck next time!';
        res.status(200).json({ message, transaction: newTransaction });
    } catch (error) {
        console.error('Error during gameplay:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;


