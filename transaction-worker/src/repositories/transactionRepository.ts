import { randomUUID } from 'crypto';
import Transaction, { ITransaction } from "../models/transaction";
import { currentDate } from "../utils/helpers";

class TransactionRepository {

    async save(data?: ITransaction) {
        const transaction = await Transaction.create({
            ...data, transactionExternalId: randomUUID(), createdAt: currentDate()
        });
        
        return transaction.toJSON();
    }

    async update(transactionId: string, status: string) {
        const event = await Transaction.findOne({ 
            where: { transactionExternalId: transactionId }
        });

        if (!event) return;

        await Transaction.update({ status }, {
            where: { transactionExternalId: transactionId }
        });
    }
}

export default new TransactionRepository;