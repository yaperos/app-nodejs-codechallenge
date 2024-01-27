import { TransactionTypeEntity } from "src/domain/Transaction.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('typetransaction')
export class TransactionTypeModel implements TransactionTypeEntity{
    
    @PrimaryGeneratedColumn('increment')
    id:number;

    @Column({length:50})
    name:string;
}