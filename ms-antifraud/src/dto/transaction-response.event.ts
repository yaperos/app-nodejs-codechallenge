export class TransactionReponse {
    constructor(
        public readonly id: string,
        public readonly isValid: boolean
    ) {}
}