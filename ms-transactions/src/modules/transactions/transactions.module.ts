import { Module } from "@nestjs/common";
import { TransactionsController } from "./transactions.controller";
import { TransactonService } from "./transactions.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Transaction, TransactionSchema } from "../../database/Transaction.schema";
import { TransactionStatus, TransactionStatusSchema } from "../../database/TransactionStatus.schema";
import { TransactionType, TransactionTypeSchema } from "../../database/TransactionType.schema";
import { KafkaService } from "./kafka.service";

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Transaction.name, schema: TransactionSchema },
			{ name: TransactionStatus.name, schema: TransactionStatusSchema },
			{ name: TransactionType.name, schema: TransactionTypeSchema },
		])
	],

  controllers: [TransactionsController],
	
	providers: [
		TransactonService,
		KafkaService
	]
})
export class TransactionsModule {}