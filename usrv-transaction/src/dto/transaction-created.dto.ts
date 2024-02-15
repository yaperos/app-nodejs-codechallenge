import { OmitType } from "@nestjs/mapped-types";
import { TransactionEntity } from "src/entities/transaction.entity";

export class CreateTransactionDto extends OmitType(TransactionEntity, ['id', 'createdAt', 'updatedAt']) {}