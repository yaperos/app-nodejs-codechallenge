const { v4: uuidv4 } = require('uuid');
const { 
  createTransaction,
  updateTransactionStatus,
  getTransactionByTransactionExternalId } = require('../repository/transaction');
const { TRANSACTION_STATUSES, CURRENT_DATETIME } = require('../utils/constants');
const { sendTransaction } = require('../kafka/transaction/producer');

const save = async (req,res) => {
  try{
    const {
      accountExternalIdDebit,
      accountExternalIdCredit,
      tranferTypeId,
      value
    } = req.body;

    console.log(`req.body >>> ${req.body}`);

    const transactionExternalId = uuidv4();

    console.log(`uuidv4 >>> ${uuidv4()}`);

    const transactionStatusId = TRANSACTION_STATUSES.pending;
    const createdAt = CURRENT_DATETIME;
  
    const transaction = await createTransaction(transactionExternalId, accountExternalIdDebit, accountExternalIdCredit, tranferTypeId, transactionStatusId, value, createdAt);

    await sendTransaction(transaction);

    return res.status(200).json(transaction);
  }catch(e){
    return res.status(500).send({ message: e.message });
  }
   
}

const updateStatus = async (req,res) => {
  try{
    const { transactionExternalId ,transactionStatusId } = req.body;
  
    const transaction = await updateTransactionStatus(transactionExternalId, transactionStatusId);

    return res.status(200).json(transaction);
  }catch(e){
    return res.status(500).send({ message: e });
  }
  
}

const getByTransactionExternalId = async (req,res) => {

  try{
    const { transactionExternalId } = req.params;
  
    const transaction = await getTransactionByTransactionExternalId(transactionExternalId);

    return res.status(200).json(transaction);
  }catch(e){
    return res.status(500).send({ message: e });
  }
}

module.exports = {
	save,
  updateStatus,
  getByTransactionExternalId
}
