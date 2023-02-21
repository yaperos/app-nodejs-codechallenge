 
 const prisma = require('../prisma')
 const {
  STATUS_TRANSACTION
} = require("../config/constants.config");


  async  function createTransaction(input){
      
    const transaction = await prisma.transactions.create({
        data : {
        accountExternalIdDebit:input.accountExternalIdDebit,
        accountExternalIdCredit: input.accountExternalIdCredit,
        tranferTypeId: input.tranferTypeId,
        value : input.value,
        tranferStatusId : STATUS_TRANSACTION.PENDING
      }     
    });
 
  return transaction;
}

  async function findTransactionById(id) {
    return prisma.Transactions.findUnique({
      where: {
        id :id,
      },
    });
}


async function findTransaction() {
  return prisma.Transactions.findMany();
}

async function updateStatusTransaction(id, status) {  
   await prisma.transactions.update({
    where: {
      id:id
    },
      data: {
        tranferStatusId: status
    },
  });
}

module.exports = {
  findTransaction,
  findTransactionById,
  createTransaction,
  updateStatusTransaction
};
