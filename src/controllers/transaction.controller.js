require("dotenv").config({ path: ".env" });

const {
  STATUS_TRANSACTION,
  TYPE_TRANSACTION,
  STATUS_ID_TRANSACTION
} = require("../config/constants.config");
  
 
const {
   createTransaction,
   findTransactionById,
   findTransaction,
   updateStatusTransaction
  } = require("../services/transaction.services");
 

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

//get all transactions Ok
const getTransaction = async (req, reply) => {
  try {
    const transaction = await findTransaction();
   
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


// interno
//get id transactions Ok
const getTransactionID = async (req, reply) => {
  try {
    const transaction = await findTransactionById(req.params?.id); 
    var miArray = [];
     miArray.push(transaction);  
 
      let res = await formattResponse(miArray);     
       result.data = res;
       result.msg = "get transactions";
       result.count = transaction.length;
       
     reply.code(200).send(result); 
  } catch (err) {
   return err
  }
};
 
 
 
const createTransactionPost = async (req, reply) => { 
  try {  
     
    let id = await createTransaction(req.body);
    console.log("create Transaction ---1---",id);   
    let result =  await sendTransactionAntiFraud(req.body?.value);
    
     result ?  await updateStatusTransaction(id.id,STATUS_TRANSACTION.APPROVED) :  await updateStatusTransaction(id.id,STATUS_TRANSACTION.REJECTED)
     
     let transaction = await findTransactionById(id.id); 
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

 

  const sendTransactionAntiFraud = async (value) => {
  try {     
     return await LimitValue.LimitedTransaction(value);         
  } catch (err) {
   return err
  }
};


const formattResponse = async (transaction) => { 
   
let data_f = Array(); 
let status;  
 transaction.forEach((resultado) =>  {   
  switch (resultado.tranferStatusId){
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
      transactionExternalId: resultado.id,
      transactionType: {
        name: resultado.tranferTypeId == 1 ?  TYPE_TRANSACTION.SEND : TYPE_TRANSACTION.REQUEST
      },
      transactionStatus: {
        name: status
      },
      value: resultado.value,
      createdAt: resultado.createdAt,
    }
    data_f.push(result);
  });  
  return data_f;
}
 

module.exports = {
  createTransactionPost,
  getTransaction, 
  getTransactionID
};
