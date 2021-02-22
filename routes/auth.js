const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const genPassword = require('../services/passwordUtils').genPassword;

const User = require('../models/User');

router.get('/', async (req, res) => {
  res.send('Auth route');
});

// @route   POST /register
// @desc    Regsiter new user route
// @access  Public
router.post('/register', async (req, res, next) => {
  try {
    let existingUser = await User.findOne({ username: req.body.uname });
    if (existingUser) {
      return res.status(400).json({ msg: 'This user is already registered.' });
    }

    // Pull out salt and hash from returned object. Password is on req.body
    const { salt, hash } = genPassword(req.body.pw);

    const user = new User({
      username: req.body.uname,
      hash,
      salt,
    });

    await user.save();
    console.log(user);

    res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /login
// @desc    Login user route
// @access  Public
router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: 'login-failure',
    successRedirect: 'login-success',
  })
);

// Successful login
router.get('/login-success', (req, res, next) => {
  res.json({ msg: 'You successfully logged in.' });
});

// Unsuccessful login
router.get('/login-failure', (req, res, next) => {
  res.status(400).json({ msg: 'Invalid credentials' });
});

module.exports = router;
