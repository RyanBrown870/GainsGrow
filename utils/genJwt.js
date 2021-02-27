const jwt = require('jsonwebtoken');
const keys = require('../config/dev');

function genJwt(id) {
  const payload = {
    user: {
      id: id,
    },
  };

  return jwt.sign(payload, keys.jwtSecret, {
    expiresIn: 360000,
  });
}

module.exports.genJwt = genJwt;
