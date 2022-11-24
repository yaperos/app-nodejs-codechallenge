import { Repository } from "typeorm";
import { TransactionEntity } from "../entity/transaction.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TransactionRepository extends Repository<TransactionEntity> {

}
