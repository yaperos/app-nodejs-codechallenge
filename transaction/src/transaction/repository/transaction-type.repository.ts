import { Repository } from "typeorm";
import { TransactionTypeEntity } from "../entity/transaction-type.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TransactionTypeRepository extends Repository<TransactionTypeEntity> {

}
