require("dotenv").config({ path: ".env" });
 
const {sendTransactionAntiFraud} = require("../consumers/broker");

const {
  createTransaction,
  findTransactionById,
  findTransaction,
  updateStatusTransaction,
} = require("../services/transaction.services");

const Utils = require("../utils/formattResponse");

let result = {
  error: false,
  msg: "OK",
  count: 0,
  transaction: null,
};

//get all transactions Ok
const getTransaction = async (req,reply) => {
  try {
    const transaction = await findTransaction();

    if (transaction.length > 0) {
      let res = await Utils.formattResponse(transaction);
      result.transaction = res;
      result.msg = "List all transactions";
      result.count = transaction.length;
    }
    reply.code(200).send(result);
  } catch (err) {
    reply.status(500).send({ error: err });
  }
};

// interno
//get id transactions Ok
const getTransactionID = async (req, reply) => {
  try {
    const id = await req.params?.id;
    const transaction = await findTransactionById(id);
    let miArray = [];    

    transaction != null
      ? miArray.push(transaction)
      : reply.code(404).send({msg:`Transaction with transactionExternalId # ${id} not found`});

    if (!Utils.isEmptyArray(miArray)) {
      let res = await Utils.formattResponse(miArray);
      result.transaction = res;
      result.msg = `Get transaction with transactionExternalId # ${id} `;
      result.count = transaction.length;
    }
    reply.code(200).send(result);
  } catch (err) {
    return err;
  }
};

const createTransactionPost = async (req, reply) => {
  try {
    let id = await createTransaction(req.body);
    let data = {
      id:id.id,
      value:id.value
    }

    let response = await sendTransactionAntiFraud(data);
    if(!response.error && response.data) { 
         await updateStatusTransaction(response.data.transactionExternalId,response.data.status);
    } 
    let transaction = await findTransactionById(id.id);
    let miArray = [];
    
    transaction != null
      ? miArray.push(transaction)
      : reply.code(404).send(result);
    if (!Utils.isEmptyArray(miArray)) {
      let res = await Utils.formattResponse(miArray);
      result.transaction = res;
      result.msg = `Save Transaction with transactionExternalId # ${id.id}`;
    }

    reply.code(201).send(result);
  } catch (err) {
    console.error(err);
    return err;
  }
};

 
module.exports = {
  createTransactionPost,
  getTransaction,
  getTransactionID,
};
