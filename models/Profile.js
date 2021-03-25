const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  measurements: [
    {
      height: {
        type: String,
      },
      weight: {
        type: String,
      },
      bodyfat: {
        type: String,
      },
      bmi: {
        type: String,
      },
      chest: {
        type: String,
      },
      waist: {
        type: String,
      },
      bicep: {
        type: String,
      },
    },
  ],
  bio: {
    type: String,
  },
  location: {
    type: String,
  },
  social: {
    twitter: {
      type: String,
    },
    facebook: {
      type: String,
    },
    instagram: {
      type: String,
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
