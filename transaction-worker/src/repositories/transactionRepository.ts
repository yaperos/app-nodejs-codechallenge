import transactionModel, { ITransaction } from "../models/transactionModel";

class TransactionRepository {

    async save(data?: ITransaction) {
        const transaction = new transactionModel(data);

        await transaction.save();

        return transaction;
    }

    async update(transactionId: string, status: string) {
        const event = await transactionModel.findOne({ 
            transactionExternalId: transactionId,
        });

        if (!event) return;

        await transactionModel.findOneAndUpdate(
            {transactionExternalId: transactionId}, { status }, {new: true}
        );
    }
}

export default new TransactionRepository;