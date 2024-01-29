require('dotenv').config();

module.exports.ConfigEnv = {
  port: process.env.PORT || 3000,
  secretToken: process.env.TOKEN_SECRET,
};
