const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  hash: String,
  salt: String,
});

module.exports = User = mongoose.model('user', userSchema);
