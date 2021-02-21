const express = require('express');
const connectDB = require('./config/db');
const passport = require('passport');
const crypto = require('crypto');

connectDB();

const app = express();

app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('API running');
});

// Define routes
app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('Server started on port', PORT));
