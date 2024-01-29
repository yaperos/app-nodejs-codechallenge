const jwt = require('jsonwebtoken');

const { ConfigEnv } = require('../../config');

const generateToken = (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).send('Email is required');
    }

    const token = jwt.sign({ email }, ConfigEnv.secretToken, { expiresIn: '60s' });
    res.status(200).send({ token });
  } catch (error) {
    next(error);
  }
};

module.exports.AuthController = {
  generateToken,
};
