import transactionModel, { ITransaction } from "../models/transactionModel";
import { currentDate } from "../utils/helpers";

class TransactionRepository {

    async save(data?: ITransaction) {
        const transaction = new transactionModel({
            ...data, createdAt: currentDate()
        });
        
        await transaction.save();

        return transaction;
    }

    async update(transactionId: string, status: string) {
        const event = await transactionModel.findOne({ 
            transactionExternalId: transactionId,
        });

        if (!event) return;

        await transactionModel.findOneAndUpdate(
            { transactionExternalId: transactionId }, { status }, {new: true}
        );
    }
}

export default new TransactionRepository;