const express = require('express');
const connectDB = require('./config/db');
const mongoose = require('mongoose');
const passport = require('passport');
const crypto = require('crypto');
const session = require('express-session');
const keys = require('./config/dev');

const MongoStore = require('connect-mongo').default;

require('./services/passport');

// Connect to Mongo DB
connectDB();

const app = express();

app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: true }));

// Express session middleware
app.use(
  session({
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
    resave: false,
    saveUninitialized: true,
    secret: keys.sessionSecret,
    store: MongoStore.create({
      mongoUrl: keys.mongoURI,
    }),
  })
);

// Passport middleware

app.use(passport.initialize());
app.use(passport.session());

// Test route
app.get('/', (req, res) => {
  res.send('API running');
});

// Define routes
app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('Server started on port', PORT));
