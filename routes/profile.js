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
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );
      return res.json(profile);
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

// @route     GET api/profile/me
// @desc      Get user's profile
// @access    Private
router.get('/me', jwtAuth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['username', 'displayname']);

    if (!profile) {
      res.status(400).send('No profile found for this user');
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route     DELETE api/profile
// @desc      Delete user and the profile
// @access    Private
router.delete('/', jwtAuth, async (req, res) => {
  try {
    await Profile.findOneAndRemove({ user: req.user.id });

    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'User and profile deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route     PUT api/profile/measurements
// @desc      Update profile measurements
// @access    Private
router.put('/measurements', jwtAuth, async (req, res) => {
  const { height, weight, bodyfat, bmi, chest, waist, bicep } = req.body;
  const measurementsFields = {};

  if (height) measurementsFields.height = height;
  if (weight) measurementsFields.weight = weight;
  if (bodyfat) measurementsFields.bodyfat = bodyfat;
  if (bmi) measurementsFields.bmi = bmi;
  if (chest) measurementsFields.chest = chest;
  if (waist) measurementsFields.waist = waist;
  if (bicep) measurementsFields.bicep = bicep;

  try {
    const profile = await Profile.findOne({ user: req.user.id });
    console.log('profile', profile);
    console.log('user id', req.user.id);
    if (!profile) {
      return res.status(400).json({ msg: 'Profile not found for this user' });
    }
    profile.measurements.unshift(measurementsFields);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
