import { IRepository } from "../domain/repository"

class TransactionUpdate {
    constructor(
        private readonly repository: IRepository
    ) { }

    async run(id: string, stateId: number): Promise<boolean> {
        const { status, data, error } = await this.repository.transactionUpdate(id, stateId)
        if (!status) throw new Error(error);
        return true
    }
}

export {
    TransactionUpdate
}