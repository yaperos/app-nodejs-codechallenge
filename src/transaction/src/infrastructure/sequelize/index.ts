import { Sequelize } from "sequelize";
import { RequestDTO, IResponse, Transaction } from "../../domain/entities";
import { IRepository } from "../../domain/repository";
import { modelInit } from "./models";
import { StateModel } from "./models/State";
import { TransactionModel } from "./models/Transaction";


export class PostgreSQLRepository implements IRepository {

    constructor(){
        modelInit()
    }

    async transactionSave(payload: RequestDTO): Promise<IResponse<any>> {
        try {
            const record = await TransactionModel.create({
                accountExternalIdDebit: payload.accountExternalIdDebit,
                accountExternalIdCredit: payload.accountExternalIdCredit,
                tranferTypeId: payload.tranferTypeId,
                value: payload.value
            })
            return { status: true, data: record.dataValues }
        } catch (e: any) {
            console.log(e)
            return { status: false }
        }
    }

    async transactionUpdate(id: string, stateId: number): Promise<IResponse<boolean>> {
        try {
            await TransactionModel.update({ stateId: stateId }, {
                where: {
                    id: id
                }
            })
            return { status: true }
        } catch (e: any) {
            console.log(e)
            return { status: false }
        }
    }

    async transactionDetail(id: string): Promise<IResponse<Transaction>> {
        try {
            const record = await TransactionModel.findByPk(id,
                {
                    include: {
                        model: StateModel,
                        required: true
                    }
                }
            )
            const row  = JSON.parse(JSON.stringify(record, null, 2))
            let transaction: Transaction = {
                transactionExternalId: row['id'],
                transactionType: row['tranferTypeId'],
                transactionStatus: row['State']['name'],
                value: parseFloat(row['value']),
                createdAt: row['createdAt'],
            }
            return { status: true, data: transaction }
        } catch (e: any) {
            console.log(e)
            return { status: false }
        }
    }



}