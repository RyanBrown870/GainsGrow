const crypto = require('crypto');

const genPassword = (password) => {
  const salt = crypto.randomBytes(32).toString('hex');
  // 10000 iterations, 64 digits, sha512 is hashing function
  const genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');

  return {
    salt,
    hash: genHash,
  };
};

const validatePassword = (password, hash, salt) => {
  const verifyHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');
  // return boolean for hash vs DB_hash
  return hash === verifyHash;
};

module.exports.validatePassword = validatePassword;
module.exports.genPassword = genPassword;
