import Transaction from "../models/transaction";

class TransactionRepository {
    async get(transactionId: string) {
        const transaction = await Transaction.findOne({
            attributes: [
                "transactionExternalId",
                "accountExternalIdDebit",
                "accountExternalIdCredit",
                "tranferTypeId",
                "status",
                "value",
                "createdAt"
            ], 
            where: {
                transactionExternalId: transactionId
            },
            raw: true
        });

        return transaction
    }

    async all() {
        return await Transaction.findAll({ limit: 10, order:[['createdAt', 'DESC']], raw: true });
    }
}

export default new TransactionRepository;