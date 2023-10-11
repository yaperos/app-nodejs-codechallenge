
export class GetAntifraudRequest {
    constructor(
        public readonly value: number,
        public readonly transactionStatus: string
    ) { }
    toString() {
        return JSON.stringify({
            value: this.value,
            transactionStatus: this.transactionStatus
        })
    }
}

