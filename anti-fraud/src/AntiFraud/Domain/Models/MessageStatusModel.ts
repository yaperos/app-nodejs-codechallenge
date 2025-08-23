
export class MessageStatusModel {
    constructor(
        public readonly transactionExternalId: string,
        public readonly status: string,
        public readonly reason?: string,
        public readonly validatedAt: Date = new Date()
    ) {}
}
