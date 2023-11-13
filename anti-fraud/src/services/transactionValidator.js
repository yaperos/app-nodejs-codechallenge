const validateTransaction = async (transaction) => {
    try {
      if (transaction.amount > 1000) {
        return { status: 'rejected' };
      }
      return { status: 'approved' };
    } catch (error) {
     throw new Error(error) 
    }
  };
  
  module.exports = validateTransaction;
  