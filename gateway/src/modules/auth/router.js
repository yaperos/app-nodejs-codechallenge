const router = require('express').Router();

const { AuthController } = require('./controller');

router.post(
  '/',
  AuthController.generateToken,
);

module.exports.AuthRouter = router;
