import { Column, Entity } from "typeorm";
import { BaseEntity } from "./base-entity";

@Entity('transactions_types')
export class TransactionTypes extends BaseEntity {

    @Column({ type: 'varchar', length: 100, nullable: false })
    name?: string;

}