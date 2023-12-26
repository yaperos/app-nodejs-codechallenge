
import { TransactionDto } from "../models/dto/transaction.dto";


export interface IOrmTransactionRepository {
    
    /* The `saveUser` method is a function that takes a `userDto` object of type `UserDto` as a
    parameter and returns a `Promise` that resolves to a `UserDto` object. This method is likely
    used to save a user's data to a database or some other form of persistent storage. */
    saveTransaction(transaction: TransactionDto): Promise<TransactionDto>;
}