import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    transactionId: string;
    
    @Column({nullable: true})
    accountExternalIdDebit: string;

    @Column({nullable: true})
    accountExternalIdCredit: string;

    @Column({ default: 'pending'})
    status: string;
    
    @Column("decimal", { precision: 10, scale: 2 })    
    value: number;
    
    @Column()
    createdAt: Date;

    @BeforeInsert()
    async beforeInsert() {
        const createdDate = new Date();
        this.createdAt = new Date(createdDate.toLocaleDateString());
    }
}
