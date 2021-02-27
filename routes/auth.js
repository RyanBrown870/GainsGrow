const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const genPassword = require('../utils/passwordUtils').genPassword;
const genJwt = require('../utils/genJwt').genJwt;
const jwtAuth = require('../middleware/jwtAuth');

const User = require('../models/User');

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

    const jwtToken = genJwt(user.id);
    const { _id, username } = user;

    res.json({
      success: true,
      user: {
        _id,
        username,
      },
      token: jwtToken,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /login
// @desc    Login user route
// @access  Public
router.post('/login', passport.authenticate('local'), (req, res) => {
  const jwtToken = genJwt(req.user.id);

  const { _id, username } = req.user;
  res.json({
    success: true,
    user: {
      _id,
      username,
    },
    token: jwtToken,
  });
});

// Protected Test Route
router.get('/protected', jwtAuth, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.send(user);
});

module.exports = router;
