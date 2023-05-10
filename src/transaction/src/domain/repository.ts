import { IResponse, RequestDTO, Transaction } from "./entities"

export interface IRepository {
    transactionSave(payload: RequestDTO): Promise<IResponse<any>>
    transactionUpdate(id: string, stateId: number): Promise<IResponse<boolean>>
    transactionDetail(id: string): Promise<IResponse<Transaction>>
}