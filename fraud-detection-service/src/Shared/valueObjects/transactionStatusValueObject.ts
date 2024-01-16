
export class TransactionStatusValueObject {
    private value: string;

    constructor(status: string) {
        const validStatuses = ['approved', 'rejected'];
        if (!validStatuses.includes(status)) {
            throw new Error(`Invalid transaction status: ${status}`);
        }
        this.value = status;
    }

    toString(): string {
        return this.value;
    }
}
