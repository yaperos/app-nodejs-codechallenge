export interface ITransactionLogRepository {
    create(transaction: any, status: string): Promise<void>

}