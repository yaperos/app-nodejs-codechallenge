const { 
    TYPE_TRANSACTION,
    STATUS_ID_TRANSACTION
  } = require("../config/constants.config");
    
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
    
    function isEmptyArray(value) {
      return value == null || value.length === 0;
    };
  
  module.exports = { 
    formattResponse,
    isEmptyArray
  };
  