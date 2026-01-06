export interface IValidateTransactionUseCase {
    execute(
        transactionId: string,
        value: number,
        accountExternalIdDebit: string,
        accountExternalIdCredit: string,
        transferTypeId: number,
        createdAt: Date,
        metadata: { correlationId: string; causationId: string; service: string },
    ): Promise<void>;
}

export const VALIDATE_TRANSACTION_USE_CASE = 'VALIDATE_TRANSACTION_USE_CASE';
