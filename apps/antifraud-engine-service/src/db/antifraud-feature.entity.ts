import { 
    Column, 
    Entity, 
    PrimaryGeneratedColumn
} from 'typeorm';

@Entity({ name: 'antifraud_feature' })
export class AntifraudFeature {
    @PrimaryGeneratedColumn({ 
        name: 'id' 
    })
    id: number;

    @Column({ 
        name: 'code', 
        nullable: false, 
    })
    code: string;

    @Column({ 
        name: 'description', 
        nullable: false, 
    })
    desccriptcion: string;

    @Column({ 
        name: 'active', 
        nullable: false,
        default: true, 
    })
    active: boolean;

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