const { VALUE_VALID } = require("../config/constants.config");

const LimitedTransaction = async (value) => {
  let flag = true;
  if (Number(value) > VALUE_VALID.VALUE) {
    flag = false;
  }
  return flag;
};

module.exports = {
  LimitedTransaction,
};
