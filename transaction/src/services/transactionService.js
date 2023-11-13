const {models} = require('./../models/index')
const TransactionModel = models.Transaction;

const TransactionService = {
    async update(status, id){
       return  TransactionModel.update({transactionStatus: status},{where:{id}})
    },

    async get(id){
        return TransactionModel.findOne({where:{id:id}})
    }
}

module.exports = {TransactionService}