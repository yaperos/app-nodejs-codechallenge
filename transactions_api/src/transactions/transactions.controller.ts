import {
    Body,
    Controller,
    Get,
    Param,
    Post,
} from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { NewTransactionDto } from "./dto/NewTransactionDto";
import { TransactionDto } from "./dto/TransactionDto";
import { TransactionsService } from "./transactions.service";
import { Error } from "src/util/Error";

@Controller("api/transactions")
export class TransactionsController {
    constructor(private readonly service: TransactionsService) {}

    @Get(":id")
    async getTransaction(
        @Param("id") id: string,
    ): Promise<TransactionDto | Error> {
        return this.service
            .getTransaction(id)
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
                } as TransactionDto;
            })
            .catch((error) => {
                return new Error(`Transaction not found for ID: ${id}`, error.message);
            });
    }

    @Post("create")
    async createTransaction(@Body() newTransaction: NewTransactionDto): Promise<any | Error> {
        return this.service.createTransaction(newTransaction).then((result) => {
			this.service.sendTransactionForValidation(result);
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
                } as TransactionDto;
		}).catch((error) => {
			return new Error("Could not create transaction", error.message);
		});
    }

    // Just for testing purposes, this endpoint should not be exposed

    // @Put("update")
    // updateTransaction(@Body() transaction: TransactionDto) {
    // 	return this.service.updateTransaction(transaction);
    // }
}
