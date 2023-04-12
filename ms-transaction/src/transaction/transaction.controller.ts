import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { NewTransactionDTO } from './DTO/NewTransactionDTO';
import { TransactionDTO } from './DTO/TransactionDTO';
import { StatesTransaction } from './helper/StatesTransaction';
import { TransactionService } from './transaction.service';

@Controller('transactions')
export class TransactionController {
    constructor(private _service: TransactionService) { }

    @Get(":id")
    async getTransaction(@Param("id") id: string): Promise<TransactionDTO | Error> {
        return this._service
            .getT(id)
            .then((result) => {
                return {
                    transactionExternalId: result.transactionExternalId,
                    transactionType: {
                        name: result.transactionType.name,
                    },
                    transactionStatus: {
                        name: result.transactionStatus.name,
                    },
                    value: result.value,
                    createdAt: result.createdAt,
                } as TransactionDTO;
            })
            .catch((error) => {
                return new Error(`Transaction not found for ID: ${id}, ${error.message}`);
            });
    }

    @Post("create")
    async createTransaction(@Body() nT: NewTransactionDTO): Promise<TransactionDTO | Error> {
        return this._service
            .create(nT)
            .then((result) => {
                this._service.valid(result);
                return {
                    transactionExternalId: result.transactionExternalId,
                    transactionType: {
                        name: result.transactionType.name,
                    },
                    transactionStatus: {
                        name: result.transactionStatus.name,
                    },
                    value: result.value,
                    createdAt: result.createdAt,
                };
            })
            .catch((error) => {
                return new Error(`Could not create transaction ${error.message}`);
            });
    }

    @EventPattern('transaction.approved')
    async approvedTransaction(data: any) {

        Logger.log(
            `Transaction APPROVED [ID: ${data.id} ]`,
        );
        this._service.
            updateTransactionStatus(
                data.id,
                StatesTransaction.APPROVED)
            .then((result) => {
                Logger.log(
                    `Transaction UPDATED [ID: ${result.transactionExternalId}, STATUS: ${result.transactionStatus.name}`,
                );
            })
            .catch((err) => {
                return new Error(`An error occurred while trying to update the status of the transaction: ${err}`);
            });
    }

    @EventPattern('transaction.rejected')
    async rejectedTransaction(data: any) {
        Logger.log(
            `Transaction REJECTED [ID: ${data.transactionExternalId} ]`,
        );

        this._service
            .updateTransactionStatus(
                data.transactionExternalId,
                StatesTransaction.REJECTED
            ).then((result) => {
                Logger.log(
                    `Transaction UPDATED [ID: ${result.transactionExternalId}, STATUS: ${result.transactionStatus.name}]`,
                );
            })
            .catch((err) => {
                return new Error(`An error occurred while trying to update the status of the transaction: ${err}`);
            });;
    }

}

