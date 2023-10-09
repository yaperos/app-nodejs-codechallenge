import { Column, Entity, PrimaryColumn, Generated, CreateDateColumn, UpdateDateColumn, BaseEntity } from "typeorm";

@Entity('Transaction_Status')
export class TransactionStatusEntity extends BaseEntity {
    @PrimaryColumn()
    @Generated('increment')
    id: number;

    @Column()
    name: string;
    
    @CreateDateColumn()
    createdAt: Date;
    
    @UpdateDateColumn()
    updatedAt: Date;
}