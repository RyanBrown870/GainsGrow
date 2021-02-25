const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const validatePassword = require('../utils/passwordUtils').validatePassword;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const keys = require('../config/dev');

const User = require('../models/User');

// Passport Jwt

// Tell passport-jwt to extract the token from request header
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.jwtSecret,
  algorithms: ['RS256'],
};

const jwtAuthStrategy = new JwtStrategy(options, async (payload, done) => {
  // grab user id from jwt payload
  try {
    const user = await User.findOne({ _id: payload.sub });

    if (user) {
      return done(null, user);
    } else {
      return done(null, false, { message: 'User not found' });
    }
  } catch (err) {
    done(err, null);
  }
});

passport.use(jwtAuthStrategy);

// Passport Local

const customFields = {
  usernameField: 'uname',
  passwordField: 'pw',
};

const verifyCallback = async (username, password, done) => {
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }

    const isValid = validatePassword(password, user.hash, user.salt);

    if (isValid) {
      return done(null, user);
    } else {
      return done(null, false, { message: 'Incorrect password.' });
    }
  } catch (err) {
    done(err);
  }
};

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  User.findById(userId)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => done(err));
});
