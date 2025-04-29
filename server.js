const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');


dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('pick_a_box_app', 'root', 'ChiefSossa#1', {
    host: '127.0.0.1',
    dialect: 'mysql',
});
sequelize.authenticate()
    .then(() => console.log('Database connected successfully!'))
    .catch((error) => console.error('Database connection error:', error));

// Middleware
app.use(bodyParser.json());

// Sample Route
app.get('/', (req, res) => {
res.send('Welcome to the Pick A Box App!');
});

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

const gameRoutes = require('./routes/game');
app.use('/game', gameRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

console.log(authRoutes);