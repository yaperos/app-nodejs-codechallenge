export class PoisonMessageError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "PoisonMessageError"
    }
}