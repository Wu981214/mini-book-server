const jwt = require('jsonwebtoken');

const getToken = (results) => {
  const token = jwt.sign({
    uID: results.userid
  }, 'minibook', { expiresIn: '1h' });
  return token;
}

module.exports = {
  getToken
}