require("dotenv").config({ path: ".env" });
const { STATUS_TRANSACTION } = require("../config/constants.config");
 
const LimitValue = require("../data/validate.data");
 
const validateTransaction  = async (req, reply) => {
  try {
    
    let anti_fraud = await sendTransactionAntiFraud(req.body?.value);
    let data = {
      status :  anti_fraud ?  STATUS_TRANSACTION.APPROVED :  STATUS_TRANSACTION.REJECTED,
      transactionExternalId:req.body?.id
    }
    reply.code(200).send(data);
  } catch (err) {
    console.error(err);
    return err;
  }
};

const sendTransactionAntiFraud = async (value) => {
  try {
    return await LimitValue.LimitedTransaction(value);
  } catch (err) {
    return err;
  }
};

module.exports = {
  validateTransaction, 
};
