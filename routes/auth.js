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
    let existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(400).json({ msg: 'This user is already registered.' });
    }

    // Pull out salt and hash from returned object. Password is on req.body
    const { salt, hash } = genPassword(req.body.pw);

    const { displayname, firstname, username, lastname } = req.body;

    // Build userFields object
    const userFields = {};
    if (displayname) userFields.displayname = displayname;
    if (username) userFields.username = username;
    if (firstname) userFields.firstname = firstname;
    if (lastname) userFields.lastname = lastname;
    if (salt) userFields.salt = salt;
    if (hash) userFields.hash = hash;

    const user = new User(userFields);

    await user.save();

    const jwtToken = genJwt(user.id);
    const { _id } = user;

    res.json({
      success: true,
      user: {
        _id,
        username,
        displayname,
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

  const { _id, username, displayname } = req.user;
  res.json({
    success: true,
    user: {
      _id,
      username,
      displayname,
    },
    token: jwtToken,
  });
});

module.exports = router;
