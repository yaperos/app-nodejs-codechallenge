import {
    Column,
    Entity, JoinColumn, ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import {UserEntity} from "./user.entity";


@Entity({
    schema: 'public',
    name: 'tx',
})
export class TxEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    type: number;

    @ManyToOne(() => UserEntity, (user) => user.id, { nullable: true })
    @JoinColumn({
        name: 'user_debit_id',
    })
    userDebit: UserEntity;

    @ManyToOne(() => UserEntity, (user) => user.id, { nullable: true })
    @JoinColumn({
        name: 'user_credit_id',
    })
    userCredit: UserEntity;

    @Column()
    value: number;

    @Column({
        name: 'created_at'
    })
    createdAt: Date;

    @Column()
    status: number;
}
