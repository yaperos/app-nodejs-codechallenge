require("dotenv").config({ path: ".env" });

const {STATUS_TRANSACTION,TYPE_TRANSACTION,STATUS_ID_TRANSACTION} = require("../config/constants.config");
const Transaction = require("../models/transaction.model");   
const LimitValue = require("../data/validate.data");
 

let result = {
  error: false,
  msg: "OK",
  count: 0,
  data: null,
};

let res = {
  transactionExternalId: "",
  transactionType: {
    name: ""
  },
  transactionStatus: {
    name: ""
  },
  value: 0,
  createdAt:""  
}

//get all transactions
const getTransaction = async (req, reply) => {
  try {
    const transaction = await prisma.Transaction.findMany();
   
    if(transaction.length > 0 ){
    let res = await formattResponse(transaction);
     
      result.data = res;
      result.msg = "List all transactions";
      result.count = transaction.length;
    }

    reply.code(200).send(result);
  } catch (err) {
    reply.status(500).send({ error: err })
  }
};


//get all transactions
const getTransactionbyId = async (id) => {
  try {
    const transaction =  await Transaction.find({
      _id: id,
    }).sort({ index: 1 });
console.log("getTransactionbyId",transaction)
    return transaction;
 
  } catch (err) {
    reply.status(500).send({ error: err })
  }
};
 

const getTransactionStatus = async (req, reply) => {  
  
  const status = req.query?.status.toUpperCase()  || "PENDING";
 
  try {    
    
 console.log("asd------------",status)
    const transaction = await Transaction.find({
      tranferStatusId: 1,
    }).sort({ index: 1 });


      if(transaction.length > 0 ){
              result.data = transaction;
              result.msg = "List all transactions";
              result.count = transaction.length;
        }else{
          result.data = [];
          result.msg = "No transactions found";
        }

   
    reply.code(200).send(result);
  } catch (err) {
    reply.status(500).send({ error: err })
  }  
};
 
const createTransaction = async (req, reply) => {
 
  try {
  
    const data = new Transaction({
      accountExternalIdDebit:req.body.accountExternalIdDebit,
      accountExternalIdCredit: req.body.accountExternalIdCredit,
      tranferTypeId: req.body.tranferTypeId,
      value : req.body.value,
      tranferStatusId : 1
    });
     
    let id = await data.save();
    console.log("create Transaction",id);   
    let result =  await sendTransactionAntiFraud(data.value);
  
     result ?  await updateTransactionStatus(id._id,STATUS_TRANSACTION.APPROVED) :  await updateTransactionStatus(id._id,STATUS_TRANSACTION.REJECTED)
      console.log("----id----",id._id);
     let transaction =  await  getTransactionbyId(id._id );

     let res = await formattResponse(transaction);
     if(res){
      result.data = res;
      result.msg = "Save Transaction"; }
   
    reply.code(200).send({ result });
  } catch (err) {
    console.error(err);
    reply.status(500).send({ error: err })
  }
}; 

    
const updateTransactionStatus = async (id, tranferStatusId) => {
  try {    
    console.log("updateTransactionStatus",id);
    console.log("updateTransactionStatus---",tranferStatusId);
    await Transaction.findOneAndUpdate({ _id: id }, { tranferStatusId: tranferStatusId }); 
  } catch (err) {
    throw boom.boomify(err);
  }
};

  const sendTransactionAntiFraud = async (value) => {
  try {
      console.log("sendTransactionAntiFraud",value);
     return await LimitValue.LimitedTransaction(value);
         
  } catch (err) {
    throw boom.boomify(err);
  }
};


const formattResponse = async (transaction) => { 
let data_f = Array(); 
let status;
for (let i = 0; i < transaction.length; i++) {
 
/* transaction.for((resultado) =>  {  */
  switch (transaction[i].tranferStatusId){
    case 1:
    status = STATUS_ID_TRANSACTION[1];
    break;
    case 2:
    status = STATUS_ID_TRANSACTION[2];
    break;
    case 3:
    status = STATUS_ID_TRANSACTION[3];
    break;
  }
 
  const result =  {
      transactionExternalId: transaction[i]._id,
      transactionType: {
        name: transaction[i].tranferTypeId == 1 ?  TYPE_TRANSACTION.SEND : TYPE_TRANSACTION.REQUEST
      },
      transactionStatus: {
        name: status
      },
      value: transaction[i].value,
      createdAt: transaction[i].createdAt,
    }
    data_f.push(result);
  } 
  return data_f;
}
 
module.exports = {
  createTransaction,
  getTransaction,
  getTransactionStatus
};
