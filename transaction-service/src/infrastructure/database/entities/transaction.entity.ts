import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity('transactions')
export class TransactionEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string | undefined;

    @Column({nullable: false})
    accountExternalIdDebit: string = '';

    @Column({nullable: false})
    accountExternalIdCredit: string = '';

    @Column({nullable: false})
    status: string = '';

    @Column({nullable: false})
    transferTypeId: number = 0;

    @Column({type: 'decimal', precision: 10, scale: 2, nullable: false})
    value: number = 0;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date = new Date();

    public getTransactionTypeName(): string {
        if (this.transferTypeId == 1) {
            return "add";
        }

        if (this.transferTypeId == 2) {
            return "substract";
        }

        return "other";
    }

}
