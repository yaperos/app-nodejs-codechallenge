const axios = require('axios');
const { kafkaConsumerEmitter } = require('./kafkaConsumer');

const createTransaction = async (transactionData) => {
  try {
    const response = await axios.post(`${process.env.TRANSACTION_SERVICE_BASE_URL}/transactions`, transactionData);
    let result = await new Promise((resolve, reject) => {
      kafkaConsumerEmitter.once('transactionUpdate', (transactionUpdate) => {
        if (transactionUpdate.id === response.data.id) {
          resolve(transactionUpdate);
        }
      });
    });
    return result
  } catch (error) {
    throw new Error(error);
  }
};

const getTransaction = async (id) => {
    try {
      const response = await axios.get(`${process.env.TRANSACTION_SERVICE_BASE_URL}/transactions/${id}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new Error('Transaction not found');
      } else {
        throw new Error(`Error retrieving transaction: ${error.message}`);
      }
    }
  };

  const getAllTransactions = async () => {
    try {
      const response = await axios.get(`${process.env.TRANSACTION_SERVICE_BASE_URL}/transactions/`);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  };
module.exports = {
  createTransaction,
  getTransaction,
  getAllTransactions
};
