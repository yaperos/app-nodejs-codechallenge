const { v4: uuidv4 } = require("uuid");

const generateTransactionId = () => {
  return uuidv4();
};

module.exports = generateTransactionId;
