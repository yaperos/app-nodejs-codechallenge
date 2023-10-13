const dotenv = require('dotenv');
dotenv.config({ path: './dev.env' });

const setupEnvConfig = () => {
  return process.env;
};

setupEnvConfig();
