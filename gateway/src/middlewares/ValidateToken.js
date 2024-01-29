const jwt = require('jsonwebtoken');

const { ConfigEnv } = require('../config');

module.exports.ValidateToken = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).send('Access Denied: No token provided');
    }

    const verified = jwt.verify(token, ConfigEnv.secretToken);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send('Invalid Token');
  }
};
