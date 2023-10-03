export class ValidateTransaction {
    constructor(
        public readonly id: number,
        public readonly value: number,
        public readonly transaction_external_id: string,
    ){}

    toString() {
        return JSON.stringify({
            id: this.id,
            value: this.value,
            transaction_external_id: this.transaction_external_id
        })
    }
}