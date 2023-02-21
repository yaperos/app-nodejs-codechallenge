require("dotenv").config({ path: ".env" });

const {
  STATUS_TRANSACTION
} = require("../config/constants.config");
  
 
const {
   createTransaction,
   findTransactionById,
   findTransaction,
   updateStatusTransaction
  } = require("../services/transaction.services");
 

const Utils = require("../utils/formattResponse");
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
     let res = await Utils.formattResponse(transaction);     
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
    const id = await req.params?.id;
    const transaction = await findTransactionById(id); 
    let miArray = []; 
    result.msg = `Transaction with transactionExternalId # ${id} not found`  
   
    transaction != null  ?  miArray.push(transaction) :  reply.code(404).send(result); 
      
   if (!Utils.isEmptyArray(miArray)) {
      let res = await Utils.formattResponse(miArray);     
       result.data = res; 
       result.msg =`Get Transaction transactionExternalId # ${id} `
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
  return err
  }
}; 

 

  const sendTransactionAntiFraud = async (value) => {
  try {     
     return await LimitValue.LimitedTransaction(value);         
  } catch (err) {
  return err
  }
};
 

module.exports = {
  createTransactionPost,
  getTransaction, 
  getTransactionID
};
