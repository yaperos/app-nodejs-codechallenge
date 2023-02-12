import {Injectable} from "@nestjs/common";
import {CreateTransactionDto, TransactionStatus} from "./dtos";

@Injectable()
export class AppService {
    validateTransaction(transaction: CreateTransactionDto) {
        console.log('llego a la validacion en el ms');
        const limitValue = 1000;

        if (transaction.value > limitValue) return { id: transaction.id, status: TransactionStatus.REJECTED }

        return { id: transaction.id, status: TransactionStatus.APPROVED }
    }
}
