const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwtAuth = require('../middleware/jwtAuth');
const keys = require('../config/dev');

const Profile = require('../models/Profile');
const User = require('../models/User');

// @route     POST api/profile
// @desc      Create or update profile
// @access    Private
router.post('/', jwtAuth, async (req, res) => {
  // Pull out profile variables from request body
  const {
    height,
    weight,
    bodyfat,
    bmi,
    chest,
    waist,
    bicep,
    bio,
    location,
    twitter,
    facebook,
    instagram,
  } = req.body;

  // Build profileFields object
  const profileFields = {};
  profileFields.user = req.user.id;
  if (bio) profileFields.bio = bio;
  if (location) profileFields.location = location;

  // Build measurements object
  profileFields.measurements = {};
  if (height) profileFields.measurements.height = height;
  if (weight) profileFields.measurements.weight = weight;
  if (bodyfat) profileFields.measurements.bodyfat = bodyfat;
  if (bmi) profileFields.measurements.bmi = bmi;
  if (chest) profileFields.measurements.chest = chest;
  if (waist) profileFields.measurements.waist = waist;
  if (bicep) profileFields.measurements.bicep = bicep;

  // Build socials object
  profileFields.social = {};
  if (twitter) profileFields.social.twitter = twitter;
  if (facebook) profileFields.social.facebook = facebook;
  if (instagram) profileFields.social.instagram = instagram;

  try {
    // Check profile exists
    let profile = await Profile.findOne({ user: req.user.id });
    if (profile) {
      console.log('User exists');
    }

    // No profile, create a profile
    profile = new Profile(profileFields);
    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
