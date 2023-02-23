const axios = require("axios");

const respError = (err) => {
  return {
    error: true,
    status: err.status || err.response?.status || 400,
    msg:err.status || 'ERROR'
     
  };
};

const sendTransactionAntiFraud = async (data) => {  
    try {
        return await axios.post(
            process.env.BROKE_API_ENDPOINT + `/anti-fraud/validateTransaction`, data
          );
       
    } catch (err) {
      console.log(err);
      return respError(err);
    }
  };

  
module.exports = {
    sendTransactionAntiFraud 
  };