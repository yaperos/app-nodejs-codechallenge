import transactionModel from "../models/transactionModel";

class TransactionRepository {
    async get(transactionId: string) {
        const transaction = await transactionModel.findOne({ 
            transactionExternalId: transactionId,
        });

        return transaction
    }

    async all() {
        return await transactionModel.find({}, null, { limit: 10, sort: { createdAt: -1} });
    }
}

export default new TransactionRepository;