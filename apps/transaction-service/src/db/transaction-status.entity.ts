import { 
    Column, 
    Entity, 
    PrimaryGeneratedColumn
} from 'typeorm';

@Entity({ name: 'transaction_status' })
export class TransactionStatus {
    @PrimaryGeneratedColumn({ 
        name: 'id' 
    })
    id: number;

    @Column({ 
        name: 'name', 
        nullable: false, 
    })
    name: string;

    @Column({
        name: 'created_at',
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @Column({ 
        name: 'updated_at', 
        nullable: true, 
        type: 'timestamptz'
    })
    updatedAt?: Date;
}