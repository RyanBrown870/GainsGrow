const jwt = require('jsonwebtoken');
const keys = require('../config/dev');

function genJwt(user) {
  const payload = {
    sub: user.id,
    iat: Date.now(),
  };

  const token = jwt.sign(payload, keys.jwtSecret, {
    expiresIn: '1d',
  });

  return {
    token: 'Bearer ' + token,
    expires: '1d',
  };
}

module.exports.genJwt = genJwt;
