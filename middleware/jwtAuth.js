const jwt = require('jsonwebtoken');
const keys = require('../config/dev');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');
  console.log('token', token);

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorisation denied' });
  }

  try {
    const verifiedToken = jwt.verify(token, keys.jwtSecret);
    console.log('verified', verifiedToken);
    req.user = verifiedToken.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
