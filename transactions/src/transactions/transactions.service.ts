import { Inject, Injectable, Logger } from "@nestjs/common";
import { CARDSIZE, PENDING, TRANSFER } from "./constants/constants";
import { CreateTransaction, CreatedTransaction, EmitTransactionToValidation, IncomingTransaction } from "./dto/transactions.dto";
import TransactionsRepository from "./transactions.repository";
import { ClientKafka } from "@nestjs/microservices";

@Injectable()
export default class TransactionService {
    private logger:Logger;

    constructor(
        @Inject('ANTI-FRAUD-VALIDATED') private readonly antiFraudClient: ClientKafka,
        private readonly transactionRepository: TransactionsRepository){
        this.logger = new Logger(TransactionService.name)
    }

    public async getAllTransactions(): Promise<CreatedTransaction[]> {
        return await this.transactionRepository.getAll();
    }

    public async createTransaction(data: IncomingTransaction):Promise<any> {
        try {
            const createTransaction: CreateTransaction = new CreateTransaction();
            createTransaction.account_external_id_credit = data.accountExternalIdCredit
            createTransaction.account_external_id_debit = data.accountExternalIdDebit
            createTransaction.created_At = Date();
            createTransaction.transactionType = TRANSFER;
            createTransaction.transaction_status = PENDING;
            createTransaction.values = data.values;
            createTransaction.transaction_external_id = await this.makeid(CARDSIZE);
            createTransaction.modified_At = null;

            const savedTransaction: CreatedTransaction = await this.transactionRepository.create(createTransaction);
            const emitTransaction: EmitTransactionToValidation = {
                values: savedTransaction.values,
                transaction_external_id: savedTransaction.transaction_external_id,
                id: savedTransaction.id
            }

            return emitTransaction;

        } catch (e) {
            this.logger.error(e)
            return e
        }
    }

    public emitEventToKafkaTopic(topic: string, data: any){
        this.antiFraudClient.emit(topic, data)
    }


    /**
     * 
     * This is only a way to generate some random value
     */
    private async makeid(length: number): Promise<string> {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        return result;
    }
}