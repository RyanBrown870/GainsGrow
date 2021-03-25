const express = require('express');
const connectDB = require('./config/db');
const mongoose = require('mongoose');
const passport = require('passport');
const crypto = require('crypto');
const keys = require('./config/dev');

require('./services/passport');

// Connect to Mongo DB
connectDB();

const app = express();

app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: true }));

// Passport middleware

app.use(passport.initialize());
app.use(passport.session());

// Test route
app.get('/', (req, res) => {
  res.send('API running');
});

// Define routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('Server started on port', PORT));
