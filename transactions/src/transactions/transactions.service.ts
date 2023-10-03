import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientKafka, ClientProxy } from "@nestjs/microservices";
import { CARDSIZE, PENDING, TRANSACTION, TRANSFER } from "./constants/constants";
import { CreateTransaction, CreatedTransaction, EmitTransactionToValidation, IncomingTransaction } from "./dto/transactions.dto";
import TransactionsRepository from "./transactions.repository";
import { ValidateTransaction } from "./events/transactionEvent";

@Injectable()
export default class TransactionService {
    private logger:Logger;

    constructor(
        @Inject('TRANSACTION_SERVICE') private client: ClientKafka,
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
            createTransaction.value = data.value;
            createTransaction.transaction_external_id = await this.makeid(CARDSIZE);
            createTransaction.modified_At = null;

            const savedTransaction: CreatedTransaction = await this.transactionRepository.create(createTransaction);
            const emitTransaction: EmitTransactionToValidation = {
                value: savedTransaction.value,
                transaction_external_id: savedTransaction.transaction_external_id,
                id: savedTransaction.id
            }

            this.emitValidateTransaction(emitTransaction);
            return savedTransaction;

        } catch (e) {
            this.logger.error(e)
            return e
        }
    }

    public async emitValidateTransaction(data: EmitTransactionToValidation): Promise<void> {
        this.client.emit(TRANSACTION, new ValidateTransaction(data.id, data.value, data.transaction_external_id));
    }

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